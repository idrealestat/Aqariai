# 🔗 **INTEGRATION PACKAGE - PART 2**
## **Real-Time + API Gateway + Database Consistency**

---

# 2️⃣ **REAL-TIME DATA FLOW**

## **Socket.IO Event Orchestrator**

File: `backend/src/socket/event-orchestrator.ts`

```typescript
import { Server, Socket } from 'socket.io';
import { IntegrationMasterService } from '../services/integration-master.service';

/**
 * Real-Time Event Orchestrator
 * Manages all WebSocket events across features
 */
export class EventOrchestrator {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // ============================================
  // EVENT EMITTERS (Backend → Frontend)
  // ============================================

  // CRM Events
  emitCustomerCreated(userId: string, customer: any): void {
    this.io.to(`user:${userId}`).emit('crm:customer:created', {
      type: 'customer_created',
      data: customer,
      timestamp: new Date(),
    });
  }

  emitCustomerUpdated(userId: string, customer: any): void {
    this.io.to(`user:${userId}`).emit('crm:customer:updated', {
      type: 'customer_updated',
      data: customer,
      timestamp: new Date(),
    });
  }

  emitFollowupDue(userId: string, followup: any): void {
    this.io.to(`user:${userId}`).emit('crm:followup:due', {
      type: 'followup_due',
      data: followup,
      timestamp: new Date(),
    });
  }

  // Finance Events
  emitSaleCreated(userId: string, sale: any): void {
    this.io.to(`user:${userId}`).emit('finance:sale:created', {
      type: 'sale_created',
      data: sale,
      timestamp: new Date(),
    });
  }

  emitPaymentReceived(userId: string, payment: any): void {
    this.io.to(`user:${userId}`).emit('finance:payment:received', {
      type: 'payment_received',
      data: payment,
      timestamp: new Date(),
    });
  }

  emitCommissionCalculated(userId: string, commission: any): void {
    this.io.to(`user:${userId}`).emit('finance:commission:calculated', {
      type: 'commission_calculated',
      data: commission,
      timestamp: new Date(),
    });
  }

  // Owners & Seekers Events
  emitPropertyAdded(userId: string, property: any): void {
    this.io.to(`user:${userId}`).emit('owners:property:added', {
      type: 'property_added',
      data: property,
      timestamp: new Date(),
    });
  }

  emitMatchFound(userId: string, match: any): void {
    this.io.to(`user:${userId}`).emit('owners:match:found', {
      type: 'match_found',
      data: match,
      timestamp: new Date(),
    });
  }

  // Auto-Publishing Events
  emitPublishingStarted(userId: string, listing: any): void {
    this.io.to(`user:${userId}`).emit('publishing:started', {
      type: 'publishing_started',
      data: listing,
      timestamp: new Date(),
    });
  }

  emitPublishingCompleted(userId: string, listing: any): void {
    this.io.to(`user:${userId}`).emit('publishing:completed', {
      type: 'publishing_completed',
      data: listing,
      timestamp: new Date(),
    });
  }

  emitPublishingFailed(userId: string, error: any): void {
    this.io.to(`user:${userId}`).emit('publishing:failed', {
      type: 'publishing_failed',
      data: error,
      timestamp: new Date(),
    });
  }

  // Calendar Events
  emitAppointmentReminder(userId: string, appointment: any): void {
    this.io.to(`user:${userId}`).emit('calendar:reminder', {
      type: 'appointment_reminder',
      data: appointment,
      timestamp: new Date(),
    });
  }

  emitAppointmentCompleted(userId: string, appointment: any): void {
    this.io.to(`user:${userId}`).emit('calendar:appointment:completed', {
      type: 'appointment_completed',
      data: appointment,
      timestamp: new Date(),
    });
  }

  // Digital Cards Events
  emitCardScanned(userId: string, scan: any): void {
    this.io.to(`user:${userId}`).emit('card:scanned', {
      type: 'card_scanned',
      data: scan,
      timestamp: new Date(),
    });
  }

  emitCardAnalyticsUpdated(userId: string, analytics: any): void {
    this.io.to(`user:${userId}`).emit('card:analytics:updated', {
      type: 'card_analytics_updated',
      data: analytics,
      timestamp: new Date(),
    });
  }

  // Reports Events
  emitReportGenerated(userId: string, report: any): void {
    this.io.to(`user:${userId}`).emit('reports:generated', {
      type: 'report_generated',
      data: report,
      timestamp: new Date(),
    });
  }

  emitDashboardUpdated(userId: string, dashboard: any): void {
    this.io.to(`user:${userId}`).emit('reports:dashboard:updated', {
      type: 'dashboard_updated',
      data: dashboard,
      timestamp: new Date(),
    });
  }

  // ============================================
  // EVENT LISTENERS (Frontend → Backend)
  // ============================================

  setupEventListeners(socket: Socket): void {
    const userId = socket.data.user?.id;
    if (!userId) return;

    // Subscribe to real-time updates
    socket.on('subscribe:dashboard', async () => {
      socket.join(`dashboard:${userId}`);
      
      // Send initial data
      const dashboard = await this.getDashboardData(userId);
      socket.emit('dashboard:initial', dashboard);
    });

    // Request real-time analytics
    socket.on('subscribe:analytics', async () => {
      socket.join(`analytics:${userId}`);
      
      const analytics = await this.getAnalyticsData(userId);
      socket.emit('analytics:initial', analytics);
    });

    // Request notifications
    socket.on('subscribe:notifications', async () => {
      socket.join(`notifications:${userId}`);
      
      const notifications = await this.getRecentNotifications(userId);
      socket.emit('notifications:initial', notifications);
    });
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private async getDashboardData(userId: string): Promise<any> {
    // Fetch real-time dashboard data
    // Implementation from Reports feature
    return {};
  }

  private async getAnalyticsData(userId: string): Promise<any> {
    // Fetch real-time analytics
    return {};
  }

  private async getRecentNotifications(userId: string): Promise<any[]> {
    // Fetch recent notifications
    return [];
  }
}
```

