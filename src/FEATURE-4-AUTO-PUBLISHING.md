# 🚀 **FEATURE 4: AUTO PUBLISHING - MULTI-PLATFORM SYSTEM**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🎯 FEATURE 4: AUTO PUBLISHING - FULL IMPLEMENTATION        ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (Platforms + Queue)                         ║
║  ✅ Backend APIs (Schedule + Execute + Retry)                ║
║  ✅ Multi-Platform Integration                               ║
║  ✅ Auto Scheduler (Cron Jobs)                               ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Real-Time Status Updates (Socket.IO)                     ║
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
4. [Platform Integrations](#4-platform-integrations)
5. [Scheduler Service](#5-scheduler-service)
6. [Frontend Components](#6-frontend-components)
7. [Real-Time Integration](#7-real-time-integration)
8. [Testing](#8-testing)
9. [Setup Instructions](#9-setup-instructions)

---

# 1️⃣ **DATABASE SCHEMA**

## **Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
// ============================================
// FEATURE 4: AUTO PUBLISHING - DATABASE SCHEMA
// ============================================

// ============================================
// PUBLISHING PLATFORMS
// ============================================

model PublishingPlatform {
  id                  String                @id @default(uuid())
  userId              String?               @map("user_id") // null = system-wide platform
  user                User?                 @relation(fields: [userId], references: [id])
  
  // Platform Details
  name                String                // 'aqar', 'bayut', 'propertyfinder', 'haraj'
  displayName         String                @map("display_name") // 'عقار ماب', 'بيوت'
  platformType        String                @map("platform_type") // 'api', 'manual', 'email'
  logo                String?
  website             String?
  
  // API Configuration
  apiEndpoint         String?               @map("api_endpoint")
  apiKey              String?               @map("api_key")
  apiSecret           String?               @map("api_secret")
  authType            String                @default("api_key") @map("auth_type") // 'api_key', 'oauth', 'basic'
  
  // Credentials (encrypted)
  username            String?
  password            String?
  accessToken         String?               @map("access_token") @db.Text
  refreshToken        String?               @map("refresh_token") @db.Text
  tokenExpiresAt      DateTime?             @map("token_expires_at")
  
  // Platform Capabilities
  supportsImages      Boolean               @default(true) @map("supports_images")
  maxImages           Int                   @default(20) @map("max_images")
  supportsVideo       Boolean               @default(false) @map("supports_video")
  supportsVirtualTour Boolean               @default(false) @map("supports_virtual_tour")
  supportedTypes      Json                  @default("[]") @map("supported_types") // ['apartment', 'villa']
  supportedPurposes   Json                  @default("[]") @map("supported_purposes") // ['sale', 'rent']
  
  // Limits & Quotas
  dailyLimit          Int?                  @map("daily_limit")
  monthlyLimit        Int?                  @map("monthly_limit")
  publishedToday      Int                   @default(0) @map("published_today")
  publishedThisMonth  Int                   @default(0) @map("published_this_month")
  lastResetDate       DateTime?             @map("last_reset_date")
  
  // Status
  status              String                @default("active") // 'active', 'inactive', 'error', 'suspended'
  isActive            Boolean               @default(true) @map("is_active")
  lastConnectedAt     DateTime?             @map("last_connected_at")
  lastErrorAt         DateTime?             @map("last_error_at")
  lastError           String?               @map("last_error") @db.Text
  
  // Stats
  totalPublished      Int                   @default(0) @map("total_published")
  totalFailed         Int                   @default(0) @map("total_failed")
  successRate         Decimal               @default(0) @map("success_rate") @db.Decimal(5, 2)
  
  // Settings
  autoPublish         Boolean               @default(false) @map("auto_publish")
  requiresApproval    Boolean               @default(true) @map("requires_approval")
  retryOnFailure      Boolean               @default(true) @map("retry_on_failure")
  maxRetries          Int                   @default(3) @map("max_retries")
  
  // Metadata
  config              Json                  @default("{}")
  notes               String?               @db.Text
  
  // Timestamps
  createdAt           DateTime              @default(now()) @map("created_at")
  updatedAt           DateTime              @updatedAt @map("updated_at")

  // Relations
  tasks               PublishingTask[]
  logs                PublishingLog[]

  @@index([userId])
  @@index([name])
  @@index([status])
  @@map("publishing_platforms")
}

// ============================================
// PUBLISHING TASKS (Queue)
// ============================================

model PublishingTask {
  id                  String                @id @default(uuid())
  userId              String                @map("user_id")
  user                User                  @relation(fields: [userId], references: [id])
  propertyId          String                @map("property_id")
  property            OwnerProperty         @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  platformId          String                @map("platform_id")
  platform            PublishingPlatform    @relation(fields: [platformId], references: [id], onDelete: Cascade)
  
  // Task Details
  action              String                // 'publish', 'update', 'unpublish', 'refresh'
  priority            String                @default("normal") // 'low', 'normal', 'high', 'urgent'
  status              String                @default("pending") // 'pending', 'scheduled', 'processing', 'completed', 'failed', 'cancelled'
  
  // Scheduling
  scheduledAt         DateTime              @map("scheduled_at")
  executedAt          DateTime?             @map("executed_at")
  completedAt         DateTime?             @map("completed_at")
  
  // Retry Logic
  retryCount          Int                   @default(0) @map("retry_count")
  maxRetries          Int                   @default(3) @map("max_retries")
  lastRetryAt         DateTime?             @map("last_retry_at")
  nextRetryAt         DateTime?             @map("next_retry_at")
  
  // External Reference
  externalId          String?               @map("external_id") // Platform's listing ID
  externalUrl         String?               @map("external_url")
  externalStatus      String?               @map("external_status")
  
  // Response Data
  responseCode        Int?                  @map("response_code")
  responseMessage     String?               @map("response_message") @db.Text
  responseData        Json?                 @map("response_data")
  errorMessage        String?               @map("error_message") @db.Text
  errorDetails        Json?                 @map("error_details")
  
  // Metadata
  metadata            Json                  @default("{}")
  notes               String?               @db.Text
  
  // Timestamps
  createdAt           DateTime              @default(now()) @map("created_at")
  updatedAt           DateTime              @updatedAt @map("updated_at")

  // Relations
  logs                PublishingLog[]

  @@index([userId])
  @@index([propertyId])
  @@index([platformId])
  @@index([status])
  @@index([scheduledAt])
  @@map("publishing_tasks")
}

// ============================================
// PUBLISHING LOGS
// ============================================

model PublishingLog {
  id                  String                @id @default(uuid())
  taskId              String?               @map("task_id")
  task                PublishingTask?       @relation(fields: [taskId], references: [id], onDelete: Cascade)
  platformId          String                @map("platform_id")
  platform            PublishingPlatform    @relation(fields: [platformId], references: [id])
  propertyId          String?               @map("property_id")
  
  // Log Details
  action              String                // 'publish', 'update', 'unpublish'
  status              String                // 'success', 'failed', 'retry'
  level               String                @default("info") // 'info', 'warning', 'error', 'debug'
  
  // Request/Response
  requestData         Json?                 @map("request_data")
  requestHeaders      Json?                 @map("request_headers")
  responseCode        Int?                  @map("response_code")
  responseData        Json?                 @map("response_data")
  responseTime        Int?                  @map("response_time") // milliseconds
  
  // Error Information
  errorMessage        String?               @map("error_message") @db.Text
  errorType           String?               @map("error_type")
  errorStack          String?               @map("error_stack") @db.Text
  
  // External Reference
  externalId          String?               @map("external_id")
  externalUrl         String?               @map("external_url")
  
  // Metadata
  metadata            Json                  @default("{}")
  ipAddress           String?               @map("ip_address")
  userAgent           String?               @map("user_agent")
  
  // Timestamps
  createdAt           DateTime              @default(now()) @map("created_at")

  @@index([taskId])
  @@index([platformId])
  @@index([status])
  @@index([createdAt])
  @@map("publishing_logs")
}

// ============================================
// PUBLISHING TEMPLATES
// ============================================

model PublishingTemplate {
  id                  String                @id @default(uuid())
  userId              String                @map("user_id")
  user                User                  @relation(fields: [userId], references: [id])
  platformId          String?               @map("platform_id") // null = generic template
  
  // Template Details
  name                String
  description         String?               @db.Text
  
  // Field Mappings
  titleTemplate       String                @map("title_template") @db.Text
  descriptionTemplate String                @map("description_template") @db.Text
  fieldMappings       Json                  @map("field_mappings") // Custom field mappings
  
  // Image Settings
  imageOrder          Json                  @map("image_order") // [0, 2, 1, 3] - reorder images
  imageWatermark      Boolean               @default(false) @map("image_watermark")
  watermarkText       String?               @map("watermark_text")
  
  // Auto-Enhancement
  autoTranslate       Boolean               @default(false) @map("auto_translate")
  autoEnhance         Boolean               @default(false) @map("auto_enhance")
  includeVirtualTour  Boolean               @default(true) @map("include_virtual_tour")
  
  // Usage Stats
  usageCount          Int                   @default(0) @map("usage_count")
  lastUsedAt          DateTime?             @map("last_used_at")
  
  // Status
  isDefault           Boolean               @default(false) @map("is_default")
  isActive            Boolean               @default(true) @map("is_active")
  
  // Timestamps
  createdAt           DateTime              @default(now()) @map("created_at")
  updatedAt           DateTime              @updatedAt @map("updated_at")

  @@index([userId])
  @@index([platformId])
  @@map("publishing_templates")
}

// ============================================
// PUBLISHING SCHEDULES (Recurring)
// ============================================

model PublishingSchedule {
  id                  String                @id @default(uuid())
  userId              String                @map("user_id")
  user                User                  @relation(fields: [userId], references: [id])
  
  // Schedule Details
  name                String
  description         String?               @db.Text
  
  // Trigger Conditions
  triggerType         String                @map("trigger_type") // 'property_created', 'property_updated', 'manual', 'cron'
  cronExpression      String?               @map("cron_expression") // '0 9 * * *' for daily at 9am
  
  // Filters
  propertyFilters     Json                  @map("property_filters") // {status: 'available', city: 'الرياض'}
  platforms           Json                  // ['platform-id-1', 'platform-id-2']
  
  // Settings
  autoApprove         Boolean               @default(false) @map("auto_approve")
  notifyOnComplete    Boolean               @default(true) @map("notify_on_complete")
  
  // Status
  isActive            Boolean               @default(true) @map("is_active")
  lastRunAt           DateTime?             @map("last_run_at")
  nextRunAt           DateTime?             @map("next_run_at")
  
  // Stats
  totalRuns           Int                   @default(0) @map("total_runs")
  successfulRuns      Int                   @default(0) @map("successful_runs")
  failedRuns          Int                   @default(0) @map("failed_runs")
  
  // Timestamps
  createdAt           DateTime              @default(now()) @map("created_at")
  updatedAt           DateTime              @updatedAt @map("updated_at")

  @@index([userId])
  @@index([isActive])
  @@index([nextRunAt])
  @@map("publishing_schedules")
}

// ============================================
// PUBLISHING STATS
// ============================================

model PublishingStats {
  id                  String                @id @default(uuid())
  userId              String                @map("user_id")
  user                User                  @relation(fields: [userId], references: [id])
  date                DateTime              @db.Date
  
  // Daily Stats
  totalPublished      Int                   @default(0) @map("total_published")
  totalFailed         Int                   @default(0) @map("total_failed")
  totalRetries        Int                   @default(0) @map("total_retries")
  
  // By Platform
  platformStats       Json                  @map("platform_stats") // {platform_id: {published: 10, failed: 2}}
  
  // Performance
  avgResponseTime     Int?                  @map("avg_response_time") // milliseconds
  successRate         Decimal               @map("success_rate") @db.Decimal(5, 2)
  
  // Timestamps
  createdAt           DateTime              @default(now()) @map("created_at")
  updatedAt           DateTime              @updatedAt @map("updated_at")

  @@unique([userId, date])
  @@index([userId])
  @@index([date])
  @@map("publishing_stats")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/auto-publishing.seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// SAMPLE DATA
// ============================================

const SAUDI_PLATFORMS = [
  {
    name: 'aqar',
    displayName: 'عقار',
    platformType: 'api',
    apiEndpoint: 'https://api.aqar.fm/v1',
    logo: 'https://cdn.aqar.fm/logo.png',
    website: 'https://aqar.fm',
    supportsImages: true,
    maxImages: 20,
    supportsVideo: true,
    supportsVirtualTour: true,
    supportedTypes: JSON.stringify(['apartment', 'villa', 'land', 'commercial']),
    supportedPurposes: JSON.stringify(['sale', 'rent']),
    dailyLimit: 100,
    monthlyLimit: 3000,
  },
  {
    name: 'bayut',
    displayName: 'بيوت',
    platformType: 'api',
    apiEndpoint: 'https://api.bayut.sa/v2',
    logo: 'https://cdn.bayut.sa/logo.png',
    website: 'https://bayut.sa',
    supportsImages: true,
    maxImages: 15,
    supportsVideo: true,
    supportsVirtualTour: true,
    supportedTypes: JSON.stringify(['apartment', 'villa', 'land', 'commercial', 'building']),
    supportedPurposes: JSON.stringify(['sale', 'rent']),
    dailyLimit: 50,
    monthlyLimit: 1500,
  },
  {
    name: 'propertyfinder',
    displayName: 'بروبرتي فايندر',
    platformType: 'api',
    apiEndpoint: 'https://api.propertyfinder.sa/listings',
    logo: 'https://cdn.propertyfinder.sa/logo.png',
    website: 'https://propertyfinder.sa',
    supportsImages: true,
    maxImages: 25,
    supportsVideo: false,
    supportsVirtualTour: true,
    supportedTypes: JSON.stringify(['apartment', 'villa', 'land', 'commercial']),
    supportedPurposes: JSON.stringify(['sale', 'rent']),
    dailyLimit: 75,
    monthlyLimit: 2000,
  },
  {
    name: 'haraj',
    displayName: 'حراج',
    platformType: 'api',
    apiEndpoint: 'https://api.haraj.com.sa/post',
    logo: 'https://cdn.haraj.com.sa/logo.png',
    website: 'https://haraj.com.sa',
    supportsImages: true,
    maxImages: 10,
    supportsVideo: false,
    supportsVirtualTour: false,
    supportedTypes: JSON.stringify(['apartment', 'villa', 'land', 'commercial', 'building']),
    supportedPurposes: JSON.stringify(['sale', 'rent']),
    dailyLimit: 200,
    monthlyLimit: 6000,
  },
  {
    name: 'opensooq',
    displayName: 'السوق المفتوح',
    platformType: 'api',
    apiEndpoint: 'https://api.opensooq.com/listings',
    logo: 'https://cdn.opensooq.com/logo.png',
    website: 'https://sa.opensooq.com',
    supportsImages: true,
    maxImages: 12,
    supportsVideo: false,
    supportsVirtualTour: false,
    supportedTypes: JSON.stringify(['apartment', 'villa', 'land', 'commercial']),
    supportedPurposes: JSON.stringify(['sale', 'rent']),
    dailyLimit: 150,
    monthlyLimit: 4500,
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function futureDate(minHours: number, maxHours: number): Date {
  const hours = randomNumber(minHours, maxHours);
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedAutoPublishing() {
  console.log('🌱 Seeding Auto Publishing System...\n');

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@novacrm.com' },
  });

  if (!user) {
    throw new Error('Demo user not found. Run previous seeds first.');
  }

  // ============================================
  // 1. CREATE PLATFORMS
  // ============================================
  console.log('🌐 Creating publishing platforms...');

  const platforms = [];

  for (const platformData of SAUDI_PLATFORMS) {
    const platform = await prisma.publishingPlatform.create({
      data: {
        ...platformData,
        userId: user.id,
        apiKey: `demo_api_key_${platformData.name}_${Math.random().toString(36).substr(2, 9)}`,
        authType: 'api_key',
        status: 'active',
        isActive: true,
        autoPublish: Math.random() > 0.5,
        requiresApproval: Math.random() > 0.3,
        retryOnFailure: true,
        maxRetries: 3,
        successRate: randomNumber(85, 99),
        totalPublished: randomNumber(50, 500),
        totalFailed: randomNumber(5, 50),
      },
    });

    platforms.push(platform);
  }

  console.log(`✅ Created ${platforms.length} platforms`);

  // ============================================
  // 2. CREATE PUBLISHING TASKS
  // ============================================
  console.log('\n📋 Creating publishing tasks...');

  // Get some properties
  const properties = await prisma.ownerProperty.findMany({
    where: {
      userId: user.id,
      status: 'available',
      isPublished: true,
    },
    take: 30,
  });

  if (properties.length === 0) {
    console.log('⚠️  No properties found. Skipping task creation.');
  } else {
    const tasks = [];

    // Create 50 tasks with various statuses
    for (let i = 0; i < 50; i++) {
      const property = randomElement(properties);
      const platform = randomElement(platforms);
      const action = randomElement(['publish', 'publish', 'publish', 'update', 'refresh']);
      const status = randomElement([
        'pending',
        'pending',
        'pending',
        'scheduled',
        'scheduled',
        'processing',
        'completed',
        'completed',
        'completed',
        'failed',
      ]);

      const scheduledAt = status === 'completed' 
        ? new Date(Date.now() - randomNumber(1, 72) * 60 * 60 * 1000) // Past
        : futureDate(1, 48); // Future

      const taskData: any = {
        userId: user.id,
        propertyId: property.id,
        platformId: platform.id,
        action,
        priority: randomElement(['normal', 'normal', 'normal', 'high', 'urgent']),
        status,
        scheduledAt,
      };

      if (status === 'completed') {
        taskData.executedAt = scheduledAt;
        taskData.completedAt = new Date(scheduledAt.getTime() + randomNumber(1, 10) * 1000);
        taskData.externalId = `ext_${platform.name}_${randomNumber(10000, 99999)}`;
        taskData.externalUrl = `${platform.website}/listing/${taskData.externalId}`;
        taskData.responseCode = 200;
        taskData.responseMessage = 'Successfully published';
      }

      if (status === 'failed') {
        taskData.executedAt = scheduledAt;
        taskData.retryCount = randomNumber(1, 3);
        taskData.responseCode = randomElement([400, 401, 403, 500, 503]);
        taskData.errorMessage = randomElement([
          'API rate limit exceeded',
          'Invalid API key',
          'Property data validation failed',
          'Platform service unavailable',
        ]);
        taskData.nextRetryAt = futureDate(1, 6);
      }

      if (status === 'processing') {
        taskData.executedAt = new Date();
      }

      const task = await prisma.publishingTask.create({
        data: taskData,
      });

      tasks.push(task);

      // Create log for completed/failed tasks
      if (status === 'completed' || status === 'failed') {
        await prisma.publishingLog.create({
          data: {
            taskId: task.id,
            platformId: platform.id,
            propertyId: property.id,
            action: task.action,
            status: status === 'completed' ? 'success' : 'failed',
            level: status === 'completed' ? 'info' : 'error',
            responseCode: task.responseCode,
            responseTime: randomNumber(200, 2000),
            errorMessage: task.errorMessage,
            externalId: task.externalId,
            externalUrl: task.externalUrl,
          },
        });
      }
    }

    console.log(`✅ Created ${tasks.length} publishing tasks`);
  }

  // ============================================
  // 3. CREATE PUBLISHING TEMPLATES
  // ============================================
  console.log('\n📝 Creating publishing templates...');

  const templates = [
    {
      name: 'قالب عقار الافتراضي',
      description: 'القالب الافتراضي للنشر على منصة عقار',
      platformId: platforms.find(p => p.name === 'aqar')?.id,
      titleTemplate: '{{propertyType}} للـ{{purpose}} في {{city}} - {{district}}',
      descriptionTemplate: `{{description}}

📍 الموقع: {{city}} - {{district}}
📐 المساحة: {{area}} متر مربع
🛏️ غرف النوم: {{bedrooms}}
🚿 الحمامات: {{bathrooms}}
💰 السعر: {{price}} ريال

{{features}}`,
      fieldMappings: JSON.stringify({
        title: 'title',
        description: 'description',
        price: 'price',
        area: 'area',
        city: 'city',
        district: 'district',
      }),
      imageOrder: JSON.stringify([0, 1, 2, 3, 4]),
      isDefault: true,
    },
    {
      name: 'قالب بيوت المحسّن',
      description: 'قالب محسّن للنشر على منصة بيوت',
      platformId: platforms.find(p => p.name === 'bayut')?.id,
      titleTemplate: '{{propertyType}} فاخر للـ{{purpose}} | {{city}}',
      descriptionTemplate: `🏠 {{propertyType}} {{purpose}}

✨ المميزات:
{{features}}

📊 التفاصيل:
• المساحة: {{area}} م²
• غرف النوم: {{bedrooms}}
• الحمامات: {{bathrooms}}
• الموقع: {{city}} - {{district}}

💵 السعر: {{price}} ريال

{{description}}`,
      fieldMappings: JSON.stringify({
        title: 'title',
        description: 'description',
        price: 'price',
      }),
      imageOrder: JSON.stringify([0, 1, 2, 3, 4]),
      autoEnhance: true,
    },
    {
      name: 'قالب حراج السريع',
      description: 'قالب مبسط للنشر السريع على حراج',
      platformId: platforms.find(p => p.name === 'haraj')?.id,
      titleTemplate: '{{propertyType}} {{city}} - {{price}} ريال',
      descriptionTemplate: `{{description}}

{{area}} م² | {{bedrooms}} غرف | {{city}}

السعر: {{price}} ريال`,
      fieldMappings: JSON.stringify({
        title: 'title',
        description: 'description',
      }),
      imageOrder: JSON.stringify([0]),
    },
  ];

  for (const templateData of templates) {
    await prisma.publishingTemplate.create({
      data: {
        ...templateData,
        userId: user.id,
        usageCount: randomNumber(0, 50),
      },
    });
  }

  console.log(`✅ Created ${templates.length} publishing templates`);

  // ============================================
  // 4. CREATE PUBLISHING SCHEDULES
  // ============================================
  console.log('\n📅 Creating publishing schedules...');

  const schedules = [
    {
      name: 'نشر يومي للعقارات الجديدة',
      description: 'نشر تلقائي للعقارات الجديدة كل يوم عند الساعة 9 صباحاً',
      triggerType: 'cron',
      cronExpression: '0 9 * * *',
      propertyFilters: JSON.stringify({
        status: 'available',
        isPublished: true,
        createdAt: { gte: 'today' },
      }),
      platforms: JSON.stringify(platforms.slice(0, 3).map(p => p.id)),
      autoApprove: true,
      isActive: true,
      totalRuns: randomNumber(10, 50),
      successfulRuns: randomNumber(8, 45),
      failedRuns: randomNumber(0, 5),
    },
    {
      name: 'تحديث العقارات المميزة',
      description: 'تحديث العقارات المميزة كل أسبوع',
      triggerType: 'cron',
      cronExpression: '0 10 * * 1',
      propertyFilters: JSON.stringify({
        isFeatured: true,
        status: 'available',
      }),
      platforms: JSON.stringify([platforms[0].id]),
      autoApprove: false,
      isActive: true,
      totalRuns: randomNumber(5, 20),
      successfulRuns: randomNumber(4, 18),
      failedRuns: randomNumber(0, 2),
    },
  ];

  for (const scheduleData of schedules) {
    await prisma.publishingSchedule.create({
      data: {
        ...scheduleData,
        userId: user.id,
        lastRunAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created ${schedules.length} publishing schedules`);

  // ============================================
  // 5. CREATE PUBLISHING STATS
  // ============================================
  console.log('\n📊 Creating publishing stats...');

  // Create stats for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const totalPublished = randomNumber(5, 30);
    const totalFailed = randomNumber(0, 5);

    await prisma.publishingStats.create({
      data: {
        userId: user.id,
        date,
        totalPublished,
        totalFailed,
        totalRetries: randomNumber(0, totalFailed * 2),
        platformStats: JSON.stringify({
          [platforms[0].id]: { published: randomNumber(2, 10), failed: randomNumber(0, 2) },
          [platforms[1].id]: { published: randomNumber(2, 10), failed: randomNumber(0, 2) },
          [platforms[2].id]: { published: randomNumber(1, 10), failed: randomNumber(0, 1) },
        }),
        avgResponseTime: randomNumber(500, 2000),
        successRate: ((totalPublished / (totalPublished + totalFailed)) * 100).toFixed(2),
      },
    });
  }

  console.log('✅ Created 30 days of stats');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ Auto Publishing Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Platforms:  ${platforms.length}`);
  console.log(`   - Tasks:      50`);
  console.log(`   - Templates:  ${templates.length}`);
  console.log(`   - Schedules:  ${schedules.length}`);
  console.log(`   - Stats:      30 days`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedAutoPublishing };

// If running directly
if (require.main === module) {
  seedAutoPublishing()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
```

---

**(يتبع في الجزء التالي...)**

📄 **File:** `/FEATURE-4-AUTO-PUBLISHING.md`  
🎯 **Status:** Part 1 Complete (DB + Seeding)  
⏱️ **Next:** Backend APIs + Platform Integrations + Scheduler
