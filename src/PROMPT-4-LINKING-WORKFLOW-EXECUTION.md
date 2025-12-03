# 🔗 **LINKING & WORKFLOW - Execution Prompt**
## **Nova CRM - Full System Integration**

---

## 🎯 **OBJECTIVE**

Integrate all modules of Nova CRM into a cohesive, real-time system where:
- Data flows seamlessly between all sections
- Real-time updates propagate to all connected users
- Analytics track every interaction
- RBAC enforces permissions at every level
- All user actions are logged and analyzed

---

## 🌐 **SYSTEM ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Dashboard │ CRM │ Smart Matches │ Calendar │ Tasks │ Team  │
└─────────────────────────────────────────────────────────────┘
                            ↕ ↕ ↕
┌─────────────────────────────────────────────────────────────┐
│                      Real-time Layer                         │
├─────────────────────────────────────────────────────────────┤
│              Socket.io / Supabase Realtime                   │
│        ↓                ↓                ↓                   │
│   Customers      Smart Matches      Notifications            │
└─────────────────────────────────────────────────────────────┘
                            ↕ ↕ ↕
┌─────────────────────────────────────────────────────────────┐
│                       Backend Layer                          │
├─────────────────────────────────────────────────────────────┤
│  API Routes │ Business Logic │ Matching Algorithm │ Jobs    │
└─────────────────────────────────────────────────────────────┘
                            ↕ ↕ ↕
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL │ Redis Cache │ Queue (Bull) │ Storage (S3)     │
└─────────────────────────────────────────────────────────────┘
                            ↕ ↕ ↕
┌─────────────────────────────────────────────────────────────┐
│                      Analytics Layer                         │
├─────────────────────────────────────────────────────────────┤
│        Event Tracking │ User Stats │ Reports │ AI Insights  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 **DATA FLOW DIAGRAMS**

### **1. Customer Journey Flow:**

```
[Add Customer]
     ↓
[Save to DB] ──→ [Update User Stats]
     ↓
[Track Analytics Event: "customer_created"]
     ↓
[Real-time Update] ──→ [Notify Team Members]
     ↓
[Customer Card in CRM Grid]
     ↓
[Quick Actions Available]
     ├─→ [Call] ──→ [Log Activity]
     ├─→ [WhatsApp] ──→ [Log Activity]
     ├─→ [Schedule Appointment] ──→ [Create in Calendar]
     ├─→ [Create Task] ──→ [Add to Tasks]
     ├─→ [Add Property] ──→ [Link to Properties]
     └─→ [Add Note] ──→ [Save Activity]
```

### **2. Smart Match Flow:**

```
[User Creates Request]
     ↓
[Save to DB]
     ↓
[Trigger Matching Algorithm] (Background Job)
     ↓
[Calculate Match Scores for All Offers]
     ↓
[Filter: Score >= 50%]
     ↓
[Create Smart Match Records]
     ↓
[Send Notification] ──→ [Real-time Push to User]
     ↓
[User Views Matches in Swipe UI]
     ↓
[User Swipes]
     ├─→ [Accept]
     │   ├─→ [Update Match Status]
     │   ├─→ [Increment Offer.acceptedCount]
     │   ├─→ [Move to "Accepted" Tab]
     │   ├─→ [Fetch Full Offer Details]
     │   ├─→ [Track Analytics: "match_accepted"]
     │   └─→ [Notify Offer Owner]
     │
     └─→ [Reject]
         ├─→ [Update Match Status]
         ├─→ [Track Analytics: "match_rejected"]
         └─→ [Show Next Match]
```

### **3. Appointment Flow:**

```
[Create Appointment]
     ↓
[Validate Against Working Hours]
     ↓
[Check for Conflicts]
     ↓
[Save to DB]
     ↓
[Link to Customer & Property (if any)]
     ↓
[Schedule Reminders]
     ├─→ [30 minutes before]
     ├─→ [2 hours before]
     └─→ [24 hours before]
     ↓
[Real-time Update] ──→ [Update Calendar UI]
     ↓
[Track Analytics: "appointment_created"]
     ↓
[Send Notifications]
     ├─→ [User]
     ├─→ [Customer (SMS/Email)]
     └─→ [Team Members (if assigned)]
```

### **4. HomeOwners Flow:**