## **Queue Event Handlers**

File: `backend/src/queues/event-handlers.ts`

```typescript
import {
  emailQueue,
  smsQueue,
  publishingQueue,
  matchingQueue,
  reportQueue,
} from '../services/queue.service';
import { IntegrationMasterService } from '../services/integration-master.service';
import { EventOrchestrator } from '../socket/event-orchestrator';

/**
 * Queue Event Handlers
 * Process background jobs and trigger integrations
 */

// ============================================
// EMAIL QUEUE
// ============================================

emailQueue.process(async (job) => {
  const { to, subject, body, userId } = job.data;
  
  console.log(`📧 Sending email to ${to}: ${subject}`);
  
  // Send email implementation
  // await sendEmail(to, subject, body);
  
  return { sent: true, timestamp: new Date() };
});

// ============================================
// SMS QUEUE
// ============================================

smsQueue.process(async (job) => {
  const { phone, message, userId } = job.data;
  
  console.log(`📱 Sending SMS to ${phone}: ${message}`);
  
  // Send SMS implementation
  // await sendSMS(phone, message);
  
  return { sent: true, timestamp: new Date() };
});

// ============================================
// PUBLISHING QUEUE
// ============================================

publishingQueue.process(async (job) => {
  const { listingId, platform, userId } = job.data;
  
  console.log(`📤 Publishing listing ${listingId} to ${platform}`);
  
  try {
    // Emit publishing started event
    const eventOrchestrator = new EventOrchestrator(io);
    eventOrchestrator.emitPublishingStarted(userId, { listingId, platform });

    // Publish to platform implementation
    // await publishToPlatform(listingId, platform);

    // Update listing status
    await prisma.publishedListing.update({
      where: { id: listingId },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    });

    // Emit completion event
    eventOrchestrator.emitPublishingCompleted(userId, { listingId, platform });

    // Update analytics
    await IntegrationMasterService.onPublishingCompleted({
      userId,
      listing: { id: listingId, platform },
    });

    return { published: true, timestamp: new Date() };
  } catch (error) {
    console.error('❌ Publishing failed:', error);
    
    // Emit failure event
    const eventOrchestrator = new EventOrchestrator(io);
    eventOrchestrator.emitPublishingFailed(userId, {
      listingId,
      platform,
      error: error.message,
    });

    throw error;
  }
});

// ============================================
// MATCHING QUEUE
// ============================================

matchingQueue.process(async (job) => {
  const { seekerId, userId } = job.data;
  
  console.log(`🔍 Running matching for seeker ${seekerId}`);
  
  // Run matching algorithm
  const matches = await runMatchingAlgorithm(seekerId);
  
  // Process each match
  for (const match of matches) {
    // Create match record
    await prisma.propertyMatch.create({
      data: {
        userId,
        seekerId,
        propertyId: match.propertyId,
        matchScore: match.score,
        status: 'pending',
      },
    });

    // Trigger integration
    await IntegrationMasterService.onPropertyMatched({
      userId,
      match,
    });
  }
  
  return { matched: matches.length, timestamp: new Date() };
});

// ============================================
// REPORT QUEUE
// ============================================

reportQueue.process(async (job) => {
  const { reportId, userId } = job.data;
  
  console.log(`📊 Generating report ${reportId}`);
  
  try {
    // Generate report implementation
    // await generateReport(reportId);

    // Update report status
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Emit event
    const eventOrchestrator = new EventOrchestrator(io);
    eventOrchestrator.emitReportGenerated(userId, { reportId });

    return { generated: true, timestamp: new Date() };
  } catch (error) {
    console.error('❌ Report generation failed:', error);
    throw error;
  }
});

// ============================================
// HELPER FUNCTION
// ============================================

async function runMatchingAlgorithm(seekerId: string): Promise<any[]> {
  // Matching algorithm implementation
  // Returns array of matches with scores
  return [];
}
```

