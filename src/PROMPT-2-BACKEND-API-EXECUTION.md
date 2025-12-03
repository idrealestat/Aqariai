# 🔧 **BACKEND & API - Execution Prompt**
## **Nova CRM - Backend Foundation**

---

## 🎯 **OBJECTIVE**

Build a complete, production-ready backend API for Nova CRM with:
- PostgreSQL database (27 tables)
- Authentication & Authorization (JWT + OTP)
- RESTful API (100+ endpoints)
- Real-time capabilities (WebSocket)
- Role-based access control (RBAC)
- Comprehensive logging & monitoring

---

## 🏗️ **TECH STACK**

```yaml
Runtime: Node.js 20.x
Language: TypeScript 5.x
Framework: Express.js / NestJS (recommended)
Database: PostgreSQL 15+
ORM: Prisma 5.x
Cache: Redis 7.x
Storage: AWS S3 / Supabase Storage
Real-time: Socket.io / Supabase Realtime
Queue: Bull / BullMQ
Validation: Zod
Authentication: JWT + bcrypt
Testing: Jest + Supertest
Documentation: Swagger/OpenAPI
```

---

## 📦 **PROJECT SETUP**

### **1. Initialize Project:**

```bash
# Create project
mkdir nova-crm-backend
cd nova-crm-backend

# Initialize with TypeScript
npm init -y
npm install -D typescript @types/node ts-node nodemon

# Create tsconfig.json
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true

# Install dependencies
npm install express cors helmet compression
npm install @prisma/client
npm install jsonwebtoken bcrypt
npm install zod
npm install dotenv
npm install winston
npm install socket.io
npm install redis
npm install bull

# Install dev dependencies
npm install -D @types/express @types/cors @types/jsonwebtoken @types/bcrypt
npm install -D prisma
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

### **2. Project Structure:**

```
nova-crm-backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── logger.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rbac.ts
│   │   ├── validate.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimit.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.types.ts
│   │   ├── users/
│   │   ├── customers/
│   │   ├── properties/
│   │   ├── smart-matches/
│   │   ├── appointments/
│   │   ├── tasks/
│   │   ├── teams/
│   │   ├── subscriptions/
│   │   ├── notifications/
│   │   └── analytics/
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── otp.ts
│   │   ├── email.ts
│   │   ├── sms.ts
│   │   └── helpers.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ **DATABASE SCHEMA**

### **Create Prisma Schema:**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USERS & AUTHENTICATION
// ============================================

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  phone     String   @unique
  password  String
  name      String
  role      UserRole @default(BROKER)
  status    UserStatus @default(ACTIVE)
  
  emailVerified Boolean @default(false)
  phoneVerified Boolean @default(false)
  
  // Profile
  companyName            String?
  falLicense             String?
  falExpiry              DateTime?
  commercialRegistration String?
  commercialExpiry       DateTime?
  idNumber               String?
  dateOfBirth            DateTime?
  city                   String?
  district               String?
  
  // Settings
  preferences           Json?
  notificationSettings  Json?
  
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  lastLogin  DateTime?
  
  // Relations
  subscription       Subscription?
  customers          Customer[]
  properties         Property[]
  offers             Offer[]
  requests           Request[]
  appointments       Appointment[]
  tasks              Task[]
  tasksAssigned      Task[] @relation("AssignedTasks")
  teamMemberships    TeamMember[]
  managedTeams       Team[]
  notifications      Notification[]
  otpCodes           OtpCode[]
  analyticsEvents    AnalyticsEvent[]
  userStats          UserStats?
  
  @@index([email])
  @@index([phone])
  @@index([role])
  @@index([status])
  @@map("users")
}

