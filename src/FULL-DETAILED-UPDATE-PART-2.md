# 🚀 **FULL DETAILED SYSTEM UPDATE - PART 2**
## **Database Schema Continuation + Complete Backend Services**

---

# **DATABASE SCHEMA - CONTINUATION**

```prisma
// ============================================
// CALENDAR & APPOINTMENTS
// ============================================

model Appointment {
  id          String   @id @default(cuid())
  userId      String
  customerId  String?
  title       String
  description String?  @db.Text
  location    String?
  startTime   DateTime
  endTime     DateTime
  status      AppointmentStatus @default(scheduled)
  type        AppointmentType
  reminderSent Boolean  @default(false)
  reminderMinutes Int   @default(30)
  recurrence  String?  // 'daily', 'weekly', 'monthly'
  recurrenceEnd DateTime?
  version     Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([startTime])
  @@index([status])
  @@map("appointments")
}

enum AppointmentStatus {
  scheduled
  confirmed
  completed
  cancelled
  no_show
}

enum AppointmentType {
  meeting
  viewing
  call
  inspection
  signing
  other
}

// ============================================
// DIGITAL BUSINESS CARDS
// ============================================

model DigitalCard {
  id          String   @id @default(cuid())
  userId      String
  name        String
  title       String?
  company     String?
  email       String
  phone       String
  whatsapp    String?
  website     String?
  address     String?
  bio         String?  @db.Text
  avatar      String?
  logo        String?
  theme       String   @default('default')
  customFields Json?
  qrCode      String   // Generated QR code URL
  slug        String   @unique
  isActive    Boolean  @default(true)
  viewCount   Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  scans CardScan[]
  
  @@index([userId])
  @@index([slug])
  @@map("digital_cards")
}

model CardScan {
  id        String   @id @default(cuid())
  cardId    String
  userId    String?  // If scan leads to registration
  ipAddress String
  userAgent String   @db.Text
  location  String?
  device    String?
  
  scannedAt DateTime @default(now())
  
  card DigitalCard @relation(fields: [cardId], references: [id], onDelete: Cascade)
  user User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([cardId])
  @@index([scannedAt])
  @@map("card_scans")
}

// ============================================
// REPORTS & ANALYTICS
// ============================================

model Report {
  id          String   @id @default(cuid())
  userId      String
  type        ReportType
  title       String
  description String?  @db.Text
  filters     Json
  data        Json
  schedule    String?  // 'daily', 'weekly', 'monthly'
  nextRun     DateTime?
  isActive    Boolean  @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([type])
  @@map("reports")
}

enum ReportType {
  sales
  customers
  properties
  performance
  finance
  custom
}

model AnalyticsSnapshot {
  id        String   @id @default(cuid())
  userId    String?
  date      DateTime
  type      String   // 'daily', 'weekly', 'monthly'
  metrics   Json     // All metrics for that period
  
  createdAt DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@unique([userId, date, type])
  @@index([userId])
  @@index([date])
  @@map("analytics_snapshots")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String   @db.Text
  data      Json?
  isRead    Boolean  @default(false)
  readAt    DateTime?
  priority  Priority @default(medium)
  
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  followup
  appointment
  sale
  commission
  match
  system
  alert
}

// ============================================
// SYSTEM TABLES
// ============================================

model SystemSettings {
  id    String @id @default(cuid())
  key   String @unique
  value Json
  
  updatedAt DateTime @updatedAt
  
  @@map("system_settings")
}

model RateLimitLog {
  id        String   @id @default(cuid())
  key       String   // userId or IP
  endpoint  String
  count     Int
  window    String   // Time window
  blocked   Boolean  @default(false)
  
  timestamp DateTime @default(now())
  
  @@index([key])
  @@index([timestamp])
  @@map("rate_limit_logs")
}
```

---

# **COMPLETE BACKEND SERVICES**

## **Enhanced Authentication Service**

File: `backend/src/services/enhanced-auth.service.ts`

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { TwoFactorAuthService } from './2fa.service';
import { secretsManager } from '../config/secrets.config';
import { AuditLoggerService } from './audit-logger.service';

/**
 * Enhanced Authentication Service
 * With 2FA, JWT rotation, and session management
 */

interface LoginResult {
  user: any;
  accessToken?: string;
  refreshToken?: string;
  requires2FA?: boolean;
  sessionId?: string;
}

export class EnhancedAuthService {
  // ============================================
  // REGISTER USER
  // ============================================

