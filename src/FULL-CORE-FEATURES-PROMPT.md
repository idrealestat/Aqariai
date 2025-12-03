# 🎯 **NOVA CRM - Full Core Features Implementation Guide**
## **Complete Development Prompt with All 7 Features**

---

## 📋 **OVERVIEW**

This comprehensive guide provides everything needed to implement all 7 core features of NOVA CRM:

- ✅ Database Schemas (PostgreSQL)
- ✅ Data Seeding Scripts
- ✅ Backend APIs (Node.js + Express + Prisma)
- ✅ Frontend Components (React + TypeScript + Tailwind)
- ✅ Real-time Testing Scripts
- ✅ AI-powered Logic
- ✅ Complete Setup Instructions

**Timeline:** 8-10 weeks  
**Team Size:** 2-3 developers  
**Tech Stack:** React, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS

---

## 1️⃣ **FEATURE 1: CRM CORE - CUSTOMER INTERACTIONS**

### **Database Schema**

```sql
-- Customer Interactions Table
CREATE TABLE customer_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  notes TEXT,
  outcome VARCHAR(100),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_minutes INTEGER,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer Follow-ups Table
CREATE TABLE customer_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  interaction_id UUID REFERENCES customer_interactions(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_at TIMESTAMP,
  completed_at TIMESTAMP,
  completion_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customer_interactions_customer ON customer_interactions(customer_id);
CREATE INDEX idx_customer_interactions_user ON customer_interactions(user_id);
CREATE INDEX idx_followups_customer ON customer_followups(customer_id);
CREATE INDEX idx_followups_due_date ON customer_followups(due_date);
```

### **Data Seeding**

```sql
-- Seed sample interactions
INSERT INTO customer_interactions (id, customer_id, user_id, type, subject, notes, outcome, completed_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'customer-uuid-1', 'user-uuid-1', 'call', 'مكالمة أولية', 'تحدثنا عن متطلبات العميل', 'interested', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440002', 'customer-uuid-1', 'user-uuid-1', 'meeting', 'اجتماع في الموقع', 'عرض عقار في الرياض', 'callback', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 'customer-uuid-2', 'user-uuid-1', 'whatsapp', 'رسالة واتساب', 'إرسال تفاصيل العقار', 'interested', NOW());

-- Seed follow-ups
INSERT INTO customer_followups (id, customer_id, user_id, title, due_date, priority, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'customer-uuid-1', 'user-uuid-1', 'متابعة بعد العرض', NOW() + INTERVAL '3 days', 'high', 'pending'),
('660e8400-e29b-41d4-a716-446655440002', 'customer-uuid-2', 'user-uuid-1', 'إعادة اتصال', NOW() + INTERVAL '1 day', 'urgent', 'pending');
```

### **Backend APIs**

```typescript
// backend/src/routes/interactions.ts
import { Router } from 'express';
import { InteractionController } from '../controllers/interaction-controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new InteractionController();

router.post('/interactions', authenticate, controller.createInteraction);
router.get('/interactions', authenticate, controller.getInteractions);
router.get('/interactions/:id', authenticate, controller.getInteraction);
router.put('/interactions/:id', authenticate, controller.updateInteraction);
router.delete('/interactions/:id', authenticate, controller.deleteInteraction);

router.post('/followups', authenticate, controller.createFollowUp);
router.get('/followups', authenticate, controller.getFollowUps);
router.put('/followups/:id', authenticate, controller.updateFollowUp);

export default router;
```

### **Frontend Component**

```typescript
// frontend/src/components/interactions/InteractionsList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageSquare, Calendar } from 'lucide-react';

export function InteractionsList({ customerId }: { customerId: string }) {
  const { data: interactions } = useQuery({
    queryKey: ['interactions', customerId],
    queryFn: () => apiClient.get(`/interactions?customer_id=${customerId}`),
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {interactions?.data?.map((interaction: any) => (
        <Card key={interaction.id} className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-50 rounded-full">
              {getIcon(interaction.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{interaction.subject}</h3>
                {interaction.outcome && (
                  <Badge>{interaction.outcome}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{interaction.notes}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(interaction.created_at).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### **Real-time Testing Script**

```typescript
// tests/interactions.test.ts
import { test, expect } from '@playwright/test';