enum UserRole {
  BROKER
  TEAM_MEMBER
  MANAGER
  COMPANY
  OWNER
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

model OtpCode {
  id        String   @id @default(uuid())
  userId    String
  code      String
  type      OtpType
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([code])
  @@map("otp_codes")
}

enum OtpType {
  EMAIL_VERIFICATION
  PHONE_VERIFICATION
  PASSWORD_RESET
}

// ============================================
// SUBSCRIPTIONS
// ============================================

model SubscriptionPlan {
  id            String  @id @default(uuid())
  name          String  @unique
  nameAr        String
  priceMonthly  Int
  priceYearly   Int
  features      Json
  limits        Json
  isActive      Boolean @default(true)
  createdAt     DateTime @default(now())
  
  subscriptions Subscription[]
  
  @@map("subscription_plans")
}

model Subscription {
  id                 String            @id @default(uuid())
  userId             String            @unique
  planId             String
  status             SubscriptionStatus @default(ACTIVE)
  billingCycle       BillingCycle
  
  trialEndsAt        DateTime?
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAt           DateTime?
  cancelledAt        DateTime?
  
  paymentMethod      Json?
  lastPaymentAt      DateTime?
  nextPaymentAt      DateTime?
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  user User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan SubscriptionPlan @relation(fields: [planId], references: [id])
  
  invoices Invoice[]
  
  @@index([userId])
  @@index([status])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  TRIAL
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

model Invoice {
  id             String        @id @default(uuid())
  subscriptionId String
  userId         String
  amount         Int
  currency       String        @default("SAR")
  status         InvoiceStatus
  paymentMethod  String?
  transactionId  String?
  invoiceUrl     String?
  createdAt      DateTime      @default(now())
  paidAt         DateTime?
  
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@map("subscription_invoices")
}

enum InvoiceStatus {
  PAID
  PENDING
  FAILED
  REFUNDED
}

// ============================================
// TEAMS
// ============================================

model Team {
  id          String   @id @default(uuid())
  name        String
  managerId   String
  companyId   String?
  logoUrl     String?
  description String?
  settings    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  manager User         @relation(fields: [managerId], references: [id])
  members TeamMember[]
  
  @@map("teams")
}

model TeamMember {
  id        String           @id @default(uuid())
  teamId    String
  userId    String
  role      TeamMemberRole   @default(MEMBER)
  status    TeamMemberStatus @default(ACTIVE)
  joinedAt  DateTime         @default(now())
  
  team        Team              @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  permissions TeamPermissions?
  
  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
  @@map("team_members")
}

enum TeamMemberRole {
  MANAGER
  BROKER
  OBSERVER
}

enum TeamMemberStatus {
  ACTIVE
  INACTIVE
}

model TeamPermissions {
  id           String @id @default(uuid())
  teamMemberId String @unique
  permissions  Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  teamMember TeamMember @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)
  
  @@map("permissions")
}

// ============================================
// CRM - CUSTOMERS
// ============================================

model Customer {
  id                     String   @id @default(uuid())
  userId                 String
  teamId                 String?
  assignedTo             String?
  
  name                   String
  phone                  String
  email                  String?
  whatsapp               String?
  
  category               String?
  interestLevel          String?
  source                 String?
  status                 CustomerStatus @default(ACTIVE)
  isVip                  Boolean  @default(false)
  
  preferredContactMethod String?
  preferredContactTime   Json?
  
  budgetMin              Int?
  budgetMax              Int?
  financingNeeded        Boolean?
  
  preferredCities        String[]
  preferredDistricts     String[]
  propertyTypes          String[]
  
  tags                   String[]
  notes                  String?
  customFields           Json?
  
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
  lastContact            DateTime?
  
  user       User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  activities CustomerActivity[]
  documents  CustomerDocument[]
  properties Property[]
  requests   Request[]
  appointments Appointment[]
  
  @@index([userId])
  @@index([phone])
  @@index([category])
  @@index([interestLevel])
  @@index([tags])
  @@map("customers")
}

enum CustomerStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

model CustomerActivity {
  id          String   @id @default(uuid())
  customerId  String
  userId      String?
  type        String
  description String?
  metadata    Json?
  createdAt   DateTime @default(now())
  
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  @@index([customerId])
  @@index([type])
  @@map("customer_activities")
}

model CustomerDocument {
  id         String   @id @default(uuid())
  customerId String
  uploadedBy String
  name       String
  type       String?
  fileUrl    String
  fileSize   Int?
  mimeType   String?
  createdAt  DateTime @default(now())
  
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  @@map("customer_documents")
}

// ============================================
// PROPERTIES
// ============================================

model Property {
  id                 String         @id @default(uuid())
  userId             String
  customerId         String?
  
  title              String
  description        String?
  propertyType       String
  category           String
  listingType        ListingType
  
  city               String
  district           String
  street             String?
  locationLat        Float?
  locationLng        Float?
  googleMapsUrl      String?
  
  price              Int
  priceNegotiable    Boolean        @default(true)
  commissionPercentage Float?
  
  area               Int
  bedrooms           Int?
  bathrooms          Int?
  lounges            Int?
  floors             Int?
  
  propertyAge        Int?
  deedNumber         String?
  facing             String?
  streetWidth        Int?
  
  features           String[]
  amenities          String[]
  
  status             PropertyStatus @default(DRAFT)
  isFeatured         Boolean        @default(false)
  isPublished        Boolean        @default(false)
  publishedAt        DateTime?
  
  viewsCount         Int            @default(0)
  inquiriesCount     Int            @default(0)
  sharesCount        Int            @default(0)
  
  customFields       Json?
  source             String?
  
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt
  
  user   User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  customer Customer?      @relation(fields: [customerId], references: [id])
  images PropertyImage[]
  offers Offer[]
  appointments Appointment[]
  
  @@index([userId])
  @@index([customerId])
  @@index([propertyType])
  @@index([listingType])
  @@index([city])
  @@index([status])
  @@index([price])
  @@index([area])
  @@map("properties")
}

enum ListingType {
  SALE
  RENT
}

enum PropertyStatus {
  DRAFT
  ACTIVE
  SOLD
  RENTED
  ARCHIVED
}

model PropertyImage {
  id           String   @id @default(uuid())
  propertyId   String
  url          String
  thumbnailUrl String?
  orderIndex   Int      @default(0)
  isPrimary    Boolean  @default(false)
  createdAt    DateTime @default(now())
  
  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  @@index([propertyId])
  @@map("property_images")
}

// ============================================
// OFFERS & REQUESTS
// ============================================

model Offer {
  id            String      @id @default(uuid())
  propertyId    String
  userId        String
  
  summary       Json
  fullDetails   Json
  
  maxBrokers    Int         @default(10)
  acceptedCount Int         @default(0)
  
  status        OfferStatus @default(ACTIVE)
  expiresAt     DateTime?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  property Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  matches  SmartMatch[]
  
  @@map("offers")
}

enum OfferStatus {
  ACTIVE
  PAUSED
  COMPLETED
  EXPIRED
}

model Request {
  id              String        @id @default(uuid())
  userId          String
  customerId      String?
  
  type            RequestType
  propertyTypes   String[]
  cities          String[]
  districts       String[]
  
  priceMin        Int?
  priceMax        Int?
  areaMin         Int?
  areaMax         Int?
  
  bedroomsMin     Int?
  bathroomsMin    Int?
  ageMax          Int?
  facing          String?
  
  requiredFeatures String[]
  
  description     String?
  
  financingNeeded Boolean?
  downPayment     Int?
  monthlySalary   Int?
  
  urgencyLevel    String?
  
  status          RequestStatus @default(ACTIVE)
  
  summary         Json?
  fullDetails     Json?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  customer Customer?     @relation(fields: [customerId], references: [id])
  matches  SmartMatch[]
  
  @@index([userId])
  @@index([type])
  @@index([status])
  @@map("requests")
}

enum RequestType {
  BUY
  RENT
}

enum RequestStatus {
  ACTIVE
  FULFILLED
  CANCELED
  ARCHIVED
}

// ============================================
// SMART MATCHES
// ============================================

model SmartMatch {
  id                String          @id @default(uuid())
  offerId           String
  requestId         String
  brokerId          String?
  
  matchScore        Int
  matchedFeatures   String[]
  
  status            SmartMatchStatus @default(PENDING)
  
  viewedAt          DateTime?
  acceptedAt        DateTime?
  rejectedAt        DateTime?
  
  algorithmVersion  String?
  calculationData   Json?
  
  createdAt         DateTime         @default(now())
  
  offer   Offer   @relation(fields: [offerId], references: [id], onDelete: Cascade)
  request Request @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  @@unique([offerId, requestId, brokerId])
  @@index([offerId])
  @@index([requestId])
  @@index([brokerId])
  @@index([status])
  @@index([matchScore])
  @@map("smart_matches")
}

enum SmartMatchStatus {
  PENDING
  VIEWED
  ACCEPTED
  REJECTED
  EXPIRED
}

// ============================================
// CALENDAR & APPOINTMENTS
// ============================================

model Appointment {
  id                  String             @id @default(uuid())
  userId              String
  customerId          String?
  propertyId          String?
  
  title               String
  description         String?
  type                String
  
  startDatetime       DateTime
  endDatetime         DateTime
  duration            Int?
  timezone            String             @default("Asia/Riyadh")
  
  location            String?
  googleMapsUrl       String?
  isVirtual           Boolean            @default(false)
  meetingUrl          String?
  
  status              AppointmentStatus  @default(SCHEDULED)
  cancelledReason     String?
  
  reminders           Json?
  
  recurrenceRule      Json?
  parentAppointmentId String?
  
  notes               String?
  
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
  
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  customer Customer? @relation(fields: [customerId], references: [id])
  property Property? @relation(fields: [propertyId], references: [id])
  
  @@index([userId])
  @@index([customerId])
  @@index([startDatetime])
  @@index([status])
  @@map("appointments")
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

model WorkingHours {
  id         String   @id @default(uuid())
  userId     String
  dayOfWeek  Int
  isWorking  Boolean  @default(true)
  startTime  String?
  endTime    String?
  breakStart String?
  breakEnd   String?
  
  @@unique([userId, dayOfWeek])
  @@map("working_hours")
}

model Holiday {
  id        String   @id @default(uuid())
  userId    String
  name      String?
  startDate DateTime
  endDate   DateTime
  createdAt DateTime @default(now())
  
  @@map("holidays")
}

// ============================================
// TASKS
// ============================================

model Task {
  id          String     @id @default(uuid())
  userId      String
  createdBy   String?
  assignedTo  String?
  
  title       String
  description String?
  type        String?
  priority    TaskPriority @default(MEDIUM)
  
  dueDate     DateTime?
  dueTime     String?
  
  customerId  String?
  propertyId  String?
  appointmentId String?
  
  status      TaskStatus @default(TODO)
  
  checklist   Json?
  attachments Json?
  tags        String[]
  customFields Json?
  
  completedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  user           User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignedToUser User? @relation("AssignedTasks", fields: [assignedTo], references: [id])
  comments       TaskComment[]
  
  @@index([userId])
  @@index([assignedTo])
  @@index([status])
  @@index([dueDate])
  @@map("tasks")
}

enum TaskPriority {
  HIGH
  MEDIUM
  LOW
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
  CANCELLED
}

model TaskComment {
  id        String   @id @default(uuid())
  taskId    String
  userId    String
  comment   String
  createdAt DateTime @default(now())
  
  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  @@map("task_comments")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id                String             @id @default(uuid())
  userId            String
  
  title             String
  message           String
  type              NotificationType
  category          String?
  
  actionUrl         String?
  actionLabel       String?
  
  isRead            Boolean            @default(false)
  readAt            DateTime?
  
  priority          NotificationPriority @default(NORMAL)
  
  relatedEntityType String?
  relatedEntityId   String?
  
  createdAt         DateTime           @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([isRead])
  @@index([type])
  @@map("notifications")
}

enum NotificationType {
  APPOINTMENT
  SMART_MATCH
  TASK
  CUSTOMER
  SYSTEM
}

enum NotificationPriority {
  URGENT
  NORMAL
  LOW
}

// ============================================
// ANALYTICS
// ============================================

model AnalyticsEvent {
  id            String   @id @default(uuid())
  userId        String?
  sessionId     String?
  
  eventType     String
  eventCategory String?
  eventAction   String?
  eventLabel    String?
  
  pageUrl       String?
  pageTitle     String?
  referrer      String?
  
  userAgent     String?
  deviceType    String?
  browser       String?
  os            String?
  
  ipAddress     String?
  country       String?
  city          String?
  
  metadata      Json?
  
  createdAt     DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
  @@map("analytics_events")
}

model UserStats {
  id                    String   @id @default(uuid())
  userId                String   @unique
  
  totalCustomers        Int      @default(0)
  activeCustomers       Int      @default(0)
  vipCustomers          Int      @default(0)
  
  totalProperties       Int      @default(0)
  activeProperties      Int      @default(0)
  soldProperties        Int      @default(0)
  rentedProperties      Int      @default(0)
  
  totalAppointments     Int      @default(0)
  completedAppointments Int      @default(0)
  cancelledAppointments Int      @default(0)
  
  totalTasks            Int      @default(0)
  completedTasks        Int      @default(0)
  
  totalMatches          Int      @default(0)
  acceptedMatches       Int      @default(0)
  
  totalLogins           Int      @default(0)
  lastActivity          DateTime?
  
  updatedAt             DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("user_stats")
}
```

### **Run Migrations:**

```bash
# Generate migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

---

## 🔐 **AUTHENTICATION**

### **JWT Utilities:**

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  sub: string; // user id
  email: string;
  phone: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
  };
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};
```

### **Password Hashing:**

```typescript
// src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### **OTP Generation:**

