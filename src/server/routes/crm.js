// =======================================================
// CRM Routes
// create contact, create activity, create task - CRM كامل
// =======================================================

const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// =======================================================
// Validation schemas
// =======================================================

const createContactSchema = Joi.object({
  full_name: Joi.string().required().min(2).max(100),
  phone: Joi.string().pattern(/^05\d{8}$/),
  email: Joi.string().email(),
  type: Joi.string().valid('lead', 'client', 'owner', 'tenant').default('lead'),
  source: Joi.string().max(50),
  source_meta: Joi.object(),
  budget_max: Joi.number().positive(),
  requirements: Joi.string().max(1000)
});

const createActivitySchema = Joi.object({
  type: Joi.string().valid('call', 'email', 'whatsapp', 'meeting', 'note').required(),
  summary: Joi.string().required().min(5).max(200),
  details: Joi.string().max(2000)
});

const createTaskSchema = Joi.object({
  contact_id: Joi.string().uuid().required(),
  title: Joi.string().required().min(5).max(200),
  description: Joi.string().max(1000),
  assigned_to: Joi.string().uuid(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  due_date: Joi.date().iso()
});

// =======================================================
// Helper functions
// =======================================================

const calculateLeadScore = (contact) => {
  let score = 0;
  
  // Basic info
  if (contact.phone) score += 20;
  if (contact.email) score += 15;
  if (contact.budget_max) score += 25;
  
  // Source scoring
  const sourceScores = {
    'website': 30,
    'referral': 40,
    'facebook': 20,
    'cold_call': 10
  };
  score += sourceScores[contact.source] || 5;
  
  return Math.min(score, 100);
};

// =======================================================
// Routes
// =======================================================

// POST /api/v1/crm/contacts
router.post('/contacts', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createContactSchema.validate(req.body);
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

    const contactData = value;
    const workspaceId = req.workspaceId;
    const userId = req.user.id;

    // Check for duplicate by phone or email
    if (contactData.phone || contactData.email) {
      let duplicateQuery = 'SELECT id FROM crm_contacts WHERE workspace_id = $1 AND (';
      const duplicateParams = [workspaceId];
      let paramIndex = 2;
      
      if (contactData.phone) {
        duplicateQuery += `phone = $${paramIndex}`;
        duplicateParams.push(contactData.phone);
        paramIndex++;
      }
      
      if (contactData.email) {
        if (contactData.phone) duplicateQuery += ' OR ';
        duplicateQuery += `email = $${paramIndex}`;
        duplicateParams.push(contactData.email);
      }
      
      duplicateQuery += ')';
      
      const duplicateResult = await db.query(duplicateQuery, duplicateParams);
      if (duplicateResult.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CONTACT_EXISTS',
            message: 'العميل موجود مسبقاً'
          }
        });
      }
    }

    // Calculate lead score
    const leadScore = calculateLeadScore(contactData);

    // Assign to current user if not specified
    const assignedTo = contactData.assigned_to || userId;

    // Create contact
    const result = await db.query(`
      INSERT INTO crm_contacts (
        workspace_id, full_name, phone, email, type, source, source_meta,
        budget_max, requirements, assigned_to, lead_score, last_contact_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `, [
      workspaceId,
      contactData.full_name,
      contactData.phone,
      contactData.email,
      contactData.type,
      contactData.source,
      JSON.stringify(contactData.source_meta || {}),
      contactData.budget_max,
      contactData.requirements,
      assignedTo,
      leadScore
    ]);

    const contact = result.rows[0];

    res.status(201).json({
      success: true,
      data: contact,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إنشاء العميل'
      }
    });
  }
});

// GET /api/v1/crm/contacts
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const {
      page = 1,
      limit = 20,
      status,
      assigned_to,
      search,
      source
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = `
      SELECT c.*, u.name as assigned_to_name,
             COUNT(a.id) as activities_count,
             COUNT(t.id) as open_tasks_count
      FROM crm_contacts c
      LEFT JOIN users u ON c.assigned_to = u.id
      LEFT JOIN crm_activities a ON c.id = a.contact_id
      LEFT JOIN crm_tasks t ON c.id = t.contact_id AND t.status = 'pending'
      WHERE c.workspace_id = $1
    `;

    const params = [workspaceId];
    let paramIndex = 2;

    // Add filters
    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (assigned_to) {
      query += ` AND c.assigned_to = $${paramIndex}`;
      params.push(assigned_to);
      paramIndex++;
    }

    if (source) {
      query += ` AND c.source = $${paramIndex}`;
      params.push(source);
      paramIndex++;
    }

    if (search) {
      query += ` AND (c.full_name ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY c.id, u.name ORDER BY c.created_at DESC`;
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
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب العملاء'
      }
    });
  }
});

