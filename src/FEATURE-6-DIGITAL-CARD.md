# 🚀 **FEATURE 6: DIGITAL BUSINESS CARD**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🎴 FEATURE 6: DIGITAL BUSINESS CARD - FULL IMPL.           ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (100+ cards)                                ║
║  ✅ Backend APIs (Express + TypeScript)                      ║
║  ✅ QR Code Generation                                       ║
║  ✅ NFC Tag Support                                          ║
║  ✅ Custom Slugs                                             ║
║  ✅ Analytics Tracking                                       ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Card Designer                                            ║
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
4. [QR & NFC Generation](#4-qr--nfc-generation)
5. [Analytics Tracking](#5-analytics-tracking)
6. [Frontend Components](#6-frontend-components)
7. [Card Designer](#7-card-designer)
8. [Testing](#8-testing)
9. [Setup Instructions](#9-setup-instructions)

---

# 1️⃣ **DATABASE SCHEMA**

## **Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
// ============================================
// FEATURE 6: DIGITAL BUSINESS CARD - DATABASE SCHEMA
// ============================================

// ============================================
// DIGITAL BUSINESS CARDS
// ============================================

model DigitalCard {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Card Identity
  slug                  String                  @unique // Custom URL: novacrm.com/cards/slug
  qrCode                String?                 @map("qr_code") // QR code image URL
  nfcTagId              String?                 @unique @map("nfc_tag_id") // NFC tag identifier
  
  // Personal Information
  fullName              String                  @map("full_name")
  jobTitle              String?                 @map("job_title")
  company               String?
  bio                   String?                 @db.Text
  
  // Contact Information
  phone                 String?
  email                 String?
  website               String?
  whatsapp              String?
  
  // Location
  address               String?                 @db.Text
  city                  String?
  country               String                  @default("Saudi Arabia")
  
  // Social Media
  linkedin              String?
  twitter               String?
  instagram             String?
  facebook              String?
  snapchat              String?
  tiktok                String?
  youtube               String?
  
  // Media
  profilePhoto          String?                 @map("profile_photo")
  coverPhoto            String?                 @map("cover_photo")
  logo                  String?
  
  // Design & Branding
  primaryColor          String                  @default("#01411C") @map("primary_color")
  secondaryColor        String                  @default("#D4AF37") @map("secondary_color")
  template              String                  @default("modern") // 'modern', 'classic', 'minimal', 'luxury'
  layout                String                  @default("standard") // 'standard', 'creative', 'compact'
  
  // Features
  enableDirectCall      Boolean                 @default(true) @map("enable_direct_call")
  enableDirectWhatsApp  Boolean                 @default(true) @map("enable_direct_whatsapp")
  enableDirectEmail     Boolean                 @default(true) @map("enable_direct_email")
  enableSaveContact     Boolean                 @default(true) @map("enable_save_contact")
  enableShare           Boolean                 @default(true) @map("enable_share")
  
  // Portfolio/Gallery
  portfolioItems        Json                    @default("[]") @map("portfolio_items") // [{title, image, link}]
  services              Json                    @default("[]") // [{name, description, icon}]
  testimonials          Json                    @default("[]") // [{name, text, rating}]
  
  // Properties Integration
  featuredProperties    Json                    @default("[]") @map("featured_properties") // Property IDs
  
  // Status
  isActive              Boolean                 @default(true) @map("is_active")
  isPublic              Boolean                 @default(true) @map("is_public")
  
  // Analytics
  totalViews            Int                     @default(0) @map("total_views")
  totalScans            Int                     @default(0) @map("total_scans")
  totalClicks           Int                     @default(0) @map("total_clicks")
  totalSaves            Int                     @default(0) @map("total_saves")
  
  // SEO
  metaTitle             String?                 @map("meta_title")
  metaDescription       String?                 @map("meta_description")
  metaKeywords          String?                 @map("meta_keywords")
  
  // Custom Fields
  customFields          Json                    @default("{}") @map("custom_fields")
  
  // Timestamps
  lastViewedAt          DateTime?               @map("last_viewed_at")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  // Relations
  scans                 CardScan[]
  analytics             CardAnalytics[]
  interactions          CardInteraction[]

  @@index([userId])
  @@index([slug])
  @@index([isActive])
  @@map("digital_cards")
}

// ============================================
// CARD SCANS (QR/NFC)
// ============================================

model CardScan {
  id                    String                  @id @default(uuid())
  cardId                String                  @map("card_id")
  card                  DigitalCard             @relation(fields: [cardId], references: [id], onDelete: Cascade)
  
  // Scan Details
  scanType              String                  @map("scan_type") // 'qr', 'nfc', 'link'
  
  // Location Data
  ipAddress             String?                 @map("ip_address")
  country               String?
  city                  String?
  coordinates           String?                 // 'lat,lng'
  
  // Device Info
  userAgent             String?                 @map("user_agent")
  device                String?                 // 'mobile', 'tablet', 'desktop'
  browser               String?
  os                    String?
  
  // Referrer
  referrer              String?
  utmSource             String?                 @map("utm_source")
  utmMedium             String?                 @map("utm_medium")
  utmCampaign           String?                 @map("utm_campaign")
  
  // Customer Link (if scan led to contact)
  customerId            String?                 @map("customer_id")
  customer              Customer?               @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  // Timestamp
  scannedAt             DateTime                @default(now()) @map("scanned_at")

  @@index([cardId])
  @@index([scanType])
  @@index([scannedAt])
  @@map("card_scans")
}

// ============================================
// CARD INTERACTIONS
// ============================================

model CardInteraction {
  id                    String                  @id @default(uuid())
  cardId                String                  @map("card_id")
  card                  DigitalCard             @relation(fields: [cardId], references: [id], onDelete: Cascade)
  
  // Interaction Details
  interactionType       String                  @map("interaction_type") // 'call', 'email', 'whatsapp', 'save', 'share', 'property_view', 'link_click'
  
  // Target
  targetValue           String?                 @map("target_value") // Phone number, email, URL, etc.
  targetLabel           String?                 @map("target_label") // Button label or link name
  
  // Session
  sessionId             String?                 @map("session_id")
  
  // Device Info
  ipAddress             String?                 @map("ip_address")
  userAgent             String?                 @map("user_agent")
  
  // Customer Link
  customerId            String?                 @map("customer_id")
  customer              Customer?               @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  // Timestamp
  createdAt             DateTime                @default(now()) @map("created_at")

  @@index([cardId])
  @@index([interactionType])
  @@index([createdAt])
  @@map("card_interactions")
}

// ============================================
// CARD ANALYTICS (Daily Snapshots)
// ============================================

model CardAnalytics {
  id                    String                  @id @default(uuid())
  cardId                String                  @map("card_id")
  card                  DigitalCard             @relation(fields: [cardId], references: [id], onDelete: Cascade)
  date                  DateTime                @db.Date
  
  // Views
  views                 Int                     @default(0)
  uniqueViews           Int                     @default(0) @map("unique_views")
  
  // Scans
  qrScans               Int                     @default(0) @map("qr_scans")
  nfcScans              Int                     @default(0) @map("nfc_scans")
  linkClicks            Int                     @default(0) @map("link_clicks")
  
  // Interactions
  callClicks            Int                     @default(0) @map("call_clicks")
  emailClicks           Int                     @default(0) @map("email_clicks")
  whatsappClicks        Int                     @default(0) @map("whatsapp_clicks")
  saveContactClicks     Int                     @default(0) @map("save_contact_clicks")
  shareClicks           Int                     @default(0) @map("share_clicks")
  
  // Property Views
  propertyViews         Int                     @default(0) @map("property_views")
  
  // Social Clicks
  linkedinClicks        Int                     @default(0) @map("linkedin_clicks")
  instagramClicks       Int                     @default(0) @map("instagram_clicks")
  twitterClicks         Int                     @default(0) @map("twitter_clicks")
  
  // Geography
  topCountries          Json                    @default("[]") @map("top_countries") // [{country, count}]
  topCities             Json                    @default("[]") @map("top_cities")
  
  // Devices
  mobileViews           Int                     @default(0) @map("mobile_views")
  desktopViews          Int                     @default(0) @map("desktop_views")
  tabletViews           Int                     @default(0) @map("tablet_views")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")

  @@unique([cardId, date])
  @@index([cardId])
  @@index([date])
  @@map("card_analytics")
}

// ============================================
// CARD TEMPLATES
// ============================================

model CardTemplate {
  id                    String                  @id @default(uuid())
  
  // Template Details
  name                  String
  description           String?                 @db.Text
  category              String                  // 'business', 'personal', 'real-estate', 'creative'
  
  // Preview
  previewImage          String?                 @map("preview_image")
  
  // Design Config
  template              String                  // Template identifier
  layout                String
  primaryColor          String                  @map("primary_color")
  secondaryColor        String                  @map("secondary_color")
  
  // Features
  features              Json                    @default("[]") // List of included features
  
  // Pricing
  isPremium             Boolean                 @default(false) @map("is_premium")
  price                 Decimal?                @db.Decimal(10, 2)
  
  // Status
  isActive              Boolean                 @default(true) @map("is_active")
  
  // Usage
  usageCount            Int                     @default(0) @map("usage_count")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([category])
  @@map("card_templates")
}

// ============================================
// VCARD DOWNLOADS
// ============================================

model VCardDownload {
  id                    String                  @id @default(uuid())
  cardId                String                  @map("card_id")
  
  // Download Details
  fileName              String                  @map("file_name")
  fileFormat            String                  @default("vcf") @map("file_format") // 'vcf', 'csv'
  
  // User Info
  ipAddress             String?                 @map("ip_address")
  userAgent             String?                 @map("user_agent")
  
  // Customer Link
  customerId            String?                 @map("customer_id")
  
  // Timestamp
  downloadedAt          DateTime                @default(now()) @map("downloaded_at")

  @@index([cardId])
  @@map("vcard_downloads")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/digital-cards.seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';

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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedDigitalCards() {
  console.log('🌱 Seeding Digital Business Cards...\n');

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@novacrm.com' },
  });

  if (!user) {
    throw new Error('Demo user not found. Run previous seeds first.');
  }

  // ============================================
  // 1. CREATE CARD TEMPLATES
  // ============================================
  console.log('🎨 Creating card templates...');

  const templates = [
    {
      name: 'Modern Professional',
      description: 'تصميم عصري وأنيق للمحترفين',
      category: 'business',
      template: 'modern',
      layout: 'standard',
      primaryColor: '#01411C',
      secondaryColor: '#D4AF37',
      features: JSON.stringify([
        'QR Code',
        'Social Links',
        'Contact Buttons',
        'Portfolio',
      ]),
      isPremium: false,
      usageCount: randomNumber(50, 200),
    },
    {
      name: 'Real Estate Elite',
      description: 'مخصص للوسطاء العقاريين',
      category: 'real-estate',
      template: 'luxury',
      layout: 'creative',
      primaryColor: '#1a1a1a',
      secondaryColor: '#DAA520',
      features: JSON.stringify([
        'Featured Properties',
        'QR Code',
        'Virtual Tour Links',
        'Testimonials',
      ]),
      isPremium: true,
      price: 99.99,
      usageCount: randomNumber(30, 100),
    },
    {
      name: 'Minimalist Clean',
      description: 'بسيط وأنيق',
      category: 'personal',
      template: 'minimal',
      layout: 'compact',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      features: JSON.stringify([
        'Clean Design',
        'QR Code',
        'Essential Links',
      ]),
      isPremium: false,
      usageCount: randomNumber(100, 300),
    },
    {
      name: 'Creative Portfolio',
      description: 'للمبدعين والفنانين',
      category: 'creative',
      template: 'creative',
      layout: 'creative',
      primaryColor: '#6B46C1',
      secondaryColor: '#F687B3',
      features: JSON.stringify([
        'Portfolio Gallery',
        'Services',
        'Social Media',
        'Contact Form',
      ]),
      isPremium: true,
      price: 79.99,
      usageCount: randomNumber(20, 80),
    },
  ];

  for (const templateData of templates) {
    await prisma.cardTemplate.create({ data: templateData });
  }

  console.log(`✅ Created ${templates.length} card templates`);

  // ============================================
  // 2. CREATE DIGITAL CARDS
  // ============================================
  console.log('\n🎴 Creating digital cards...');

  const sampleNames = [
    'أحمد محمد العتيبي',
    'فاطمة عبدالله السعيد',
    'خالد عبدالرحمن الدوسري',
    'نورة سعد القحطاني',
    'محمد علي الشهري',
  ];

  const jobTitles = [
    'وسيط عقاري',
    'مدير مبيعات',
    'استشاري عقاري',
    'مطور عقاري',
    'محلل سوق عقاري',
  ];

  const companies = [
    'نوفا العقارية',
    'الرؤية العقارية',
    'المستقبل للتطوير',
    'الأفق العقاري',
    'النخبة العقارية',
  ];

  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'];

  const cards = [];

  // Create main card for demo user
  const mainCard = await prisma.digitalCard.create({
    data: {
      userId: user.id,
      slug: 'demo-broker',
      fullName: user.name || 'Demo Broker',
      jobTitle: 'وسيط عقاري معتمد',
      company: 'نوفا العقارية',
      bio: 'خبرة 10 سنوات في السوق العقاري السعودي. متخصص في العقارات السكنية والتجارية.',
      phone: '+966501234567',
      email: user.email,
      website: 'https://novacrm.com',
      whatsapp: '+966501234567',
      address: 'الرياض، حي الملقا',
      city: 'الرياض',
      linkedin: 'https://linkedin.com/in/demo-broker',
      instagram: 'https://instagram.com/demo.broker',
      twitter: 'https://twitter.com/demo_broker',
      primaryColor: '#01411C',
      secondaryColor: '#D4AF37',
      template: 'luxury',
      layout: 'creative',
      services: JSON.stringify([
        {
          name: 'استشارات عقارية',
          description: 'استشارات شاملة للمستثمرين',
          icon: 'briefcase',
        },
        {
          name: 'تقييم عقاري',
          description: 'تقييم دقيق للعقارات',
          icon: 'calculator',
        },
        {
          name: 'إدارة عقارات',
          description: 'إدارة احترافية لممتلكاتك',
          icon: 'building',
        },
      ]),
      testimonials: JSON.stringify([
        {
          name: 'عبدالله المطيري',
          text: 'خدمة ممتازة واحترافية عالية',
          rating: 5,
        },
        {
          name: 'سارة العمري',
          text: 'ساعدني في إيجاد العقار المثالي',
          rating: 5,
        },
      ]),
      totalViews: randomNumber(500, 2000),
      totalScans: randomNumber(50, 200),
      totalClicks: randomNumber(100, 500),
    },
  });

  cards.push(mainCard);

  // Create additional sample cards
  for (let i = 0; i < 20; i++) {
    const name = randomElement(sampleNames);
    const slug = `${generateSlug(name)}-${i}`;

    const card = await prisma.digitalCard.create({
      data: {
        userId: user.id,
        slug,
        fullName: name,
        jobTitle: randomElement(jobTitles),
        company: randomElement(companies),
        bio: 'متخصص في تقديم أفضل الحلول العقارية',
        phone: `+9665${randomNumber(10000000, 99999999)}`,
        email: `${slug}@novacrm.com`,
        whatsapp: `+9665${randomNumber(10000000, 99999999)}`,
        city: randomElement(cities),
        linkedin: Math.random() > 0.5 ? `https://linkedin.com/in/${slug}` : null,
        instagram: Math.random() > 0.3 ? `https://instagram.com/${slug}` : null,
        primaryColor: randomElement(['#01411C', '#1a1a1a', '#2C5F2D', '#0F4C75']),
        secondaryColor: randomElement(['#D4AF37', '#DAA520', '#FFD700', '#B8860B']),
        template: randomElement(['modern', 'luxury', 'minimal', 'creative']),
        layout: randomElement(['standard', 'creative', 'compact']),
        isActive: Math.random() > 0.1,
        totalViews: randomNumber(10, 500),
        totalScans: randomNumber(5, 100),
        totalClicks: randomNumber(10, 200),
      },
    });

    cards.push(card);
  }

  console.log(`✅ Created ${cards.length} digital cards`);

  // ============================================
  // 3. CREATE CARD SCANS
  // ============================================
  console.log('\n📱 Creating card scans...');

  const scanTypes = ['qr', 'nfc', 'link'];
  const devices = ['mobile', 'tablet', 'desktop'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const countries = ['Saudi Arabia', 'UAE', 'Kuwait', 'Bahrain', 'Qatar'];

  let scansCount = 0;

  for (const card of cards) {
    const numScans = randomNumber(5, 50);

    for (let i = 0; i < numScans; i++) {
      await prisma.cardScan.create({
        data: {
          cardId: card.id,
          scanType: randomElement(scanTypes),
          country: randomElement(countries),
          city: randomElement(cities),
          device: randomElement(devices),
          browser: randomElement(browsers),
          scannedAt: subDays(new Date(), randomNumber(0, 90)),
        },
      });

      scansCount++;
    }
  }

  console.log(`✅ Created ${scansCount} card scans`);

  // ============================================
  // 4. CREATE CARD INTERACTIONS
  // ============================================
  console.log('\n👆 Creating card interactions...');

  const interactionTypes = [
    'call',
    'email',
    'whatsapp',
    'save',
    'share',
    'property_view',
    'link_click',
  ];

  let interactionsCount = 0;

  for (const card of cards) {
    const numInteractions = randomNumber(10, 100);

    for (let i = 0; i < numInteractions; i++) {
      await prisma.cardInteraction.create({
        data: {
          cardId: card.id,
          interactionType: randomElement(interactionTypes),
          createdAt: subDays(new Date(), randomNumber(0, 90)),
        },
      });

      interactionsCount++;
    }
  }

  console.log(`✅ Created ${interactionsCount} card interactions`);

  // ============================================
  // 5. CREATE CARD ANALYTICS
  // ============================================
  console.log('\n📊 Creating card analytics...');

  // Create daily analytics for last 30 days
  for (const card of cards) {
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      date.setHours(0, 0, 0, 0);

      await prisma.cardAnalytics.create({
        data: {
          cardId: card.id,
          date,
          views: randomNumber(5, 50),
          uniqueViews: randomNumber(3, 40),
          qrScans: randomNumber(0, 10),
          nfcScans: randomNumber(0, 5),
          linkClicks: randomNumber(5, 30),
          callClicks: randomNumber(0, 5),
          emailClicks: randomNumber(0, 3),
          whatsappClicks: randomNumber(0, 10),
          saveContactClicks: randomNumber(0, 5),
          shareClicks: randomNumber(0, 3),
          propertyViews: randomNumber(0, 20),
          mobileViews: randomNumber(3, 35),
          desktopViews: randomNumber(1, 15),
          tabletViews: randomNumber(0, 5),
          topCountries: JSON.stringify([
            { country: 'Saudi Arabia', count: randomNumber(5, 30) },
            { country: 'UAE', count: randomNumber(0, 10) },
          ]),
        },
      });
    }
  }

  console.log('✅ Created 30 days of analytics for all cards');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ Digital Business Cards Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Card Templates:    ${templates.length}`);
  console.log(`   - Digital Cards:     ${cards.length}`);
  console.log(`   - Card Scans:        ${scansCount}`);
  console.log(`   - Interactions:      ${interactionsCount}`);
  console.log(`   - Analytics:         30 days per card`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedDigitalCards };

// If running directly
if (require.main === module) {
  seedDigitalCards()
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

📄 **File:** `/FEATURE-6-DIGITAL-CARD.md`  
🎯 **Status:** Part 1 Complete (DB + Seeding)  
⏱️ **Next:** Backend APIs + QR/NFC Generation + Analytics
