# 🔥 **NOVA CRM - FULL FEATURES AUTOMATION PROMPT**
## **Copy-Paste This Entire Prompt to Generate Complete System**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🤖 AUTOMATED SYSTEM GENERATOR - ALL 7 FEATURES              ║
║                                                               ║
║  This prompt generates complete, production-ready code for:  ║
║  ✅ Database Schemas (PostgreSQL)                            ║
║  ✅ Backend APIs (Node.js + Express + Prisma)                ║
║  ✅ Frontend Components (React + TypeScript)                 ║
║  ✅ Data Seeding Scripts                                     ║
║  ✅ Real-time Testing Scripts                                ║
║  ✅ AI Integration Logic                                     ║
║                                                               ║
║  Simply copy this entire file and execute!                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 🎯 **MASTER AUTOMATION PROMPT**

```
I need you to generate a complete, production-ready CRM system for real estate brokers in Saudi Arabia with 7 core features. Generate ALL code files, schemas, and configurations as specified below.

## PROJECT STRUCTURE

Create the following project structure:

nova-crm/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
└── scripts/
    ├── test-all.sh
    └── setup.sh

## TECH STACK

- Backend: Node.js, Express, Prisma, PostgreSQL
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Real-time: Socket.IO
- AI: OpenAI API
- Auth: JWT
- Validation: Zod

---

## FEATURE 1: CRM CORE - CUSTOMER INTERACTIONS

### DATABASE SCHEMA

Generate Prisma schema for:

```prisma
model CustomerInteraction {
  id              String    @id @default(uuid())
  customerId      String    @map("customer_id")
  customer        Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)
  userId          String    @map("user_id")
  user            User      @relation(fields: [userId], references: [id])
  type            String    // 'call', 'meeting', 'email', 'whatsapp', 'note'
  subject         String?
  notes           String?   @db.Text
  outcome         String?   // 'interested', 'not_interested', 'callback', 'deal_closed'
  scheduledAt     DateTime? @map("scheduled_at")
  completedAt     DateTime? @map("completed_at")
  durationMinutes Int?      @map("duration_minutes")
  attachments     Json      @default("[]")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  @@index([customerId])
  @@index([userId])
  @@map("customer_interactions")
}

model CustomerFollowup {
  id               String              @id @default(uuid())
  customerId       String              @map("customer_id")
  customer         Customer            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  userId           String              @map("user_id")
  user             User                @relation(fields: [userId], references: [id])
  interactionId    String?             @map("interaction_id")
  interaction      CustomerInteraction? @relation(fields: [interactionId], references: [id])
  title            String
  description      String?             @db.Text
  dueDate          DateTime            @map("due_date")
  priority         String              @default("medium") // 'low', 'medium', 'high', 'urgent'
  status           String              @default("pending") // 'pending', 'completed', 'cancelled'
  reminderSent     Boolean             @default(false) @map("reminder_sent")
  reminderAt       DateTime?           @map("reminder_at")
  completedAt      DateTime?           @map("completed_at")
  completionNotes  String?             @map("completion_notes") @db.Text
  createdAt        DateTime            @default(now()) @map("created_at")
  updatedAt        DateTime            @updatedAt @map("updated_at")

  @@index([customerId])
  @@index([dueDate])
  @@map("customer_followups")
}
```

### BACKEND CONTROLLER

Generate: `backend/src/controllers/interaction-controller.ts`

Include:
- createInteraction (POST /api/interactions)
- getInteractions (GET /api/interactions)
- updateInteraction (PUT /api/interactions/:id)
- deleteInteraction (DELETE /api/interactions/:id)
- createFollowUp (POST /api/followups)
- getFollowUps (GET /api/followups)
- AI-powered follow-up suggestions

With Zod validation and error handling.

### FRONTEND COMPONENT

Generate: `frontend/src/app/(dashboard)/customers/[id]/interactions.tsx`

Include:
- Interaction timeline view
- Create interaction dialog
- Follow-up alerts
- Real-time notifications
- AI suggestion chips

### DATA SEEDING

Generate seed data in `backend/prisma/seed.ts`:

- 50 sample interactions across different types
- 20 follow-ups with various priorities
- Mix of completed and pending statuses

### TESTING SCRIPT

Generate: `scripts/test-interactions.sh`

Test:
- Create interaction → verify notification sent
- Create interaction with 'interested' outcome → verify auto follow-up created
- Update interaction → verify real-time update in frontend
- AI suggestion → verify relevance and accuracy

---

## FEATURE 2: FINANCE INTEGRATION - SALES & COMMISSIONS

### DATABASE SCHEMA

Generate Prisma schema for:

```prisma
model Sale {
  id                String    @id @default(uuid())
  userId            String    @map("user_id")
  user              User      @relation(fields: [userId], references: [id])
  customerId        String?   @map("customer_id")
  customer          Customer? @relation(fields: [customerId], references: [id])
  propertyId        String?   @map("property_id")
  property          Property? @relation(fields: [propertyId], references: [id])
  saleType          String    @map("sale_type") // 'sale', 'rent', 'commission'
  amount            Decimal   @db.Decimal(15, 2)
  currency          String    @default("SAR")
  commissionRate    Decimal?  @map("commission_rate") @db.Decimal(5, 2)
  commissionAmount  Decimal?  @map("commission_amount") @db.Decimal(15, 2)
  paymentStatus     String    @default("pending") @map("payment_status")
  paidAmount        Decimal   @default(0) @map("paid_amount") @db.Decimal(15, 2)
  contractNumber    String?   @map("contract_number")
  contractDate      DateTime? @map("contract_date")
  notes             String?   @db.Text
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  payments          Payment[]
  commissions       Commission[]

  @@index([userId])
  @@map("sales")
}

