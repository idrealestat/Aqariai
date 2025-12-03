# 🔒 **SECURITY LAYER - PART 2**
## **API Security + Database Security + File Upload Security**

---

# 3️⃣ **API SECURITY SHIELD**

## **Input Validation & Sanitization**

File: `backend/src/middleware/validation.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize all string inputs
      const sanitized = sanitizeInput(req.body);
      
      // Validate with Zod schema
      const validated = await schema.parseAsync(sanitized);
      
      // Replace body with validated data
      req.body = validated;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      next(error);
    }
  };
};

// ============================================
// INPUT SANITIZATION
// ============================================

function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    // Remove HTML tags
    let clean = sanitizeHtml(data, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Escape special characters
    clean = validator.escape(clean);

    // Remove null bytes
    clean = clean.replace(/\0/g, '');

    return clean;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return data;
}

// ============================================
// SQL INJECTION PROTECTION
// ============================================

export const sqlInjectionProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(;|\-\-|\/\*|\*\/|xp_|sp_)/gi,
    /('|(\\')|(;)|(\-\-)|(%27)|(0x))/gi,
  ];

  const checkForSQLInjection = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlPatterns.some((pattern) => pattern.test(value));
    }

    if (Array.isArray(value)) {
      return value.some(checkForSQLInjection);
    }

    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkForSQLInjection);
    }

    return false;
  };

  // Check all inputs
  const inputs = [req.body, req.query, req.params];

  for (const input of inputs) {
    if (checkForSQLInjection(input)) {
      console.error('⚠️ SQL Injection attempt detected:', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        input,
      });

      return res.status(400).json({
        success: false,
        message: 'إدخال غير صالح',
      });
    }
  }

  next();
};

// ============================================
// XSS PROTECTION
// ============================================

export const xssProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
  ];

  const checkForXSS = (value: any): boolean => {
    if (typeof value === 'string') {
      return xssPatterns.some((pattern) => pattern.test(value));
    }

    if (Array.isArray(value)) {
      return value.some(checkForXSS);
    }

    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkForXSS);
    }

    return false;
  };

  const inputs = [req.body, req.query, req.params];

  for (const input of inputs) {
    if (checkForXSS(input)) {
      console.error('⚠️ XSS attempt detected:', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        input,
      });

      return res.status(400).json({
        success: false,
        message: 'إدخال غير صالح',
      });
    }
  }

  next();
};
```

## **API Endpoints Security Matrix**

File: `backend/src/config/api-security.config.ts`

```typescript
// Define security requirements for each endpoint
export const API_SECURITY_MATRIX = {
  // CRM Endpoints
  'POST /api/customers': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'standard',
    validation: 'createCustomerSchema',
    features: ['crm:create'],
  },
  'GET /api/customers': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'standard',
    features: ['crm:read'],
  },
  'PUT /api/customers/:id': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'standard',
    validation: 'updateCustomerSchema',
    features: ['crm:update'],
    ownership: true, // User must own the resource
  },
  'DELETE /api/customers/:id': {
    auth: true,
    roles: ['admin'],
    rateLimit: 'strict',
    features: ['crm:delete'],
  },

  // Finance Endpoints
  'POST /api/sales': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'standard',
    validation: 'createSaleSchema',
    features: ['finance:create'],
    audit: true, // Log all changes
  },
  'GET /api/sales': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'standard',
    features: ['finance:read'],
  },
  'GET /api/commissions': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'standard',
    features: ['finance:read'],
    ownership: true,
  },

  // Auth Endpoints
  'POST /api/auth/login': {
    auth: false,
    rateLimit: 'auth',
    validation: 'loginSchema',
    audit: true,
  },
  'POST /api/auth/register': {
    auth: false,
    rateLimit: 'auth',
    validation: 'registerSchema',
    audit: true,
  },
  'POST /api/auth/refresh': {
    auth: false,
    rateLimit: 'auth',
  },

  // Digital Cards (Public Endpoints)
  'GET /api/cards/public/:slug': {
    auth: false,
    rateLimit: 'public',
    tracking: true, // Track views
  },
  'POST /api/cards/:id/scan': {
    auth: false,
    rateLimit: 'public',
    tracking: true,
  },

  // File Upload
  'POST /api/upload': {
    auth: true,
    roles: ['broker', 'admin'],
    rateLimit: 'upload',
    fileValidation: true,
    maxSize: '10MB',
  },
};

// Rate limit configurations
export const RATE_LIMIT_CONFIG = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 },
  strict: { windowMs: 1 * 60 * 1000, max: 10 },
  standard: { windowMs: 1 * 60 * 1000, max: 100 },
  public: { windowMs: 1 * 60 * 1000, max: 50 },
  upload: { windowMs: 1 * 60 * 1000, max: 5 },
};
```

---

# 4️⃣ **DATABASE SECURITY**

## **Sensitive Data Encryption**

File: `backend/src/utils/encryption.util.ts`

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Must be 32 bytes
const ALGORITHM = 'aes-256-gcm';

export class EncryptionUtil {
  // ============================================
  // ENCRYPT DATA
  // ============================================
  
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  // ============================================
  // DECRYPT DATA
  // ============================================
  
  static decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // ============================================
  // HASH SENSITIVE DATA (One-way)
  // ============================================
  
