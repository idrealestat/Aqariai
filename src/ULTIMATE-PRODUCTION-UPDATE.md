# 🚀 **NOVA CRM - ULTIMATE PRODUCTION UPDATE**
## **Complete System Update for Production Readiness**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🏆 ULTIMATE PRODUCTION UPDATE 🏆                     ║
║                                                               ║
║  ✅ Enhanced Security (2FA/MFA)                              ║
║  ✅ Complete Integration                                     ║
║  ✅ Maximum Performance                                      ║
║  ✅ Full CI/CD Pipeline                                      ║
║  ✅ Advanced Analytics                                       ║
║  ✅ GDPR Compliance                                          ║
║  ✅ Complete Testing Suite                                   ║
║  ✅ Production Deployment                                    ║
║                                                               ║
║         ENTERPRISE-GRADE SYSTEM READY! 🎯                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 📋 **UPDATE OVERVIEW**

This document contains all necessary updates to make Nova CRM fully production-ready with enterprise-grade security, performance, and reliability.

---

# 1️⃣ **ENHANCED SECURITY LAYER**

## **Two-Factor Authentication (2FA/MFA)**

File: `backend/src/services/2fa.service.ts`

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma';
import { smsQueue } from './queue.service';

/**
 * Two-Factor Authentication Service
 * Supports TOTP (Authenticator Apps) and SMS OTP
 */

export class TwoFactorAuthService {
  // ============================================
  // ENABLE 2FA - TOTP
  // ============================================