model Payment {
  id              String   @id @default(uuid())
  saleId          String   @map("sale_id")
  sale            Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  userId          String   @map("user_id")
  user            User     @relation(fields: [userId], references: [id])
  amount          Decimal  @db.Decimal(15, 2)
  currency        String   @default("SAR")
  paymentMethod   String   @map("payment_method")
  paymentDate     DateTime @map("payment_date")
  referenceNumber String?  @map("reference_number")
  status          String   @default("confirmed")
  notes           String?  @db.Text
  createdAt       DateTime @default(now()) @map("created_at")

  @@index([saleId])
  @@map("payments")
}

model Commission {
  id            String    @id @default(uuid())
  saleId        String    @map("sale_id")
  sale          Sale      @relation(fields: [saleId], references: [id], onDelete: Cascade)
  userId        String    @map("user_id")
  user          User      @relation(fields: [userId], references: [id])
  amount        Decimal   @db.Decimal(15, 2)
  currency      String    @default("SAR")
  rate          Decimal   @db.Decimal(5, 2)
  status        String    @default("pending")
  paidDate      DateTime? @map("paid_date")
  paymentMethod String?   @map("payment_method")
  notes         String?   @db.Text
  createdAt     DateTime  @default(now()) @map("created_at")

  @@index([saleId])
  @@index([userId])
  @@map("commissions")
}
```

### BACKEND CONTROLLER

Generate: `backend/src/controllers/finance-controller.ts`

Include:
- createSale with auto-commission calculation
- recordPayment with auto-status update
- getCommissions with filtering
- getFinanceReports with aggregations

### FRONTEND COMPONENTS

Generate:
- `frontend/src/app/(dashboard)/finance/sales/page.tsx`
- `frontend/src/app/(dashboard)/finance/commissions/page.tsx`
- `frontend/src/components/finance/SaleForm.tsx`
- `frontend/src/components/finance/PaymentForm.tsx`

### DATA SEEDING

50 sales records with:
- Mix of sale/rent types
- Various payment statuses
- Auto-calculated commissions
- Linked to customers and properties

### TESTING SCRIPT

Test commission calculation accuracy (amount * rate = commission)

---

## FEATURE 3: OWNERS & SEEKERS

### DATABASE SCHEMA

```prisma
model PropertyOwner {
  id                String   @id @default(uuid())
  userId            String   @map("user_id")
  user              User     @relation(fields: [userId], references: [id])
  name              String
  phone             String
  email             String?
  city              String?
  district          String?
  status            String   @default("active")
  propertiesCount   Int      @default(0) @map("properties_count")
  totalValue        Decimal  @default(0) @map("total_value") @db.Decimal(15, 2)
  notes             String?  @db.Text
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  properties        OwnerProperty[]

  @@index([userId])
  @@index([phone])
  @@map("property_owners")
}