// GET /api/v1/crm/contacts/:id
router.get('/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contactId = req.params.id;
    const workspaceId = req.workspaceId;

    const result = await db.query(`
      SELECT c.*, u.name as assigned_to_name
      FROM crm_contacts c
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.id = $1 AND c.workspace_id = $2
    `, [contactId, workspaceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'العميل غير موجود'
        }
      });
    }

    const contact = result.rows[0];

    res.json({
      success: true,
      data: contact,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب العميل'
      }
    });
  }
});

// PUT /api/v1/crm/contacts/:id
router.put('/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contactId = req.params.id;
    const workspaceId = req.workspaceId;
    const updateData = req.body;

    // Verify contact ownership
    const contactResult = await db.query(
      'SELECT id FROM crm_contacts WHERE id = $1 AND workspace_id = $2',
      [contactId, workspaceId]
    );

    if (contactResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'العميل غير موجود'
        }
      });
    }

    // Build update query dynamically
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['full_name', 'phone', 'email', 'status', 'type', 'budget_max', 'requirements'];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(updateData[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_UPDATES',
          message: 'لا توجد تحديثات'
        }
      });
    }

    fields.push(`updated_at = NOW()`);
    
    const query = `
      UPDATE crm_contacts 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND workspace_id = $${paramIndex + 1}
      RETURNING *
    `;
    
    values.push(contactId, workspaceId);

    const result = await db.query(query, values);

    res.json({
      success: true,
      data: result.rows[0],
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء تحديث العميل'
      }
    });
  }
});

// POST /api/v1/crm/contacts/:id/activities
router.post('/contacts/:id/activities', authenticateToken, async (req, res) => {
  try {
    const contactId = req.params.id;
    const workspaceId = req.workspaceId;
    const userId = req.user.id;

    // Validate input
    const { error, value } = createActivitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'خطأ في البيانات المدخلة'
        }
      });
    }

    const { type, summary, details } = value;

    // Verify contact ownership
    const contactResult = await db.query(
      'SELECT id FROM crm_contacts WHERE id = $1 AND workspace_id = $2',
      [contactId, workspaceId]
    );

    if (contactResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'العميل غير موجود'
        }
      });
    }

    // Create activity
    const result = await db.query(`
      INSERT INTO crm_activities (contact_id, workspace_id, type, summary, details, performed_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [contactId, workspaceId, type, summary, details, userId]);

    // Update contact last_contact_at
    await db.query(
      'UPDATE crm_contacts SET last_contact_at = NOW() WHERE id = $1',
      [contactId]
    );

    const activity = result.rows[0];

    res.status(201).json({
      success: true,
      data: activity,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إنشاء النشاط'
      }
    });
  }
});

// POST /api/v1/crm/tasks
router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const userId = req.user.id;

    // Validate input
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'خطأ في البيانات المدخلة'
        }
      });
    }

    const { contact_id, title, description, assigned_to, priority, due_date } = value;

    // Verify contact ownership
    const contactResult = await db.query(
      'SELECT id FROM crm_contacts WHERE id = $1 AND workspace_id = $2',
      [contact_id, workspaceId]
    );

    if (contactResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'العميل غير موجود'
        }
      });
    }

    // Create task
    const result = await db.query(`
      INSERT INTO crm_tasks (
        contact_id, workspace_id, title, description, 
        assigned_to, priority, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      contact_id, workspaceId, title, description,
      assigned_to || userId, priority, due_date
    ]);

    const task = result.rows[0];

    res.status(201).json({
      success: true,
      data: task,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إنشاء المهمة'
      }
    });
  }
});

// GET /api/v1/crm/tags
router.get('/tags', authenticateToken, async (req, res) => {
  try {
    const workspaceId = req.workspaceId;

    const result = await db.query(
      'SELECT * FROM crm_tags WHERE workspace_id = $1 ORDER BY name',
      [workspaceId]
    );

    res.json({
      success: true,
      data: result.rows,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب التاقات'
      }
    });
  }
});

// GET /api/v1/crm/pipeline
router.get('/pipeline', authenticateToken, async (req, res) => {
  try {
    const workspaceId = req.workspaceId;

    // Get stages with contact counts
    const result = await db.query(`
      SELECT ps.*, COUNT(c.id) as contacts_count
      FROM pipeline_stages ps
      LEFT JOIN crm_contacts c ON ps.name = c.status AND c.workspace_id = $1
      WHERE ps.workspace_id = $1 OR ps.workspace_id IS NULL
      GROUP BY ps.id, ps.name, ps.position
      ORDER BY ps.position
    `, [workspaceId]);

    res.json({
      success: true,
      data: {
        stages: result.rows
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب مراحل المبيعات'
      }
    });
  }
});

module.exports = router;