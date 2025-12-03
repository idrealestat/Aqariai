// =======================================================
// Public Routes
// POST /public/listing-inquiries - منصتي → CRM workflow
// =======================================================

const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// =======================================================
// Validation schemas
// =======================================================

const listingInquirySchema = Joi.object({
  listing_id: Joi.string().uuid().required(),
  full_name: Joi.string().required().min(2).max(100),
  phone: Joi.string().pattern(/^05\d{8}$/).required(),
  email: Joi.string().email(),
  message: Joi.string().required().min(10).max(1000),
  preferred_contact: Joi.string().valid('phone', 'whatsapp', 'email').default('phone')
});

// =======================================================
// Helper functions
// =======================================================

const generateLeadScore = (inquiryData) => {
  let score = 30; // Base score for inquiry
  
  if (inquiryData.email) score += 15;
  if (inquiryData.message.length > 50) score += 10;
  if (inquiryData.preferred_contact === 'whatsapp') score += 5;
  
  return Math.min(score, 100);
};

const determineClientType = (listing) => {
  // Determine client type based on listing category
  if (listing.category === 'rent') {
    return 'tenant';
  } else if (listing.category === 'sale') {
    return 'buyer';
  }
  return 'lead';
};

const getDefaultAgent = async (workspaceId) => {
  // Get workspace owner as default agent
  const result = await db.query(`
    SELECT u.id
    FROM users u
    JOIN workspaces w ON u.id = w.owner_id
    WHERE w.id = $1
  `, [workspaceId]);
  
  return result.rows.length > 0 ? result.rows[0].id : null;
};

// =======================================================
// Routes
// =======================================================

// POST /api/v1/public/listing-inquiries
router.post('/listing-inquiries', optionalAuth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = listingInquirySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'خطأ في البيانات المدخلة',
          details: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message
          }))
        }
      });
    }

    const { listing_id, full_name, phone, email, message, preferred_contact } = value;

    // 1. Get listing and property info
    const listingResult = await db.query(`
      SELECT l.*, p.title as property_title, p.workspace_id, p.city, p.type, p.category
      FROM listings l
      JOIN properties p ON l.property_id = p.id
      WHERE l.id = $1 AND l.status = 'published'
    `, [listing_id]);

    if (listingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LISTING_NOT_FOUND',
          message: 'الإعلان غير موجود أو غير منشور'
        }
      });
    }

    const listing = listingResult.rows[0];
    const workspaceId = listing.workspace_id;

    // Start transaction
    await db.query('BEGIN');

    try {
      let contactId;
      let isNewContact = false;

      // 2. Check if contact exists (by phone or email)
      let existingContactQuery = 'SELECT id FROM crm_contacts WHERE workspace_id = $1 AND (phone = $2';
      const existingContactParams = [workspaceId, phone];
      
      if (email) {
        existingContactQuery += ' OR email = $3)';
        existingContactParams.push(email);
      } else {
        existingContactQuery += ')';
      }

      const existingContactResult = await db.query(existingContactQuery, existingContactParams);

      if (existingContactResult.rows.length > 0) {
        // Contact exists - use existing contact
        contactId = existingContactResult.rows[0].id;
        
        // Update last_contact_at and email if not set
        let updateQuery = 'UPDATE crm_contacts SET last_contact_at = NOW()';
        const updateParams = [];
        let paramIndex = 1;

        if (email && !existingContactResult.rows[0].email) {
          updateQuery += `, email = $${paramIndex}`;
          updateParams.push(email);
          paramIndex++;
        }

        updateQuery += ` WHERE id = $${paramIndex}`;
        updateParams.push(contactId);

        await db.query(updateQuery, updateParams);

      } else {
        // 3. Create new contact if doesn't exist
        isNewContact = true;
        const clientType = determineClientType(listing);
        const leadScore = generateLeadScore(value);
        const defaultAgent = await getDefaultAgent(workspaceId);

        const contactResult = await db.query(`
          INSERT INTO crm_contacts (
            workspace_id, full_name, phone, email, type, status, source, source_meta,
            assigned_to, lead_score, last_contact_at
          ) VALUES ($1, $2, $3, $4, $5, 'new', 'waseety-website', $6, $7, $8, NOW())
          RETURNING id
        `, [
          workspaceId,
          full_name,
          phone,
          email,
          clientType,
          JSON.stringify({
            listing_id,
            property_title: listing.property_title,
            preferred_contact
          }),
          defaultAgent,
          leadScore
        ]);

        contactId = contactResult.rows[0].id;
      }

      // 4. Add activity (inquiry)
      const activityResult = await db.query(`
        INSERT INTO crm_activities (
          contact_id, workspace_id, type, summary, details, performed_by
        ) VALUES ($1, $2, 'inquiry', $3, $4, $1)
        RETURNING id
      `, [
        contactId,
        workspaceId,
        `استفسار عن ${listing.property_title}`,
        `رسالة: ${message}\nطريقة التواصل المفضلة: ${preferred_contact}`
      ]);

      // 5. Create follow-up task for default agent
      const defaultAgent = await getDefaultAgent(workspaceId);
      let taskId = null;

      if (defaultAgent) {
        const taskResult = await db.query(`
          INSERT INTO crm_tasks (
            contact_id, workspace_id, title, description, assigned_to, priority, due_date
          ) VALUES ($1, $2, $3, $4, $5, 'high', CURRENT_DATE + INTERVAL '1 day')
          RETURNING id
        `, [
          contactId,
          workspaceId,
          `متابعة استفسار عن ${listing.property_title}`,
          `عميل ${isNewContact ? 'جديد' : 'موجود'} يستفسر عن العقار. رقم الهاتف: ${phone}${email ? `, البريد: ${email}` : ''}\nالرسالة: ${message}`,
          defaultAgent
        ]);

        taskId = taskResult.rows[0].id;
      }

      // 6. Update property inquiry count
      await db.query(
        'UPDATE properties SET inquiries_count = inquiries_count + 1 WHERE id = $1',
        [listing.property_id]
      );

      await db.query('COMMIT');

      // في التطبيق الحقيقي، هنا نرسل إشعارات للوسيط
      console.log(`📧 New inquiry for ${listing.property_title} from ${full_name} (${phone})`);

      res.status(201).json({
        success: true,
        data: {
          contact_id: contactId,
          task_id: taskId,
          message: isNewContact 
            ? 'تم استلام استفسارك بنجاح. سيتم التواصل معك قريباً'
            : 'شكراً لاستفسارك الجديد. سيتم التواصل معك قريباً'
        },
        meta: {
          timestamp: new Date().toISOString(),
          request_id: req.id
        }
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Listing inquiry error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إرسال الاستفسار'
      }
    });
  }
});