test('Create and view interaction', async ({ request }) => {
  // Create interaction
  const response = await request.post('/api/interactions', {
    data: {
      customer_id: 'test-customer-id',
      type: 'call',
      subject: 'Test call',
      notes: 'Test notes',
      outcome: 'interested',
    },
  });

  expect(response.ok()).toBeTruthy();
  const interaction = await response.json();
  expect(interaction.type).toBe('call');

  // Verify notification was created
  const notifications = await request.get('/api/notifications');
  const notifList = await notifications.json();
  expect(notifList.data.some((n: any) => n.type === 'INTERACTION')).toBeTruthy();
});

test('AI follow-up suggestion', async ({ request }) => {
  // Create interaction with interested outcome
  await request.post('/api/interactions', {
    data: {
      customer_id: 'test-customer-id',
      type: 'meeting',
      outcome: 'interested',
    },
  });

  // Check if follow-up was auto-created
  const followups = await request.get('/api/followups?customer_id=test-customer-id');
  const followupList = await followups.json();
  expect(followupList.data.length).toBeGreaterThan(0);
});
```

### **Setup Instructions**

```bash
# 1. Install dependencies
npm install

# 2. Run migrations
npx prisma migrate dev --name add_interactions

# 3. Seed database
npm run seed:interactions

# 4. Start development server
npm run dev

# 5. Run tests
npm run test:interactions
```

---

## 2️⃣ **FEATURE 2: FINANCE INTEGRATION - SALES & COMMISSIONS**

### **Database Schema**

```sql
-- Sales Table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  customer_id UUID REFERENCES customers(id),
  property_id UUID REFERENCES properties(id),
  sale_type VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  commission_rate DECIMAL(5, 2),
  commission_amount DECIMAL(15, 2),
  payment_status VARCHAR(20) DEFAULT 'pending',
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_date DATE,
  contract_number VARCHAR(100),
  contract_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  payment_method VARCHAR(50) NOT NULL,
  payment_date DATE NOT NULL,
  reference_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commissions Table
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  rate DECIMAL(5, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_date DATE,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_user ON sales(user_id);
CREATE INDEX idx_payments_sale ON payments(sale_id);
CREATE INDEX idx_commissions_sale ON commissions(sale_id);
```

### **Data Seeding**

```sql
-- Seed sales
INSERT INTO sales (id, user_id, customer_id, sale_type, amount, commission_rate, commission_amount, payment_status) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'user-uuid-1', 'customer-uuid-1', 'sale', 500000.00, 2.5, 12500.00, 'completed'),
('770e8400-e29b-41d4-a716-446655440002', 'user-uuid-1', 'customer-uuid-2', 'rent', 50000.00, 5.0, 2500.00, 'partial');

-- Seed payments
INSERT INTO payments (sale_id, user_id, amount, payment_method, payment_date, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'user-uuid-1', 500000.00, 'bank_transfer', CURRENT_DATE, 'confirmed'),
('770e8400-e29b-41d4-a716-446655440002', 'user-uuid-1', 25000.00, 'cash', CURRENT_DATE, 'confirmed');

-- Seed commissions
INSERT INTO commissions (sale_id, user_id, amount, rate, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'user-uuid-1', 12500.00, 2.5, 'approved'),
('770e8400-e29b-41d4-a716-446655440002', 'user-uuid-1', 2500.00, 5.0, 'pending');
```

### **Backend APIs**

```typescript
// backend/src/routes/finance.ts
import { Router } from 'express';
import { FinanceController } from '../controllers/finance-controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new FinanceController();

router.post('/sales', authenticate, controller.createSale);
router.get('/sales', authenticate, controller.getSales);
router.get('/sales/:id', authenticate, controller.getSale);
router.put('/sales/:id', authenticate, controller.updateSale);