```typescript
// src/utils/otp.ts
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phone: string, code: string): Promise<void> => {
  // Integrate with SMS provider (Twilio, Unifonic, MSEGAT)
  console.log(`Sending OTP ${code} to ${phone}`);
  // await smsProvider.send({ to: phone, body: `رمز التحقق: ${code}` });
};
```

---

## 🔒 **MIDDLEWARE**

### **Authentication Middleware:**

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### **RBAC Middleware:**

```typescript
// src/middleware/rbac.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

export const requireSubscription = (feature: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const { subscription } = req.user;
    
    if (!subscription || subscription.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Active subscription required' });
    }
    
    // Check if plan includes feature
    // This would require fetching plan details from database
    next();
  };
};
```

### **Validation Middleware:**

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
  };
};
```

---

## 🌐 **API ENDPOINTS**

### **Authentication Module:**

```typescript
// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { generateOTP, sendOTP } from '../../utils/otp';

export class AuthController {
  // Register
  async register(req: Request, res: Response) {
    try {
      const { email, phone, password, name, role = 'BROKER' } = req.body;
      
      // Check if user exists
      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] }
      });
      
      if (existing) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          name,
          role,
        }
      });
      
      // Generate OTP for phone verification
      const otpCode = generateOTP();
      await prisma.otpCode.create({
        data: {
          userId: user.id,
          code: otpCode,
          type: 'PHONE_VERIFICATION',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        }
      });
      
      // Send OTP
      await sendOTP(phone, otpCode);
      
      // Generate JWT
      const token = generateToken({
        sub: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: { plan: 'trial', status: 'TRIAL' }
      });
      
      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
        requiresVerification: {
          email: !user.emailVerified,
          phone: !user.phoneVerified,
        }
      });
      
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Login
  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      
      // Find user by email or phone
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { phone: identifier }
          ]
        },
        include: {
          subscription: {
            include: { plan: true }
          }
        }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check status
      if (user.status !== 'ACTIVE') {
        return res.status(403).json({ error: 'Account suspended' });
      }
      
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });
      
      // Generate token
      const token = generateToken({
        sub: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: {
          plan: user.subscription?.plan.name || 'none',
          status: user.subscription?.status || 'none'
        }
      });
      
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          subscription: user.subscription ? {
            plan: user.subscription.plan.name,
            status: user.subscription.status,
            expiresAt: user.subscription.currentPeriodEnd
          } : null
        },
        token
      });
      
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Verify OTP
  async verifyOTP(req: Request, res: Response) {
    try {
      const { phone, code } = req.body;
      
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          code,
          used: false,
          expiresAt: { gt: new Date() }
        },
        include: { user: true }
      });
      
      if (!otpRecord || otpRecord.user.phone !== phone) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      // Mark OTP as used
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true }
      });
      
      // Update user verification status
      await prisma.user.update({
        where: { id: otpRecord.userId },
        data: { phoneVerified: true }
      });
      
      return res.json({ message: 'Phone verified successfully' });
      
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
```

### **Routes:**

```typescript
// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, verifyOTPSchema } from './auth.types';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), (req, res) => 
  authController.register(req, res)
);

