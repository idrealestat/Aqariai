// =======================================================
// Response Formatter Middleware
// توحيد شكل الاستجابات ومعالجة الأخطاء
// =======================================================

const { v4: uuidv4 } = require('uuid');

// =======================================================
// Response Formatter Middleware
// =======================================================

const responseFormatter = (req, res, next) => {
  // حفظ الدالة الأصلية
  const originalJson = res.json;
  const originalSend = res.send;

  // إعادة تعريف res.json
  res.json = function(data) {
    // إذا كانت الاستجابة تحتوي على error بالفعل، لا نغيرها
    if (data && data.success === false) {
      return originalJson.call(this, data);
    }

    // تنسيق الاستجابة الناجحة
    const formattedResponse = {
      success: true,
      data: data,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id || uuidv4(),
        api_version: '1.0.0',
        response_time: Date.now() - req.startTime
      }
    };

    // إضافة pagination إذا وجدت
    if (req.pagination) {
      formattedResponse.pagination = req.pagination;
    }

    return originalJson.call(this, formattedResponse);
  };

  // إعادة تعريف res.send للنصوص البسيطة
  res.send = function(data) {
    if (typeof data === 'string' && !data.startsWith('{')) {
      const formattedResponse = {
        success: true,
        data: { message: data },
        meta: {
          timestamp: new Date().toISOString(),
          request_id: req.id || uuidv4(),
          api_version: '1.0.0',
          response_time: Date.now() - req.startTime
        }
      };
      return originalJson.call(this, formattedResponse);
    }
    
    return originalSend.call(this, data);
  };

  // دالة مساعدة لإرسال استجابة ناجحة
  res.success = function(data, statusCode = 200) {
    return this.status(statusCode).json(data);
  };

  // دالة مساعدة لإرسال استجابة خطأ
  res.error = function(error, statusCode = 400) {
    const errorResponse = {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'حدث خطأ غير معروف',
        details: error.details || null
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id || uuidv4(),
        api_version: '1.0.0',
        response_time: Date.now() - req.startTime
      }
    };

    return this.status(statusCode).json(errorResponse);
  };

  // دالة مساعدة للاستجابة مع pagination
  res.paginated = function(data, pagination, statusCode = 200) {
    const paginatedResponse = {
      success: true,
      data: data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        total: pagination.total || 0,
        pages: pagination.pages || Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
        has_next: pagination.has_next || false,
        has_prev: pagination.has_prev || false
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id || uuidv4(),
        api_version: '1.0.0',
        response_time: Date.now() - req.startTime
      }
    };

    return this.status(statusCode).json(paginatedResponse);
  };

  next();
};

// =======================================================
// Error Handler Middleware
// =======================================================

const errorHandler = (err, req, res, next) => {
  console.error('🚨 خطأ في التطبيق:', {
    error: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      user: req.user ? req.user.id : 'غير مسجل'
    },
    timestamp: new Date().toISOString()
  });

  // تحديد نوع الخطأ وحالة HTTP المناسبة
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'حدث خطأ داخلي في الخادم';
  let details = null;

  // أخطاء التحقق من البيانات
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'خطأ في التحقق من البيانات';
    details = err.details || null;
  }

  // أخطاء JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'رمز مصادقة غير صالح';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'انتهت صلاحية رمز المصادقة';
  }

  // أخطاء قاعدة البيانات
  if (err.code === '23505') { // Unique constraint violation
    statusCode = 409;
    errorCode = 'DUPLICATE_ENTRY';
    message = 'البيانات موجودة مسبقاً';
  }

  if (err.code === '23503') { // Foreign key constraint violation
    statusCode = 400;
    errorCode = 'REFERENCE_ERROR';
    message = 'خطأ في المراجع المطلوبة';
  }

  if (err.code === '23502') { // Not null constraint violation
    statusCode = 400;
    errorCode = 'MISSING_REQUIRED_FIELD';
    message = 'حقل مطلوب مفقود';
  }

  // أخطاء الصلاحيات
  if (err.statusCode === 403 || err.status === 403) {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    message = 'ليس لديك صلاحية لهذا الإجراء';
  }

  // أخطاء عدم وجود المورد
  if (err.statusCode === 404 || err.status === 404) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    message = 'المورد المطلوب غير موجود';
  }

  // أخطاء معدل الطلبات
  if (err.statusCode === 429 || err.status === 429) {
    statusCode = 429;
    errorCode = 'RATE_LIMITED';
    message = 'تم تجاوز عدد الطلبات المسموحة';
  }

  // خطأ مخصص من التطبيق
  if (err.statusCode && err.code && err.message) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  }

  // إنشاء استجابة الخطأ
  const errorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: details
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: req.id || uuidv4(),
      api_version: '1.0.0',
      response_time: Date.now() - (req.startTime || Date.now())
    }
  };

  // في بيئة التطوير، أضف تفاصيل إضافية
  if (process.env.NODE_ENV === 'development') {
    errorResponse.debug = {
      stack: err.stack,
      original_error: err.message
    };
  }

  res.status(statusCode).json(errorResponse);
};

// =======================================================
// Request Timing Middleware
// =======================================================

const requestTiming = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

// =======================================================
// Request ID Middleware
// =======================================================

const requestId = (req, res, next) => {
  req.id = req.get('X-Request-ID') || uuidv4();
  res.set('X-Request-ID', req.id);
  next();
};

// =======================================================
// Logging Middleware
// =======================================================

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // تسجيل الطلب
  console.log(`📥 ${req.method} ${req.path}`, {
    request_id: req.id,
    user: req.user ? req.user.id : 'غير مسجل',
    ip: req.ip,
    user_agent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // تسجيل الاستجابة
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    console.log(`📤 ${req.method} ${req.path} ${res.statusCode}`, {
      request_id: req.id,
      duration: `${duration}ms`,
      status: res.statusCode,
      timestamp: new Date().toISOString()
    });

    return originalSend.call(this, data);
  };

  next();
};

// =======================================================
// API Version Middleware
// =======================================================

const apiVersion = (version = '1.0.0') => {
  return (req, res, next) => {
    req.apiVersion = version;
    res.set('API-Version', version);
    next();
  };
};

// =======================================================
// Health Check Response
// =======================================================

const healthCheck = (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: req.apiVersion || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(healthData);
};

// =======================================================
// Exports
// =======================================================

module.exports = {
  responseFormatter,
  errorHandler,
  requestTiming,
  requestId,
  requestLogger,
  apiVersion,
  healthCheck
};