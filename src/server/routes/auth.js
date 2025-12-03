// =======================================================
// Authentication Routes
// register, login, me - مع JWT generation
// =======================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// =======================================================
// Validation schemas
// =======================================================

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^05\d{8}$/),
  password: Joi.string().min(8).required(),
  workspace_name: Joi.string().required().min(2).max(100)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  workspace_id: Joi.string().uuid().optional()
});

// =======================================================
// Helper functions
// =======================================================

const generateTokens = (userId, workspaceId = null) => {
  const payload = { userId, workspaceId };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
  
  return {
    access_token: accessToken,
    expires_in: 24 * 60 * 60 // 24 hours in seconds
  };
};

const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[أ-ي]/g, 'ar') // Replace Arabic with 'ar'
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substr(2, 6);
};

// =======================================================
// Routes
// =======================================================

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
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

    const { name, email, phone, password, workspace_name } = value;

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'المستخدم موجود مسبقاً'
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Start transaction
    await db.query('BEGIN');

    try {
      // Create user
      const userResult = await db.query(`
        INSERT INTO users (name, email, phone, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, phone, role, created_at
      `, [name, email, phone, passwordHash]);

      const user = userResult.rows[0];

      // Create workspace
      const slug = createSlug(workspace_name);
      const workspaceResult = await db.query(`
        INSERT INTO workspaces (name, slug, owner_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, slug
      `, [workspace_name, slug, user.id]);

      const workspace = workspaceResult.rows[0];

      // Add user to workspace
      await db.query(`
        INSERT INTO user_workspaces (user_id, workspace_id, role)
        VALUES ($1, $2, 'admin')
      `, [user.id, workspace.id]);

      // Create trial subscription
      await db.query(`
        INSERT INTO subscriptions (workspace_id, plan_id, status, trial_ends_at)
        VALUES ($1, 'trial', 'trial', NOW() + INTERVAL '30 days')
      `, [workspace.id]);

      await db.query('COMMIT');

      // Generate tokens
      const tokens = generateTokens(user.id, workspace.id);

      res.status(201).json({
        success: true,
        data: {
          user,
          workspace,
          tokens,
          subscription: {
            plan: 'trial',
            trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
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
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إنشاء الحساب'
      }
    });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'خطأ في البيانات المدخلة'
        }
      });
    }

    const { email, password, workspace_id } = value;

    // Get user with workspace info
    let query = `
      SELECT u.*, uw.workspace_id, w.name as workspace_name, uw.role as workspace_role
      FROM users u
      LEFT JOIN user_workspaces uw ON u.id = uw.user_id
      LEFT JOIN workspaces w ON uw.workspace_id = w.id
      WHERE u.email = $1
    `;
    
    const params = [email];
    
    if (workspace_id) {
      query += ' AND uw.workspace_id = $2';
      params.push(workspace_id);
    }

    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'بيانات الدخول غير صحيحة'
        }
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'بيانات الدخول غير صحيحة'
        }
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id, user.workspace_id);

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      success: true,
      data: {
        user,
        tokens,
        workspace: {
          id: user.workspace_id,
          name: user.workspace_name
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء تسجيل الدخول'
      }
    });
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = { ...req.user };
    delete user.password_hash;

    res.json({
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب بيانات المستخدم'
      }
    });
  }
});

module.exports = router;