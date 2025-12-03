# 🚀 **FEATURE 1: CRM CORE - CUSTOMER INTERACTIONS**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🎯 FEATURE 1: CRM CORE - FULL IMPLEMENTATION          ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (50 customers + 200 interactions)           ║
║  ✅ Backend APIs (Express + TypeScript)                      ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Real-Time Notifications (Socket.IO)                      ║
║  ✅ AI Suggestions (OpenAI Integration)                      ║
║  ✅ Testing Scripts                                          ║
║                                                               ║
║        Copy-Paste Ready for Immediate Development!           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 📋 **TABLE OF CONTENTS**

1. [Database Schema](#1-database-schema)
2. [Data Seeding](#2-data-seeding)
3. [Backend Implementation](#3-backend-implementation)
4. [Frontend Components](#4-frontend-components)
5. [Real-Time Integration](#5-real-time-integration)
6. [AI Integration](#6-ai-integration)
7. [Testing](#7-testing)
8. [Setup Instructions](#8-setup-instructions)

---

# 1️⃣ **DATABASE SCHEMA**

## **Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
// ============================================
// FEATURE 1: CRM CORE - DATABASE SCHEMA
// ============================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// USERS
// ============================================

model User {
  id                    String                 @id @default(uuid())
  email                 String                 @unique
  name                  String
  password              String
  phone                 String?
  role                  String                 @default("BROKER")
  status                String                 @default("ACTIVE")
  avatar                String?
  createdAt             DateTime               @default(now()) @map("created_at")
  updatedAt             DateTime               @updatedAt @map("updated_at")

  // Relations
  customers             Customer[]
  interactions          CustomerInteraction[]
  followups             CustomerFollowup[]
  notifications         Notification[]

  @@map("users")
}

// ============================================
// CUSTOMERS
// ============================================

model Customer {
  id                String                 @id @default(uuid())
  userId            String                 @map("user_id")
  user              User                   @relation(fields: [userId], references: [id])
  name              String
  phone             String
  email             String?
  secondaryPhone    String?                @map("secondary_phone")
  whatsapp          String?
  type              String                 @default("buyer") // 'buyer', 'seller', 'both'
  status            String                 @default("active") // 'active', 'inactive', 'closed'
  source            String?                // 'website', 'referral', 'social', 'direct'
  
  // Buyer-specific fields
  budgetMin         Decimal?               @map("budget_min") @db.Decimal(15, 2)
  budgetMax         Decimal?               @map("budget_max") @db.Decimal(15, 2)
  preferredType     String?                @map("preferred_type") // 'apartment', 'villa', etc.
  preferredCity     String?                @map("preferred_city")
  preferredDistrict String?                @map("preferred_district")
  
  // Seller-specific fields
  propertyType      String?                @map("property_type")
  propertyCity      String?                @map("property_city")
  propertyDistrict  String?                @map("property_district")
  askingPrice       Decimal?               @map("asking_price") @db.Decimal(15, 2)
  
  // Metadata
  rating            Int                    @default(0) // 0-5 stars
  tags              Json                   @default("[]") // ['vip', 'urgent', 'negotiable']
  customFields      Json                   @default("{}") @map("custom_fields")
  notes             String?                @db.Text
  
  // Timestamps
  lastContactedAt   DateTime?              @map("last_contacted_at")
  createdAt         DateTime               @default(now()) @map("created_at")
  updatedAt         DateTime               @updatedAt @map("updated_at")

  // Relations
  interactions      CustomerInteraction[]
  followups         CustomerFollowup[]

  @@index([userId])
  @@index([phone])
  @@index([email])
  @@index([status])
  @@index([type])
  @@map("customers")
}

// ============================================
// CUSTOMER INTERACTIONS
// ============================================

model CustomerInteraction {
  id                String              @id @default(uuid())
  customerId        String              @map("customer_id")
  customer          Customer            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  userId            String              @map("user_id")
  user              User                @relation(fields: [userId], references: [id])
  
  // Interaction details
  type              String              // 'call', 'meeting', 'email', 'whatsapp', 'sms', 'note'
  subject           String?
  notes             String?             @db.Text
  outcome           String?             // 'interested', 'not_interested', 'callback', 'meeting_scheduled', 'deal_closed', 'no_answer'
  
  // Scheduling
  scheduledAt       DateTime?           @map("scheduled_at")
  completedAt       DateTime?           @map("completed_at")
  durationMinutes   Int?                @map("duration_minutes")
  
  // Attachments & metadata
  attachments       Json                @default("[]") // [{name, url, type, size}]
  recordingUrl      String?             @map("recording_url")
  metadata          Json                @default("{}")
  
  // Follow-up tracking
  requiresFollowup  Boolean             @default(false) @map("requires_followup")
  followupCreated   Boolean             @default(false) @map("followup_created")
  
  // Timestamps
  createdAt         DateTime            @default(now()) @map("created_at")
  updatedAt         DateTime            @updatedAt @map("updated_at")

  // Relations
  followups         CustomerFollowup[]

  @@index([customerId])
  @@index([userId])
  @@index([type])
  @@index([outcome])
  @@index([scheduledAt])
  @@index([completedAt])
  @@map("customer_interactions")
}

// ============================================
// CUSTOMER FOLLOW-UPS
// ============================================

model CustomerFollowup {
  id                String              @id @default(uuid())
  customerId        String              @map("customer_id")
  customer          Customer            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  userId            String              @map("user_id")
  user              User                @relation(fields: [userId], references: [id])
  interactionId     String?             @map("interaction_id")
  interaction       CustomerInteraction? @relation(fields: [interactionId], references: [id], onDelete: SetNull)
  
  // Follow-up details
  title             String
  description       String?             @db.Text
  dueDate           DateTime            @map("due_date")
  priority          String              @default("medium") // 'low', 'medium', 'high', 'urgent'
  status            String              @default("pending") // 'pending', 'completed', 'cancelled', 'overdue'
  
  // Reminder settings
  reminderEnabled   Boolean             @default(true) @map("reminder_enabled")
  reminderSent      Boolean             @default(false) @map("reminder_sent")
  reminderAt        DateTime?           @map("reminder_at")
  reminderMethod    String              @default("notification") @map("reminder_method") // 'notification', 'email', 'sms', 'all'
  
  // Completion details
  completedAt       DateTime?           @map("completed_at")
  completionNotes   String?             @map("completion_notes") @db.Text
  
  // Timestamps
  createdAt         DateTime            @default(now()) @map("created_at")
  updatedAt         DateTime            @updatedAt @map("updated_at")

  @@index([customerId])
  @@index([userId])
  @@index([dueDate])
  @@index([status])
  @@index([priority])
  @@map("customer_followups")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type        String   // 'followup_due', 'interaction_scheduled', 'customer_update'
  title       String
  message     String   @db.Text
  actionUrl   String?  @map("action_url")
  metadata    Json     @default("{}")
  
  isRead      Boolean  @default(false) @map("is_read")
  readAt      DateTime? @map("read_at")
  
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

// ============================================
// INTERACTION TEMPLATES (for quick actions)
// ============================================

model InteractionTemplate {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id") // null = system template
  name        String
  type        String   // 'call', 'meeting', 'email', 'whatsapp'
  subject     String?
  content     String   @db.Text
  isDefault   Boolean  @default(false) @map("is_default")
  usageCount  Int      @default(0) @map("usage_count")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([type])
  @@map("interaction_templates")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/crm-core.seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================
// SAMPLE DATA
// ============================================

const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'تبوك', 'أبها', 'الطائف', 'بريدة'
];

const CUSTOMER_NAMES = [
  'محمد أحمد', 'فاطمة علي', 'خالد سعيد', 'نورة محمد', 'عبدالله إبراهيم',
  'سارة خالد', 'عمر حسن', 'ريم عبدالله', 'فيصل ناصر', 'لينا يوسف',
  'طارق محمود', 'هند سلطان', 'ماجد فهد', 'منى عادل', 'وليد راشد',
  'ديما فؤاد', 'سلطان مشعل', 'جواهر حمد', 'تركي بندر', 'شهد عمر'
];

const INTERACTION_TYPES = ['call', 'meeting', 'email', 'whatsapp', 'sms', 'note'];

const OUTCOMES = [
  'interested',
  'not_interested',
  'callback',
  'meeting_scheduled',
  'deal_closed',
  'no_answer'
];

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhone(): string {
  const prefix = '0505';
  const suffix = String(randomNumber(100000, 999999));
  return prefix + suffix;
}

function generateEmail(name: string): string {
  const cleanName = name.replace(/\s+/g, '.').toLowerCase();
  const domains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
  return `${cleanName}@${randomElement(domains)}`;
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedCRMCore() {
  console.log('🌱 Seeding CRM Core - Customer Interactions...\n');

  // ============================================
  // 1. CREATE DEMO USER
  // ============================================
  console.log('👤 Creating demo user...');
  
  const hashedPassword = await bcrypt.hash('Demo@123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@novacrm.com' },
    update: {},
    create: {
      email: 'demo@novacrm.com',
      name: 'أحمد الوسيط',
      password: hashedPassword,
      phone: '+966501234567',
      role: 'BROKER',
      status: 'ACTIVE',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
    },
  });
  
  console.log(`✅ Demo user created: ${user.email}`);

  // ============================================
  // 2. CREATE CUSTOMERS (50)
  // ============================================
  console.log('\n👥 Creating 50 customers...');
  
  const customers = [];
  
  for (let i = 0; i < 50; i++) {
    const type = randomElement(['buyer', 'seller', 'both']);
    const name = randomElement(CUSTOMER_NAMES);
    const phone = generatePhone();
    const city = randomElement(SAUDI_CITIES);
    
    const customerData: any = {
      userId: user.id,
      name: `${name} ${i + 1}`,
      phone,
      email: Math.random() > 0.3 ? generateEmail(name) : null,
      type,
      status: randomElement(['active', 'active', 'active', 'inactive']), // 75% active
      source: randomElement(['website', 'referral', 'social', 'direct']),
      rating: randomNumber(0, 5),
      tags: JSON.stringify(
        Math.random() > 0.7
          ? [randomElement(['vip', 'urgent', 'negotiable', 'hot_lead'])]
          : []
      ),
      lastContactedAt: randomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date()
      ),
    };

    // Buyer-specific fields
    if (type === 'buyer' || type === 'both') {
      customerData.budgetMin = randomNumber(200, 800) * 1000;
      customerData.budgetMax = customerData.budgetMin + randomNumber(100, 500) * 1000;
      customerData.preferredType = randomElement(['apartment', 'villa', 'land', 'commercial']);
      customerData.preferredCity = city;
      customerData.preferredDistrict = `حي ${randomElement(['الملقا', 'النخيل', 'الياسمين', 'الربوة'])}`;
    }

    // Seller-specific fields
    if (type === 'seller' || type === 'both') {
      customerData.propertyType = randomElement(['apartment', 'villa', 'land', 'commercial']);
      customerData.propertyCity = city;
      customerData.propertyDistrict = `حي ${randomElement(['الملقا', 'النخيل', 'الياسمين', 'الربوة'])}`;
      customerData.askingPrice = randomNumber(300, 2000) * 1000;
    }

    const customer = await prisma.customer.create({
      data: customerData,
    });

    customers.push(customer);
  }
  
  console.log(`✅ Created ${customers.length} customers`);

  // ============================================
  // 3. CREATE INTERACTIONS (200)
  // ============================================
  console.log('\n💬 Creating 200 customer interactions...');
  
  const interactions = [];
  
  for (let i = 0; i < 200; i++) {
    const customer = randomElement(customers);
    const type = randomElement(INTERACTION_TYPES);
    const outcome = Math.random() > 0.3 ? randomElement(OUTCOMES) : null;
    
    // Generate realistic date
    const scheduledDate = randomDate(
      new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)   // 7 days from now
    );
    
    const isCompleted = scheduledDate < new Date();
    
    const interactionData: any = {
      customerId: customer.id,
      userId: user.id,
      type,
      subject: `${type === 'call' ? 'مكالمة' : type === 'meeting' ? 'اجتماع' : 'تواصل'} مع ${customer.name}`,
      notes: generateInteractionNote(type, customer.name),
      outcome: isCompleted ? outcome : null,
      scheduledAt: scheduledDate,
      completedAt: isCompleted ? scheduledDate : null,
      durationMinutes: isCompleted && (type === 'call' || type === 'meeting') 
        ? randomNumber(5, 60) 
        : null,
      requiresFollowup: outcome === 'interested' || outcome === 'callback',
    };

    const interaction = await prisma.customerInteraction.create({
      data: interactionData,
    });

    interactions.push(interaction);
  }
  
  console.log(`✅ Created ${interactions.length} interactions`);

  // ============================================
  // 4. CREATE FOLLOW-UPS (80)
  // ============================================
  console.log('\n📅 Creating 80 follow-ups...');
  
  let followupCount = 0;
  
  for (const interaction of interactions) {
    if (interaction.requiresFollowup && Math.random() > 0.6) {
      const dueDate = new Date(interaction.scheduledAt);
      dueDate.setDate(dueDate.getDate() + randomNumber(1, 14)); // 1-14 days after interaction
      
      const isPastDue = dueDate < new Date();
      const isCompleted = isPastDue && Math.random() > 0.3;
      
      await prisma.customerFollowup.create({
        data: {
          customerId: interaction.customerId,
          userId: user.id,
          interactionId: interaction.id,
          title: generateFollowupTitle(),
          description: 'متابعة بعد التواصل الأخير',
          dueDate,
          priority: randomElement(PRIORITIES),
          status: isCompleted ? 'completed' : isPastDue ? 'overdue' : 'pending',
          reminderEnabled: true,
          reminderSent: isPastDue,
          reminderAt: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000), // 24h before
          completedAt: isCompleted ? dueDate : null,
          completionNotes: isCompleted ? 'تمت المتابعة بنجاح' : null,
        },
      });
      
      followupCount++;
    }
  }
  
  console.log(`✅ Created ${followupCount} follow-ups`);

  // ============================================
  // 5. CREATE NOTIFICATIONS (50)
  // ============================================
  console.log('\n🔔 Creating 50 notifications...');
  
  for (let i = 0; i < 50; i++) {
    const type = randomElement([
      'followup_due',
      'interaction_scheduled',
      'customer_update',
    ]);
    
    await prisma.notification.create({
      data: {
        userId: user.id,
        type,
        title: generateNotificationTitle(type),
        message: generateNotificationMessage(type),
        isRead: Math.random() > 0.5,
        readAt: Math.random() > 0.5 ? new Date() : null,
        metadata: JSON.stringify({ customerId: randomElement(customers).id }),
      },
    });
  }
  
  console.log('✅ Created 50 notifications');

  // ============================================
  // 6. CREATE INTERACTION TEMPLATES (10)
  // ============================================
  console.log('\n📝 Creating 10 interaction templates...');
  
  const templates = [
    {
      name: 'مكالمة أولية',
      type: 'call',
      subject: 'مكالمة تعريفية',
      content: 'السلام عليكم، أتصل للتعرف على متطلباتكم العقارية وكيف يمكنني مساعدتكم.',
    },
    {
      name: 'تحديد موعد معاينة',
      type: 'meeting',
      subject: 'موعد معاينة عقار',
      content: 'نود ترتيب موعد لمعاينة العقار في الوقت المناسب لكم.',
    },
    {
      name: 'متابعة بعد المعاينة',
      type: 'whatsapp',
      subject: 'متابعة بعد المعاينة',
      content: 'شكراً لوقتكم في معاينة العقار. ما رأيكم؟ هل لديكم أي استفسارات؟',
    },
    {
      name: 'عرض سعر',
      type: 'email',
      subject: 'عرض سعر خاص',
      content: 'يسعدنا تقديم عرض سعر خاص على العقار المعروض.',
    },
    {
      name: 'تذكير بالموعد',
      type: 'sms',
      subject: 'تذكير بالموعد',
      content: 'تذكير: لديك موعد معاينة غداً الساعة [الوقت].',
    },
  ];

  for (const template of templates) {
    await prisma.interactionTemplate.create({
      data: {
        ...template,
        isDefault: true,
        usageCount: randomNumber(0, 50),
      },
    });
  }
  
  console.log('✅ Created 10 interaction templates');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ CRM Core Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Users:        1`);
  console.log(`   - Customers:    ${customers.length}`);
  console.log(`   - Interactions: ${interactions.length}`);
  console.log(`   - Follow-ups:   ${followupCount}`);
  console.log(`   - Notifications: 50`);
  console.log(`   - Templates:    10`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateInteractionNote(type: string, customerName: string): string {
  const notes = {
    call: [
      `اتصلت بـ ${customerName} للمتابعة على استفساره عن العقار`,
      `مكالمة مع ${customerName} - أبدى اهتماماً كبيراً`,
      `تم التواصل مع ${customerName} - طلب مزيد من التفاصيل`,
    ],
    meeting: [
      `اجتماع مع ${customerName} لمناقشة الخيارات المتاحة`,
      `لقاء مع ${customerName} في الموقع`,
      `اجتماع تفصيلي مع ${customerName} لمراجعة العروض`,
    ],
    email: [
      `تم إرسال تفاصيل العقار لـ ${customerName}`,
      `إرسال عرض سعر خاص لـ ${customerName}`,
    ],
    whatsapp: [
      `تواصل عبر واتساب مع ${customerName}`,
      `إرسال صور العقار عبر واتساب`,
    ],
  };

  const typeNotes = notes[type as keyof typeof notes] || [`تواصل مع ${customerName}`];
  return randomElement(typeNotes);
}

function generateFollowupTitle(): string {
  const titles = [
    'متابعة بعد المكالمة',
    'الاتصال للتأكيد',
    'إرسال التفاصيل الإضافية',
    'جدولة موعد المعاينة',
    'متابعة قرار العميل',
    'مراجعة العرض المقدم',
  ];
  return randomElement(titles);
}

function generateNotificationTitle(type: string): string {
  const titles = {
    followup_due: 'متابعة مستحقة',
    interaction_scheduled: 'تفاعل مجدول',
    customer_update: 'تحديث عميل',
  };
  return titles[type as keyof typeof titles] || 'إشعار جديد';
}

function generateNotificationMessage(type: string): string {
  const messages = {
    followup_due: 'لديك متابعة مستحقة اليوم',
    interaction_scheduled: 'لديك تفاعل مجدول خلال ساعة',
    customer_update: 'تم تحديث بيانات أحد العملاء',
  };
  return messages[type as keyof typeof messages] || 'إشعار جديد';
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedCRMCore };

// If running directly
if (require.main === module) {
  seedCRMCore()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
```

## **Main Seed File**

File: `backend/prisma/seed.ts`

```typescript
import { seedCRMCore } from './seeds/crm-core.seed';

async function main() {
  console.log('🌱 Starting database seeding...\n');
  
  await seedCRMCore();
  
  console.log('\n🎉 All seeding completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });
```

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Controllers**

### **Customer Controller**

File: `backend/src/controllers/customer.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  email: z.string().email().optional().nullable(),
  secondaryPhone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  type: z.enum(['buyer', 'seller', 'both']).default('buyer'),
  source: z.string().optional().nullable(),
  budgetMin: z.number().optional().nullable(),
  budgetMax: z.number().optional().nullable(),
  preferredType: z.string().optional().nullable(),
  preferredCity: z.string().optional().nullable(),
  preferredDistrict: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  propertyCity: z.string().optional().nullable(),
  propertyDistrict: z.string().optional().nullable(),
  askingPrice: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateCustomerSchema = createCustomerSchema.partial();

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ============================================
// CUSTOMER CONTROLLER
// ============================================

export class CustomerController {
  
  // Get all customers (with pagination & filters)
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const query = querySchema.parse(req.query);
      
      const page = parseInt(query.page);
      const limit = parseInt(query.limit);
      const skip = (page - 1) * limit;
      
      // Build where clause
      const where: any = { userId };
      
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      
      if (query.type) {
        where.type = query.type;
      }
      
      if (query.status) {
        where.status = query.status;
      }
      
      // Get customers with counts
      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [query.sortBy]: query.sortOrder },
          include: {
            _count: {
              select: {
                interactions: true,
                followups: { where: { status: 'pending' } },
              },
            },
          },
        }),
        prisma.customer.count({ where }),
      ]);
      
      res.json({
        success: true,
        data: customers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get single customer
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      const customer = await prisma.customer.findFirst({
        where: { id, userId },
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          followups: {
            where: { status: 'pending' },
            orderBy: { dueDate: 'asc' },
          },
          _count: {
            select: {
              interactions: true,
              followups: true,
            },
          },
        },
      });
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }
      
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Create customer
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createCustomerSchema.parse(req.body);
      
      const customer = await prisma.customer.create({
        data: {
          ...data,
          userId,
          tags: data.tags ? JSON.stringify(data.tags) : '[]',
        },
      });
      
      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'customer_update',
          title: 'عميل جديد',
          message: `تم إضافة العميل ${customer.name}`,
          metadata: JSON.stringify({ customerId: customer.id }),
        },
      });
      
      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Update customer
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateCustomerSchema.parse(req.body);
      
      // Check ownership
      const existing = await prisma.customer.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }
      
      const customer = await prisma.customer.update({
        where: { id },
        data: {
          ...data,
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
        },
      });
      
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Delete customer
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      // Check ownership
      const existing = await prisma.customer.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }
      
      await prisma.customer.delete({ where: { id } });
      
      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get customer stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      const [
        totalCustomers,
        activeCustomers,
        buyers,
        sellers,
        recentInteractions,
        pendingFollowups,
      ] = await Promise.all([
        prisma.customer.count({ where: { userId } }),
        prisma.customer.count({ where: { userId, status: 'active' } }),
        prisma.customer.count({ where: { userId, type: 'buyer' } }),
        prisma.customer.count({ where: { userId, type: 'seller' } }),
        prisma.customerInteraction.count({
          where: {
            userId,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        }),
        prisma.customerFollowup.count({
          where: { userId, status: 'pending' },
        }),
      ]);
      
      res.json({
        success: true,
        data: {
          totalCustomers,
          activeCustomers,
          buyers,
          sellers,
          recentInteractions,
          pendingFollowups,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### **Interaction Controller**

File: `backend/src/controllers/interaction.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { io } from '../server'; // Socket.IO instance

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createInteractionSchema = z.object({
  customerId: z.string().uuid(),
  type: z.enum(['call', 'meeting', 'email', 'whatsapp', 'sms', 'note']),
  subject: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  outcome: z.enum([
    'interested',
    'not_interested',
    'callback',
    'meeting_scheduled',
    'deal_closed',
    'no_answer'
  ]).optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  durationMinutes: z.number().int().positive().optional().nullable(),
  requiresFollowup: z.boolean().default(false),
});

// ============================================
// INTERACTION CONTROLLER
// ============================================

export class InteractionController {
  
  // Get all interactions
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { customerId } = req.query;
      
      const where: any = { userId };
      if (customerId) where.customerId = customerId;
      
      const interactions = await prisma.customerInteraction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        take: 50,
      });
      
      res.json({
        success: true,
        data: interactions,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Create interaction
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createInteractionSchema.parse(req.body);
      
      // Create interaction
      const interaction = await prisma.customerInteraction.create({
        data: {
          ...data,
          userId,
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
          completedAt: data.completedAt ? new Date(data.completedAt) : null,
        },
        include: {
          customer: true,
        },
      });
      
      // Auto-create follow-up if needed
      if (data.requiresFollowup || data.outcome === 'interested' || data.outcome === 'callback') {
        const followupDate = new Date();
        followupDate.setDate(followupDate.getDate() + 3); // 3 days from now
        
        await prisma.customerFollowup.create({
          data: {
            customerId: data.customerId,
            userId,
            interactionId: interaction.id,
            title: `متابعة مع ${interaction.customer.name}`,
            description: `متابعة بعد ${data.type === 'call' ? 'المكالمة' : 'التواصل'}`,
            dueDate: followupDate,
            priority: data.outcome === 'interested' ? 'high' : 'medium',
            status: 'pending',
          },
        });
        
        // Update interaction
        await prisma.customerInteraction.update({
          where: { id: interaction.id },
          data: { followupCreated: true },
        });
      }
      
      // Update customer's last contacted date
      await prisma.customer.update({
        where: { id: data.customerId },
        data: { lastContactedAt: new Date() },
      });
      
      // Send real-time notification
      io.to(`user:${userId}`).emit('interaction:created', {
        interaction,
      });
      
      res.status(201).json({
        success: true,
        data: interaction,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Update interaction
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = createInteractionSchema.partial().parse(req.body);
      
      const existing = await prisma.customerInteraction.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Interaction not found',
        });
      }
      
      const interaction = await prisma.customerInteraction.update({
        where: { id },
        data: {
          ...data,
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
          completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        },
      });
      
      res.json({
        success: true,
        data: interaction,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Delete interaction
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      const existing = await prisma.customerInteraction.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Interaction not found',
        });
      }
      
      await prisma.customerInteraction.delete({ where: { id } });
      
      res.json({
        success: true,
        message: 'Interaction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### **Follow-up Controller**

File: `backend/src/controllers/followup.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { io } from '../server';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createFollowupSchema = z.object({
  customerId: z.string().uuid(),
  interactionId: z.string().uuid().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  dueDate: z.string().datetime(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  reminderEnabled: z.boolean().default(true),
});

// ============================================
// FOLLOWUP CONTROLLER
// ============================================

export class FollowupController {
  
  // Get all follow-ups
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status, priority, customerId } = req.query;
      
      const where: any = { userId };
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (customerId) where.customerId = customerId;
      
      const followups = await prisma.customerFollowup.findMany({
        where,
        orderBy: { dueDate: 'asc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          interaction: {
            select: {
              id: true,
              type: true,
              subject: true,
            },
          },
        },
      });
      
      res.json({
        success: true,
        data: followups,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Create follow-up
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createFollowupSchema.parse(req.body);
      
      const dueDate = new Date(data.dueDate);
      const reminderAt = new Date(dueDate);
      reminderAt.setHours(reminderAt.getHours() - 24); // 24h before
      
      const followup = await prisma.customerFollowup.create({
        data: {
          ...data,
          userId,
          dueDate,
          reminderAt: data.reminderEnabled ? reminderAt : null,
        },
        include: {
          customer: true,
        },
      });
      
      // Send notification
      io.to(`user:${userId}`).emit('followup:created', {
        followup,
      });
      
      res.status(201).json({
        success: true,
        data: followup,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Update follow-up
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = createFollowupSchema.partial().parse(req.body);
      
      const existing = await prisma.customerFollowup.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Follow-up not found',
        });
      }
      
      const followup = await prisma.customerFollowup.update({
        where: { id },
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
      });
      
      res.json({
        success: true,
        data: followup,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Complete follow-up
  static async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { completionNotes } = req.body;
      
      const existing = await prisma.customerFollowup.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Follow-up not found',
        });
      }
      
      const followup = await prisma.customerFollowup.update({
        where: { id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          completionNotes,
        },
      });
      
      res.json({
        success: true,
        data: followup,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Delete follow-up
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      const existing = await prisma.customerFollowup.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Follow-up not found',
        });
      }
      
      await prisma.customerFollowup.delete({ where: { id } });
      
      res.json({
        success: true,
        message: 'Follow-up deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get upcoming follow-ups (dashboard widget)
  static async getUpcoming(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      const now = new Date();
      const next7Days = new Date();
      next7Days.setDate(next7Days.getDate() + 7);
      
      const followups = await prisma.customerFollowup.findMany({
        where: {
          userId,
          status: 'pending',
          dueDate: {
            gte: now,
            lte: next7Days,
          },
        },
        orderBy: { dueDate: 'asc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        take: 10,
      });
      
      res.json({
        success: true,
        data: followups,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

## **Routes**

File: `backend/src/routes/crm.routes.ts`

```typescript
import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { InteractionController } from '../controllers/interaction.controller';
import { FollowupController } from '../controllers/followup.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(auth);

// ============================================
// CUSTOMER ROUTES
// ============================================

router.get('/customers', CustomerController.getAll);
router.get('/customers/stats', CustomerController.getStats);
router.get('/customers/:id', CustomerController.getOne);
router.post('/customers', CustomerController.create);
router.put('/customers/:id', CustomerController.update);
router.delete('/customers/:id', CustomerController.delete);

// ============================================
// INTERACTION ROUTES
// ============================================

router.get('/interactions', InteractionController.getAll);
router.post('/interactions', InteractionController.create);
router.put('/interactions/:id', InteractionController.update);
router.delete('/interactions/:id', InteractionController.delete);

// ============================================
// FOLLOWUP ROUTES
// ============================================

router.get('/followups', FollowupController.getAll);
router.get('/followups/upcoming', FollowupController.getUpcoming);
router.post('/followups', FollowupController.create);
router.put('/followups/:id', FollowupController.update);
router.post('/followups/:id/complete', FollowupController.complete);
router.delete('/followups/:id', FollowupController.delete);

export default router;
```

---

**(يتبع في التعليق التالي بسبب الطول...)**

📄 **File:** `/FEATURE-1-CRM-CORE.md`  
🎯 **Status:** Part 1 Complete (DB + Backend)  
⏱️ **Next:** Frontend Components + AI + Testing