model PropertySeeker {
  id                String   @id @default(uuid())
  userId            String   @map("user_id")
  user              User     @relation(fields: [userId], references: [id])
  name              String
  phone             String
  email             String?
  propertyType      String?  @map("property_type")
  purpose           String   // 'buy', 'rent'
  budgetMin         Decimal? @map("budget_min") @db.Decimal(15, 2)
  budgetMax         Decimal? @map("budget_max") @db.Decimal(15, 2)
  preferredCities   Json     @default("[]") @map("preferred_cities")
  bedroomsMin       Int?     @map("bedrooms_min")
  bedroomsMax       Int?     @map("bedrooms_max")
  status            String   @default("active")
  matchesCount      Int      @default(0) @map("matches_count")
  notes             String?  @db.Text
  createdAt         DateTime @default(now()) @map("created_at")

  matches           SeekerMatch[]

  @@index([userId])
  @@index([phone])
  @@map("property_seekers")
}

model SeekerMatch {
  id           String   @id @default(uuid())
  seekerId     String   @map("seeker_id")
  seeker       PropertySeeker @relation(fields: [seekerId], references: [id], onDelete: Cascade)
  propertyId   String   @map("property_id")
  property     Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  userId       String   @map("user_id")
  user         User     @relation(fields: [userId], references: [id])
  matchScore   Decimal  @map("match_score") @db.Decimal(5, 2)
  matchReason  String?  @map("match_reason") @db.Text
  status       String   @default("pending")
  createdAt    DateTime @default(now()) @map("created_at")

  @@unique([seekerId, propertyId])
  @@index([seekerId])
  @@index([propertyId])
  @@map("seeker_matches")
}
```

### BACKEND CONTROLLER

Generate: `backend/src/controllers/owners-controller.ts` and `backend/src/controllers/seekers-controller.ts`

Include:
- Full CRUD for owners and seekers
- Auto-matching algorithm with scoring (0-100)
- Match notifications
- Stats calculation

### MATCHING ALGORITHM

Implement smart matching based on:
- Property type (20 points)
- Price/budget (30 points)
- Location (25 points)
- Bedrooms (15 points)
- Area (10 points)

Minimum match score: 50%

### DATA SEEDING

- 20 owners
- 50 seekers with diverse requirements
- Auto-generate 30+ matches

---

## FEATURE 4: AUTO PUBLISHING SYSTEM

### DATABASE SCHEMA

```prisma
model PlatformIntegration {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  user          User      @relation(fields: [userId], references: [id])
  platformName  String    @map("platform_name")
  apiKey        String?   @map("api_key")
  autoPublish   Boolean   @default(false) @map("auto_publish")
  status        String    @default("active")
  lastSyncAt    DateTime? @map("last_sync_at")
  createdAt     DateTime  @default(now()) @map("created_at")

  tasks         AutoPublishTask[]

  @@index([userId])
  @@map("platform_integrations")
}

model AutoPublishTask {
  id                  String              @id @default(uuid())
  userId              String              @map("user_id")
  user                User                @relation(fields: [userId], references: [id])
  propertyId          String              @map("property_id")
  property            Property            @relation(fields: [propertyId], references: [id])
  integrationId       String              @map("integration_id")
  integration         PlatformIntegration @relation(fields: [integrationId], references: [id])
  action              String
  status              String              @default("pending")
  scheduledAt         DateTime            @map("scheduled_at")
  completedAt         DateTime?           @map("completed_at")
  externalListingId   String?             @map("external_listing_id")
  externalListingUrl  String?             @map("external_listing_url")
  errorMessage        String?             @map("error_message")
  retryCount          Int                 @default(0) @map("retry_count")
  createdAt           DateTime            @default(now()) @map("created_at")

  logs                PublishingLog[]

  @@index([propertyId])
  @@index([status])
  @@map("auto_publish_tasks")
}

