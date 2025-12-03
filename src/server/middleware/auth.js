// =======================================================
// JWT Authentication Middleware
// تحقق من صحة الـ JWT token وجلب بيانات المستخدم
// =======================================================

const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'رمز المصادقة مطلوب'
        }
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await db.query(`
      SELECT u.*, uw.workspace_id, w.name as workspace_name, uw.role as workspace_role
      FROM users u
      LEFT JOIN user_workspaces uw ON u.id = uw.user_id
      LEFT JOIN workspaces w ON uw.workspace_id = w.id
      WHERE u.id = $1
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'رمز مصادقة غير صالح'
        }
      });
    }

    req.user = result.rows[0];
    req.workspaceId = result.rows[0].workspace_id;
    next();
    
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'رمز مصادقة غير صالح'
      }
    });
  }
};

// Optional auth middleware (لا يفشل إذا لم يكن هناك token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};