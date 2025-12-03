# 🔗 **INTEGRATION GUIDE - PART 2**
## **Real-Time Services + Testing + Deployment**

---

# 5️⃣ **REAL-TIME SERVICES**

## **Socket.IO Integration**

File: `backend/src/services/socket.service.ts`

```typescript
import { Server } from 'socket.io';
import { io } from '../server';

export class SocketService {
  
  // ============================================
  // EMIT EVENTS
  // ============================================
  
  // New customer notification
  static emitNewCustomer(userId: string, customer: any): void {
    io.to(`user:${userId}`).emit('customer:new', {
      type: 'customer_created',
      data: customer,
      timestamp: new Date(),
    });
  }

  // New sale notification
  static emitNewSale(userId: string, sale: any): void {
    io.to(`user:${userId}`).emit('sale:new', {
      type: 'sale_created',
      data: sale,
      timestamp: new Date(),
    });
  }

  // Property match found
  static emitPropertyMatch(userId: string, match: any): void {
    io.to(`user:${userId}`).emit('match:found', {
      type: 'property_matched',
      data: match,
      timestamp: new Date(),
    });
  }

  // Appointment reminder
  static emitAppointmentReminder(userId: string, appointment: any): void {
    io.to(`user:${userId}`).emit('appointment:reminder', {
      type: 'appointment_reminder',
      data: appointment,
      timestamp: new Date(),
    });
  }

  // Digital card scan
  static emitCardScan(userId: string, scan: any): void {
    io.to(`user:${userId}`).emit('card:scan', {
      type: 'card_scanned',
      data: scan,
      timestamp: new Date(),
    });
  }

  // Report generated
  static emitReportReady(userId: string, report: any): void {
    io.to(`user:${userId}`).emit('report:ready', {
      type: 'report_generated',
      data: report,
      timestamp: new Date(),
    });
  }

  // General notification
  static emitNotification(userId: string, notification: any): void {
    io.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date(),
    });
  }
}
```

## **Queue Service (Bull)**

File: `backend/src/services/queue.service.ts`

```typescript
import Queue from 'bull';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// ============================================
// QUEUE DEFINITIONS
// ============================================

export const emailQueue = new Queue('email', {
  redis: redisClient,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
  },
});

export const smsQueue = new Queue('sms', {
  redis: redisClient,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
  },
});

export const publishingQueue = new Queue('publishing', {
  redis: redisClient,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 5,
  },
});

export const matchingQueue = new Queue('matching', {
  redis: redisClient,
  defaultJobOptions: {
    removeOnComplete: 50,
    attempts: 3,
  },
});

export const reportQueue = new Queue('report', {
  redis: redisClient,
  defaultJobOptions: {
    removeOnComplete: 10,
    timeout: 60000, // 1 minute
  },
});

// ============================================
// QUEUE PROCESSORS
// ============================================

// Email processor
emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;
  console.log(`📧 Sending email to ${to}: ${subject}`);
  
  // Implement email sending logic (SendGrid, AWS SES, etc.)
  // await sendEmail(to, subject, body);
  
  return { sent: true, timestamp: new Date() };
});

// SMS processor
smsQueue.process(async (job) => {
  const { phone, message } = job.data;
  console.log(`📱 Sending SMS to ${phone}: ${message}`);
  
  // Implement SMS sending logic (Twilio, etc.)
  // await sendSMS(phone, message);
  
  return { sent: true, timestamp: new Date() };
});

// Publishing processor
publishingQueue.process(async (job) => {
  const { listingId, platform } = job.data;
  console.log(`📤 Publishing listing ${listingId} to ${platform}`);
  
  // Implement platform publishing logic
  // await publishToPlatform(listingId, platform);
  
  return { published: true, timestamp: new Date() };
});

// Matching processor
matchingQueue.process(async (job) => {
  const { seekerId } = job.data;
  console.log(`🔍 Running matching for seeker ${seekerId}`);
  
  // Implement matching logic
  // await runMatching(seekerId);
  
  return { matched: true, timestamp: new Date() };
});

// Report processor
reportQueue.process(async (job) => {
  const { reportId } = job.data;
  console.log(`📊 Generating report ${reportId}`);
  
  // Implement report generation
  // await generateReport(reportId);
  
  return { generated: true, timestamp: new Date() };
});

// ============================================
// QUEUE EVENTS
// ============================================

[emailQueue, smsQueue, publishingQueue, matchingQueue, reportQueue].forEach(
  (queue) => {
    queue.on('completed', (job, result) => {
      console.log(`✅ Job ${job.id} completed:`, result);
    });

    queue.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });
  }
);

console.log('✅ Queue service initialized');
```

