// =======================================================
// Properties Routes
// create property, upload files - مع multer للملفات
// =======================================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// =======================================================
// File upload configuration
// =======================================================

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const propertyDir = path.join(uploadDir, 'properties', req.params.id);
    if (!fs.existsSync(propertyDir)) {
      fs.mkdirSync(propertyDir, { recursive: true });
    }
    cb(null, propertyDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// =======================================================
// Validation schemas
// =======================================================

const createPropertySchema = Joi.object({
  title: Joi.string().required().min(5).max(200),
  description: Joi.string().allow('').max(2000),
  type: Joi.string().valid('villa', 'apartment', 'land', 'commercial').required(),
  category: Joi.string().valid('sale', 'rent').required(),
  city: Joi.string().required().min(2).max(100),
  district: Joi.string().allow('').max(100),
  address: Joi.string().allow('').max(500),
  area_m2: Joi.number().positive().max(100000),
  bedrooms: Joi.number().integer().min(0).max(50),
  bathrooms: Joi.number().integer().min(0).max(50),
  price: Joi.number().positive().required().max(999999999),
  currency: Joi.string().valid('SAR', 'AED', 'USD').default('SAR'),
  features: Joi.array().items(Joi.string().max(100)).max(20)
});

// =======================================================
// Routes
// =======================================================

// POST /api/v1/properties
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createPropertySchema.validate(req.body);
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

    const propertyData = value;
    const workspaceId = req.workspaceId;
    const userId = req.user.id;

    // Insert property
    const result = await db.query(`
      INSERT INTO properties (
        workspace_id, title, description, type, category,
        city, district, address, area_m2, bedrooms, bathrooms,
        price, currency, features, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      workspaceId,
      propertyData.title,
      propertyData.description,
      propertyData.type,
      propertyData.category,
      propertyData.city,
      propertyData.district,
      propertyData.address,
      propertyData.area_m2,
      propertyData.bedrooms,
      propertyData.bathrooms,
      propertyData.price,
      propertyData.currency,
      propertyData.features,
      userId
    ]);

    const property = result.rows[0];

    res.status(201).json({
      success: true,
      data: property,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إنشاء العقار'
      }
    });
  }
});

// GET /api/v1/properties
router.get('/', authenticateToken, async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const {
      page = 1,
      limit = 20,
      status,
      type,
      city,
      min_price,
      max_price,
      search
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = `
      SELECT p.*, u.name as created_by_name,
             COUNT(pf.id) as files_count
      FROM properties p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN property_files pf ON p.id = pf.property_id
      WHERE p.workspace_id = $1
    `;

    const params = [workspaceId];
    let paramIndex = 2;

    // Add filters
    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (type) {
      query += ` AND p.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (city) {
      query += ` AND p.city = $${paramIndex}`;
      params.push(city);
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

    if (search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.address ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY p.id, u.name ORDER BY p.created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM properties WHERE workspace_id = $1';
    const countParams = [workspaceId];
    // Add same filters to count query...

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب العقارات'
      }
    });
  }
});

// POST /api/v1/properties/:id/files
router.post('/:id/files', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const workspaceId = req.workspaceId;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'لم يتم رفع أي ملفات'
        }
      });
    }

    // Verify property ownership
    const propertyResult = await db.query(
      'SELECT id FROM properties WHERE id = $1 AND workspace_id = $2',
      [propertyId, workspaceId]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: 'العقار غير موجود'
        }
      });
    }

    // Insert file records
    const uploadedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.mimetype.startsWith('image/') ? 'image' : 
                      file.mimetype.startsWith('video/') ? 'video' : 'document';
      
      const fileResult = await db.query(`
        INSERT INTO property_files (property_id, file_type, file_name, url, order_index)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        propertyId,
        fileType,
        file.originalname,
        `/uploads/properties/${propertyId}/${file.filename}`,
        i
      ]);

      uploadedFiles.push(fileResult.rows[0]);
    }

    res.status(201).json({
      success: true,
      data: {
        uploaded_files: uploadedFiles
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Upload files error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء رفع الملفات'
      }
    });
  }
});

// Serve uploaded files
router.use('/uploads', express.static(uploadDir));

module.exports = router;