// GET /api/v1/public/properties (للموقع العام)
router.get('/properties', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      city,
      type,
      category,
      min_price,
      max_price
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query for published properties only
    let query = `
      SELECT p.id, p.title, p.type, p.category, p.city, p.district,
             p.price, p.currency, p.bedrooms, p.bathrooms, p.area_m2,
             p.views_count, p.created_at,
             pf.url as primary_image
      FROM properties p
      LEFT JOIN property_files pf ON p.id = pf.property_id AND pf.order_index = 0
      WHERE p.status = 'published' AND p.visibility = 'public'
    `;

    const params = [];
    let paramIndex = 1;

    // Add filters
    if (city) {
      query += ` AND p.city = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }

    if (type) {
      query += ` AND p.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (min_price) {
      query += ` AND p.price >= $${paramIndex}`;
      params.push(parseFloat(min_price));
      paramIndex++;
    }

    if (max_price) {
      query += ` AND p.price <= $${paramIndex}`;
      params.push(parseFloat(max_price));
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get public properties error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب العقارات'
      }
    });
  }
});

// GET /api/v1/public/properties/:id (تفاصيل عقار + زيادة المشاهدات)
router.get('/properties/:id', optionalAuth, async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Get property with files
    const result = await db.query(`
      SELECT p.*, 
             json_agg(
               json_build_object(
                 'id', pf.id,
                 'file_type', pf.file_type,
                 'url', pf.url,
                 'order_index', pf.order_index
               ) ORDER BY pf.order_index
             ) FILTER (WHERE pf.id IS NOT NULL) as files
      FROM properties p
      LEFT JOIN property_files pf ON p.id = pf.property_id
      WHERE p.id = $1 AND p.status = 'published' AND p.visibility = 'public'
      GROUP BY p.id
    `, [propertyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: 'العقار غير موجود'
        }
      });
    }

    const property = result.rows[0];

    // Increment view count
    await db.query(
      'UPDATE properties SET views_count = views_count + 1 WHERE id = $1',
      [propertyId]
    );

    res.json({
      success: true,
      data: property,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get public property error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب العقار'
      }
    });
  }
});

module.exports = router;