```
[Owner Fills Form]
     ↓
[Select Subscription Plan] (199 SAR or 259 SAR)
     ↓
[Process Payment]
     ↓
[Create User Account]
     ↓
[Create Property/Request]
     ↓
[Publish to Marketplace]
     ├─→ [Summary Data Only]
     ├─→ [Full Data Saved Separately]
     └─→ [Max 10 Brokers Limit]
     ↓
[Trigger Smart Matching]
     ↓
[Notify Matched Brokers]
     ↓
[Track Analytics by Plan]
     ├─→ [Basic (199): Priority 1]
     └─→ [Premium (259): Priority 2]
     ↓
[Broker Accepts]
     ├─→ [Increment acceptedCount]
     ├─→ [Move to "Accepted Offers/Requests"]
     ├─→ [Fetch Full Details]
     └─→ [Track: "homeowner_offer_accepted"]
     ↓
[Owner Views Analytics Dashboard]
     ├─→ [Total Views]
     ├─→ [Total Brokers Interested]
     ├─→ [Acceptance Rate]
     └─→ [AI Recommendations (Premium only)]
```

### **5. Platform Publishing Flow:**

```
[User Creates Property]
     ↓
[Save to Properties Table]
     ↓
[User Clicks "Publish"]
     ↓
[Select Platforms]
     ├─→ [My Platform (Default)]
     ├─→ [Marketplace]
     ├─→ [External (Future)]
     ↓
[Visibility Settings]
     ├─→ [Public]
     ├─→ [Private]
     └─→ [Team Only]
     ↓
[Update Property Status: "Published"]
     ↓
[Generate Public URL]
     ↓
[Real-time Update] ──→ [Show on Platform]
     ↓
[Track Analytics: "property_published"]
     ↓
[Index for Search]
```

---

## 🔄 **REAL-TIME SYNCHRONIZATION**

### **Backend Real-time Events:**

```typescript
// src/services/realtime.service.ts
import { Server as SocketServer } from 'socket.io';
import { prisma } from '../config/database';

export class RealtimeService {
  constructor(private io: SocketServer) {}
  
  // Customer Events
  async onCustomerCreated(customerId: string, userId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    
    // Emit to user
    this.io.to(`user:${userId}`).emit('customer:created', customer);
    
    // Emit to team members
    const teamMembers = await this.getTeamMembers(userId);
    teamMembers.forEach((memberId) => {
      this.io.to(`user:${memberId}`).emit('customer:created', customer);
    });
  }
  
  async onCustomerUpdated(customerId: string, updates: any) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    
    this.io.to(`user:${customer!.userId}`).emit('customer:updated', customer);
  }
  
  async onCustomerDeleted(customerId: string, userId: string) {
    this.io.to(`user:${userId}`).emit('customer:deleted', { id: customerId });
  }
  
  // Smart Match Events
  async onMatchCreated(matchId: string, brokerId: string) {
    const match = await prisma.smartMatch.findUnique({
      where: { id: matchId },
      include: {
        offer: { include: { property: true } },
        request: true,
      },
    });
    
    this.io.to(`user:${brokerId}`).emit('match:new', match);
    
    // Send notification
    await prisma.notification.create({
      data: {
        userId: brokerId,
        title: 'فرصة ذكية جديدة! 🎯',
        message: `تم العثور على فرصة بنسبة تطابق ${match!.matchScore}%`,
        type: 'SMART_MATCH',
        relatedEntityId: matchId,
      },
    });
    
    this.io.to(`user:${brokerId}`).emit('notification:new', {
      title: 'فرصة ذكية جديدة! 🎯',
      message: `تم العثور على فرصة بنسبة تطابق ${match!.matchScore}%`,
    });
  }
  
  async onMatchAccepted(matchId: string) {
    const match = await prisma.smartMatch.findUnique({
      where: { id: matchId },
      include: { offer: true },
    });
    
    // Notify offer owner
    this.io.to(`user:${match!.offer.userId}`).emit('match:accepted', match);
    
    // Update offer accepted count
    await prisma.offer.update({
      where: { id: match!.offerId },
      data: {
        acceptedCount: { increment: 1 },
      },
    });
    
    // Check if max brokers reached
    const offer = await prisma.offer.findUnique({
      where: { id: match!.offerId },
    });
    
    if (offer!.acceptedCount >= offer!.maxBrokers) {
      await prisma.offer.update({
        where: { id: offer!.id },
        data: { status: 'COMPLETED' },
      });
    }
  }
  
  // Appointment Events
  async onAppointmentCreated(appointmentId: string, userId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { customer: true, property: true },
    });
    
    this.io.to(`user:${userId}`).emit('appointment:created', appointment);
    
    // Schedule reminders
    this.scheduleReminders(appointmentId);
  }
  
  async onAppointmentUpdated(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    
    this.io.to(`user:${appointment!.userId}`).emit('appointment:updated', appointment);
  }
  
  // Task Events
  async onTaskCreated(taskId: string, userId: string, assignedTo?: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });
    
    this.io.to(`user:${userId}`).emit('task:created', task);
    
    if (assignedTo) {
      this.io.to(`user:${assignedTo}`).emit('task:assigned', task);
      
      await prisma.notification.create({
        data: {
          userId: assignedTo,
          title: 'مهمة جديدة',
          message: `تم تعيين مهمة جديدة لك: ${task!.title}`,
          type: 'TASK',
          relatedEntityId: taskId,
        },
      });
    }
  }
  
  // Helper Methods
  private async getTeamMembers(userId: string): Promise<string[]> {
    const memberships = await prisma.teamMember.findMany({
      where: {
        team: {
          members: {
            some: { userId },
          },
        },
      },
      select: { userId: true },
    });
    
    return memberships.map((m) => m.userId).filter((id) => id !== userId);
  }
  
  private async scheduleReminders(appointmentId: string) {
    // Implementation using Bull queue
    // Schedule jobs for 30min, 2hrs, 24hrs before appointment
  }
}
```