---

# 6️⃣ **MODULE INTEGRATION**

## **Cross-Module Communication**

File: `backend/src/services/integration.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { SocketService } from './socket.service';
import { emailQueue, smsQueue, matchingQueue } from './queue.service';

export class IntegrationService {
  
  // ============================================
  // CRM → FINANCE
  // ============================================
  
  static async onCustomerCreated(customer: any): Promise<void> {
    console.log('🔗 CRM → Finance: Customer created');
    
    // Create potential revenue forecast
    if (customer.budget) {
      // Estimate potential commission
      const estimatedCommission = customer.budget * 0.025; // 2.5%
      
      console.log(`💰 Potential commission: ${estimatedCommission}`);
    }

    // Send welcome email
    await emailQueue.add({
      to: customer.email,
      subject: 'مرحباً بك في نوفا العقارية',
      body: `مرحباً ${customer.name}، نحن سعداء بخدمتك!`,
    });
  }

  // ============================================
  // FINANCE → CRM
  // ============================================
  
  static async onSaleCompleted(sale: any): Promise<void> {
    console.log('🔗 Finance → CRM: Sale completed');
    
    if (sale.customerId) {
      // Update customer status to 'closed'
      await prisma.customer.update({
        where: { id: sale.customerId },
        data: {
          status: 'closed',
          lastContactedAt: new Date(),
        },
      });

      // Create follow-up for post-sale service
      await prisma.customerFollowup.create({
        data: {
          customerId: sale.customerId,
          userId: sale.userId,
          title: 'متابعة بعد البيع',
          description: 'التواصل مع العميل للتأكد من الرضا',
          priority: 'medium',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    }

    // Notify user
    SocketService.emitNewSale(sale.userId, sale);
  }

  // ============================================
  // OWNERS & SEEKERS → CALENDAR
  // ============================================
  
  static async onMatchFound(match: any): Promise<void> {
    console.log('🔗 Match → Calendar: Property matched');
    
    // Notify user
    SocketService.emitPropertyMatch(match.userId, match);

    // Send notification to seeker
    if (match.seeker?.phone) {
      await smsQueue.add({
        phone: match.seeker.phone,
        message: `تم العثور على عقار مطابق لمتطلباتك! ${match.property?.title}`,
      });
    }

    // Auto-schedule viewing appointment (optional)
    if (match.autoSchedule) {
      const viewingDate = new Date();
      viewingDate.setDate(viewingDate.getDate() + 2); // 2 days from now
      viewingDate.setHours(10, 0, 0, 0);

      await prisma.appointment.create({
        data: {
          userId: match.userId,
          seekerId: match.seekerId,
          propertyId: match.propertyId,
          title: `معاينة ${match.property?.title}`,
          type: 'viewing',
          startDatetime: viewingDate,
          endDatetime: new Date(viewingDate.getTime() + 60 * 60 * 1000), // 1 hour
          reminderEnabled: true,
        },
      });
    }
  }

  // ============================================
  // CALENDAR → CRM
  // ============================================
  
  static async onAppointmentCompleted(appointment: any): Promise<void> {
    console.log('🔗 Calendar → CRM: Appointment completed');
    
    if (appointment.customerId) {
      // Create interaction record
      await prisma.customerInteraction.create({
        data: {
          customerId: appointment.customerId,
          userId: appointment.userId,
          type: appointment.type,
          title: appointment.title,
          notes: appointment.outcomeNotes,
          outcome: appointment.outcome,
          interactionDate: appointment.completedAt,
        },
      });

      // Update last contacted
      await prisma.customer.update({
        where: { id: appointment.customerId },
        data: { lastContactedAt: appointment.completedAt },
      });
    }

    // If outcome is positive, create sales opportunity
    if (appointment.outcome === 'interested' && appointment.propertyId) {
      console.log('💡 Creating sales opportunity');
    }
  }

  // ============================================
  // DIGITAL CARDS → CRM
  // ============================================
  
  static async onCardScanned(scan: any): Promise<void> {
    console.log('🔗 Digital Card → CRM: Card scanned');
    
    const card = await prisma.digitalCard.findUnique({
      where: { id: scan.cardId },
    });

    if (!card) return;

    // Notify card owner
    SocketService.emitCardScan(card.userId, scan);

    // If scan includes contact info, create lead
    if (scan.contactInfo) {
      await prisma.customer.create({
        data: {
          userId: card.userId,
          name: scan.contactInfo.name,
          phone: scan.contactInfo.phone,
          email: scan.contactInfo.email,
          status: 'lead',
          source: 'digital_card',
        },
      });
    }
  }

  // ============================================
  // AUTO-PUBLISHING → REPORTS
  // ============================================
  
  static async onPublishingCompleted(listing: any): Promise<void> {
    console.log('🔗 Publishing → Reports: Listing published');
    
    // Track in analytics
    await prisma.analyticsSnapshot.updateMany({
      where: {
        userId: listing.userId,
        snapshotDate: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      data: {
        // Update relevant metrics
      },
    });
  }

  // ============================================
  // REPORTS → ALL MODULES
  // ============================================
  
  static async onReportGenerated(report: any): Promise<void> {
    console.log('🔗 Reports: Report generated');
    
    // Notify user
    SocketService.emitReportReady(report.userId, report);

    // Send email with report link
    const user = await prisma.user.findUnique({
      where: { id: report.userId },
    });

    if (user?.email) {
      await emailQueue.add({
        to: user.email,
        subject: `تقرير ${report.title} جاهز`,
        body: `تم إنشاء تقريرك بنجاح. يمكنك تحميله من لوحة التحكم.`,
      });
    }
  }
}
```