router.post('/login', validate(loginSchema), (req, res) => 
  authController.login(req, res)
);

router.post('/verify-otp', validate(verifyOTPSchema), (req, res) => 
  authController.verifyOTP(req, res)
);

export default router;
```

---

## 📊 **SMART MATCHING ALGORITHM**

```typescript
// src/modules/smart-matches/matching.service.ts
import { prisma } from '../../config/database';

interface MatchScore {
  score: number;
  breakdown: {
    city: number;
    district: number;
    propertyType: number;
    category: number;
    price: number;
    area: number;
  };
  matchedFeatures: string[];
}

export class MatchingService {
  async calculateMatches(userId: string): Promise<void> {
    // Get user's requests
    const requests = await prisma.request.findMany({
      where: { userId, status: 'ACTIVE' }
    });
    
    // Get marketplace offers (exclude own)
    const offers = await prisma.offer.findMany({
      where: {
        status: 'ACTIVE',
        acceptedCount: { lt: prisma.raw('max_brokers') },
        userId: { not: userId }
      },
      include: { property: true }
    });
    
    const matches = [];
    
    for (const request of requests) {
      for (const offer of offers) {
        const matchData = this.calculateMatchScore(request, offer.property);
        
        if (matchData.score >= 50) {
          // Check if match already exists
          const existing = await prisma.smartMatch.findFirst({
            where: {
              offerId: offer.id,
              requestId: request.id,
              brokerId: userId
            }
          });
          
          if (!existing) {
            matches.push({
              offerId: offer.id,
              requestId: request.id,
              brokerId: userId,
              matchScore: matchData.score,
              matchedFeatures: matchData.matchedFeatures,
              calculationData: matchData.breakdown,
              algorithmVersion: '1.0'
            });
          }
        }
      }
    }
    
    // Save matches
    if (matches.length > 0) {
      await prisma.smartMatch.createMany({ data: matches });
      
      // Send notification
      await prisma.notification.create({
        data: {
          userId,
          title: 'فرص ذكية جديدة! 🎯',
          message: `تم العثور على ${matches.length} فرصة مطابقة`,
          type: 'SMART_MATCH',
          priority: 'NORMAL'
        }
      });
    }
  }
  