model PublishingLog {
  id             String           @id @default(uuid())
  taskId         String?          @map("task_id")
  task           AutoPublishTask? @relation(fields: [taskId], references: [id], onDelete: Cascade)
  integrationId  String           @map("integration_id")
  propertyId     String           @map("property_id")
  action         String
  status         String
  requestData    Json?            @map("request_data")
  responseData   Json?            @map("response_data")
  errorMessage   String?          @map("error_message")
  createdAt      DateTime         @default(now()) @map("created_at")

  @@index([taskId])
  @@map("publishing_logs")
}
```

### BACKEND LOGIC

Generate publishing service that:
- Schedules publishing tasks
- Executes tasks at scheduled time
- Retries on failure (max 3 times)
- Logs all attempts
- Sends notifications on success/failure

### PLATFORM INTEGRATIONS

Implement mock integrations for:
- Aqar.com
- Haraj.com.sa
- Property Finder
- Bayut

---

## FEATURE 5: CALENDAR & APPOINTMENTS

### DATABASE SCHEMA

```prisma
model Appointment {
  id                    String    @id @default(uuid())
  userId                String    @map("user_id")
  user                  User      @relation(fields: [userId], references: [id])
  title                 String
  description           String?   @db.Text
  type                  String?
  startDatetime         DateTime  @map("start_datetime")
  endDatetime           DateTime  @map("end_datetime")
  timezone              String    @default("Asia/Riyadh")
  allDay                Boolean   @default(false) @map("all_day")
  locationType          String    @default("physical") @map("location_type")
  locationAddress       String?   @map("location_address")
  meetingUrl            String?   @map("meeting_url")
  customerId            String?   @map("customer_id")
  customer              Customer? @relation(fields: [customerId], references: [id])
  propertyId            String?   @map("property_id")
  property              Property? @relation(fields: [propertyId], references: [id])
  status                String    @default("scheduled")
  reminderHoursBefore   Int       @default(24) @map("reminder_hours_before")
  notes                 String?   @db.Text
  outcome               String?   @db.Text
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  reminders             AppointmentReminder[]

  @@index([userId])
  @@index([startDatetime])
  @@map("appointments")
}

model AppointmentReminder {
  id            String      @id @default(uuid())
  appointmentId String      @map("appointment_id")
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  reminderType  String      @map("reminder_type")
  hoursBefore   Int         @map("hours_before")
  status        String      @default("pending")
  scheduledAt   DateTime    @map("scheduled_at")
  sentAt        DateTime?   @map("sent_at")
  createdAt     DateTime    @default(now()) @map("created_at")

  @@index([appointmentId])
  @@map("appointment_reminders")
}
```

### BACKEND FEATURES

- Conflict detection algorithm
- AI-suggested time slots
- Auto-reminder scheduling
- Calendar view API (day/week/month)

### FRONTEND COMPONENT

Full calendar view with:
- Month/week/day views
- Drag-and-drop rescheduling
- Conflict warnings
- Quick create dialog

---

## FEATURE 6: DIGITAL BUSINESS CARD

### DATABASE SCHEMA

```prisma
model DigitalCard {
  id            String   @id @default(uuid())
  userId        String   @unique @map("user_id")
  user          User     @relation(fields: [userId], references: [id])
  cardName      String?  @map("card_name")
  tagline       String?
  bio           String?  @db.Text
  phone         String?
  email         String?
  whatsapp      String?
  companyName   String?  @map("company_name")
  position      String?
  profileImage  String?  @map("profile_image")
  qrCodeUrl     String?  @map("qr_code_url")
  customSlug    String?  @unique @map("custom_slug")
  themeColor    String   @default("#01411C") @map("theme_color")
  isPublic      Boolean  @default(true) @map("is_public")
  viewsCount    Int      @default(0) @map("views_count")
  sharesCount   Int      @default(0) @map("shares_count")
  createdAt     DateTime @default(now()) @map("created_at")

  analytics     CardAnalytic[]

  @@map("digital_cards")
}

model CardAnalytic {
  id              String   @id @default(uuid())
  cardId          String   @map("card_id")
  card            DigitalCard @relation(fields: [cardId], references: [id], onDelete: Cascade)
  eventType       String   @map("event_type")
  visitorIp       String?  @map("visitor_ip")
  visitorCountry  String?  @map("visitor_country")
  createdAt       DateTime @default(now()) @map("created_at")

  @@index([cardId])
  @@map("card_analytics")
}
```

### FEATURES

- QR code generation using `qrcode` library
- Public card page (shareable link)
- Analytics tracking (views, shares, clicks)
- Custom slugs

---

## FEATURE 7: REPORTS & ANALYTICS

### DATABASE SCHEMA

```prisma
model Report {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  user            User      @relation(fields: [userId], references: [id])
  name            String
  reportType      String    @map("report_type")
  filters         Json      @default("{}")
  outputFormat    String    @default("pdf") @map("output_format")
  lastGeneratedAt DateTime? @map("last_generated_at")
  createdAt       DateTime  @default(now()) @map("created_at")

  @@index([userId])
  @@map("reports")
}

