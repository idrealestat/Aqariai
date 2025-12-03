# 🚀 **NOVA CRM - FULL DETAILED SYSTEM UPDATE - PART 1**
## **Complete Backend Infrastructure + Security + Database**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║       🏆 FULL DETAILED SYSTEM UPDATE - PART 1 🏆             ║
║                                                               ║
║  📦 Complete Backend Infrastructure                          ║
║  🔒 Enhanced Security System                                 ║
║  🗄️  Optimized Database Schema                               ║
║  🔐 Secrets Management                                       ║
║  🛡️  Input Validation & Sanitization                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 📋 **COMPLETE DATABASE SCHEMA WITH OPTIMIZATIONS**

## **Enhanced Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  avatar    String?
  bio       String?  @db.Text
  role      Role     @default(broker)
  status    UserStatus @default(active)
  
  // 2FA Fields
  twoFactorEnabled    Boolean   @default(false)
  twoFactorSecret     String?
  twoFactorMethod     String?   // 'totp' or 'sms'
  twoFactorBackupCodes String[]
  twoFactorEnabledAt  DateTime?
  
  // Session Management
  lastLoginAt         DateTime?
  lastLoginIp         String?
  sessionVersion      Int       @default(0)
  
  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
  
  // Relations
  customers            Customer[]
  interactions         CustomerInteraction[]
  followups            CustomerFollowup[]
  sales                Sale[]
  commissions          Commission[]
  ownerProperties      OwnerProperty[]
  seekerRequests       SeekerRequest[]
  appointments         Appointment[]
  digitalCards         DigitalCard[]
  cardScans            CardScan[]
  reports              Report[]
  publishingAccounts   PublishingAccount[]
  publishedPosts       PublishedPost[]
  notifications        Notification[]
  analyticsSnapshots   AnalyticsSnapshot[]
  userPermissions      UserPermission[]
  auditLogs            AuditLog[]
  securityLogs         SecurityLog[]
  gdprLogs             GDPRLog[]
  userConsents         UserConsent[]
  otpCodes             OTPCode[]
  refreshTokens        RefreshToken[]
  
  @@index([email])
  @@index([role])
  @@index([status])
  @@index([createdAt])
  @@map("users")
}

enum Role {
  admin
  broker
  manager
}

enum UserStatus {
  active
  inactive
  suspended
  deleted
}

// ============================================
// 2FA & SECURITY
// ============================================

model OTPCode {
  id        String   @id @default(cuid())
  userId    String
  code      String
  type      String   // 'sms', 'email'
  used      Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, code])
  @@index([expiresAt])
  @@map("otp_codes")
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  issuedAt  DateTime @default(now())
  revokedAt DateTime?
  ipAddress String?
  userAgent String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("refresh_tokens")
}

model UserPermission {
  id        String   @id @default(cuid())
  userId    String
  feature   String   // 'crm', 'finance', 'owners', etc.
  action    String   // 'create', 'read', 'update', 'delete', 'manage'
  isActive  Boolean  @default(true)
  grantedBy String?
  grantedAt DateTime @default(now())
  expiresAt DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, feature, action])
  @@index([userId])
  @@index([feature])
  @@map("user_permissions")
}

model SecurityLog {
  id        String   @id @default(cuid())
  userId    String?
  event     String   // 'login', 'logout', 'failed_login', 'unauthorized_access', etc.
  ipAddress String
  userAgent String   @db.Text
  endpoint  String?
  method    String?
  metadata  Json?
  success   Boolean  @default(true)
  timestamp DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([event])
  @@index([timestamp])
  @@index([ipAddress])
  @@map("security_logs")
}

// ============================================
// AUDIT LOGGING
// ============================================

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String   // 'create', 'read', 'update', 'delete', 'export', etc.
  resource   String   // 'customer', 'sale', 'property', etc.
  resourceId String?
  oldValue   String?  @db.Text
  newValue   String?  @db.Text
  ipAddress  String?
  userAgent  String?  @db.Text
  endpoint   String?
  method     String?
  metadata   Json?
  timestamp  DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([resource])
  @@index([resourceId])
  @@index([action])
  @@index([timestamp])
  @@map("audit_logs")
}