  static async enableTOTP(userId: string): Promise<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  }> {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Nova CRM (${userId})`,
      issuer: 'Nova CRM',
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);

    // Store in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorBackupCodes: backupCodes,
        twoFactorEnabled: false, // Will be enabled after verification
        twoFactorMethod: 'totp',
      },
    });

    return {
      secret: secret.base32,
      qrCode,
      backupCodes,
    };
  }

  // ============================================
  // VERIFY AND ENABLE 2FA
  // ============================================

  static async verifyAndEnable(
    userId: string,
    token: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.twoFactorSecret) {
      throw new Error('2FA not initialized');
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after
    });

    if (!verified) {
      throw new Error('Invalid verification code');
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorEnabledAt: new Date(),
      },
    });

    return true;
  }

  // ============================================
  // VERIFY 2FA TOKEN
  // ============================================

  static async verifyToken(
    userId: string,
    token: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    // Check if it's a backup code
    if (user.twoFactorBackupCodes?.includes(token)) {
      // Remove used backup code
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: user.twoFactorBackupCodes.filter(
            (code) => code !== token
          ),
        },
      });
      return true;
    }

    // Verify TOTP
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });
  }

  // ============================================
  // SEND SMS OTP
  // ============================================

  static async sendSMSOTP(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.phone) {
      throw new Error('Phone number not found');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry (5 minutes)
    await prisma.oTPCode.create({
      data: {
        userId,
        code: otp,
        type: 'sms',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Send SMS
    await smsQueue.add({
      phone: user.phone,
      message: `رمز التحقق الخاص بك: ${otp}\nصالح لمدة 5 دقائق.`,
    });
  }

  // ============================================
  // VERIFY SMS OTP
  // ============================================

  static async verifySMSOTP(
    userId: string,
    code: string
  ): Promise<boolean> {
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        userId,
        code,
        type: 'sms',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return false;
    }

    // Mark as used
    await prisma.oTPCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return true;
  }

  // ============================================
  // GENERATE BACKUP CODES
  // ============================================

  private static generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  // ============================================
  // DISABLE 2FA
  // ============================================

  static async disable2FA(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
        twoFactorMethod: null,
      },
    });
  }
}
```

## **Enhanced RBAC System**

File: `backend/src/middleware/rbac.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from './auth.middleware';

/**
 * Role-Based Access Control (RBAC)
 * Granular permissions for all features and operations
 */

export interface Permission {
  feature: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// Permission definitions for each feature
const PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    // Full access to everything
    { feature: '*', action: 'manage' },
  ],
  broker: [
    // CRM
    { feature: 'crm', action: 'create' },
    { feature: 'crm', action: 'read' },
    { feature: 'crm', action: 'update' },
    { feature: 'crm', action: 'delete' },
    // Finance
    { feature: 'finance', action: 'create' },
    { feature: 'finance', action: 'read' },
    { feature: 'finance', action: 'update' },
    // Owners & Seekers
    { feature: 'owners', action: 'create' },
    { feature: 'owners', action: 'read' },
    { feature: 'owners', action: 'update' },
    // Auto Publishing
    { feature: 'publishing', action: 'create' },
    { feature: 'publishing', action: 'read' },
    // Calendar
    { feature: 'calendar', action: 'create' },
    { feature: 'calendar', action: 'read' },
    { feature: 'calendar', action: 'update' },
    // Digital Cards
    { feature: 'cards', action: 'create' },
    { feature: 'cards', action: 'read' },
    { feature: 'cards', action: 'update' },
    // Reports (read only)
    { feature: 'reports', action: 'read' },
  ],
  manager: [
    // Can view all, manage team
    { feature: 'crm', action: 'read' },
    { feature: 'finance', action: 'read' },
    { feature: 'owners', action: 'read' },
    { feature: 'reports', action: 'read' },
    { feature: 'reports', action: 'create' },
    { feature: 'team', action: 'manage' },
  ],
};

// ============================================
// CHECK PERMISSION
// ============================================

export const checkPermission = (
  feature: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح',
      });
    }

    // Check if user has permission
    const hasPermission = await hasAccess(user.id, user.role, feature, action);

    if (!hasPermission) {
      // Log unauthorized access attempt
      await prisma.securityLog.create({
        data: {
          userId: user.id,
          event: 'unauthorized_access',
          ipAddress: req.ip || '',
          userAgent: req.get('user-agent') || '',
          metadata: {
            feature,
            action,
            endpoint: req.path,
          },
          success: false,
        },
      });

      return res.status(403).json({
        success: false,
        message: `ليس لديك صلاحية ${action} في ${feature}`,
      });
    }

    next();
  };
};

// ============================================
// HAS ACCESS
// ============================================

async function hasAccess(
  userId: string,
  role: string,
  feature: string,
  action: string
): Promise<boolean> {
  // Admin has full access
  if (role === 'admin') {
    return true;
  }

  // Check role-based permissions
  const rolePermissions = PERMISSIONS[role] || [];

  // Check for wildcard permission
  if (
    rolePermissions.some(
      (p) => p.feature === '*' && p.action === 'manage'
    )
  ) {
    return true;
  }

  // Check for specific feature permission
  const hasFeaturePermission = rolePermissions.some(
    (p) =>
      (p.feature === feature || p.feature === '*') &&
      (p.action === action || p.action === 'manage')
  );

  if (hasFeaturePermission) {
    return true;
  }

  // Check custom user permissions
  const customPermission = await prisma.userPermission.findFirst({
    where: {
      userId,
      feature,
      action,
      isActive: true,
    },
  });

  return !!customPermission;
}

// ============================================
// RESOURCE OWNERSHIP CHECK
// ============================================

export const checkOwnership = (
  resourceType: 'customer' | 'sale' | 'property' | 'appointment'
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const resourceId = req.params.id;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح',
      });
    }

    // Admin can access all resources
    if (user.role === 'admin') {
      return next();
    }

    // Check ownership based on resource type
    let resource: any = null;

    switch (resourceType) {
      case 'customer':
        resource = await prisma.customer.findFirst({
          where: { id: resourceId, userId: user.id },
        });
        break;
      case 'sale':
        resource = await prisma.sale.findFirst({
          where: { id: resourceId, userId: user.id },
        });
        break;
      case 'property':
        resource = await prisma.ownerProperty.findFirst({
          where: { id: resourceId, userId: user.id },
        });
        break;
      case 'appointment':
        resource = await prisma.appointment.findFirst({
          where: { id: resourceId, userId: user.id },
        });
        break;
    }

    if (!resource) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية الوصول لهذا المورد',
      });
    }

    next();
  };
};
```

## **Secrets Management**

File: `backend/src/config/secrets.config.ts`

```typescript
import AWS from 'aws-sdk';

/**
 * Secrets Manager
 * Manages sensitive configuration using AWS Secrets Manager or Vault
 */

interface Secrets {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ENCRYPTION_KEY: string;
  REDIS_URL: string;
  SMTP_PASSWORD: string;
  TWILIO_AUTH_TOKEN: string;
  AWS_SECRET_ACCESS_KEY: string;
}

class SecretsManager {
  private secrets: Secrets | null = null;
  private awsSecretsManager: AWS.SecretsManager;

  constructor() {
    this.awsSecretsManager = new AWS.SecretsManager({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  // ============================================
  // LOAD SECRETS
  // ============================================

  async loadSecrets(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      // Load from AWS Secrets Manager
      await this.loadFromAWS();
    } else {
      // Load from environment variables
      this.loadFromEnv();
    }
  }

  // ============================================
  // LOAD FROM AWS SECRETS MANAGER
  // ============================================

  private async loadFromAWS(): Promise<void> {
    try {
      const secretName = process.env.AWS_SECRET_NAME || 'nova-crm/production';

      const data = await this.awsSecretsManager
        .getSecretValue({ SecretId: secretName })
        .promise();

      if (data.SecretString) {
        this.secrets = JSON.parse(data.SecretString);
        console.log('✅ Secrets loaded from AWS Secrets Manager');
      }
    } catch (error) {
      console.error('❌ Failed to load secrets from AWS:', error);
      throw error;
    }
  }

  // ============================================
  // LOAD FROM ENVIRONMENT
  // ============================================

  private loadFromEnv(): void {
    this.secrets = {
      DATABASE_URL: process.env.DATABASE_URL!,
      JWT_SECRET: process.env.JWT_SECRET!,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!,
      REDIS_URL: process.env.REDIS_URL!,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    };

    console.log('✅ Secrets loaded from environment variables');
  }

  // ============================================
  // GET SECRET
  // ============================================

  getSecret<K extends keyof Secrets>(key: K): Secrets[K] {
    if (!this.secrets) {
      throw new Error('Secrets not loaded. Call loadSecrets() first.');
    }

    return this.secrets[key];
  }

  // ============================================
  // ROTATE SECRET
  // ============================================

  async rotateSecret(key: keyof Secrets, newValue: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      // Update in AWS Secrets Manager
      await this.updateAWSSecret(key, newValue);
    }

    // Update in memory
    if (this.secrets) {
      this.secrets[key] = newValue as any;
    }

    console.log(`✅ Secret ${key} rotated successfully`);
  }

  // ============================================
  // UPDATE AWS SECRET
  // ============================================

  private async updateAWSSecret(
    key: string,
    value: string
  ): Promise<void> {
    const secretName = process.env.AWS_SECRET_NAME || 'nova-crm/production';

    // Get current secrets
    const data = await this.awsSecretsManager
      .getSecretValue({ SecretId: secretName })
      .promise();

    const currentSecrets = data.SecretString
      ? JSON.parse(data.SecretString)
      : {};

    // Update specific key
    currentSecrets[key] = value;

    // Update in AWS
    await this.awsSecretsManager
      .updateSecret({
        SecretId: secretName,
        SecretString: JSON.stringify(currentSecrets),
      })
      .promise();
  }
}

export const secretsManager = new SecretsManager();

// Initialize secrets on startup
secretsManager.loadSecrets().catch((error) => {
  console.error('Failed to load secrets:', error);
  process.exit(1);
});
```

---

**(يتبع...)**

هذا هو بداية التحديث الشامل. سأكمل في الأجزاء التالية:
- Enhanced Rate Limiting
- Complete Audit Logging
- Transaction Management
- Advanced Performance Optimization
- Complete CI/CD Pipeline
- GDPR Compliance
- Full Testing Suite

هل تريدني أن أكمل الآن؟