  static async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
  }): Promise<any> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('البريد الإلكتروني مسجل مسبقاً');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: (data.role as any) || 'broker',
        status: 'active',
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // ============================================
  // LOGIN - STEP 1 (Check credentials)
  // ============================================

  static async login(
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<LoginResult> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Log failed login
      await AuditLoggerService.logEvent({
        action: 'login_failed',
        resource: 'auth',
        ipAddress,
        userAgent,
        metadata: { email, reason: 'user_not_found' },
      });

      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Check if account is active
    if (user.status !== 'active') {
      throw new Error('الحساب غير نشط');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Log failed login
      await AuditLoggerService.logEvent({
        userId: user.id,
        action: 'login_failed',
        resource: 'auth',
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_password' },
      });

      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return without tokens, require 2FA
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        requires2FA: true,
      };
    }

    // Generate tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Log successful login
    await AuditLoggerService.logLogin(user.id, true, {
      ip: ipAddress,
      get: () => userAgent,
    } as any);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  // ============================================
  // LOGIN - STEP 2 (Verify 2FA)
  // ============================================

  static async verifyLogin2FA(
    userId: string,
    code: string,
    ipAddress: string,
    userAgent: string
  ): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // Verify 2FA code
    const isValid = await TwoFactorAuthService.verifyToken(userId, code);

    if (!isValid) {
      // Log failed 2FA
      await AuditLoggerService.logEvent({
        userId,
        action: '2fa_failed',
        resource: 'auth',
        ipAddress,
        userAgent,
      });

      throw new Error('رمز التحقق غير صحيح');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    // Update last login
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Log successful login
    await AuditLoggerService.logLogin(userId, true, {
      ip: ipAddress,
      get: () => userAgent,
    } as any);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  // ============================================
  // GENERATE TOKENS
  // ============================================

  private static async generateTokens(
    user: any,
    ipAddress: string,
    userAgent: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    const jwtSecret = secretsManager.getSecret('JWT_SECRET');
    const jwtRefreshSecret = secretsManager.getSecret('JWT_REFRESH_SECRET');

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionVersion: user.sessionVersion,
      },
      jwtSecret,
      { expiresIn: '15m' }
    );

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        sessionVersion: user.sessionVersion,
      },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    // Store refresh token
    const tokenRecord = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
      },
    });

    return {
      accessToken,
      refreshToken,
      sessionId: tokenRecord.id,
    };
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================

  static async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtRefreshSecret = secretsManager.getSecret('JWT_REFRESH_SECRET');

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as any;

      // Check if token exists in database
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!tokenRecord) {
        throw new Error('Refresh token invalid or expired');
      }

      // Check session version
      if (decoded.sessionVersion !== tokenRecord.user.sessionVersion) {
        throw new Error('Session has been invalidated');
      }

      // Revoke old refresh token
      await prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revokedAt: new Date() },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(
        tokenRecord.user,
        tokenRecord.ipAddress || '',
        tokenRecord.userAgent || ''
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new Error('Refresh token invalid or expired');
    }
  }

  // ============================================
  // LOGOUT
  // ============================================

  static async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific token
      await prisma.refreshToken.updateMany({
        where: {
          userId,
          token: refreshToken,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    } else {
      // Revoke all tokens
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    // Log logout
    await AuditLoggerService.logEvent({
      userId,
      action: 'logout',
      resource: 'auth',
    });
  }

  // ============================================
  // LOGOUT ALL SESSIONS
  // ============================================

  static async logoutAllSessions(userId: string): Promise<void> {
    // Increment session version (invalidates all tokens)
    await prisma.user.update({
      where: { id: userId },
      data: {
        sessionVersion: {
          increment: 1,
        },
      },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: {
        revokedAt: new Date(),
      },
    });

    // Log event
    await AuditLoggerService.logEvent({
      userId,
      action: 'logout_all_sessions',
      resource: 'auth',
    });
  }

  // ============================================
  // CHANGE PASSWORD
  // ============================================

  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and invalidate all sessions
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        sessionVersion: {
          increment: 1,
        },
      },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: {
        revokedAt: new Date(),
      },
    });

    // Log event
    await AuditLoggerService.logEvent({
      userId,
      action: 'password_changed',
      resource: 'auth',
    });
  }

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      secretsManager.getSecret('JWT_SECRET'),
      { expiresIn: '1h' }
    );

    // Send email with reset link
    // await emailService.sendPasswordReset(email, resetToken);

    // Log event
    await AuditLoggerService.logEvent({
      userId: user.id,
      action: 'password_reset_requested',
      resource: 'auth',
    });
  }

  // ============================================
  // RESET PASSWORD
  // ============================================

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    try {
      const decoded = jwt.verify(
        token,
        secretsManager.getSecret('JWT_SECRET')
      ) as any;

      if (decoded.purpose !== 'password_reset') {
        throw new Error('Invalid token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and invalidate all sessions
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          password: hashedPassword,
          sessionVersion: {
            increment: 1,
          },
        },
      });

      // Revoke all refresh tokens
      await prisma.refreshToken.updateMany({
        where: { userId: decoded.userId },
        data: {
          revokedAt: new Date(),
        },
      });

      // Log event
      await AuditLoggerService.logEvent({
        userId: decoded.userId,
        action: 'password_reset_completed',
        resource: 'auth',
      });
    } catch (error) {
      throw new Error('رمز إعادة التعيين غير صحيح أو منتهي الصلاحية');
    }
  }
}
```

---

**(يتبع في PART 3...)**

📄 **تم إنشاء:** Enhanced Auth Service + Database Schema الكامل  
🎯 **التالي:** باقي الخدمات الأساسية + Validation + Error Handling
