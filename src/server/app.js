// =======================================================
// وسِيطي Backend - Express.js Server
// جاهز للتنفيذ المباشر مع middleware وroutes كاملة + Response Formatter
// =======================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Middleware
const {
  responseFormatter,
  errorHandler,
  requestTiming,
  requestId,
  requestLogger,
  apiVersion,
  healthCheck
} = require('./middleware/responseFormatter');

// Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const listingRoutes = require('./routes/listings');
const crmRoutes = require('./routes/crm');
const publicRoutes = require('./routes/public');

const app = express();

// =======================================================
// Middleware Setup
// =======================================================

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Request processing
app.use(requestTiming);
app.use(requestId);
app.use(apiVersion('1.0.0'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'تم تجاوز عدد الطلبات المسموحة'
    }
  }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Response formatting
app.use(responseFormatter);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// =======================================================
// Routes
// =======================================================

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/public', publicRoutes);

// Health check
app.get('/health', healthCheck);

// API info
app.get('/api/v1', (req, res) => {
  res.json({
    name: 'وسِيطي API',
    version: req.apiVersion || '1.0.0',
    description: 'Real Estate CRM & Platform Integration API',
    documentation: '/api/v1/docs',
    realtime: {
      enabled: true,
      endpoint: process.env.REALTIME_URL || 'http://localhost:4000'
    },
    endpoints: {
      auth: '/api/v1/auth',
      properties: '/api/v1/properties',
      listings: '/api/v1/listings',
      crm: '/api/v1/crm',
      public: '/api/v1/public'
    },
    features: [
      'JWT Authentication',
      'Real-time Notifications',
      'Background Jobs',
      'Platform Integration',
      'CRM System',
      'File Upload'
    ]
  });
});

// =======================================================
// Error Handling
// =======================================================

// 404 handler
app.use('*', (req, res) => {
  res.error({
    code: 'NOT_FOUND',
    message: 'المورد المطلوب غير موجود'
  }, 404);
});

// Global error handler
app.use(errorHandler);

// =======================================================
// Server Start
// =======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 وسِيطي Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/v1`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;