---

# 3️⃣ **API GATEWAY**

## **Unified API Gateway Configuration**

File: `backend/src/gateway/api-gateway.ts`

```typescript
import express, { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { apiLimiter, authLimiter } from '../middleware/rate-limit.middleware';
import { checkBlockedIP } from '../services/ids.service';

/**
 * API Gateway
 * Centralized routing and middleware management
 */

const app = express();

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

app.use(checkBlockedIP); // Check if IP is blocked
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// FEATURE 1: CRM CORE
// ============================================

// Customers
app.post(
  '/api/crm/customers',
  authLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createCustomerSchema),
  CustomerController.create
);

app.get(
  '/api/crm/customers',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  CustomerController.list
);

app.get(
  '/api/crm/customers/:id',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  CustomerController.getById
);

app.put(
  '/api/crm/customers/:id',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(updateCustomerSchema),
  CustomerController.update
);

app.delete(
  '/api/crm/customers/:id',
  authLimiter,
  authenticate,
  authorize('admin'),
  CustomerController.delete
);

// Interactions
app.post(
  '/api/crm/interactions',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createInteractionSchema),
  InteractionController.create
);

// Follow-ups
app.post(
  '/api/crm/followups',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createFollowupSchema),
  FollowupController.create
);

// ============================================
// FEATURE 2: FINANCE
// ============================================

// Sales
app.post(
  '/api/finance/sales',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createSaleSchema),
  SaleController.create
);

app.get(
  '/api/finance/sales',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  SaleController.list
);

// Payments
app.post(
  '/api/finance/payments',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createPaymentSchema),
  PaymentController.create
);

// Commissions
app.get(
  '/api/finance/commissions',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  CommissionController.list
);

app.put(
  '/api/finance/commissions/:id/approve',
  authLimiter,
  authenticate,
  authorize('admin'),
  CommissionController.approve
);

// ============================================
// FEATURE 3: OWNERS & SEEKERS
// ============================================

// Property Owners
app.post(
  '/api/owners',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createOwnerSchema),
  OwnerController.create
);

// Properties
app.post(
  '/api/properties',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createPropertySchema),
  PropertyController.create
);

// Seekers
app.post(
  '/api/seekers',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createSeekerSchema),
  SeekerController.create
);

// Matching
app.post(
  '/api/matching/run',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  MatchingController.runMatching
);

// ============================================
// FEATURE 4: AUTO-PUBLISHING
// ============================================

// Published Listings
app.post(
  '/api/publishing/listings',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createListingSchema),
  PublishingController.createListing
);

app.post(
  '/api/publishing/listings/:id/publish',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  PublishingController.publishNow
);

// Schedules
app.post(
  '/api/publishing/schedules',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createScheduleSchema),
  PublishingController.createSchedule
);

// ============================================
// FEATURE 5: CALENDAR & APPOINTMENTS
// ============================================

// Appointments
app.post(
  '/api/calendar/appointments',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createAppointmentSchema),
  AppointmentController.create
);

app.get(
  '/api/calendar/appointments',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  AppointmentController.list
);

app.put(
  '/api/calendar/appointments/:id/complete',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  AppointmentController.markComplete
);

// ============================================
// FEATURE 6: DIGITAL CARDS
// ============================================

// Cards (Authenticated)
app.post(
  '/api/cards',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createCardSchema),
  CardController.create
);

app.get(
  '/api/cards',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  CardController.list
);

// Public endpoints (No auth required)
app.get(
  '/api/cards/public/:slug',
  apiLimiter,
  CardController.getPublic
);

app.post(
  '/api/cards/:id/scan',
  apiLimiter,
  CardController.recordScan
);

// ============================================
// FEATURE 7: REPORTS & ANALYTICS
// ============================================

// Reports
app.post(
  '/api/reports',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  validate(createReportSchema),
  ReportController.create
);

app.get(
  '/api/reports',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  ReportController.list
);

// Dashboard
app.get(
  '/api/dashboard',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  DashboardController.getDashboard
);

// Analytics
app.get(
  '/api/analytics/snapshot',
  apiLimiter,
  authenticate,
  authorize('broker', 'admin'),
  AnalyticsController.getSnapshot
);

// ============================================
// HEALTH & MONITORING
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.get('/api/stats', authenticate, authorize('admin'), async (req, res) => {
  const stats = {
    totalUsers: await prisma.user.count(),
    totalCustomers: await prisma.customer.count(),
    totalSales: await prisma.sale.count(),
    totalProperties: await prisma.ownerProperty.count(),
    totalAppointments: await prisma.appointment.count(),
    totalCards: await prisma.digitalCard.count(),
    totalReports: await prisma.report.count(),
  };

  res.json({ success: true, data: stats });
});

export default app;
```

---

**(يتبع في Part 3...)**

📄 **File:** `/INTEGRATION-PACKAGE-PART-2.md`  
🎯 **Next:** Database Consistency + Analytics + Testing