### **Frontend Real-time Hooks:**

```typescript
// src/hooks/useRealtimeCustomers.ts
import { useEffect } from 'react';
import { useRealtime } from './useRealtime';
import { useCustomerStore } from '@/store/customerStore';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeCustomers = () => {
  const socket = useRealtime('', () => {});
  const queryClient = useQueryClient();
  const { addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
  
  useEffect(() => {
    if (!socket) return;
    
    // Listen for customer created
    socket.on('customer:created', (customer) => {
      addCustomer(customer);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    });
    
    // Listen for customer updated
    socket.on('customer:updated', (customer) => {
      updateCustomer(customer.id, customer);
      queryClient.invalidateQueries({ queryKey: ['customers', customer.id] });
    });
    
    // Listen for customer deleted
    socket.on('customer:deleted', ({ id }) => {
      deleteCustomer(id);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    });
    
    return () => {
      socket.off('customer:created');
      socket.off('customer:updated');
      socket.off('customer:deleted');
    };
  }, [socket, addCustomer, updateCustomer, deleteCustomer, queryClient]);
};
```

---

## 📈 **ANALYTICS INTEGRATION**

### **Event Tracking Service:**

```typescript
// src/services/analytics.service.ts
import { prisma } from '../config/database';

export interface AnalyticsEvent {
  userId?: string;
  sessionId?: string;
  eventType: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  metadata?: any;
}

export class AnalyticsService {
  async trackEvent(event: AnalyticsEvent) {
    await prisma.analyticsEvent.create({
      data: {
        ...event,
        createdAt: new Date(),
      },
    });
    
    // Update user stats if userId provided
    if (event.userId) {
      await this.updateUserStats(event.userId, event.eventType);
    }
  }
  
  private async updateUserStats(userId: string, eventType: string) {
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });
    
    if (!stats) {
      await prisma.userStats.create({
        data: { userId },
      });
    }
    
    // Update specific stats based on event type
    const updates: any = { lastActivity: new Date() };
    
    switch (eventType) {
      case 'customer_created':
        updates.totalCustomers = { increment: 1 };
        updates.activeCustomers = { increment: 1 };
        break;
      
      case 'property_created':
        updates.totalProperties = { increment: 1 };
        updates.activeProperties = { increment: 1 };
        break;
      
      case 'property_sold':
        updates.soldProperties = { increment: 1 };
        updates.activeProperties = { decrement: 1 };
        break;
      
      case 'appointment_completed':
        updates.completedAppointments = { increment: 1 };
        break;
      
      case 'match_accepted':
        updates.acceptedMatches = { increment: 1 };
        break;
      
      case 'login':
        updates.totalLogins = { increment: 1 };
        break;
    }
    
    await prisma.userStats.update({
      where: { userId },
      data: updates,
    });
  }
  
  async getUserStats(userId: string, dateRange?: { from: Date; to: Date }) {
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });
    
    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: {
        userId,
        createdAt: dateRange ? {
          gte: dateRange.from,
          lte: dateRange.to,
        } : undefined,
      },
      _count: true,
    });
    
    return {
      stats,
      events: events.map((e) => ({
        type: e.eventType,
        count: e._count,
      })),
    };
  }
  
  async getSystemStats() {
    const totalUsers = await prisma.user.count();
    const totalCustomers = await prisma.customer.count();
    const totalProperties = await prisma.property.count();
    const totalMatches = await prisma.smartMatch.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = await prisma.analyticsEvent.count({
      where: {
        createdAt: { gte: today },
      },
    });
    
    return {
      totalUsers,
      totalCustomers,
      totalProperties,
      totalMatches,
      todayEvents,
    };
  }
}
```