  private calculateMatchScore(request: any, property: any): MatchScore {
    let score = 0;
    const breakdown = {
      city: 0,
      district: 0,
      propertyType: 0,
      category: 0,
      price: 0,
      area: 0
    };
    const matchedFeatures: string[] = [];
    
    // City match (25 points)
    if (request.cities.includes(property.city)) {
      breakdown.city = 25;
      score += 25;
      matchedFeatures.push('المدينة');
    }
    
    // District match (20 points)
    if (request.districts && request.districts.includes(property.district)) {
      breakdown.district = 20;
      score += 20;
      matchedFeatures.push('الحي');
    }
    
    // Property type (20 points)
    if (request.propertyTypes.includes(property.propertyType)) {
      breakdown.propertyType = 20;
      score += 20;
      matchedFeatures.push('نوع العقار');
    }
    
    // Category (10 points)
    if (property.category === 'سكني' && request.type === 'BUY') {
      breakdown.category = 10;
      score += 10;
    }
    
    // Price match (15 points)
    if (request.priceMin && request.priceMax) {
      if (property.price >= request.priceMin && property.price <= request.priceMax) {
        breakdown.price = 15;
        score += 15;
        matchedFeatures.push('السعر');
      }
    }
    
    // Area match (10 points)
    if (request.areaMin && request.areaMax) {
      if (property.area >= request.areaMin && property.area <= request.areaMax) {
        breakdown.area = 10;
        score += 10;
        matchedFeatures.push('المساحة');
      }
    }
    
    return { score: Math.round(score), breakdown, matchedFeatures };
  }
}
```

---

## 📡 **REAL-TIME UPDATES**

```typescript
// src/config/socket.ts
import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt';

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL }
  });
  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    try {
      const user = verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.data.user.sub;
    
    // Join user's personal room
    socket.join(`user:${userId}`);
    
    console.log(`User ${userId} connected`);
    
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
  
  return io;
};