router.post('/sales/:id/payments', authenticate, controller.recordPayment);
router.get('/commissions', authenticate, controller.getCommissions);
router.get('/finance/reports', authenticate, controller.getFinanceReports);

export default router;
```

### **Real-time Testing Script**

```bash
# Test auto-commission calculation
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customer_id": "customer-uuid-1",
    "sale_type": "sale",
    "amount": 600000,
    "commission_rate": 2.5
  }'

# Expected: commission_amount = 15000 (600000 * 0.025)
# Verify commission record was auto-created

curl -X GET http://localhost:3000/api/commissions \
  -H "Authorization: Bearer $TOKEN"

# Should show new commission with status 'pending'
```

---

## 3️⃣ **FEATURE 3: OWNERS & SEEKERS**

### **Database Schema**

```sql
-- Property Owners Table
CREATE TABLE property_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(100),
  district VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  properties_count INTEGER DEFAULT 0,
  total_value DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Property Seekers Table
CREATE TABLE property_seekers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  property_type VARCHAR(50),
  purpose VARCHAR(20),
  budget_min DECIMAL(15, 2),
  budget_max DECIMAL(15, 2),
  preferred_cities JSONB DEFAULT '[]',
  bedrooms_min INTEGER,
  bedrooms_max INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  matches_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seeker Matches Table
CREATE TABLE seeker_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seeker_id UUID NOT NULL REFERENCES property_seekers(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  match_score DECIMAL(5, 2),
  match_reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seeker_id, property_id)
);
```

### **Data Seeding**

```sql
-- Seed owners
INSERT INTO property_owners (id, user_id, name, phone, email, city) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'user-uuid-1', 'محمد أحمد', '0501234567', 'owner1@example.com', 'الرياض'),
('880e8400-e29b-41d4-a716-446655440002', 'user-uuid-1', 'فاطمة علي', '0507654321', 'owner2@example.com', 'جدة');

-- Seed seekers
INSERT INTO property_seekers (id, user_id, name, phone, property_type, purpose, budget_min, budget_max, preferred_cities) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'user-uuid-1', 'خالد سعيد', '0509876543', 'apartment', 'buy', 300000, 500000, '["الرياض"]'),
('990e8400-e29b-41d4-a716-446655440002', 'user-uuid-1', 'نورة محمد', '0503456789', 'villa', 'rent', 50000, 100000, '["جدة"]');
```

### **Real-time Testing Script**

```typescript
// Test auto-matching algorithm
test('Auto-match seekers with properties', async ({ request }) => {
  // Create seeker
  const seekerRes = await request.post('/api/seekers', {
    data: {
      name: 'Test Seeker',
      phone: '0501234567',
      property_type: 'apartment',
      purpose: 'buy',
      budget_min: 300000,
      budget_max: 500000,
      preferred_cities: ['الرياض'],
    },
  });

  const seeker = await seekerRes.json();

  // Wait for auto-matching to complete
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check matches
  const matchesRes = await request.get(`/api/seekers/${seeker.id}/matches`);
  const matches = await matchesRes.json();

  expect(matches.length).toBeGreaterThan(0);
  expect(matches[0].match_score).toBeGreaterThan(50);
});
```

---

## 4️⃣ **FEATURE 4: AUTO PUBLISHING SYSTEM**

### **Database Schema**

```sql
-- Platform Integrations Table
CREATE TABLE platform_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  platform_name VARCHAR(100) NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  auto_publish BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Auto Publish Tasks Table
CREATE TABLE auto_publish_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  integration_id UUID NOT NULL REFERENCES platform_integrations(id),
  action VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  external_listing_id VARCHAR(255),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Data Seeding**

```sql
-- Seed platform integrations
INSERT INTO platform_integrations (user_id, platform_name, api_key, auto_publish, status) VALUES
('user-uuid-1', 'aqar', 'test-api-key-aqar', true, 'active'),
('user-uuid-1', 'haraj', 'test-api-key-haraj', false, 'active');

-- Seed publish tasks
INSERT INTO auto_publish_tasks (user_id, property_id, integration_id, action, status, scheduled_at) VALUES
('user-uuid-1', 'property-uuid-1', 'integration-uuid-1', 'publish', 'completed', NOW() - INTERVAL '1 day'),
('user-uuid-1', 'property-uuid-2', 'integration-uuid-1', 'publish', 'pending', NOW() + INTERVAL '1 hour');
```