---

# 7️⃣ **ENVIRONMENT CONFIGURATION**

## **Package.json Scripts**

File: `backend/package.json`

```json
{
  "name": "nova-crm-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed:all": "ts-node prisma/seeds/index.ts",
    "seed:users": "ts-node prisma/seeds/users.seed.ts",
    "seed:crm": "ts-node prisma/seeds/crm.seed.ts",
    "seed:finance": "ts-node prisma/seeds/finance.seed.ts",
    "seed:owners": "ts-node prisma/seeds/owners-seekers.seed.ts",
    "seed:publishing": "ts-node prisma/seeds/publishing.seed.ts",
    "seed:calendar": "ts-node prisma/seeds/calendar-appointments.seed.ts",
    "seed:cards": "ts-node prisma/seeds/digital-cards.seed.ts",
    "seed:reports": "ts-node prisma/seeds/reports-analytics.seed.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "express": "^4.18.2",
    "socket.io": "^4.6.0",
    "bull": "^4.12.0",
    "ioredis": "^5.3.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "zod": "^3.22.4",
    "date-fns": "^2.30.0",
    "qrcode": "^1.5.3",
    "pdfkit": "^0.14.0",
    "exceljs": "^4.4.0",
    "csv-writer": "^1.6.0",
    "node-cron": "^3.0.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.4",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "prisma": "^5.7.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
```

## **Master Seed Script**

File: `backend/prisma/seeds/index.ts`

```typescript
import { seedUsers } from './users.seed';
import { seedCRM } from './crm.seed';
import { seedFinance } from './finance.seed';
import { seedOwnersSeekers } from './owners-seekers.seed';
import { seedPublishing } from './publishing.seed';
import { seedCalendarAppointments } from './calendar-appointments.seed';
import { seedDigitalCards } from './digital-cards.seed';
import { seedReportsAnalytics } from './reports-analytics.seed';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║         NOVA CRM - COMPLETE DATABASE SEEDING          ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Seed in order (respecting dependencies)
    await seedUsers();
    await seedCRM();
    await seedFinance();
    await seedOwnersSeekers();
    await seedPublishing();
    await seedCalendarAppointments();
    await seedDigitalCards();
    await seedReportsAnalytics();

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║         ✨ ALL SEEDING COMPLETE! ✨                   ║');
    console.log('║                                                       ║');
    console.log('║  🎯 Database ready for development                    ║');
    console.log('║  👤 Demo user: demo@novacrm.com / Demo@123           ║');
    console.log('║  🚀 Start server: npm run dev                         ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
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

---

# 8️⃣ **TESTING STRATEGY**

## **Integration Test**

File: `backend/tests/integration.test.ts`

```typescript
import request from 'supertest';
import { app } from '../src/server';
import { prisma } from '../src/lib/prisma';

describe('Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'demo@novacrm.com',
        password: 'Demo@123',
      });

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  describe('CRM → Finance Integration', () => {
    it('should create customer and track in analytics', async () => {
      // Create customer
      const customerRes = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Customer',
          phone: '+966501234567',
          email: 'test@example.com',
          budget: 500000,
        });

      expect(customerRes.status).toBe(201);

      // Check analytics updated
      const analytics = await prisma.analyticsSnapshot.findFirst({
        where: { userId },
      });

      expect(analytics).toBeTruthy();
    });
  });

  describe('Owners & Seekers → Calendar Integration', () => {
    it('should match property and create appointment', async () => {
      // Implementation
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
```

---

**(يتبع...)**

📄 **File:** `/INTEGRATION-GUIDE-PART-2.md`  
🎯 **Next:** Deployment + Quick Start Guide
