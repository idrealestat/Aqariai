# 🚀 **ULTIMATE PRODUCTION UPDATE - PART 2**
## **Enhanced Rate Limiting + Audit Logging + Transactions**

---

# **ENHANCED RATE LIMITING**

## **Multi-Level Rate Limiting System**

File: `backend/src/middleware/advanced-rate-limit.middleware.ts`

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { Request, Response } from 'express';
import { AuthRequest } from './auth.middleware';

const redis = new Redis(process.env.REDIS_URL);

/**
 * Advanced Rate Limiting System
 * 5 Levels: Critical, Strict, Standard, Relaxed, Public
 */

// ============================================
// LEVEL 1: CRITICAL (Authentication)
// ============================================

export const criticalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:critical:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'تم تجاوز عدد المحاولات. حاول مرة أخرى بعد 15 دقيقة',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip for whitelisted IPs
    const whitelistedIPs = (process.env.WHITELISTED_IPS || '').split(',');
    return whitelistedIPs.includes(req.ip || '');
  },
  keyGenerator: (req: Request) => {
    // Use both IP and user agent for more accurate tracking
    return `${req.ip}:${req.get('user-agent')}`;
  },
  handler: async (req: Request, res: Response) => {
    // Log rate limit exceeded
    await prisma.securityLog.create({
      data: {
        event: 'rate_limit_exceeded',
        ipAddress: req.ip || '',
        userAgent: req.get('user-agent') || '',
        endpoint: req.path,
        metadata: {
          limit: 'critical',
          windowMs: 15 * 60 * 1000,
          max: 5,
        },
        success: false,
      },
    });

    res.status(429).json({
      success: false,
      message: 'تم تجاوز عدد المحاولات. حاول مرة أخرى بعد 15 دقيقة',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  },
});

// ============================================
// LEVEL 2: STRICT (Sensitive Operations)
// ============================================

export const strictLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:strict:',
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح للطلبات',
  },
  keyGenerator: (req: AuthRequest) => {
    // Use userId if authenticated, otherwise IP
    return req.user?.id || req.ip || 'anonymous';
  },
});

// ============================================
// LEVEL 3: STANDARD (General API)
// ============================================

export const standardLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:standard:',
  }),
  windowMs: 1 * 60 * 1000,
  max: 100, // 100 requests per minute
  keyGenerator: (req: AuthRequest) => {
    return req.user?.id || req.ip || 'anonymous';
  },
});

// ============================================
// LEVEL 4: RELAXED (Read Operations)
// ============================================

export const relaxedLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:relaxed:',
  }),
  windowMs: 1 * 60 * 1000,
  max: 300, // 300 requests per minute
  keyGenerator: (req: AuthRequest) => {
    return req.user?.id || req.ip || 'anonymous';
  },
});

// ============================================
// LEVEL 5: PUBLIC (Public Endpoints)
// ============================================

export const publicLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:public:',
  }),
  windowMs: 1 * 60 * 1000,
  max: 50, // 50 requests per minute
  keyGenerator: (req: Request) => {
    return req.ip || 'anonymous';
  },
});

// ============================================
// USER-SPECIFIC RATE LIMITING
// ============================================

export const userRateLimiter = (max: number, windowMs: number) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:user:',
    }),
    windowMs,
    max,
    keyGenerator: (req: AuthRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      return req.user.id;
    },
    skip: (req: AuthRequest) => {
      // Skip for admin users
      return req.user?.role === 'admin';
    },
  });
};

// ============================================
// ENDPOINT-SPECIFIC RATE LIMITING
// ============================================

export const endpointLimiter = (
  endpoint: string,
  max: number,
  windowMs: number
) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: `rl:endpoint:${endpoint}:`,
    }),
    windowMs,
    max,
    keyGenerator: (req: AuthRequest) => {
      return req.user?.id || req.ip || 'anonymous';
    },
  });
};
```

---

# **COMPLETE AUDIT LOGGING**

## **Comprehensive Audit System**

File: `backend/src/services/audit-logger.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Audit Logger Service
 * Logs all CRUD operations and important events
 */

export interface AuditLogData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export class AuditLoggerService {
  // ============================================
  // LOG CRUD OPERATION
  // ============================================