### **Frontend Analytics Tracking:**

```typescript
// src/lib/analytics.ts
import { apiClient } from './api/client';

export const analytics = {
  track: async (eventType: string, metadata?: any) => {
    try {
      await apiClient.post('/analytics/track', {
        eventType,
        eventCategory: metadata?.category,
        eventAction: metadata?.action,
        eventLabel: metadata?.label,
        metadata,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },
  
  pageView: async (page: string) => {
    await analytics.track('page_view', {
      category: 'navigation',
      label: page,
    });
  },
  
  buttonClick: async (buttonName: string, location: string) => {
    await analytics.track('button_click', {
      category: 'interaction',
      action: 'click',
      label: `${location}:${buttonName}`,
    });
  },
  
  formSubmit: async (formName: string, success: boolean) => {
    await analytics.track('form_submit', {
      category: 'form',
      action: success ? 'success' : 'error',
      label: formName,
    });
  },
};

// Usage in components:
// import { analytics } from '@/lib/analytics';
// 
// const handleClick = () => {
//   analytics.buttonClick('Add Customer', 'CRM Page');
//   // ... rest of logic
// };
```

---

## 🔒 **RBAC ENFORCEMENT**

### **Permission Checking:**

```typescript
// src/lib/permissions.ts
export const PERMISSIONS = {
  BROKER: {
    crm: ['view', 'create', 'edit', 'delete', 'export'],
    properties: ['view', 'create', 'edit', 'delete', 'publish'],
    calendar: ['view', 'create', 'edit', 'delete'],
    tasks: ['view', 'create', 'edit', 'delete', 'assign'],
    analytics: ['view', 'export'],
    settings: ['view', 'edit'],
  },
  
  TEAM_MEMBER: {
    crm: ['view', 'create', 'edit'],
    properties: ['view', 'create', 'edit'],
    calendar: ['view', 'create', 'edit'],
    tasks: ['view', 'create', 'edit'],
    analytics: ['view'],
    settings: ['view'],
  },
  
  OBSERVER: {
    crm: ['view'],
    properties: ['view'],
    calendar: ['view'],
    tasks: ['view'],
    analytics: ['view'],
    settings: [],
  },
  
  OWNER: {
    offers: ['create', 'view', 'edit'],
    requests: ['create', 'view', 'edit'],
    matches: ['view'],
    analytics: ['view'],
  },
};

export const hasPermission = (
  userRole: string,
  resource: string,
  action: string
): boolean => {
  const permissions = PERMISSIONS[userRole as keyof typeof PERMISSIONS];
  if (!permissions) return false;
  
  const resourcePermissions = permissions[resource as keyof typeof permissions];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
};

// Usage:
// if (!hasPermission(user.role, 'crm', 'delete')) {
//   return <div>You don't have permission</div>;
// }
```

### **Frontend Permission Component:**

```typescript
// src/components/shared/Can.tsx
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/lib/permissions';

interface CanProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can = ({ resource, action, children, fallback }: CanProps) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  if (hasPermission(user.role, resource, action)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

// Usage:
// <Can resource="crm" action="delete">
//   <Button onClick={handleDelete}>Delete</Button>
// </Can>
```

---

## 🔄 **BACKGROUND JOBS**

### **Job Queue Setup:**

