# 🚀 **FEATURE 7: REPORTS & ANALYTICS**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    📊 FEATURE 7: REPORTS & ANALYTICS - FULL IMPL.             ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (50+ reports)                               ║
║  ✅ Backend APIs (Express + TypeScript)                      ║
║  ✅ Report Generation (PDF/CSV/Excel)                        ║
║  ✅ AI-Powered Insights                                      ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Analytics Dashboard                                      ║
║  ✅ Real-Time Charts                                         ║
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
4. [Report Generation Service](#4-report-generation-service)
5. [AI Insights Engine](#5-ai-insights-engine)
6. [Frontend Components](#6-frontend-components)
7. [Export Handlers](#7-export-handlers)
8. [Testing](#8-testing)
9. [Setup Instructions](#9-setup-instructions)

---

# 1️⃣ **DATABASE SCHEMA**

## **Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
// ============================================
// FEATURE 7: REPORTS & ANALYTICS - DATABASE SCHEMA
// ============================================

// ============================================
// REPORTS
// ============================================

model Report {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Report Details
  title                 String
  description           String?                 @db.Text
  reportType            String                  @map("report_type") // 'sales', 'finance', 'properties', 'customers', 'calendar', 'commissions', 'analytics'
  
  // Filters Applied
  filters               Json                    @default("{}")
  dateFrom              DateTime?               @map("date_from")
  dateTo                DateTime?               @map("date_to")
  
  // Generation
  status                String                  @default("pending") // 'pending', 'generating', 'completed', 'failed'
  format                String                  @default("pdf") // 'pdf', 'csv', 'excel', 'json'
  
  // File
  fileUrl               String?                 @map("file_url")
  fileSize              Int?                    @map("file_size") // in bytes
  fileName              String?                 @map("file_name")
  
  // Scheduling
  isScheduled           Boolean                 @default(false) @map("is_scheduled")
  scheduleFrequency     String?                 @map("schedule_frequency") // 'daily', 'weekly', 'monthly'
  nextRunAt             DateTime?               @map("next_run_at")
  lastRunAt             DateTime?               @map("last_run_at")
  
  // Statistics
  totalRecords          Int?                    @map("total_records")
  processingTime        Int?                    @map("processing_time") // in milliseconds
  
  // Error Handling
  errorMessage          String?                 @map("error_message") @db.Text
  retryCount            Int                     @default(0) @map("retry_count")
  
  // Sharing
  isPublic              Boolean                 @default(false) @map("is_public")
  shareToken            String?                 @unique @map("share_token")
  expiresAt             DateTime?               @map("expires_at")
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  generatedAt           DateTime?               @map("generated_at")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  // Relations
  logs                  ReportLog[]

  @@index([userId])
  @@index([reportType])
  @@index([status])
  @@index([createdAt])
  @@map("reports")
}

// ============================================
// REPORT LOGS
// ============================================

model ReportLog {
  id                    String                  @id @default(uuid())
  reportId              String                  @map("report_id")
  report                Report                  @relation(fields: [reportId], references: [id], onDelete: Cascade)
  
  // Log Details
  level                 String                  @default("info") // 'info', 'warning', 'error'
  message               String                  @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamp
  createdAt             DateTime                @default(now()) @map("created_at")

  @@index([reportId])
  @@map("report_logs")
}

// ============================================
// ANALYTICS SNAPSHOTS
// ============================================

model AnalyticsSnapshot {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Snapshot Details
  snapshotType          String                  @map("snapshot_type") // 'daily', 'weekly', 'monthly', 'yearly'
  snapshotDate          DateTime                @map("snapshot_date") @db.Date
  
  // Sales Metrics
  totalSales            Decimal                 @default(0) @map("total_sales") @db.Decimal(12, 2)
  salesCount            Int                     @default(0) @map("sales_count")
  avgSaleAmount         Decimal                 @default(0) @map("avg_sale_amount") @db.Decimal(12, 2)
  
  // Revenue Metrics
  totalRevenue          Decimal                 @default(0) @map("total_revenue") @db.Decimal(12, 2)
  totalCommissions      Decimal                 @default(0) @map("total_commissions") @db.Decimal(12, 2)
  netRevenue            Decimal                 @default(0) @map("net_revenue") @db.Decimal(12, 2)
  
  // Customer Metrics
  newCustomers          Int                     @default(0) @map("new_customers")
  activeCustomers       Int                     @default(0) @map("active_customers")
  totalCustomers        Int                     @default(0) @map("total_customers")
  
  // Property Metrics
  newProperties         Int                     @default(0) @map("new_properties")
  activeProperties      Int                     @default(0) @map("active_properties")
  totalProperties       Int                     @default(0) @map("total_properties")
  
  // Appointment Metrics
  totalAppointments     Int                     @default(0) @map("total_appointments")
  completedAppointments Int                     @default(0) @map("completed_appointments")
  appointmentCompletionRate Decimal             @default(0) @map("appointment_completion_rate") @db.Decimal(5, 2)
  
  // Conversion Metrics
  leadsCount            Int                     @default(0) @map("leads_count")
  conversionsCount      Int                     @default(0) @map("conversions_count")
  conversionRate        Decimal                 @default(0) @map("conversion_rate") @db.Decimal(5, 2)
  
  // Performance Metrics
  avgResponseTime       Int                     @default(0) @map("avg_response_time") // in minutes
  customerSatisfaction  Decimal                 @default(0) @map("customer_satisfaction") @db.Decimal(3, 2)
  
  // Top Performers
  topProperty           String?                 @map("top_property")
  topCustomer           String?                 @map("top_customer")
  topDistrict           String?                 @map("top_district")
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")

  @@unique([userId, snapshotType, snapshotDate])
  @@index([userId])
  @@index([snapshotDate])
  @@map("analytics_snapshots")
}

// ============================================
// AI INSIGHTS
// ============================================

model AIInsight {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Insight Details
  insightType           String                  @map("insight_type") // 'recommendation', 'prediction', 'warning', 'opportunity'
  category              String                  // 'sales', 'customers', 'properties', 'marketing', 'operations'
  
  // Content
  title                 String
  description           String                  @db.Text
  priority              String                  @default("medium") // 'low', 'medium', 'high', 'critical'
  
  // Metrics
  confidenceScore       Decimal                 @map("confidence_score") @db.Decimal(5, 2) // 0-100
  impactScore           Decimal                 @map("impact_score") @db.Decimal(5, 2) // 0-100
  
  // Actionable Items
  suggestedActions      Json                    @map("suggested_actions") @default("[]")
  expectedOutcome       String?                 @map("expected_outcome")
  
  // Data Reference
  relatedEntityType     String?                 @map("related_entity_type") // 'property', 'customer', 'sale'
  relatedEntityId       String?                 @map("related_entity_id")
  
  // Status
  status                String                  @default("active") // 'active', 'acted_upon', 'dismissed', 'expired'
  
  // User Actions
  viewedAt              DateTime?               @map("viewed_at")
  actedUponAt           DateTime?               @map("acted_upon_at")
  dismissedAt           DateTime?               @map("dismissed_at")
  
  // Expiry
  expiresAt             DateTime?               @map("expires_at")
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")

  @@index([userId])
  @@index([status])
  @@index([insightType])
  @@index([priority])
  @@map("ai_insights")
}

// ============================================
// DASHBOARDS
// ============================================

model Dashboard {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Dashboard Details
  name                  String
  description           String?                 @db.Text
  
  // Layout
  widgets               Json                    @default("[]") // [{type, position, size, config}]
  layout                String                  @default("grid") // 'grid', 'flex'
  
  // Settings
  refreshInterval       Int                     @default(300) @map("refresh_interval") // seconds
  autoRefresh           Boolean                 @default(true) @map("auto_refresh")
  
  // Visibility
  isDefault             Boolean                 @default(false) @map("is_default")
  isPublic              Boolean                 @default(false) @map("is_public")
  
  // Timestamps
  lastViewedAt          DateTime?               @map("last_viewed_at")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@map("dashboards")
}

// ============================================
// REPORT TEMPLATES
// ============================================

model ReportTemplate {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Template Details
  name                  String
  description           String?                 @db.Text
  reportType            String                  @map("report_type")
  
  // Configuration
  defaultFilters        Json                    @map("default_filters") @default("{}")
  columns               Json                    @default("[]") // Fields to include
  sortBy                String?                 @map("sort_by")
  sortOrder             String                  @default("desc") @map("sort_order")
  
  // Formatting
  format                String                  @default("pdf")
  pageSize              String                  @default("A4") @map("page_size")
  orientation           String                  @default("portrait") // 'portrait', 'landscape'
  
  // Branding
  includeLogo           Boolean                 @default(true) @map("include_logo")
  includeHeader         Boolean                 @default(true) @map("include_header")
  includeFooter         Boolean                 @default(true) @map("include_footer")
  customStyles          Json?                   @map("custom_styles")
  
  // Usage
  usageCount            Int                     @default(0) @map("usage_count")
  lastUsedAt            DateTime?               @map("last_used_at")
  
  // Status
  isActive              Boolean                 @default(true) @map("is_active")
  isDefault             Boolean                 @default(false) @map("is_default")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([reportType])
  @@map("report_templates")
}

// ============================================
// KPI METRICS
// ============================================

model KPIMetric {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Metric Details
  name                  String
  description           String?                 @db.Text
  category              String                  // 'sales', 'finance', 'customers', 'operations'
  
  // Measurement
  metricType            String                  @map("metric_type") // 'count', 'sum', 'avg', 'percentage', 'ratio'
  dataSource            String                  @map("data_source") // Table/model name
  calculationFormula    String                  @map("calculation_formula") @db.Text
  
  // Current Value
  currentValue          Decimal                 @map("current_value") @db.Decimal(12, 2)
  previousValue         Decimal                 @map("previous_value") @db.Decimal(12, 2)
  changePercentage      Decimal                 @map("change_percentage") @db.Decimal(5, 2)
  
  // Target
  targetValue           Decimal?                @map("target_value") @db.Decimal(12, 2)
  targetType            String                  @default("monthly") @map("target_type") // 'daily', 'weekly', 'monthly', 'yearly'
  
  // Display
  displayFormat         String                  @default("number") @map("display_format") // 'number', 'currency', 'percentage'
  displayOrder          Int                     @default(0) @map("display_order")
  
  // Status
  isActive              Boolean                 @default(true) @map("is_active")
  
  // Timestamps
  lastCalculatedAt      DateTime?               @map("last_calculated_at")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([category])
  @@map("kpi_metrics")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/reports-analytics.seed.ts`

```typescript
import { PrismaClient, Decimal } from '@prisma/client';
import { subDays, subMonths, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number): Decimal {
  const value = Math.random() * (max - min) + min;
  return new Decimal(value.toFixed(2));
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedReportsAnalytics() {
  console.log('🌱 Seeding Reports & Analytics...\n');

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@novacrm.com' },
  });

  if (!user) {
    throw new Error('Demo user not found. Run previous seeds first.');
  }

  // ============================================
  // 1. CREATE REPORT TEMPLATES
  // ============================================
  console.log('📄 Creating report templates...');

  const templates = [
    {
      name: 'تقرير المبيعات الشهري',
      description: 'تقرير شامل للمبيعات والعمولات',
      reportType: 'sales',
      defaultFilters: JSON.stringify({
        period: 'monthly',
        includeCommissions: true,
      }),
      columns: JSON.stringify([
        'contractNumber',
        'customer',
        'property',
        'amount',
        'commission',
        'status',
      ]),
      format: 'pdf',
      isDefault: true,
    },
    {
      name: 'تقرير الأداء المالي',
      description: 'تحليل مالي شامل للإيرادات والمصروفات',
      reportType: 'finance',
      defaultFilters: JSON.stringify({
        period: 'monthly',
        includeExpenses: true,
      }),
      columns: JSON.stringify([
        'revenue',
        'commissions',
        'expenses',
        'netProfit',
      ]),
      format: 'excel',
    },
    {
      name: 'تقرير العملاء',
      description: 'قائمة العملاء مع تفاصيل النشاط',
      reportType: 'customers',
      defaultFilters: JSON.stringify({
        status: 'active',
      }),
      columns: JSON.stringify([
        'name',
        'phone',
        'email',
        'status',
        'interactions',
        'lastContact',
      ]),
      format: 'csv',
    },
    {
      name: 'تقرير العقارات',
      description: 'قائمة العقارات المتاحة والمباعة',
      reportType: 'properties',
      defaultFilters: JSON.stringify({
        includeAll: true,
      }),
      columns: JSON.stringify([
        'title',
        'type',
        'city',
        'price',
        'status',
        'views',
      ]),
      format: 'excel',
    },
    {
      name: 'تقرير المواعيد',
      description: 'جدول المواعيد والمعاينات',
      reportType: 'calendar',
      defaultFilters: JSON.stringify({
        period: 'monthly',
      }),
      columns: JSON.stringify([
        'date',
        'customer',
        'property',
        'type',
        'status',
      ]),
      format: 'pdf',
    },
  ];

  for (const templateData of templates) {
    await prisma.reportTemplate.create({
      data: {
        ...templateData,
        userId: user.id,
        usageCount: randomNumber(0, 50),
      },
    });
  }

  console.log(`✅ Created ${templates.length} report templates`);

  // ============================================
  // 2. CREATE REPORTS
  // ============================================
  console.log('\n📊 Creating reports...');

  const reportTypes = ['sales', 'finance', 'customers', 'properties', 'calendar'];
  const formats = ['pdf', 'csv', 'excel'];
  const statuses = ['completed', 'completed', 'completed', 'failed', 'pending'];

  const reports = [];

  for (let i = 0; i < 50; i++) {
    const reportType = randomElement(reportTypes);
    const format = randomElement(formats);
    const status = randomElement(statuses);
    const createdAt = subDays(new Date(), randomNumber(0, 90));

    const dateFrom = subDays(createdAt, 30);
    const dateTo = createdAt;

    const reportData = {
      userId: user.id,
      title: `تقرير ${reportType} - ${createdAt.toLocaleDateString('ar-SA')}`,
      reportType,
      format,
      status,
      filters: JSON.stringify({
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      }),
      dateFrom,
      dateTo,
      createdAt,
    };

    if (status === 'completed') {
      Object.assign(reportData, {
        generatedAt: new Date(createdAt.getTime() + randomNumber(5000, 30000)),
        fileUrl: `/reports/${reportType}_${i}.${format}`,
        fileName: `${reportType}_report_${i}.${format}`,
        fileSize: randomNumber(50000, 5000000),
        totalRecords: randomNumber(10, 500),
        processingTime: randomNumber(1000, 10000),
      });
    } else if (status === 'failed') {
      Object.assign(reportData, {
        errorMessage: randomElement([
          'خطأ في الاتصال بقاعدة البيانات',
          'نفاد الذاكرة',
          'خطأ في معالجة البيانات',
        ]),
        retryCount: randomNumber(1, 3),
      });
    }

    const report = await prisma.report.create({ data: reportData });
    reports.push(report);

    // Create logs for completed reports
    if (status === 'completed') {
      await prisma.reportLog.createMany({
        data: [
          {
            reportId: report.id,
            level: 'info',
            message: 'بدء توليد التقرير',
          },
          {
            reportId: report.id,
            level: 'info',
            message: `تم معالجة ${randomNumber(10, 500)} سجل`,
          },
          {
            reportId: report.id,
            level: 'info',
            message: 'اكتمل توليد التقرير بنجاح',
          },
        ],
      });
    }
  }

  console.log(`✅ Created ${reports.length} reports`);

  // ============================================
  // 3. CREATE ANALYTICS SNAPSHOTS
  // ============================================
  console.log('\n📈 Creating analytics snapshots...');

  // Create daily snapshots for last 90 days
  for (let i = 0; i < 90; i++) {
    const snapshotDate = startOfDay(subDays(new Date(), i));

    await prisma.analyticsSnapshot.create({
      data: {
        userId: user.id,
        snapshotType: 'daily',
        snapshotDate,
        totalSales: randomDecimal(100000, 500000),
        salesCount: randomNumber(5, 20),
        avgSaleAmount: randomDecimal(50000, 150000),
        totalRevenue: randomDecimal(150000, 600000),
        totalCommissions: randomDecimal(5000, 30000),
        netRevenue: randomDecimal(140000, 570000),
        newCustomers: randomNumber(2, 10),
        activeCustomers: randomNumber(20, 50),
        totalCustomers: randomNumber(100, 300),
        newProperties: randomNumber(1, 5),
        activeProperties: randomNumber(10, 30),
        totalProperties: randomNumber(50, 150),
        totalAppointments: randomNumber(5, 15),
        completedAppointments: randomNumber(3, 12),
        appointmentCompletionRate: randomDecimal(70, 95),
        leadsCount: randomNumber(10, 30),
        conversionsCount: randomNumber(2, 8),
        conversionRate: randomDecimal(15, 35),
        avgResponseTime: randomNumber(30, 180),
        customerSatisfaction: randomDecimal(4.0, 4.9),
        topDistrict: randomElement(['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة']),
      },
    });
  }

  console.log('✅ Created 90 days of analytics snapshots');

  // ============================================
  // 4. CREATE AI INSIGHTS
  // ============================================
  console.log('\n🤖 Creating AI insights...');

  const insights = [
    {
      insightType: 'recommendation',
      category: 'sales',
      title: 'فرصة لزيادة المبيعات',
      description: 'حي النخيل يشهد ارتفاع في الطلب بنسبة 35%. ننصح بالتركيز على عقارات هذا الحي.',
      priority: 'high',
      confidenceScore: new Decimal(85),
      impactScore: new Decimal(90),
      suggestedActions: JSON.stringify([
        'إضافة المزيد من العقارات في حي النخيل',
        'التواصل مع الملاك في المنطقة',
        'تكثيف التسويق للحي',
      ]),
      expectedOutcome: 'زيادة متوقعة 20-30% في المبيعات',
    },
    {
      insightType: 'warning',
      category: 'customers',
      title: 'عملاء بحاجة للمتابعة',
      description: 'لديك 12 عميل لم يتم التواصل معهم منذ أكثر من 30 يوم.',
      priority: 'medium',
      confidenceScore: new Decimal(95),
      impactScore: new Decimal(70),
      suggestedActions: JSON.stringify([
        'إنشاء حملة متابعة',
        'جدولة مكالمات',
        'إرسال عروض جديدة',
      ]),
    },
    {
      insightType: 'opportunity',
      category: 'properties',
      title: 'عقارات تحتاج تحديث السعر',
      description: 'العقارات في حي الورود أقل بـ 15% من متوسط السوق. فرصة لزيادة الأسعار.',
      priority: 'high',
      confidenceScore: new Decimal(88),
      impactScore: new Decimal(85),
      suggestedActions: JSON.stringify([
        'مراجعة أسعار العقارات',
        'تحديث التسعير',
        'التواصل مع الملاك',
      ]),
      expectedOutcome: 'زيادة متوقعة في العمولات بنسبة 15%',
    },
    {
      insightType: 'prediction',
      category: 'sales',
      title: 'توقعات المبيعات للشهر القادم',
      description: 'بناءً على الاتجاهات الحالية، من المتوقع إتمام 25-30 صفقة الشهر القادم.',
      priority: 'medium',
      confidenceScore: new Decimal(78),
      impactScore: new Decimal(60),
    },
    {
      insightType: 'recommendation',
      category: 'marketing',
      title: 'أفضل وقت للنشر',
      description: 'معظم العملاء يتفاعلون مع العقارات بين 8-10 مساءً. ننصح بالنشر في هذا الوقت.',
      priority: 'low',
      confidenceScore: new Decimal(82),
      impactScore: new Decimal(55),
      suggestedActions: JSON.stringify([
        'جدولة المنشورات في المساء',
        'تحسين المحتوى التسويقي',
      ]),
    },
  ];

  for (const insightData of insights) {
    await prisma.aIInsight.create({
      data: {
        ...insightData,
        userId: user.id,
        viewedAt: Math.random() > 0.5 ? subDays(new Date(), randomNumber(1, 7)) : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created ${insights.length} AI insights`);

  // ============================================
  // 5. CREATE KPI METRICS
  // ============================================
  console.log('\n📊 Creating KPI metrics...');

  const kpis = [
    {
      name: 'إجمالي المبيعات',
      category: 'sales',
      metricType: 'sum',
      dataSource: 'sales',
      calculationFormula: 'SUM(sale_amount)',
      currentValue: new Decimal(2500000),
      previousValue: new Decimal(2100000),
      changePercentage: new Decimal(19.05),
      targetValue: new Decimal(3000000),
      displayFormat: 'currency',
      displayOrder: 1,
    },
    {
      name: 'عدد الصفقات',
      category: 'sales',
      metricType: 'count',
      dataSource: 'sales',
      calculationFormula: 'COUNT(*)',
      currentValue: new Decimal(45),
      previousValue: new Decimal(38),
      changePercentage: new Decimal(18.42),
      targetValue: new Decimal(50),
      displayFormat: 'number',
      displayOrder: 2,
    },
    {
      name: 'متوسط قيمة الصفقة',
      category: 'sales',
      metricType: 'avg',
      dataSource: 'sales',
      calculationFormula: 'AVG(sale_amount)',
      currentValue: new Decimal(55555),
      previousValue: new Decimal(55263),
      changePercentage: new Decimal(0.53),
      displayFormat: 'currency',
      displayOrder: 3,
    },
    {
      name: 'إجمالي العمولات',
      category: 'finance',
      metricType: 'sum',
      dataSource: 'commissions',
      calculationFormula: 'SUM(total_amount)',
      currentValue: new Decimal(65000),
      previousValue: new Decimal(55000),
      changePercentage: new Decimal(18.18),
      targetValue: new Decimal(75000),
      displayFormat: 'currency',
      displayOrder: 4,
    },
    {
      name: 'معدل التحويل',
      category: 'sales',
      metricType: 'percentage',
      dataSource: 'customers',
      calculationFormula: '(conversions / leads) * 100',
      currentValue: new Decimal(25.5),
      previousValue: new Decimal(22.3),
      changePercentage: new Decimal(14.35),
      targetValue: new Decimal(30),
      displayFormat: 'percentage',
      displayOrder: 5,
    },
    {
      name: 'رضا العملاء',
      category: 'customers',
      metricType: 'avg',
      dataSource: 'customer_feedback',
      calculationFormula: 'AVG(rating)',
      currentValue: new Decimal(4.6),
      previousValue: new Decimal(4.4),
      changePercentage: new Decimal(4.55),
      targetValue: new Decimal(4.8),
      displayFormat: 'number',
      displayOrder: 6,
    },
  ];

  for (const kpiData of kpis) {
    await prisma.kPIMetric.create({
      data: {
        ...kpiData,
        userId: user.id,
        lastCalculatedAt: new Date(),
      },
    });
  }

  console.log(`✅ Created ${kpis.length} KPI metrics`);

  // ============================================
  // 6. CREATE DASHBOARDS
  // ============================================
  console.log('\n📈 Creating dashboards...');

  const dashboards = [
    {
      name: 'لوحة المبيعات',
      description: 'نظرة عامة على المبيعات والأداء',
      widgets: JSON.stringify([
        { type: 'sales_chart', position: { x: 0, y: 0 }, size: { w: 6, h: 4 } },
        { type: 'revenue_card', position: { x: 6, y: 0 }, size: { w: 3, h: 2 } },
        { type: 'kpi_grid', position: { x: 0, y: 4 }, size: { w: 12, h: 3 } },
      ]),
      isDefault: true,
    },
    {
      name: 'لوحة العملاء',
      description: 'تحليل العملاء والتفاعلات',
      widgets: JSON.stringify([
        { type: 'customers_chart', position: { x: 0, y: 0 }, size: { w: 6, h: 4 } },
        { type: 'interactions_timeline', position: { x: 6, y: 0 }, size: { w: 6, h: 4 } },
      ]),
    },
    {
      name: 'لوحة التحليلات',
      description: 'تحليلات متقدمة مع AI Insights',
      widgets: JSON.stringify([
        { type: 'ai_insights', position: { x: 0, y: 0 }, size: { w: 4, h: 6 } },
        { type: 'trends_chart', position: { x: 4, y: 0 }, size: { w: 8, h: 6 } },
      ]),
    },
  ];

  for (const dashboardData of dashboards) {
    await prisma.dashboard.create({
      data: {
        ...dashboardData,
        userId: user.id,
        lastViewedAt: subDays(new Date(), randomNumber(0, 7)),
      },
    });
  }

  console.log(`✅ Created ${dashboards.length} dashboards`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ Reports & Analytics Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Report Templates:      ${templates.length}`);
  console.log(`   - Reports:               ${reports.length}`);
  console.log(`   - Analytics Snapshots:   90 days`);
  console.log(`   - AI Insights:           ${insights.length}`);
  console.log(`   - KPI Metrics:           ${kpis.length}`);
  console.log(`   - Dashboards:            ${dashboards.length}`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedReportsAnalytics };

// If running directly
if (require.main === module) {
  seedReportsAnalytics()
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

📄 **File:** `/FEATURE-7-REPORTS-ANALYTICS.md`  
🎯 **Status:** Part 1 Complete (DB + Seeding)  
⏱️ **Next:** Backend APIs + Report Generation + AI Insights