// ============================================
// GDPR COMPLIANCE
// ============================================

model GDPRLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // 'data_export', 'data_deletion', 'consent_update', etc.
  metadata  Json?
  timestamp DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([action])
  @@index([timestamp])
  @@map("gdpr_logs")
}

model UserConsent {
  id           String   @id @default(cuid())
  userId       String
  consentType  String   // 'data_processing', 'marketing', 'data_deletion', etc.
  consentGiven Boolean
  ipAddress    String?
  consentDate  DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([consentType])
  @@map("user_consents")
}

// ============================================
// CRM - CUSTOMERS
// ============================================

model Customer {
  id              String   @id @default(cuid())
  userId          String
  name            String
  email           String?
  phone           String
  source          String?  // 'website', 'referral', 'social', etc.
  status          CustomerStatus @default(new)
  tags            String[]
  budget          Float?
  notes           String?  @db.Text
  lastContactDate DateTime?
  nextFollowupDate DateTime?
  assignedTo      String?
  priority        Priority @default(medium)
  version         Int      @default(0) // For optimistic locking
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user         User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  interactions CustomerInteraction[]
  followups    CustomerFollowup[]
  sales        Sale[]
  
  @@index([userId])
  @@index([status])
  @@index([phone])
  @@index([createdAt])
  @@index([nextFollowupDate])
  @@fulltext([name, notes])
  @@map("customers")
}

enum CustomerStatus {
  new
  contacted
  qualified
  negotiating
  converted
  lost
}

enum Priority {
  low
  medium
  high
  urgent
}

model CustomerInteraction {
  id         String   @id @default(cuid())
  customerId String
  userId     String
  type       InteractionType
  notes      String   @db.Text
  duration   Int?     // in minutes
  outcome    String?
  scheduledFor DateTime?
  completedAt  DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([customerId])
  @@index([userId])
  @@index([type])
  @@index([createdAt])
  @@map("customer_interactions")
}

enum InteractionType {
  call
  meeting
  email
  whatsapp
  visit
  other
}

model CustomerFollowup {
  id          String   @id @default(cuid())
  customerId  String
  userId      String
  dueDate     DateTime
  title       String
  description String?  @db.Text
  status      FollowupStatus @default(pending)
  priority    Priority @default(medium)
  completedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([customerId])
  @@index([userId])
  @@index([dueDate])
  @@index([status])
  @@map("customer_followups")
}

enum FollowupStatus {
  pending
  completed
  cancelled
  overdue
}

// ============================================
// FINANCE - SALES & COMMISSIONS
// ============================================

model Sale {
  id              String   @id @default(cuid())
  userId          String
  customerId      String?
  propertyId      String?
  saleType        SaleType
  saleAmount      Float
  commissionRate  Float    // Percentage
  commissionAmount Float
  paymentStatus   PaymentStatus @default(pending)
  paymentMethod   String?
  saleDate        DateTime @default(now())
  notes           String?  @db.Text
  invoiceNumber   String?  @unique
  version         Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  customer    Customer?    @relation(fields: [customerId], references: [id], onDelete: SetNull)
  commissions Commission[]
  installments Installment[]
  
  @@index([userId])
  @@index([customerId])
  @@index([saleDate])
  @@index([paymentStatus])
  @@map("sales")
}

enum SaleType {
  sale
  rent
  lease
}

enum PaymentStatus {
  pending
  partial
  paid
  overdue
  cancelled
}