```typescript
// src/jobs/queue.ts
import Bull from 'bull';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export const queues = {
  smartMatching: new Bull('smart-matching', {
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  }),
  
  reminders: new Bull('reminders', {
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  }),
  
  notifications: new Bull('notifications', {
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  }),
};

// Smart Matching Job
queues.smartMatching.process(async (job) => {
  const { userId } = job.data;
  
  const matchingService = new MatchingService();
  await matchingService.calculateMatches(userId);
});

// Reminder Job
queues.reminders.process(async (job) => {
  const { appointmentId, type } = job.data;
  
  // Send reminder notification/SMS/email
});

// Notification Job
queues.notifications.process(async (job) => {
  const { userId, notification } = job.data;
  
  // Send push notification
});

// Schedule jobs
export const scheduleSmartMatching = (userId: string) => {
  queues.smartMatching.add({ userId }, { delay: 5000 }); // 5 seconds
};

export const scheduleReminder = (
  appointmentId: string,
  type: string,
  delay: number
) => {
  queues.reminders.add({ appointmentId, type }, { delay });
};
```

---

## 📊 **CROSS-MODULE INTEGRATION**

### **1. CRM ↔ Properties:**

```typescript
// When creating a property from customer
const handleCreatePropertyFromCustomer = async (customerId: string) => {
  const customer = await customersAPI.getById(customerId);
  
  // Pre-fill property form with customer data
  const propertyData = {
    customerId: customer.id,
    city: customer.preferredCities?.[0],
    priceMin: customer.budgetMin,
    priceMax: customer.budgetMax,
    // ... other fields
  };
  
  // Navigate to property form with pre-filled data
  router.push(`/properties/new?customerId=${customerId}`);
};
```

### **2. Properties ↔ Smart Matches:**

```typescript
// When property is created/updated, trigger matching
const onPropertyCreated = async (propertyId: string) => {
  // Save property
  await propertiesAPI.create(propertyData);
  
  // Trigger matching in background
  await scheduleSmartMatching(userId);
  
  // Track analytics
  await analytics.track('property_created', { propertyId });
};
```

### **3. Smart Matches ↔ Calendar:**

```typescript
// When match is accepted, quick schedule appointment
const handleAcceptMatch = async (matchId: string) => {
  // Accept match
  await smartMatchesAPI.accept(matchId);
  
  // Prompt to schedule appointment
  const shouldSchedule = confirm('هل تريد جدولة موعد معاينة؟');
  
  if (shouldSchedule) {
    const match = await smartMatchesAPI.getById(matchId);
    
    // Pre-fill appointment form
    router.push(`/calendar/new?propertyId=${match.offer.propertyId}`);
  }
};
```

### **4. Calendar ↔ Tasks:**

```typescript
// Auto-create follow-up task after appointment
const onAppointmentCompleted = async (appointmentId: string) => {
  const appointment = await appointmentsAPI.getById(appointmentId);
  
  // Create follow-up task
  await tasksAPI.create({
    title: `متابعة موعد: ${appointment.title}`,
    description: 'تواصل مع العميل بعد المعاينة',
    customerId: appointment.customerId,
    propertyId: appointment.propertyId,
    dueDate: addDays(new Date(), 1), // Tomorrow
    priority: 'MEDIUM',
  });
};
```

---

## 🎯 **COMPLETE WORKFLOW EXAMPLE**

### **End-to-End: From Customer to Deal Closed**