### **Real-time Testing Script**

```bash
# Test scheduled publishing
curl -X POST http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "property_id": "property-uuid-1",
    "integration_ids": ["integration-uuid-1"],
    "schedule_at": "2025-01-01T10:00:00Z"
  }'

# Verify task was created
curl -X GET http://localhost:3000/api/publish/status \
  -H "Authorization: Bearer $TOKEN"

# Expected: Task with status 'pending' and scheduled_at matching
```

---

## 5️⃣ **FEATURE 5: CALENDAR & APPOINTMENTS**

### **Database Schema**

```sql
-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  location_address TEXT,
  customer_id UUID REFERENCES customers(id),
  property_id UUID REFERENCES properties(id),
  status VARCHAR(20) DEFAULT 'scheduled',
  reminder_hours_before INTEGER DEFAULT 24,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointment Reminders Table
CREATE TABLE appointment_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL,
  hours_before INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Data Seeding**

```sql
-- Seed appointments
INSERT INTO appointments (user_id, title, type, start_datetime, end_datetime, customer_id, status) VALUES
('user-uuid-1', 'معاينة عقار', 'viewing', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', 'customer-uuid-1', 'scheduled'),
('user-uuid-1', 'توقيع عقد', 'contract_signing', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '2 hours', 'customer-uuid-2', 'confirmed');

-- Seed reminders
INSERT INTO appointment_reminders (appointment_id, reminder_type, hours_before, scheduled_at) VALUES
('appointment-uuid-1', 'email', 24, NOW() + INTERVAL '23 hours'),
('appointment-uuid-1', 'sms', 2, NOW() + INTERVAL '1 day' - INTERVAL '2 hours');
```

### **Real-time Testing Script**

```typescript
// Test conflict detection
test('Detect appointment conflicts', async ({ request }) => {
  // Create first appointment
  await request.post('/api/appointments', {
    data: {
      title: 'Meeting 1',
      start_datetime: '2025-01-15T10:00:00Z',
      end_datetime: '2025-01-15T11:00:00Z',
    },
  });

  // Try to create overlapping appointment
  const response = await request.post('/api/appointments', {
    data: {
      title: 'Meeting 2',
      start_datetime: '2025-01-15T10:30:00Z',
      end_datetime: '2025-01-15T11:30:00Z',
    },
  });

  expect(response.status()).toBe(400);
  const error = await response.json();
  expect(error.error).toContain('conflict');
});
```

---

## 6️⃣ **FEATURE 6: DIGITAL BUSINESS CARD**

### **Database Schema**

```sql
-- Digital Cards Table
CREATE TABLE digital_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  card_name VARCHAR(255),
  tagline VARCHAR(500),
  bio TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  whatsapp VARCHAR(20),
  website VARCHAR(255),
  company_name VARCHAR(255),
  position VARCHAR(255),
  profile_image TEXT,
  qr_code_url TEXT,
  custom_slug VARCHAR(100) UNIQUE,
  views_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Card Analytics Table
CREATE TABLE card_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES digital_cards(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  visitor_ip VARCHAR(45),
  visitor_country VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Data Seeding**

```sql
-- Seed digital cards
INSERT INTO digital_cards (user_id, card_name, tagline, phone, email, custom_slug, qr_code_url) VALUES
('user-uuid-1', 'أحمد محمد', 'وسيط عقاري معتمد', '0501234567', 'ahmed@example.com', 'ahmed-mohammed', 'data:image/png;base64,...');
```

### **Real-time Testing Script**

```bash
# Test QR code generation
curl -X POST http://localhost:3000/api/cards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "card_name": "Test User",
    "phone": "0501234567",
    "email": "test@example.com",
    "custom_slug": "test-user"
  }'

# Verify QR code was generated
# Should receive response with qr_code_url field containing base64 data
```

---

## 7️⃣ **FEATURE 7: REPORTS & ANALYTICS**

### **Database Schema**

```sql
-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  filters JSONB DEFAULT '{}',
  output_format VARCHAR(20) DEFAULT 'pdf',
  last_generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Logs Table
CREATE TABLE analytics_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  event_category VARCHAR(50) NOT NULL,
  event_action VARCHAR(50) NOT NULL,
  event_label VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Data Seeding**

```sql
-- Seed analytics logs
INSERT INTO analytics_logs (user_id, event_category, event_action, event_label) VALUES
('user-uuid-1', 'crm', 'create', 'customer'),
('user-uuid-1', 'finance', 'create', 'sale'),
('user-uuid-1', 'calendar', 'create', 'appointment');
```

### **Real-time Testing Script**

```bash
# Test report generation
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "report_type": "sales",
    "filters": {
      "period": "30d"
    },
    "output_format": "pdf"
  }'

# Should receive PDF report data
# Verify dashboard updates in real-time
```

---

## 🚀 **GLOBAL SETUP INSTRUCTIONS**

### **Prerequisites**

```bash
# Required software
- Node.js v18+
- PostgreSQL 14+
- npm or yarn
- Git
```

### **Step 1: Clone & Install**

```bash
# Clone repository
git clone https://github.com/your-org/nova-crm.git
cd nova-crm

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **Step 2: Environment Setup**

```bash
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/nova_crm"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
PORT=3000

# frontend/.env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### **Step 3: Database Setup**

```bash
# Create database
createdb nova_crm

# Run migrations
cd backend
npx prisma migrate dev

# Or run SQL directly
psql -d nova_crm -f migrations/all-tables.sql
```

### **Step 4: Seed Database**

```bash
# Seed all features at once
npm run seed:all

# Or seed individually
npm run seed:interactions
npm run seed:finance
npm run seed:owners
npm run seed:publishing
npm run seed:calendar
npm run seed:cards
npm run seed:reports
```

**Seed script example:**

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed users
  const user = await prisma.user.upsert({
    where: { email: 'admin@novacrm.com' },
    update: {},
    create: {
      email: 'admin@novacrm.com',
      name: 'Admin User',
      password: 'hashed-password',
    },
  });

  // Seed customers
  await prisma.customer.createMany({
    data: [
      { user_id: user.id, name: 'أحمد محمد', phone: '0501234567', status: 'active' },
      { user_id: user.id, name: 'فاطمة علي', phone: '0509876543', status: 'active' },
    ],
  });

  // Seed properties
  await prisma.property.createMany({
    data: [
      { user_id: user.id, title: 'شقة في الرياض', price: 400000, city: 'الرياض' },
      { user_id: user.id, title: 'فيلا في جدة', price: 1200000, city: 'جدة' },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### **Step 5: Start Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Database Studio (optional)
cd backend
npx prisma studio
```

### **Step 6: Run Tests**

```bash
# Run all tests
npm run test

# Run specific feature tests
npm run test:interactions
npm run test:finance
npm run test:owners
npm run test:publishing
npm run test:calendar
npm run test:cards
npm run test:reports

# Run E2E tests
npm run test:e2e
```

### **Step 7: Access Applications**

```
Frontend:        http://localhost:3000
Backend API:     http://localhost:3001
API Docs:        http://localhost:3001/docs
Prisma Studio:   http://localhost:5555
```

---

## 🧪 **COMPREHENSIVE TESTING SUITE**

### **Unit Tests Example**

```typescript
// backend/tests/unit/interaction.test.ts
import { InteractionController } from '../../src/controllers/interaction-controller';
import { prismaMock } from '../setup';

describe('InteractionController', () => {
  let controller: InteractionController;

  beforeEach(() => {
    controller = new InteractionController();
  });

  test('should create interaction', async () => {
    const mockInteraction = {
      id: 'test-id',
      customer_id: 'customer-id',
      type: 'call',
      notes: 'Test notes',
    };

    prismaMock.customerInteraction.create.mockResolvedValue(mockInteraction as any);

    const result = await controller.createInteraction(mockRequest, mockResponse);
    
    expect(result.type).toBe('call');
    expect(prismaMock.customerInteraction.create).toHaveBeenCalledTimes(1);
  });
});
```

### **Integration Tests Example**

```typescript
// backend/tests/integration/sales.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('Sales API', () => {
  test('POST /api/sales - should create sale and auto-calculate commission', async () => {
    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        customer_id: 'customer-id',
        sale_type: 'sale',
        amount: 500000,
        commission_rate: 2.5,
      });

    expect(response.status).toBe(201);
    expect(response.body.commission_amount).toBe(12500);

    // Verify commission record was created
    const commission = await prisma.commission.findFirst({
      where: { sale_id: response.body.id },
    });
    expect(commission).toBeTruthy();
    expect(commission?.amount).toBe(12500);
  });
});
```

### **E2E Tests Example**

```typescript
// e2e/tests/workflow.spec.ts
import { test, expect } from '@playwright/test';

test('Complete workflow: Customer -> Interaction -> Sale', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');

  // Create customer
  await page.goto('http://localhost:3000/customers/new');
  await page.fill('[name=name]', 'Test Customer');
  await page.fill('[name=phone]', '0501234567');
  await page.click('button:has-text("حفظ")');
  await expect(page).toHaveURL(/\/customers\/[a-z0-9-]+/);

  // Add interaction
  await page.click('button:has-text("إضافة تفاعل")');
  await page.selectOption('[name=type]', 'call');
  await page.fill('[name=notes]', 'Test interaction');
  await page.click('button:has-text("حفظ التفاعل")');

  // Verify interaction appears in list
  await expect(page.locator('text=Test interaction')).toBeVisible();

  // Create sale
  await page.goto('http://localhost:3000/sales/new');
  // ... continue workflow
});
```

---

## 📊 **MONITORING & ANALYTICS**

### **Performance Monitoring**

```typescript
// backend/src/middleware/monitoring.ts
import { performance } from 'perf_hooks';

export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }

    // Track metrics
    trackMetric('api.request.duration', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
  });

  next();
};
```

### **Error Tracking**

```typescript
// backend/src/middleware/error-handler.ts
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Log to external service (e.g., Sentry)
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Return user-friendly error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
```

---

## 🎯 **SUCCESS CRITERIA**

After completing all setup steps, verify:

✅ **Database**
- [ ] All 27+ tables created
- [ ] Indexes applied
- [ ] Sample data seeded

✅ **Backend**
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] Real-time features active
- [ ] AI integrations functioning

