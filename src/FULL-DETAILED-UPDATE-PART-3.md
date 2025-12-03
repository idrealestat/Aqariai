# 🚀 **FULL DETAILED SYSTEM UPDATE - PART 3**
## **Input Validation + Error Handling + Middleware System**

---

# **COMPLETE INPUT VALIDATION SYSTEM**

## **Zod Validation Schemas**

File: `backend/src/validators/schemas.ts`

```typescript
import { z } from 'zod';

/**
 * Complete Validation Schemas using Zod
 * Type-safe validation for all API endpoints
 */

// ============================================
// AUTHENTICATION SCHEMAS
// ============================================

export const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص'
    ),
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().regex(/^(05|5)\d{8}$/, 'رقم الجوال غير صحيح').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const verify2FASchema = z.object({
  userId: z.string().cuid(),
  code: z.string().regex(/^\d{6}$/, 'رمز التحقق يجب أن يكون 6 أرقام'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z
    .string()
    .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص'
    ),
});

// ============================================
// CUSTOMER SCHEMAS
// ============================================

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().regex(/^(05|5)\d{8}$/, 'رقم الجوال غير صحيح'),
  source: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost']).optional(),
  tags: z.array(z.string()).optional(),
  budget: z.number().positive('الميزانية يجب أن تكون رقم موجب').optional(),
  notes: z.string().max(5000, 'الملاحظات طويلة جداً').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  minBudget: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'name', 'budget', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// INTERACTION SCHEMAS
// ============================================

export const createInteractionSchema = z.object({
  customerId: z.string().cuid('معرف العميل غير صحيح'),
  type: z.enum(['call', 'meeting', 'email', 'whatsapp', 'visit', 'other']),
  notes: z.string().min(5, 'الملاحظات يجب أن تكون 5 أحرف على الأقل'),
  duration: z.number().int().positive('المدة يجب أن تكون رقم موجب').optional(),
  outcome: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

// ============================================
// SALE SCHEMAS
// ============================================

export const createSaleSchema = z.object({
  customerId: z.string().cuid().optional(),
  propertyId: z.string().cuid().optional(),
  saleType: z.enum(['sale', 'rent', 'lease']),
  saleAmount: z.number().positive('مبلغ البيع يجب أن يكون رقم موجب'),
  commissionRate: z.number().min(0).max(100, 'نسبة العمولة يجب أن تكون بين 0 و 100'),
  paymentStatus: z.enum(['pending', 'partial', 'paid', 'overdue', 'cancelled']).optional(),
  paymentMethod: z.string().optional(),
  saleDate: z.string().datetime().optional(),
  notes: z.string().max(5000).optional(),
});

export const updateSaleSchema = createSaleSchema.partial();

export const createInstallmentSchema = z.object({
  saleId: z.string().cuid(),
  amount: z.number().positive('المبلغ يجب أن يكون رقم موجب'),
  dueDate: z.string().datetime(),
  notes: z.string().optional(),
});

// ============================================
// PROPERTY SCHEMAS
// ============================================

export const createPropertySchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  description: z.string().min(20, 'الوصف يجب أن يكون 20 حرف على الأقل'),
  propertyType: z.enum(['apartment', 'villa', 'land', 'commercial', 'office']),
  price: z.number().positive('السعر يجب أن يكون رقم موجب'),
  area: z.number().positive('المساحة يجب أن تكون رقم موجب'),
  location: z.string().min(3, 'الموقع يجب أن يكون 3 أحرف على الأقل'),
  city: z.string().min(2, 'المدينة يجب أن تكون حرفين على الأقل'),
  neighborhood: z.string().optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url('رابط الصورة غير صحيح')).optional(),
  status: z.enum(['available', 'sold', 'rented', 'reserved', 'expired']).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

// ============================================
// SEEKER REQUEST SCHEMAS
// ============================================

export const createSeekerRequestSchema = z.object({
  propertyType: z.enum(['apartment', 'villa', 'land', 'commercial', 'office']),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minArea: z.number().positive().optional(),
  maxArea: z.number().positive().optional(),
  city: z.string().min(2, 'المدينة يجب أن تكون حرفين على الأقل'),
  neighborhoods: z.array(z.string()).optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  features: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
}).refine(
  (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  {
    message: 'الحد الأدنى للسعر يجب أن يكون أقل من أو يساوي الحد الأقصى',
    path: ['maxPrice'],
  }
);

// ============================================
// APPOINTMENT SCHEMAS
// ============================================

export const createAppointmentSchema = z.object({
  customerId: z.string().cuid().optional(),
  title: z.string().min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل'),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  type: z.enum(['meeting', 'viewing', 'call', 'inspection', 'signing', 'other']),
  reminderMinutes: z.number().int().positive().default(30),
  recurrence: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurrenceEnd: z.string().datetime().optional(),
}).refine(
  (data) => new Date(data.startTime) < new Date(data.endTime),
  {
    message: 'وقت البداية يجب أن يكون قبل وقت النهاية',
    path: ['endTime'],
  }
);

// ============================================
// DIGITAL CARD SCHEMAS
// ============================================

export const createDigitalCardSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().regex(/^(05|5)\d{8}$/, 'رقم الجوال غير صحيح'),
  whatsapp: z.string().regex(/^(05|5)\d{8}$/, 'رقم الواتساب غير صحيح').optional(),
  website: z.string().url('رابط الموقع غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
  bio: z.string().max(500, 'النبذة طويلة جداً').optional(),
  theme: z.string().default('default'),
  customFields: z.record(z.any()).optional(),
});

// ============================================
// REPORT SCHEMAS
// ============================================

export const createReportSchema = z.object({
  type: z.enum(['sales', 'customers', 'properties', 'performance', 'finance', 'custom']),
  title: z.string().min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل'),
  description: z.string().optional(),
  filters: z.record(z.any()),
  schedule: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

// ============================================
// PUBLISHING SCHEMAS
// ============================================

export const createPublishingAccountSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'aqar', 'haraj']),
  accountName: z.string().min(2, 'اسم الحساب يجب أن يكون حرفين على الأقل'),
  accessToken: z.string().min(10, 'رمز الوصول غير صحيح'),
  refreshToken: z.string().optional(),
});

export const createPublishedPostSchema = z.object({
  accountId: z.string().cuid(),
  propertyId: z.string().cuid().optional(),
  content: z.string().min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل'),
  images: z.array(z.string().url()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

// ============================================
// PAGINATION SCHEMA
// ============================================

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// ID PARAM SCHEMA
// ============================================

export const idParamSchema = z.object({
  id: z.string().cuid('المعرف غير صحيح'),
});
```