// Emit events from controllers
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};
```

---

## ✅ **TESTING**

```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        phone: '0501234567',
        password: 'Test1234!',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
  });
  
  it('should login existing user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'test@example.com',
        password: 'Test1234!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

---

## 📚 **API DOCUMENTATION**

Use Swagger for auto-generated docs:

```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nova CRM API',
      version: '1.0.0',
      description: 'Complete API documentation for Nova CRM'
    },
    servers: [
      { url: 'http://localhost:3000/api' }
    ]
  },
  apis: ['./src/**/*.routes.ts']
};

export const specs = swaggerJsdoc(options);
export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(specs);
```

---

## 🚀 **DEPLOYMENT**

```bash
# Build
npm run build

# Start production
npm start

# Environment variables
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
REDIS_URL="redis://..."
AWS_ACCESS_KEY="..."
AWS_SECRET_KEY="..."
FRONTEND_URL="https://..."
```

---

📄 **File:** `/PROMPT-2-BACKEND-API-EXECUTION.md`  
🔧 **Type:** Backend Development  
⏱️ **Estimated Time:** 80-100 hours  
👥 **Role:** Backend Developer  
🎯 **Output:** Complete REST API with 100+ endpoints

---

**🚀 Execute this prompt to build the complete Nova CRM backend!**