model AnalyticLog {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  user          User     @relation(fields: [userId], references: [id])
  eventCategory String   @map("event_category")
  eventAction   String   @map("event_action")
  eventLabel    String?  @map("event_label")
  metadata      Json?
  createdAt     DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([eventCategory])
  @@map("analytics_logs")
}
```

### EXPORT FEATURES

Generate report exporters for:
- PDF (using pdfkit)
- CSV (using json2csv)
- Excel (using exceljs)

With Arabic support and RTL layout.

---

## GLOBAL REQUIREMENTS

### 1. AUTHENTICATION

Generate complete JWT-based auth system:
- Login/Register
- Password hashing (bcrypt)
- Token generation and validation
- Protected routes middleware

### 2. REAL-TIME NOTIFICATIONS

Implement Socket.IO for:
- New interactions
- Follow-up reminders
- Sale updates
- Match notifications
- Appointment reminders

### 3. AI INTEGRATION

OpenAI integration for:
- Smart reply suggestions
- Follow-up recommendations
- Price predictions
- Market analysis

### 4. ERROR HANDLING

Global error handler with:
- Zod validation errors
- Database errors
- API errors
- User-friendly messages

### 5. LOGGING

Winston logger for:
- API requests
- Database queries
- Errors
- AI calls

---

## PACKAGE.JSON FILES

### Backend package.json

```json
{
  "name": "nova-crm-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "seed": "tsx prisma/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@prisma/client": "^5.8.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "socket.io": "^4.6.1",
    "openai": "^4.26.0",
    "qrcode": "^1.5.3",
    "pdfkit": "^0.14.0",
    "json2csv": "^6.0.0",
    "exceljs": "^4.3.0",
    "winston": "^3.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "prisma": "^5.8.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
```

### Frontend package.json

```json
{
  "name": "nova-crm-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.5",
    "socket.io-client": "^4.6.1",
    "zustand": "^4.4.7",
    "date-fns": "^3.0.6",
    "recharts": "^2.10.3",
    "lucide-react": "^0.303.0",
    "react-hook-form": "^7.49.2",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.4",
    "sonner": "^1.3.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## SETUP AUTOMATION SCRIPT

Generate: `scripts/setup.sh`

```bash
#!/bin/bash

echo "🚀 NOVA CRM - Automated Setup"
echo "=============================="

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required"; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "❌ PostgreSQL is required"; exit 1; }
echo "✅ Prerequisites met"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
cd backend && npm install
cd ../frontend && npm install
echo "✅ Dependencies installed"

# Setup database
echo ""
echo "💾 Setting up database..."
createdb nova_crm 2>/dev/null || echo "Database already exists"
cd backend
npx prisma generate
npx prisma migrate dev --name init
echo "✅ Database setup complete"

# Seed data
echo ""
echo "🌱 Seeding database..."
npm run seed
echo "✅ Data seeded"

# Build
echo ""
echo "🔨 Building applications..."
npm run build
cd ../frontend
npm run build
echo "✅ Build complete"

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║       ✅ NOVA CRM SETUP COMPLETE! ✅                 ║"
echo "║                                                       ║"
echo "║  Run these commands to start:                        ║"
echo "║  1. npm run dev:backend    (Terminal 1)              ║"
echo "║  2. npm run dev:frontend   (Terminal 2)              ║"
echo "║  3. npm run dev:socket     (Terminal 3)              ║"
echo "║                                                       ║"
echo "║  Access at:                                          ║"
echo "║  - Frontend: http://localhost:3000                   ║"
echo "║  - Backend:  http://localhost:4000                   ║"
echo "║  - Studio:   http://localhost:5555                   ║"
echo "║                                                       ║"
echo "║  Login:                                              ║"
echo "║  - Email:    demo@novacrm.com                        ║"
echo "║  - Password: Demo@123                                ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
```

---

## TESTING AUTOMATION SCRIPT

Generate: `scripts/test-all.sh`

```bash
#!/bin/bash

echo "🧪 NOVA CRM - Automated Testing"
echo "==============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get auth token
echo "🔐 Authenticating..."
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@novacrm.com","password":"Demo@123"}' \
  | jq -r '.token')

if [ -z "$TOKEN" ]; then
  echo "${RED}❌ Authentication failed${NC}"
  exit 1
fi
echo "${GREEN}✅ Authenticated${NC}"

# Test 1: Create Interaction
echo ""
echo "📝 Test 1: Create Interaction..."
INTERACTION=$(curl -s -X POST http://localhost:4000/api/interactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "test-customer-id",
    "type": "call",
    "subject": "Test Call",
    "notes": "Automated test",
    "outcome": "interested"
  }')

if echo "$INTERACTION" | jq -e '.id' >/dev/null; then
  echo "${GREEN}✅ Interaction created${NC}"
else
  echo "${RED}❌ Failed to create interaction${NC}"
fi

# Test 2: Create Sale with Auto-Commission
echo ""
echo "💰 Test 2: Create Sale..."
SALE=$(curl -s -X POST http://localhost:4000/api/sales \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sale_type": "sale",
    "amount": 500000,
    "commission_rate": 2.5
  }')

COMMISSION_AMOUNT=$(echo "$SALE" | jq -r '.commission_amount')
if [ "$COMMISSION_AMOUNT" = "12500" ]; then
  echo "${GREEN}✅ Commission calculated correctly (12500)${NC}"
else
  echo "${RED}❌ Commission calculation failed${NC}"
fi

# Test 3: Create Seeker and Check Matches
echo ""
echo "🔍 Test 3: Create Seeker..."
SEEKER=$(curl -s -X POST http://localhost:4000/api/seekers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Seeker",
    "phone": "+966501234567",
    "property_type": "apartment",
    "purpose": "buy",
    "budget_min": 300000,
    "budget_max": 500000
  }')

SEEKER_ID=$(echo "$SEEKER" | jq -r '.id')
sleep 2 # Wait for auto-matching

MATCHES=$(curl -s -X GET "http://localhost:4000/api/seekers/$SEEKER_ID/matches" \
  -H "Authorization: Bearer $TOKEN")

MATCH_COUNT=$(echo "$MATCHES" | jq '. | length')
if [ "$MATCH_COUNT" -gt "0" ]; then
  echo "${GREEN}✅ Auto-matching working ($MATCH_COUNT matches found)${NC}"
else
  echo "${RED}❌ No matches found${NC}"
fi

# Test 4: Create Appointment
echo ""
echo "📅 Test 4: Create Appointment..."
TOMORROW=$(date -u -d "+1 day" +"%Y-%m-%dT10:00:00Z")
END_TIME=$(date -u -d "+1 day" +"%Y-%m-%dT11:00:00Z")

APPOINTMENT=$(curl -s -X POST http://localhost:4000/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Appointment\",
    \"start_datetime\": \"$TOMORROW\",
    \"end_datetime\": \"$END_TIME\"
  }")

if echo "$APPOINTMENT" | jq -e '.id' >/dev/null; then
  echo "${GREEN}✅ Appointment created${NC}"
else
  echo "${RED}❌ Failed to create appointment${NC}"
fi

# Test 5: Generate Report
echo ""
echo "📊 Test 5: Generate Report..."
REPORT=$(curl -s -X POST http://localhost:4000/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "sales",
    "output_format": "json"
  }')

if echo "$REPORT" | jq -e '.data' >/dev/null; then
  echo "${GREEN}✅ Report generated${NC}"
else
  echo "${RED}❌ Report generation failed${NC}"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║       ✅ ALL TESTS COMPLETED! ✅                     ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
```

---

## EXECUTION INSTRUCTIONS

1. Copy this entire prompt
2. Paste into your AI assistant or code generator
3. Run the generated setup script:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```
4. Run the test script:
   ```bash
   chmod +x scripts/test-all.sh
   ./scripts/test-all.sh
   ```
5. Access the application at http://localhost:3000

---

## OUTPUT EXPECTATIONS

After running this prompt, you should have:

✅ Complete project structure
✅ All database models (Prisma schema)
✅ 50+ API endpoints
✅ 15+ frontend pages
✅ Real-time Socket.IO integration
✅ AI-powered features
✅ Sample data (200+ records)
✅ Automated tests
✅ Production build configuration
✅ Docker setup (optional)

---

## VALIDATION

Run validation script to ensure everything works:

```bash
npm run validate

# Checks:
# ✅ Database connection
# ✅ All tables exist
# ✅ Sample data present
# ✅ APIs responding
# ✅ Frontend building
# ✅ Tests passing
```

---

🎊 END OF AUTOMATION PROMPT 🎊

Copy everything above this line and use it to generate your complete Nova CRM system!
```

---

📄 **File:** `/AUTOMATION-PROMPT.md`  
🎯 **Purpose:** Master automation prompt for generating complete system  
⏱️ **Generation Time:** Instant (copy-paste ready)  
✅ **Output:** Complete, production-ready CRM system