---

# **VALIDATION MIDDLEWARE**

File: `backend/src/middleware/validation.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation Middleware
 * Validates request data against Zod schemas
 */

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, query, and params
      const data = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      const validated = await schema.parseAsync(data);

      // Replace request data with validated data
      req.body = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'خطأ في البيانات المدخلة',
          errors,
        });
      }

      next(error);
    }
  };
};

// Validate body only
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'خطأ في البيانات المدخلة',
          errors,
        });
      }

      next(error);
    }
  };
};

// Validate query only
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'خطأ في البيانات المدخلة',
          errors,
        });
      }

      next(error);
    }
  };
};

// Validate params only
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.params);
      req.params = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'خطأ في البيانات المدخلة',
          errors,
        });
      }

      next(error);
    }
  };
};
```

---

# **SANITIZATION UTILITIES**

File: `backend/src/utils/sanitization.util.ts`

```typescript
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

/**
 * Sanitization Utilities
 * Clean and sanitize user inputs
 */

export class SanitizationUtil {
  // ============================================
  // SANITIZE STRING
  // ============================================

  static sanitizeString(input: string): string {
    if (!input) return '';

    // Remove HTML tags
    let sanitized = sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Trim whitespace
    sanitized = sanitized.trim();

    // Escape special characters
    sanitized = validator.escape(sanitized);

    return sanitized;
  }

  // ============================================
  // SANITIZE HTML (Allow safe tags)
  // ============================================

  static sanitizeHtml(input: string): string {
    if (!input) return '';

    return sanitizeHtml(input, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      allowedAttributes: {
        a: ['href'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
    });
  }

  // ============================================
  // SANITIZE EMAIL
  // ============================================

  static sanitizeEmail(email: string): string {
    if (!email) return '';

    return validator.normalizeEmail(email) || '';
  }

  // ============================================
  // SANITIZE PHONE
  // ============================================

  static sanitizePhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-digit characters
    let sanitized = phone.replace(/\D/g, '');

    // Ensure Saudi format (05XXXXXXXX)
    if (sanitized.startsWith('5') && sanitized.length === 9) {
      sanitized = '0' + sanitized;
    }

    return sanitized;
  }

  // ============================================
  // SANITIZE URL
  // ============================================

  static sanitizeUrl(url: string): string {
    if (!url) return '';

    // Check if valid URL
    if (!validator.isURL(url, { protocols: ['http', 'https'] })) {
      return '';
    }

    return url;
  }

  // ============================================
  // SANITIZE OBJECT (Recursive)
  // ============================================

  static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    const sanitized: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value);
        } else if (typeof value === 'object') {
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }

  // ============================================
  // REMOVE SQL INJECTION PATTERNS
  // ============================================

  static removeSqlInjection(input: string): string {
    if (!input) return '';

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(-{2}|\/\*|\*\/)/g,
      /(;|\||&)/g,
    ];

    let sanitized = input;

    sqlPatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }

  // ============================================
  // REMOVE XSS PATTERNS
  // ============================================

  static removeXss(input: string): string {
    if (!input) return '';

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    let sanitized = input;

    xssPatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }
}
```

---

# **COMPLETE ERROR HANDLING**

File: `backend/src/middleware/error-handler.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Global Error Handler Middleware
 * Handles all types of errors consistently
 */

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Default error
  let statusCode = 500;
  let message = 'حدث خطأ في الخادم';
  let errors: any[] = [];

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (error.code) {
      case 'P2002':
        message = 'البيانات موجودة مسبقاً';
        errors = [
          {
            field: error.meta?.target,
            message: 'هذه القيمة مستخدمة مسبقاً',
          },
        ];
        break;

      case 'P2003':
        message = 'البيانات المرتبطة غير موجودة';
        break;

      case 'P2025':
        message = 'السجل غير موجود';
        statusCode = 404;
        break;

      case 'P2014':
        message = 'البيانات المطلوبة مرتبطة بسجلات أخرى';
        break;

      default:
        message = 'خطأ في قاعدة البيانات';
    }
  }

  // Prisma validation errors
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'خطأ في البيانات المدخلة';
  }

  // Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'خطأ في البيانات المدخلة';
    errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }

  // JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'رمز التحقق غير صحيح';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'انتهت صلاحية رمز التحقق';
  }

  // Custom AppError
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Default error
  else if (error.message) {
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `الصفحة غير موجودة - ${req.originalUrl}`,
    404
  );
  next(error);
};
```

---

**(يتبع في PART 4...)**

📄 **تم إنشاء:** Validation System + Sanitization + Error Handling  
🎯 **التالي:** CRM Controllers + Integration Flows