```typescript
// 1. Add Customer
const customer = await customersAPI.create({
  name: 'أحمد محمد',
  phone: '0501234567',
  category: 'مشتري',
  interestLevel: 'مهتم جداً',
  budgetMin: 500000,
  budgetMax: 800000,
  preferredCities: ['الرياض'],
  preferredDistricts: ['النرجس', 'الملقا'],
  propertyTypes: ['فيلا', 'شقة'],
});
// → Real-time update to CRM grid
// → Analytics: customer_created
// → Notification to team members

// 2. Create Request for Customer
const request = await requestsAPI.create({
  customerId: customer.id,
  type: 'BUY',
  cities: ['الرياض'],
  districts: ['النرجس', 'الملقا'],
  propertyTypes: ['فيلا'],
  priceMin: 500000,
  priceMax: 800000,
  bedroomsMin: 4,
});
// → Triggers smart matching (background job)
// → Analytics: request_created

// 3. Smart Matching Finds Match
// (Background job runs every 5 minutes or on-demand)
// → Match score calculated: 85%
// → SmartMatch record created
// → Notification sent to broker
// → Real-time update to Smart Matches UI

// 4. Broker Accepts Match
await smartMatchesAPI.accept(matchId);
// → Match status: ACCEPTED
// → Fetch full offer details
// → Move to "Accepted" tab
// → Analytics: match_accepted
// → Notification to offer owner
// → Update offer.acceptedCount

// 5. Schedule Viewing Appointment
const appointment = await appointmentsAPI.create({
  customerId: customer.id,
  propertyId: match.offer.propertyId,
  title: 'معاينة فيلا - النرجس',
  type: 'معاينة',
  startDatetime: new Date('2024-01-15T10:00:00'),
  endDatetime: new Date('2024-01-15T11:00:00'),
  location: 'النرجس، الرياض',
});
// → Real-time update to calendar
// → Schedule reminders (30min, 2hrs, 24hrs)
// → Send SMS to customer
// → Analytics: appointment_created
// → Create task: "Prepare for viewing"

// 6. Complete Appointment
await appointmentsAPI.complete(appointment.id);
// → Appointment status: COMPLETED
// → Analytics: appointment_completed
// → Auto-create follow-up task
// → Update customer.lastContact

// 7. Add Follow-up Note
await customersAPI.addActivity(customer.id, {
  type: 'note',
  description: 'العميل مهتم جداً، طلب تخفيض السعر بـ 50 ألف',
});
// → Activity logged
// → Real-time update to customer timeline

// 8. Property Sold
await propertiesAPI.update(property.id, {
  status: 'SOLD',
});
// → Property status updated
// → Analytics: property_sold
// → Update user stats
// → Create invoice/commission record
// → Send congratulations notification
```

---

## 📱 **MOBILE APP SYNCHRONIZATION**

```typescript
// For future React Native app
// Sync strategy:

// 1. On app launch
// - Fetch latest data
// - Subscribe to real-time events
// - Enable offline mode (IndexedDB)

// 2. On network available
// - Sync offline changes to server
// - Pull latest updates
// - Resolve conflicts (last-write-wins)

// 3. On background
// - Maintain socket connection
// - Show push notifications
// - Background sync every 15 minutes
```

---

## ✅ **INTEGRATION CHECKLIST**

### **Backend:**
- [ ] Real-time events for all CRUD operations
- [ ] Analytics tracking on all important actions
- [ ] Background jobs for matching, reminders, notifications
- [ ] RBAC middleware on all endpoints
- [ ] Cross-module triggers (hooks/events)
- [ ] Logging for all operations
- [ ] Error handling and rollbacks

### **Frontend:**
- [ ] Real-time listeners for all modules
- [ ] Analytics tracking on button clicks
- [ ] Permission-based UI rendering
- [ ] Loading/error states for all actions
- [ ] Optimistic updates for better UX
- [ ] Toast notifications for all events
- [ ] Cross-module navigation flows

### **Database:**
- [ ] Foreign key constraints
- [ ] Indexes on frequently queried fields
- [ ] Cascading deletes where appropriate
- [ ] Triggers for auto-updates (updated_at, stats)
- [ ] Stored procedures for complex operations

### **Testing:**
- [ ] Integration tests for all workflows
- [ ] Real-time event tests
- [ ] Permission tests for all roles
- [ ] Analytics tracking tests
- [ ] Background job tests
- [ ] Load testing for concurrent users

---

## 🎯 **SUCCESS METRICS**

**System should achieve:**
- ✅ Real-time updates: < 200ms latency
- ✅ Analytics capture: 99.9% of events
- ✅ RBAC enforcement: 100% coverage
- ✅ Background jobs: 95% success rate
- ✅ Data consistency: Zero conflicts
- ✅ Concurrent users: 1000+ simultaneous

---

📄 **File:** `/PROMPT-4-LINKING-WORKFLOW-EXECUTION.md`  
🔗 **Type:** System Integration  
⏱️ **Estimated Time:** 40-60 hours  
👥 **Role:** Full-Stack Developer / System Architect  
🎯 **Output:** Fully integrated, real-time system

---

**🚀 Execute this prompt to integrate all Nova CRM modules!**