  static async logCRUD(
    req: AuthRequest,
    action: 'create' | 'read' | 'update' | 'delete',
    resource: string,
    resourceId?: string,
    oldValue?: any,
    newValue?: any
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id,
          action,
          resource,
          resourceId,
          oldValue: oldValue ? JSON.stringify(oldValue) : null,
          newValue: newValue ? JSON.stringify(newValue) : null,
          ipAddress: req.ip || '',
          userAgent: req.get('user-agent') || '',
          endpoint: req.path,
          method: req.method,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log audit:', error);
    }
  }

  // ============================================
  // LOG EVENT
  // ============================================

  static async logEvent(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
          newValue: data.newValue ? JSON.stringify(data.newValue) : null,
          ipAddress: data.ipAddress || '',
          userAgent: data.userAgent || '',
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  // ============================================
  // LOG LOGIN
  // ============================================

  static async logLogin(
    userId: string,
    success: boolean,
    req: Request
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: success ? 'login_success' : 'login_failed',
      resource: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: {
        success,
        twoFactorUsed: false, // Update if 2FA was used
      },
    });
  }

  // ============================================
  // LOG LOGOUT
  // ============================================

  static async logLogout(userId: string, req: Request): Promise<void> {
    await this.logEvent({
      userId,
      action: 'logout',
      resource: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  }

  // ============================================
  // LOG PERMISSION CHANGE
  // ============================================

  static async logPermissionChange(
    adminId: string,
    targetUserId: string,
    permission: any,
    action: 'granted' | 'revoked'
  ): Promise<void> {
    await this.logEvent({
      userId: adminId,
      action: `permission_${action}`,
      resource: 'user_permission',
      resourceId: targetUserId,
      newValue: permission,
      metadata: {
        targetUserId,
        permission,
      },
    });
  }

  // ============================================
  // LOG DATA EXPORT
  // ============================================

  static async logDataExport(
    userId: string,
    resource: string,
    format: string,
    count: number,
    req: Request
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: 'data_export',
      resource,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: {
        format,
        count,
        exportedAt: new Date(),
      },
    });
  }

  // ============================================
  // LOG SENSITIVE DATA ACCESS
  // ============================================

  static async logSensitiveAccess(
    userId: string,
    resource: string,
    resourceId: string,
    field: string,
    req: Request
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: 'sensitive_data_access',
      resource,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: {
        field,
        accessedAt: new Date(),
      },
    });
  }

  // ============================================
  // GET USER AUDIT TRAIL
  // ============================================

  static async getUserAuditTrail(
    userId: string,
    limit: number = 100
  ): Promise<any[]> {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  // ============================================
  // GET RESOURCE AUDIT TRAIL
  // ============================================

  static async getResourceAuditTrail(
    resource: string,
    resourceId: string,
    limit: number = 100
  ): Promise<any[]> {
    return await prisma.auditLog.findMany({
      where: {
        resource,
        resourceId,
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  // ============================================
  // SEARCH AUDIT LOGS
  // ============================================

  static async searchAuditLogs(filters: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<any[]> {
    return await prisma.auditLog.findMany({
      where: {
        userId: filters.userId,
        resource: filters.resource,
        action: filters.action,
        timestamp: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      },
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 100,
    });
  }
}
```

## **Audit Middleware**

File: `backend/src/middleware/audit.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AuditLoggerService } from '../services/audit-logger.service';

/**
 * Audit Middleware
 * Automatically logs all API requests
 */

export const auditMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Store original send function
  const originalSend = res.send;

  // Override send function
  res.send = function (data: any): Response {
    // Log after response is sent
    setImmediate(() => {
      const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
      
      if (isWrite) {
        const resource = extractResourceName(req.path);
        const action = mapMethodToAction(req.method);

        AuditLoggerService.logCRUD(
          req,
          action,
          resource,
          req.params.id,
          undefined, // oldValue would need to be stored before operation
          res.statusCode === 200 || res.statusCode === 201 ? JSON.parse(data) : undefined
        );
      }
    });

    return originalSend.call(this, data);
  };

  next();
};

// Helper functions
function extractResourceName(path: string): string {
  // Extract resource from path like /api/customers -> customers
  const parts = path.split('/');
  return parts[2] || 'unknown';
}

function mapMethodToAction(method: string): 'create' | 'read' | 'update' | 'delete' {
  const mapping: Record<string, any> = {
    POST: 'create',
    GET: 'read',
    PUT: 'update',
    PATCH: 'update',
    DELETE: 'delete',
  };
  return mapping[method] || 'read';
}
```

---

# **TRANSACTION MANAGEMENT**

## **Enhanced Transaction Manager**

File: `backend/src/services/enhanced-transaction-manager.service.ts`

```typescript
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Enhanced Transaction Manager
 * Provides ACID compliance with rollback on error
 */

export class EnhancedTransactionManager {
  // ============================================
  // EXECUTE TRANSACTION WITH RETRY
  // ============================================

  static async executeWithRetry<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await prisma.$transaction(
          async (tx) => {
            return await operation(tx);
          },
          {
            maxWait: 5000, // 5 seconds max wait
            timeout: 30000, // 30 seconds timeout
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        );

        console.log(`✅ Transaction completed successfully on attempt ${attempt}`);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Transaction failed on attempt ${attempt}:`, error);

        // Check if error is retryable
        if (!this.isRetryableError(error) || attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 100;
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  // ============================================
  // OPTIMISTIC LOCKING
  // ============================================

  static async updateWithOptimisticLock<T>(
    model: any,
    id: string,
    updateData: any,
    versionField: string = 'version'
  ): Promise<T> {
    return await this.executeWithRetry(async (tx) => {
      // Read current version
      const current = await (tx as any)[model].findUnique({
        where: { id },
      });

      if (!current) {
        throw new Error(`${model} not found`);
      }

      const currentVersion = current[versionField];

      // Update with version check
      try {
        const updated = await (tx as any)[model].update({
          where: {
            id,
            [versionField]: currentVersion,
          },
          data: {
            ...updateData,
            [versionField]: currentVersion + 1,
          },
        });

        return updated;
      } catch (error: any) {
        if (error.code === 'P2025') {
          // Record not found or version mismatch
          throw new Error('Optimistic lock failed: Record was modified by another transaction');
        }
        throw error;
      }
    });
  }

  // ============================================
  // PESSIMISTIC LOCKING
  // ============================================

  static async lockAndUpdate<T>(
    model: any,
    id: string,
    updateFn: (current: any) => any
  ): Promise<T> {
    return await prisma.$transaction(async (tx) => {
      // Lock the record for update
      const current = await (tx as any).$queryRaw`
        SELECT * FROM ${Prisma.raw(model)} WHERE id = ${id} FOR UPDATE
      `;

      if (!current || current.length === 0) {
        throw new Error(`${model} not found`);
      }

      // Apply update
      const updateData = updateFn(current[0]);

      // Update the record
      const updated = await (tx as any)[model].update({
        where: { id },
        data: updateData,
      });

      return updated;
    });
  }

  // ============================================
  // DISTRIBUTED TRANSACTION COORDINATOR
  // ============================================

  static async coordinatedTransaction(
    operations: Array<{
      name: string;
      execute: (tx: Prisma.TransactionClient) => Promise<any>;
      compensate?: (tx: Prisma.TransactionClient, result: any) => Promise<void>;
    }>
  ): Promise<any[]> {
    const results: any[] = [];
    const completedOperations: number[] = [];

    try {
      return await prisma.$transaction(async (tx) => {
        for (let i = 0; i < operations.length; i++) {
          const operation = operations[i];
          console.log(`Executing operation: ${operation.name}`);

          try {
            const result = await operation.execute(tx);
            results.push(result);
            completedOperations.push(i);
          } catch (error) {
            console.error(`Operation ${operation.name} failed:`, error);
            throw error;
          }
        }

        return results;
      });
    } catch (error) {
      console.error('Transaction failed, attempting compensation...');

      // Compensate completed operations in reverse order
      for (let i = completedOperations.length - 1; i >= 0; i--) {
        const opIndex = completedOperations[i];
        const operation = operations[opIndex];

        if (operation.compensate) {
          try {
            await prisma.$transaction(async (tx) => {
              await operation.compensate!(tx, results[opIndex]);
            });
            console.log(`✅ Compensated operation: ${operation.name}`);
          } catch (compensateError) {
            console.error(`Failed to compensate ${operation.name}:`, compensateError);
          }
        }
      }

      throw error;
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private static isRetryableError(error: any): boolean {
    // Check if error is due to deadlock or serialization failure
    const retryableCodes = ['P2034', 'P2028'];
    return retryableCodes.includes(error.code);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/ULTIMATE-UPDATE-PART-2.md`  
🎯 **Next:** CI/CD Pipeline + GDPR Compliance + Testing Suite