  static hash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + process.env.HASH_SALT)
      .digest('hex');
  }
}
```

## **PII Masking**

File: `backend/src/utils/masking.util.ts`

```typescript
export class MaskingUtil {
  // Mask email: user@example.com → u***@example.com
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }
    return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`;
  }

  // Mask phone: +966501234567 → +966***4567
  static maskPhone(phone: string): string {
    if (phone.length <= 8) {
      return phone.replace(/.(?=.{4})/g, '*');
    }
    return phone.slice(0, 4) + '***' + phone.slice(-4);
  }

  // Mask name: أحمد محمد العتيبي → أحمد م*** ا***
  static maskName(name: string): string {
    const parts = name.split(' ');
    return parts
      .map((part, idx) => {
        if (idx === 0) return part; // Keep first name
        return part[0] + '***';
      })
      .join(' ');
  }

  // Mask ID number: 1234567890 → 123***890
  static maskID(id: string): string {
    if (id.length <= 6) return id.replace(/.(?=.{3})/g, '*');
    return id.slice(0, 3) + '***' + id.slice(-3);
  }

  // Apply to object
  static maskObject(obj: any, fields: string[]): any {
    const masked = { ...obj };

    for (const field of fields) {
      if (masked[field]) {
        if (field.includes('email')) {
          masked[field] = this.maskEmail(masked[field]);
        } else if (field.includes('phone')) {
          masked[field] = this.maskPhone(masked[field]);
        } else if (field.includes('name')) {
          masked[field] = this.maskName(masked[field]);
        } else if (field.includes('id') || field.includes('number')) {
          masked[field] = this.maskID(masked[field]);
        }
      }
    }

    return masked;
  }
}

// Usage in API responses
// const maskedCustomer = MaskingUtil.maskObject(customer, ['email', 'phone']);
```

## **Row-Level Security (Prisma Extension)**

File: `backend/src/lib/prisma-rls.ts`

```typescript
import { PrismaClient } from '@prisma/client';

export const prismaWithRLS = (userId: string, role: string) => {
  const prisma = new PrismaClient();

  return prisma.$extends({
    query: {
      customer: {
        async findMany({ args, query }) {
          // Non-admin users can only see their own customers
          if (role !== 'admin') {
            args.where = {
              ...args.where,
              userId,
            };
          }
          return query(args);
        },
        async findUnique({ args, query }) {
          if (role !== 'admin') {
            args.where = {
              ...args.where,
              userId,
            };
          }
          return query(args);
        },
      },
      sale: {
        async findMany({ args, query }) {
          if (role !== 'admin') {
            args.where = {
              ...args.where,
              userId,
            };
          }
          return query(args);
        },
      },
      // Add RLS for all models...
    },
  });
};

// Usage in controllers
// const prisma = prismaWithRLS(req.user!.id, req.user!.role);
```

---

# 5️⃣ **FILE UPLOAD SECURITY**

File: `backend/src/middleware/upload.middleware.ts`

```typescript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

// ============================================
// FILE VALIDATION
// ============================================

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ============================================
// FILE FILTER
// ============================================

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check file type
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('نوع الملف غير مسموح'));
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];

  if (!allowedExts.includes(ext)) {
    return cb(new Error('امتداد الملف غير مسموح'));
  }

  // Additional security checks
  // Check for double extensions (e.g., file.pdf.exe)
  const parts = file.originalname.split('.');
  if (parts.length > 2) {
    return cb(new Error('اسم ملف غير صالح'));
  }

  cb(null, true);
};

// ============================================
// STORAGE CONFIGURATION
// ============================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Separate folders by file type
    let folder = 'uploads/';
    
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      folder += 'images/';
    } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      folder += 'documents/';
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate secure random filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${randomName}${ext}`);
  },
});

// ============================================
// MULTER CONFIGURATION
// ============================================

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Max 5 files per request
  },
});

// ============================================
// FILE VALIDATION MIDDLEWARE
// ============================================

export const validateUploadedFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    : [req.file];

  try {
    for (const file of files) {
      if (!file) continue;

      // Verify file exists and is readable
      const fs = require('fs');
      if (!fs.existsSync(file.path)) {
        throw new Error('فشل تحميل الملف');
      }

      // Additional virus scanning (integrate with ClamAV or similar)
      // await scanFileForViruses(file.path);

      // Verify file integrity
      const fileBuffer = fs.readFileSync(file.path);
      const fileType = await import('file-type');
      const type = await fileType.fileTypeFromBuffer(fileBuffer);

      if (!type || type.mime !== file.mimetype) {
        // File extension doesn't match content
        fs.unlinkSync(file.path);
        throw new Error('نوع الملف غير صحيح');
      }
    }

    next();
  } catch (error) {
    // Clean up uploaded files
    files.forEach((file) => {
      if (file?.path) {
        try {
          require('fs').unlinkSync(file.path);
        } catch (e) {}
      }
    });

    res.status(400).json({
      success: false,
      message: error.message || 'خطأ في التحقق من الملف',
    });
  }
};

// ============================================
// SIGNED URL GENERATION (for temporary access)
// ============================================

export class SecureFileService {
  private static SECRET = process.env.FILE_URL_SECRET!;

  static generateSignedUrl(filePath: string, expiryMinutes = 60): string {
    const expiry = Date.now() + expiryMinutes * 60 * 1000;
    const signature = crypto
      .createHmac('sha256', this.SECRET)
      .update(`${filePath}:${expiry}`)
      .digest('hex');

    return `/api/files/download?path=${encodeURIComponent(
      filePath
    )}&expiry=${expiry}&signature=${signature}`;
  }

  static verifySignedUrl(
    filePath: string,
    expiry: number,
    signature: string
  ): boolean {
    // Check expiry
    if (Date.now() > expiry) {
      return false;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', this.SECRET)
      .update(`${filePath}:${expiry}`)
      .digest('hex');

    return signature === expectedSignature;
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/SECURITY-LAYER-PART-2.md`  
🎯 **Next:** Real-Time Security + Firewall + Production Checklist
