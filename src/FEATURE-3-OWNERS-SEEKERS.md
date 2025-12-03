# 🚀 **FEATURE 3: OWNERS & SEEKERS - PROPERTY MANAGEMENT**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🎯 FEATURE 3: OWNERS & SEEKERS - FULL IMPLEMENTATION       ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (50 owners + 50 seekers + 100 properties)   ║
║  ✅ Backend APIs (Express + TypeScript)                      ║
║  ✅ Auto-Matching Algorithm (Smart Score: 0-100)             ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Real-Time Notifications (Socket.IO)                      ║
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
4. [Auto-Matching Algorithm](#4-auto-matching-algorithm)
5. [Frontend Components](#5-frontend-components)
6. [Real-Time Integration](#6-real-time-integration)
7. [Testing](#7-testing)
8. [Setup Instructions](#8-setup-instructions)

---

# 1️⃣ **DATABASE SCHEMA**

## **Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
// ============================================
// FEATURE 3: OWNERS & SEEKERS - DATABASE SCHEMA
// ============================================

// ============================================
// PROPERTY OWNERS
// ============================================

model PropertyOwner {
  id                  String            @id @default(uuid())
  userId              String            @map("user_id")
  user                User              @relation(fields: [userId], references: [id])
  
  // Basic Info
  name                String
  phone               String
  email               String?
  secondaryPhone      String?           @map("secondary_phone")
  whatsapp            String?
  nationalId          String?           @map("national_id") @unique
  
  // Location
  city                String?
  district            String?
  address             String?           @db.Text
  
  // Owner Type
  ownerType           String            @default("individual") @map("owner_type") // 'individual', 'company', 'government'
  companyName         String?           @map("company_name")
  companyRegNumber    String?           @map("company_reg_number")
  
  // Financial
  preferredPayment    String            @default("bank_transfer") @map("preferred_payment") // 'bank_transfer', 'cash', 'cheque'
  bankName            String?           @map("bank_name")
  iban                String?
  
  // Status & Verification
  status              String            @default("active") // 'active', 'inactive', 'suspended', 'blacklisted'
  isVerified          Boolean           @default(false) @map("is_verified")
  verifiedAt          DateTime?         @map("verified_at")
  verificationDoc     String?           @map("verification_doc")
  
  // Stats
  propertiesCount     Int               @default(0) @map("properties_count")
  totalValue          Decimal           @default(0) @map("total_value") @db.Decimal(15, 2)
  dealsCompleted      Int               @default(0) @map("deals_completed")
  rating              Decimal           @default(0) @db.Decimal(3, 2) // 0.00 - 5.00
  
  // Metadata
  tags                Json              @default("[]")
  notes               String?           @db.Text
  customFields        Json              @default("{}") @map("custom_fields")
  
  // Timestamps
  lastContactedAt     DateTime?         @map("last_contacted_at")
  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  // Relations
  properties          OwnerProperty[]
  contracts           OwnerContract[]

  @@index([userId])
  @@index([phone])
  @@index([email])
  @@index([city])
  @@index([status])
  @@map("property_owners")
}

// ============================================
// OWNER PROPERTIES
// ============================================

model OwnerProperty {
  id                  String            @id @default(uuid())
  ownerId             String            @map("owner_id")
  owner               PropertyOwner     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  userId              String            @map("user_id")
  user                User              @relation(fields: [userId], references: [id])
  
  // Property Details
  title               String
  description         String?           @db.Text
  propertyType        String            @map("property_type") // 'apartment', 'villa', 'land', 'commercial', 'building'
  purpose             String            // 'sale', 'rent'
  
  // Pricing
  price               Decimal           @db.Decimal(15, 2)
  currency            String            @default("SAR")
  pricePerMeter       Decimal?          @map("price_per_meter") @db.Decimal(10, 2)
  isNegotiable        Boolean           @default(true) @map("is_negotiable")
  downPayment         Decimal?          @map("down_payment") @db.Decimal(15, 2)
  monthlyRent         Decimal?          @map("monthly_rent") @db.Decimal(10, 2)
  
  // Location
  city                String
  district            String?
  neighborhood        String?
  streetName          String?           @map("street_name")
  address             String?           @db.Text
  latitude            Decimal?          @db.Decimal(10, 8)
  longitude           Decimal?          @db.Decimal(11, 8)
  
  // Property Specs
  area                Decimal           @db.Decimal(10, 2) // Square meters
  bedrooms            Int?
  bathrooms           Int?
  livingRooms         Int?              @map("living_rooms")
  kitchens            Int?
  floors              Int?              // Number of floors
  floor               Int?              // Floor number (for apartments)
  buildingAge         Int?              @map("building_age") // Years
  
  // Features & Amenities
  features            Json              @default("[]") // ['parking', 'pool', 'garden', 'elevator', 'security']
  furnishingStatus    String            @default("unfurnished") @map("furnishing_status") // 'furnished', 'semi_furnished', 'unfurnished'
  
  // Legal & Documentation
  deedNumber          String?           @map("deed_number")
  deedDate            DateTime?         @map("deed_date")
  planNumber          String?           @map("plan_number")
  hasPermit           Boolean           @default(true) @map("has_permit")
  permitNumber        String?           @map("permit_number")
  
  // Media
  images              Json              @default("[]") // [{url, caption, isPrimary}]
  videos              Json              @default("[]")
  virtualTourUrl      String?           @map("virtual_tour_url")
  
  // Status & Visibility
  status              String            @default("available") // 'available', 'reserved', 'sold', 'rented', 'draft'
  isPublished         Boolean           @default(false) @map("is_published")
  publishedAt         DateTime?         @map("published_at")
  isFeatured          Boolean           @default(false) @map("is_featured")
  isExclusive         Boolean           @default(false) @map("is_exclusive")
  
  // Views & Stats
  viewsCount          Int               @default(0) @map("views_count")
  inquiriesCount      Int               @default(0) @map("inquiries_count")
  matchesCount        Int               @default(0) @map("matches_count")
  
  // Timestamps
  availableFrom       DateTime?         @map("available_from")
  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  // Relations
  matches             SeekerMatch[]

  @@index([ownerId])
  @@index([userId])
  @@index([city])
  @@index([propertyType])
  @@index([purpose])
  @@index([status])
  @@index([price])
  @@map("owner_properties")
}

// ============================================
// PROPERTY SEEKERS
// ============================================

model PropertySeeker {
  id                  String            @id @default(uuid())
  userId              String            @map("user_id")
  user                User              @relation(fields: [userId], references: [id])
  
  // Basic Info
  name                String
  phone               String
  email               String?
  secondaryPhone      String?           @map("secondary_phone")
  whatsapp            String?
  nationalId          String?           @map("national_id")
  
  // Search Criteria
  propertyType        String?           @map("property_type") // 'apartment', 'villa', 'land', 'commercial'
  purpose             String            // 'buy', 'rent'
  
  // Budget
  budgetMin           Decimal?          @map("budget_min") @db.Decimal(15, 2)
  budgetMax           Decimal?          @map("budget_max") @db.Decimal(15, 2)
  currency            String            @default("SAR")
  paymentMethod       String            @default("financing") @map("payment_method") // 'cash', 'financing', 'both'
  downPaymentAvailable Decimal?         @map("down_payment_available") @db.Decimal(15, 2)
  
  // Location Preferences
  preferredCities     Json              @default("[]") @map("preferred_cities") // ['الرياض', 'جدة']
  preferredDistricts  Json              @default("[]") @map("preferred_districts")
  mustBeInCity        Boolean           @default(false) @map("must_be_in_city")
  
  // Property Specs
  bedroomsMin         Int?              @map("bedrooms_min")
  bedroomsMax         Int?              @map("bedrooms_max")
  bathroomsMin        Int?              @map("bathrooms_min")
  areaMin             Decimal?          @map("area_min") @db.Decimal(10, 2)
  areaMax             Decimal?          @map("area_max") @db.Decimal(10, 2)
  floorsMin           Int?              @map("floors_min")
  floorsMax           Int?              @map("floors_max")
  
  // Features Required
  requiredFeatures    Json              @default("[]") @map("required_features") // ['parking', 'elevator']
  preferredFeatures   Json              @default("[]") @map("preferred_features")
  furnishingStatus    String?           @map("furnishing_status") // 'furnished', 'semi_furnished', 'unfurnished', 'any'
  
  // Timeline
  urgency             String            @default("normal") // 'urgent', 'normal', 'flexible'
  neededBy            DateTime?         @map("needed_by")
  
  // Status
  status              String            @default("active") // 'active', 'paused', 'closed', 'converted'
  isQualified         Boolean           @default(false) @map("is_qualified")
  qualificationNotes  String?           @map("qualification_notes") @db.Text
  
  // Stats
  matchesCount        Int               @default(0) @map("matches_count")
  viewedPropertiesCount Int             @default(0) @map("viewed_properties_count")
  interestedCount     Int               @default(0) @map("interested_count")
  
  // Metadata
  tags                Json              @default("[]")
  notes               String?           @db.Text
  source              String?           // 'website', 'referral', 'social', 'direct'
  
  // Timestamps
  lastMatchedAt       DateTime?         @map("last_matched_at")
  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  // Relations
  matches             SeekerMatch[]

  @@index([userId])
  @@index([phone])
  @@index([purpose])
  @@index([status])
  @@map("property_seekers")
}

// ============================================
// SEEKER MATCHES
// ============================================

model SeekerMatch {
  id                  String            @id @default(uuid())
  seekerId            String            @map("seeker_id")
  seeker              PropertySeeker    @relation(fields: [seekerId], references: [id], onDelete: Cascade)
  propertyId          String            @map("property_id")
  property            OwnerProperty     @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  userId              String            @map("user_id")
  user                User              @relation(fields: [userId], references: [id])
  
  // Match Score (0-100)
  matchScore          Decimal           @map("match_score") @db.Decimal(5, 2)
  
  // Score Breakdown
  priceScore          Decimal           @map("price_score") @db.Decimal(5, 2)
  locationScore       Decimal           @map("location_score") @db.Decimal(5, 2)
  specsScore          Decimal           @map("specs_score") @db.Decimal(5, 2)
  featuresScore       Decimal           @map("features_score") @db.Decimal(5, 2)
  
  // Match Details
  matchReason         String?           @map("match_reason") @db.Text
  matchFactors        Json              @default("[]") @map("match_factors") // ['price_match', 'location_match', 'bedrooms_match']
  
  // Status & Actions
  status              String            @default("pending") // 'pending', 'viewed', 'interested', 'contacted', 'rejected', 'deal'
  viewedAt            DateTime?         @map("viewed_at")
  interestedAt        DateTime?         @map("interested_at")
  rejectedAt          DateTime?         @map("rejected_at")
  rejectionReason     String?           @map("rejection_reason")
  
  // Broker Actions
  notificationSent    Boolean           @default(false) @map("notification_sent")
  emailSent           Boolean           @default(false) @map("email_sent")
  smsSent             Boolean           @default(false) @map("sms_sent")
  
  // Notes
  brokerNotes         String?           @map("broker_notes") @db.Text
  
  // Timestamps
  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  @@unique([seekerId, propertyId])
  @@index([seekerId])
  @@index([propertyId])
  @@index([matchScore])
  @@index([status])
  @@map("seeker_matches")
}

// ============================================
// OWNER CONTRACTS
// ============================================

model OwnerContract {
  id                  String            @id @default(uuid())
  ownerId             String            @map("owner_id")
  owner               PropertyOwner     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  userId              String            @map("user_id")
  user                User              @relation(fields: [userId], references: [id])
  
  // Contract Details
  contractNumber      String            @unique @map("contract_number")
  contractType        String            @map("contract_type") // 'exclusive', 'open', 'limited'
  
  // Terms
  startDate           DateTime          @map("start_date")
  endDate             DateTime          @map("end_date")
  commissionRate      Decimal           @map("commission_rate") @db.Decimal(5, 2)
  terms               String            @db.Text
  
  // Status
  status              String            @default("active") // 'draft', 'active', 'expired', 'terminated'
  signedAt            DateTime?         @map("signed_at")
  signedByOwner       Boolean           @default(false) @map("signed_by_owner")
  signedByBroker      Boolean           @default(false) @map("signed_by_broker")
  
  // Documents
  contractDocument    String?           @map("contract_document")
  ownerSignature      String?           @map("owner_signature")
  brokerSignature     String?           @map("broker_signature")
  
  // Timestamps
  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  @@index([ownerId])
  @@index([status])
  @@map("owner_contracts")
}

// ============================================
// MATCH PREFERENCES (User Settings)
// ============================================

model MatchPreferences {
  id                    String   @id @default(uuid())
  userId                String   @unique @map("user_id")
  user                  User     @relation(fields: [userId], references: [id])
  
  // Auto-Matching Settings
  autoMatchEnabled      Boolean  @default(true) @map("auto_match_enabled")
  minMatchScore         Decimal  @default(50) @map("min_match_score") @db.Decimal(5, 2)
  maxMatchesPerSeeker   Int      @default(10) @map("max_matches_per_seeker")
  
  // Notification Settings
  notifyOnNewMatch      Boolean  @default(true) @map("notify_on_new_match")
  notifyOnInterested    Boolean  @default(true) @map("notify_on_interested")
  notifyOnRejected      Boolean  @default(false) @map("notify_on_rejected")
  
  // Score Weights (must sum to 100)
  priceWeight           Int      @default(35) @map("price_weight")
  locationWeight        Int      @default(30) @map("location_weight")
  specsWeight           Int      @default(20) @map("specs_weight")
  featuresWeight        Int      @default(15) @map("features_weight")
  
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  @@map("match_preferences")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/owners-seekers.seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/ar';

const prisma = new PrismaClient();

// ============================================
// SAMPLE DATA
// ============================================

const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'الظهران', 'تبوك', 'أبها', 'الطائف', 'بريدة', 'القطيف'
];

const RIYADH_DISTRICTS = [
  'الملقا', 'النخيل', 'الياسمين', 'الربوة', 'العليا', 'الملز',
  'الروضة', 'السليمانية', 'العقيق', 'النرجس', 'الحمراء', 'الورود'
];

const JEDDAH_DISTRICTS = [
  'أبحر الشمالية', 'أبحر الجنوبية', 'الشاطئ', 'الحمدانية', 'الروضة',
  'النعيم', 'البلد', 'الصفا', 'المرجان', 'الزهراء'
];

const PROPERTY_TYPES = ['apartment', 'villa', 'land', 'commercial', 'building'];

const FEATURES = [
  'parking', 'elevator', 'garden', 'pool', 'security', 'gym',
  'playground', 'mosque', 'storage', 'maid_room', 'driver_room',
  'central_ac', 'kitchen_appliances', 'balcony', 'terrace'
];

const OWNER_NAMES = [
  'عبدالله محمد', 'فاطمة أحمد', 'خالد عبدالعزيز', 'نورة سعيد',
  'محمد علي', 'سارة حسن', 'أحمد عبدالرحمن', 'منى عبدالله',
  'سعد فهد', 'هند بندر', 'عمر ناصر', 'ريم سلطان'
];

const SEEKER_NAMES = [
  'يوسف إبراهيم', 'مريم خالد', 'طارق عبدالله', 'لينا محمد',
  'فيصل أحمد', 'ديما سعيد', 'ماجد حسن', 'جواهر علي',
  'وليد عبدالعزيز', 'شهد محمود', 'تركي فهد', 'رهف ناصر'
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

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePhone(): string {
  const prefix = '050';
  const suffix = String(randomNumber(1000000, 9999999));
  return prefix + suffix;
}

function generateEmail(name: string): string {
  const cleanName = name.replace(/\s+/g, '.').toLowerCase();
  const domains = ['gmail.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  return `${cleanName}@${randomElement(domains)}`;
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedOwnersAndSeekers() {
  console.log('🌱 Seeding Owners & Seekers...\n');

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@novacrm.com' },
  });

  if (!user) {
    throw new Error('Demo user not found. Run CRM Core seed first.');
  }

  // ============================================
  // 1. CREATE PROPERTY OWNERS (50)
  // ============================================
  console.log('👤 Creating 50 property owners...');

  const owners = [];

  for (let i = 0; i < 50; i++) {
    const name = `${randomElement(OWNER_NAMES)} ${i + 1}`;
    const city = randomElement(SAUDI_CITIES);
    const ownerType = randomElement(['individual', 'individual', 'individual', 'company']);

    const ownerData: any = {
      userId: user.id,
      name,
      phone: generatePhone(),
      email: Math.random() > 0.3 ? generateEmail(name) : null,
      city,
      district: city === 'الرياض' ? randomElement(RIYADH_DISTRICTS) : city === 'جدة' ? randomElement(JEDDAH_DISTRICTS) : null,
      ownerType,
      status: randomElement(['active', 'active', 'active', 'inactive']),
      isVerified: Math.random() > 0.3,
      rating: randomNumber(30, 50) / 10, // 3.0 - 5.0
      tags: JSON.stringify(
        Math.random() > 0.6
          ? [randomElement(['premium', 'verified', 'trusted', 'frequent'])]
          : []
      ),
    };

    if (ownerType === 'company') {
      ownerData.companyName = `شركة ${name} العقارية`;
      ownerData.companyRegNumber = `CR-${randomNumber(1000000, 9999999)}`;
    }

    const owner = await prisma.propertyOwner.create({
      data: ownerData,
    });

    owners.push(owner);
  }

  console.log(`✅ Created ${owners.length} property owners`);

  // ============================================
  // 2. CREATE OWNER PROPERTIES (100)
  // ============================================
  console.log('\n🏠 Creating 100 properties...');

  const properties = [];

  for (let i = 0; i < 100; i++) {
    const owner = randomElement(owners);
    const propertyType = randomElement(PROPERTY_TYPES);
    const purpose = randomElement(['sale', 'sale', 'rent']);
    const city = owner.city || randomElement(SAUDI_CITIES);
    const district = city === 'الرياض' ? randomElement(RIYADH_DISTRICTS) : city === 'جدة' ? randomElement(JEDDAH_DISTRICTS) : `حي ${randomNumber(1, 20)}`;

    let price: number;
    let area: number;
    let bedrooms: number | null = null;
    let bathrooms: number | null = null;

    // Generate realistic data based on property type
    switch (propertyType) {
      case 'apartment':
        area = randomNumber(80, 250);
        bedrooms = randomNumber(1, 4);
        bathrooms = randomNumber(1, 3);
        price = purpose === 'sale' ? area * randomNumber(2500, 4000) : randomNumber(1500, 5000);
        break;

      case 'villa':
        area = randomNumber(250, 600);
        bedrooms = randomNumber(3, 7);
        bathrooms = randomNumber(2, 5);
        price = purpose === 'sale' ? area * randomNumber(3000, 5000) : randomNumber(4000, 12000);
        break;

      case 'land':
        area = randomNumber(400, 2000);
        price = area * randomNumber(1000, 3000);
        break;

      case 'commercial':
        area = randomNumber(100, 500);
        price = purpose === 'sale' ? area * randomNumber(4000, 7000) : randomNumber(5000, 20000);
        break;

      case 'building':
        area = randomNumber(500, 1500);
        price = area * randomNumber(3500, 6000);
        break;

      default:
        area = 200;
        price = 500000;
    }

    const selectedFeatures = randomElements(FEATURES, randomNumber(3, 8));

    const propertyData: any = {
      ownerId: owner.id,
      userId: user.id,
      title: generatePropertyTitle(propertyType, city, district),
      description: generatePropertyDescription(propertyType, area, bedrooms),
      propertyType,
      purpose,
      price,
      currency: 'SAR',
      pricePerMeter: purpose === 'sale' ? price / area : null,
      isNegotiable: Math.random() > 0.3,
      city,
      district,
      area,
      bedrooms,
      bathrooms,
      features: JSON.stringify(selectedFeatures),
      furnishingStatus: randomElement(['furnished', 'semi_furnished', 'unfurnished']),
      status: randomElement(['available', 'available', 'available', 'reserved']),
      isPublished: Math.random() > 0.2,
      viewsCount: randomNumber(0, 150),
      inquiriesCount: randomNumber(0, 30),
    };

    if (propertyType === 'villa' || propertyType === 'building') {
      propertyData.floors = randomNumber(1, 3);
      propertyData.livingRooms = randomNumber(1, 2);
      propertyData.kitchens = randomNumber(1, 2);
    }

    if (propertyType === 'apartment') {
      propertyData.floor = randomNumber(0, 15);
      propertyData.buildingAge = randomNumber(0, 30);
    }

    if (purpose === 'rent') {
      propertyData.monthlyRent = price;
      propertyData.price = price * 12; // Annual rent as price
    }

    const property = await prisma.ownerProperty.create({
      data: propertyData,
    });

    properties.push(property);

    // Update owner's properties count
    await prisma.propertyOwner.update({
      where: { id: owner.id },
      data: {
        propertiesCount: { increment: 1 },
        totalValue: { increment: price },
      },
    });
  }

  console.log(`✅ Created ${properties.length} properties`);

  // ============================================
  // 3. CREATE PROPERTY SEEKERS (50)
  // ============================================
  console.log('\n🔍 Creating 50 property seekers...');

  const seekers = [];

  for (let i = 0; i < 50; i++) {
    const name = `${randomElement(SEEKER_NAMES)} ${i + 1}`;
    const purpose = randomElement(['buy', 'buy', 'rent']);
    const propertyType = randomElement(PROPERTY_TYPES);
    const city = randomElement(SAUDI_CITIES);

    let budgetMin: number;
    let budgetMax: number;

    // Generate realistic budget based on property type and purpose
    if (purpose === 'buy') {
      switch (propertyType) {
        case 'apartment':
          budgetMin = randomNumber(200, 400) * 1000;
          budgetMax = budgetMin + randomNumber(200, 400) * 1000;
          break;
        case 'villa':
          budgetMin = randomNumber(600, 1000) * 1000;
          budgetMax = budgetMin + randomNumber(400, 800) * 1000;
          break;
        case 'land':
          budgetMin = randomNumber(300, 600) * 1000;
          budgetMax = budgetMin + randomNumber(300, 600) * 1000;
          break;
        default:
          budgetMin = randomNumber(400, 800) * 1000;
          budgetMax = budgetMin + randomNumber(300, 500) * 1000;
      }
    } else {
      budgetMin = randomNumber(1500, 3000);
      budgetMax = budgetMin + randomNumber(2000, 5000);
    }

    const requiredFeatures = randomElements(FEATURES, randomNumber(2, 5));
    const preferredFeatures = randomElements(FEATURES, randomNumber(1, 3));

    const seekerData: any = {
      userId: user.id,
      name,
      phone: generatePhone(),
      email: Math.random() > 0.4 ? generateEmail(name) : null,
      propertyType,
      purpose,
      budgetMin,
      budgetMax,
      currency: 'SAR',
      preferredCities: JSON.stringify([city]),
      preferredDistricts: JSON.stringify(
        city === 'الرياض'
          ? randomElements(RIYADH_DISTRICTS, randomNumber(2, 4))
          : []
      ),
      bedroomsMin: propertyType === 'apartment' || propertyType === 'villa' ? randomNumber(2, 3) : null,
      bedroomsMax: propertyType === 'apartment' || propertyType === 'villa' ? randomNumber(4, 6) : null,
      bathroomsMin: propertyType === 'apartment' || propertyType === 'villa' ? randomNumber(1, 2) : null,
      areaMin: randomNumber(100, 200),
      areaMax: randomNumber(300, 500),
      requiredFeatures: JSON.stringify(requiredFeatures),
      preferredFeatures: JSON.stringify(preferredFeatures),
      furnishingStatus: randomElement(['furnished', 'unfurnished', 'any']),
      urgency: randomElement(['urgent', 'normal', 'normal', 'flexible']),
      status: randomElement(['active', 'active', 'active', 'paused']),
      isQualified: Math.random() > 0.4,
      tags: JSON.stringify(
        Math.random() > 0.7
          ? [randomElement(['hot_lead', 'serious_buyer', 'investor', 'first_timer'])]
          : []
      ),
      source: randomElement(['website', 'referral', 'social', 'direct']),
    };

    const seeker = await prisma.propertySeeker.create({
      data: seekerData,
    });

    seekers.push(seeker);
  }

  console.log(`✅ Created ${seekers.length} property seekers`);

  // ============================================
  // 4. CREATE MATCH PREFERENCES
  // ============================================
  console.log('\n⚙️  Creating match preferences...');

  await prisma.matchPreferences.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      autoMatchEnabled: true,
      minMatchScore: 50,
      maxMatchesPerSeeker: 10,
      priceWeight: 35,
      locationWeight: 30,
      specsWeight: 20,
      featuresWeight: 15,
    },
  });

  console.log('✅ Match preferences created');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ Owners & Seekers Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Property Owners:   ${owners.length}`);
  console.log(`   - Properties:        ${properties.length}`);
  console.log(`   - Property Seekers:  ${seekers.length}`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generatePropertyTitle(type: string, city: string, district: string): string {
  const titles: Record<string, string[]> = {
    apartment: ['شقة فاخرة', 'شقة عائلية', 'شقة راقية', 'شقة مميزة'],
    villa: ['فيلا فاخرة', 'فيلا راقية', 'فيلا عائلية', 'فيلا مودرن'],
    land: ['أرض سكنية', 'أرض تجارية', 'أرض استثمارية'],
    commercial: ['محل تجاري', 'مكتب إداري', 'مستودع', 'معرض'],
    building: ['عمارة سكنية', 'عمارة تجارية', 'مبنى استثماري'],
  };

  const typeTitle = randomElement(titles[type] || ['عقار']);
  return `${typeTitle} في ${district} - ${city}`;
}

function generatePropertyDescription(
  type: string,
  area: number,
  bedrooms: number | null
): string {
  const descriptions = [
    `عقار مميز بمساحة ${area} متر مربع`,
    bedrooms ? ` يحتوي على ${bedrooms} غرف نوم` : '',
    ' في موقع استراتيجي',
    ' قريب من الخدمات الأساسية',
    ' تشطيب راقي',
    ' جاهز للسكن',
  ];

  return descriptions.filter(Boolean).join('،');
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedOwnersAndSeekers };

// If running directly
if (require.main === module) {
  seedOwnersAndSeekers()
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

📄 **File:** `/FEATURE-3-OWNERS-SEEKERS.md`  
🎯 **Status:** Part 1 Complete (DB + Seeding)  
⏱️ **Next:** Backend APIs + Auto-Matching Algorithm