model Commission {
  id              String   @id @default(cuid())
  saleId          String
  userId          String
  commissionType  String   // 'primary', 'referral', 'bonus'
  amount          Float
  percentage      Float
  status          CommissionStatus @default(pending)
  paidAt          DateTime?
  notes           String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  sale Sale @relation(fields: [saleId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([saleId])
  @@index([userId])
  @@index([status])
  @@map("commissions")
}

enum CommissionStatus {
  pending
  approved
  paid
  cancelled
}

model Installment {
  id          String   @id @default(cuid())
  saleId      String
  amount      Float
  dueDate     DateTime
  paidDate    DateTime?
  status      InstallmentStatus @default(pending)
  paymentMethod String?
  notes       String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  sale Sale @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  @@index([saleId])
  @@index([dueDate])
  @@index([status])
  @@map("installments")
}

enum InstallmentStatus {
  pending
  paid
  overdue
  cancelled
}

// ============================================
// OWNERS & SEEKERS
// ============================================

model OwnerProperty {
  id            String   @id @default(cuid())
  userId        String
  title         String
  description   String   @db.Text
  propertyType  PropertyType
  price         Float
  area          Float    // in square meters
  location      String
  city          String
  neighborhood  String?
  bedrooms      Int?
  bathrooms     Int?
  features      String[]
  images        String[]
  status        PropertyStatus @default(available)
  publishedAt   DateTime?
  expiresAt     DateTime?
  version       Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  matches PropertyMatch[]
  
  @@index([userId])
  @@index([status])
  @@index([propertyType])
  @@index([city])
  @@index([price])
  @@fulltext([title, description, location])
  @@map("owner_properties")
}

enum PropertyType {
  apartment
  villa
  land
  commercial
  office
}

enum PropertyStatus {
  available
  sold
  rented
  reserved
  expired
}

model SeekerRequest {
  id            String   @id @default(cuid())
  userId        String
  propertyType  PropertyType
  minPrice      Float?
  maxPrice      Float?
  minArea       Float?
  maxArea       Float?
  city          String
  neighborhoods String[]
  bedrooms      Int?
  bathrooms     Int?
  features      String[]
  notes         String?  @db.Text
  status        SeekerStatus @default(active)
  version       Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  matches PropertyMatch[]
  
  @@index([userId])
  @@index([status])
  @@index([propertyType])
  @@index([city])
  @@map("seeker_requests")
}

enum SeekerStatus {
  active
  fulfilled
  cancelled
  expired
}

model PropertyMatch {
  id              String   @id @default(cuid())
  propertyId      String
  requestId       String
  matchScore      Float    // 0-100
  status          MatchStatus @default(pending)
  viewedAt        DateTime?
  interestedAt    DateTime?
  rejectedAt      DateTime?
  notes           String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  property OwnerProperty @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  request  SeekerRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  @@unique([propertyId, requestId])
  @@index([propertyId])
  @@index([requestId])
  @@index([matchScore])
  @@index([status])
  @@map("property_matches")
}

enum MatchStatus {
  pending
  viewed
  interested
  rejected
  contacted
}

// ============================================
// AUTO PUBLISHING
// ============================================

model PublishingAccount {
  id           String   @id @default(cuid())
  userId       String
  platform     Platform
  accountName  String
  accessToken  String   // Encrypted
  refreshToken String?  // Encrypted
  isActive     Boolean  @default(true)
  lastSync     DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  posts PublishedPost[]
  
  @@unique([userId, platform])
  @@index([userId])
  @@index([platform])
  @@map("publishing_accounts")
}

enum Platform {
  facebook
  instagram
  twitter
  linkedin
  aqar
  haraj
}

model PublishedPost {
  id          String   @id @default(cuid())
  userId      String
  accountId   String
  propertyId  String?
  content     String   @db.Text
  images      String[]
  platform    Platform
  postId      String?  // ID from platform
  status      PostStatus @default(scheduled)
  scheduledFor DateTime?
  publishedAt DateTime?
  failedAt    DateTime?
  errorMessage String?  @db.Text
  retryCount  Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  account PublishingAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([accountId])
  @@index([status])
  @@index([scheduledFor])
  @@map("published_posts")
}

enum PostStatus {
  scheduled
  publishing
  published
  failed
  cancelled
}

// Continue in Part 2...
```

---

**(يتبع في PART 2...)**

📄 **تم إنشاء:** Database Schema الكامل مع جميع التحسينات
🎯 **التالي:** باقي الجداول + Backend Services