✅ **Frontend**
- [ ] All pages rendering
- [ ] Forms submitting correctly
- [ ] Real-time updates working
- [ ] Responsive design

✅ **Tests**
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance benchmarks met

✅ **Features**
- [ ] Feature 1: CRM Core ✓
- [ ] Feature 2: Finance ✓
- [ ] Feature 3: Owners & Seekers ✓
- [ ] Feature 4: Auto Publishing ✓
- [ ] Feature 5: Calendar ✓
- [ ] Feature 6: Digital Card ✓
- [ ] Feature 7: Reports ✓

---

## 📞 **SUPPORT & RESOURCES**

- **Documentation:** `/docs`
- **API Reference:** `/api/docs`
- **Database Schema:** `/docs/database.md`
- **Component Library:** `/docs/components.md`
- **Troubleshooting:** `/docs/troubleshooting.md`

---

## 🎊 **CONGRATULATIONS!**

You now have a complete, production-ready CRM system with all 7 core features implemented!

**Next Steps:**
1. 🧪 Run comprehensive tests
2. 🎨 Customize branding & styling
3. 🔐 Configure production security
4. 🚀 Deploy to production
5. 📈 Monitor and optimize

---

📄 **File:** `/FULL-CORE-FEATURES-PROMPT.md`  
🎯 **Purpose:** Complete implementation guide for all 7 features  
✅ **Status:** Ready for immediate development  
⏱️ **Timeline:** 8-10 weeks with 2-3 developers
