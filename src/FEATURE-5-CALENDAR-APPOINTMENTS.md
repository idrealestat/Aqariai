# 🚀 **FEATURE 5: CALENDAR & APPOINTMENTS**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🎯 FEATURE 5: CALENDAR & APPOINTMENTS - FULL IMPL.         ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (100+ appointments)                         ║
║  ✅ Backend APIs (Express + TypeScript)                      ║
║  ✅ Auto-Reminder Service (Cron)                             ║
║  ✅ Conflict Detection Algorithm                             ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Calendar Views (Month/Week/Day)                          ║
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
4. [Reminder Service](#4-reminder-service)
5. [Conflict Detection](#5-conflict-detection)
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
// FEATURE 5: CALENDAR & APPOINTMENTS - DATABASE SCHEMA
// ============================================

// ============================================
// APPOINTMENTS
// ============================================

model Appointment {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Participants
  customerId            String?                 @map("customer_id")
  customer              Customer?               @relation(fields: [customerId], references: [id], onDelete: SetNull)
  propertyId            String?                 @map("property_id")
  property              OwnerProperty?          @relation(fields: [propertyId], references: [id], onDelete: SetNull)
  seekerId              String?                 @map("seeker_id")
  seeker                PropertySeeker?         @relation(fields: [seekerId], references: [id], onDelete: SetNull)
  ownerId               String?                 @map("owner_id")
  owner                 PropertyOwner?          @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  
  // Appointment Details
  title                 String
  description           String?                 @db.Text
  type                  String                  // 'viewing', 'meeting', 'call', 'signing', 'inspection', 'other'
  
  // Timing
  startDatetime         DateTime                @map("start_datetime")
  endDatetime           DateTime                @map("end_datetime")
  timezone              String                  @default("Asia/Riyadh")
  allDay                Boolean                 @default(false) @map("all_day")
  duration              Int?                    // Duration in minutes
  
  // Location
  locationType          String                  @default("physical") @map("location_type") // 'physical', 'virtual', 'phone'
  locationAddress       String?                 @map("location_address")
  locationCoordinates   String?                 @map("location_coordinates") // 'lat,lng'
  meetingUrl            String?                 @map("meeting_url") // For virtual meetings
  meetingPlatform       String?                 @map("meeting_platform") // 'zoom', 'teams', 'meet'
  
  // Status
  status                String                  @default("scheduled") // 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  confirmationStatus    String                  @default("pending") @map("confirmation_status") // 'pending', 'confirmed', 'declined'
  
  // Reminders
  reminderEnabled       Boolean                 @default(true) @map("reminder_enabled")
  reminderMinutesBefore Int                     @default(60) @map("reminder_minutes_before") // 60 = 1 hour
  reminderSent          Boolean                 @default(false) @map("reminder_sent")
  reminderSentAt        DateTime?               @map("reminder_sent_at")
  
  // Follow-up
  requiresFollowup      Boolean                 @default(false) @map("requires_followup")
  followupCreated       Boolean                 @default(false) @map("followup_created")
  
  // Outcome
  outcome               String?                 // 'interested', 'not_interested', 'need_more_time', 'deal_closed'
  outcomeNotes          String?                 @map("outcome_notes") @db.Text
  rating                Int?                    // 1-5 rating
  
  // Attachments
  attachments           Json                    @default("[]") // [{name, url, type}]
  
  // Metadata
  metadata              Json                    @default("{}")
  notes                 String?                 @db.Text
  color                 String?                 // For calendar display
  
  // Timestamps
  confirmedAt           DateTime?               @map("confirmed_at")
  completedAt           DateTime?               @map("completed_at")
  cancelledAt           DateTime?               @map("cancelled_at")
  cancellationReason    String?                 @map("cancellation_reason")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  // Relations
  reminders             AppointmentReminder[]
  participants          AppointmentParticipant[]
  conflicts             AppointmentConflict[]

  @@index([userId])
  @@index([customerId])
  @@index([propertyId])
  @@index([status])
  @@index([startDatetime])
  @@index([endDatetime])
  @@map("appointments")
}

// ============================================
// APPOINTMENT REMINDERS
// ============================================

model AppointmentReminder {
  id                    String                  @id @default(uuid())
  appointmentId         String                  @map("appointment_id")
  appointment           Appointment             @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  // Reminder Details
  reminderType          String                  @map("reminder_type") // 'email', 'sms', 'push', 'whatsapp'
  minutesBefore         Int                     @map("minutes_before")
  
  // Scheduling
  scheduledAt           DateTime                @map("scheduled_at")
  sentAt                DateTime?               @map("sent_at")
  
  // Status
  status                String                  @default("pending") // 'pending', 'sent', 'failed', 'cancelled'
  
  // Response
  deliveryStatus        String?                 @map("delivery_status") // 'delivered', 'bounced', 'failed'
  errorMessage          String?                 @map("error_message")
  
  // Content
  subject               String?
  body                  String?                 @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")

  @@index([appointmentId])
  @@index([scheduledAt])
  @@index([status])
  @@map("appointment_reminders")
}

// ============================================
// APPOINTMENT PARTICIPANTS
// ============================================

model AppointmentParticipant {
  id                    String                  @id @default(uuid())
  appointmentId         String                  @map("appointment_id")
  appointment           Appointment             @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  // Participant Details
  participantType       String                  @map("participant_type") // 'customer', 'owner', 'seeker', 'agent', 'guest'
  participantId         String?                 @map("participant_id") // Related entity ID
  
  // Contact Info (for guests)
  name                  String?
  email                 String?
  phone                 String?
  
  // Status
  status                String                  @default("pending") // 'pending', 'accepted', 'declined', 'tentative'
  responseAt            DateTime?               @map("response_at")
  
  // Notifications
  notificationSent      Boolean                 @default(false) @map("notification_sent")
  reminderSent          Boolean                 @default(false) @map("reminder_sent")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")

  @@index([appointmentId])
  @@map("appointment_participants")
}

// ============================================
// APPOINTMENT CONFLICTS
// ============================================

model AppointmentConflict {
  id                    String                  @id @default(uuid())
  appointmentId         String                  @map("appointment_id")
  appointment           Appointment             @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  // Conflict Details
  conflictType          String                  @map("conflict_type") // 'time_overlap', 'location_conflict', 'participant_busy'
  conflictWithId        String?                 @map("conflict_with_id") // ID of conflicting appointment
  
  // Severity
  severity              String                  @default("warning") // 'info', 'warning', 'error'
  
  // Resolution
  status                String                  @default("unresolved") // 'unresolved', 'resolved', 'ignored'
  resolvedAt            DateTime?               @map("resolved_at")
  resolutionNotes       String?                 @map("resolution_notes")
  
  // Details
  message               String                  @db.Text
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")

  @@index([appointmentId])
  @@map("appointment_conflicts")
}

// ============================================
// CALENDAR SETTINGS
// ============================================

model CalendarSettings {
  id                    String                  @id @default(uuid())
  userId                String                  @unique @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Working Hours
  workingDays           Json                    @default("[1,2,3,4,5]") @map("working_days") // [0=Sun, 1=Mon, ..., 6=Sat]
  workingHoursStart     String                  @default("09:00") @map("working_hours_start")
  workingHoursEnd       String                  @default("17:00") @map("working_hours_end")
  
  // Default Settings
  defaultAppointmentDuration Int                @default(60) @map("default_appointment_duration") // minutes
  defaultReminderBefore Int                     @default(60) @map("default_reminder_before") // minutes
  
  // Preferences
  allowWeekendAppointments Boolean               @default(false) @map("allow_weekend_appointments")
  allowOverlapping      Boolean                 @default(false) @map("allow_overlapping")
  autoConfirm           Boolean                 @default(false) @map("auto_confirm")
  
  // Notifications
  emailReminders        Boolean                 @default(true) @map("email_reminders")
  smsReminders          Boolean                 @default(true) @map("sms_reminders")
  pushReminders         Boolean                 @default(true) @map("push_reminders")
  whatsappReminders     Boolean                 @default(false) @map("whatsapp_reminders")
  
  // View Preferences
  defaultView           String                  @default("week") @map("default_view") // 'day', 'week', 'month'
  weekStartsOn          Int                     @default(6) @map("week_starts_on") // 6 = Saturday (Saudi Arabia)
  timeFormat            String                  @default("24h") @map("time_format") // '12h', '24h'
  
  // Timezone
  timezone              String                  @default("Asia/Riyadh")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@map("calendar_settings")
}

// ============================================
// APPOINTMENT TEMPLATES
// ============================================

model AppointmentTemplate {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Template Details
  name                  String
  description           String?                 @db.Text
  type                  String                  // 'viewing', 'meeting', 'call', 'signing'
  
  // Default Values
  defaultDuration       Int                     @map("default_duration") // minutes
  defaultLocation       String?                 @map("default_location")
  defaultReminderBefore Int                     @map("default_reminder_before")
  
  // Content
  titleTemplate         String                  @map("title_template")
  descriptionTemplate   String?                 @map("description_template") @db.Text
  
  // Settings
  requiresConfirmation  Boolean                 @default(true) @map("requires_confirmation")
  autoCreateFollowup    Boolean                 @default(false) @map("auto_create_followup")
  
  // Usage
  usageCount            Int                     @default(0) @map("usage_count")
  lastUsedAt            DateTime?               @map("last_used_at")
  
  // Status
  isDefault             Boolean                 @default(false) @map("is_default")
  isActive              Boolean                 @default(true) @map("is_active")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@map("appointment_templates")
}

// ============================================
// RECURRING APPOINTMENTS
// ============================================

model RecurringAppointment {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Pattern Details
  title                 String
  description           String?                 @db.Text
  type                  String
  
  // Recurrence Pattern
  recurrenceType        String                  @map("recurrence_type") // 'daily', 'weekly', 'monthly', 'yearly'
  recurrenceInterval    Int                     @default(1) @map("recurrence_interval") // Every N days/weeks/months
  recurrenceDaysOfWeek  Json?                   @map("recurrence_days_of_week") // [1,3,5] for Mon, Wed, Fri
  recurrenceDayOfMonth  Int?                    @map("recurrence_day_of_month") // 15 for 15th of month
  
  // Time
  startTime             String                  @map("start_time") // '09:00'
  duration              Int                     // minutes
  
  // Range
  startDate             DateTime                @map("start_date")
  endDate               DateTime?               @map("end_date")
  occurrences           Int?                    // Max number of occurrences
  
  // Generated Appointments
  lastGeneratedDate     DateTime?               @map("last_generated_date")
  nextGenerationDate    DateTime?               @map("next_generation_date")
  
  // Status
  isActive              Boolean                 @default(true) @map("is_active")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([isActive])
  @@map("recurring_appointments")
}

// ============================================
// APPOINTMENT STATS
// ============================================

model AppointmentStats {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  date                  DateTime                @db.Date
  
  // Counts
  totalScheduled        Int                     @default(0) @map("total_scheduled")
  totalCompleted        Int                     @default(0) @map("total_completed")
  totalCancelled        Int                     @default(0) @map("total_cancelled")
  totalNoShow           Int                     @default(0) @map("total_no_show")
  
  // By Type
  viewings              Int                     @default(0)
  meetings              Int                     @default(0)
  calls                 Int                     @default(0)
  signings              Int                     @default(0)
  
  // Success Metrics
  completionRate        Decimal                 @default(0) @map("completion_rate") @db.Decimal(5, 2)
  averageRating         Decimal                 @default(0) @map("average_rating") @db.Decimal(3, 2)
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@unique([userId, date])
  @@index([userId])
  @@index([date])
  @@map("appointment_stats")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/calendar-appointments.seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { addDays, addHours, addMinutes, setHours, setMinutes } from 'date-fns';

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

function getWorkingDateTime(daysFromNow: number, hour: number = 10): Date {
  let date = addDays(new Date(), daysFromNow);
  
  // Skip weekends (Friday & Saturday in Saudi Arabia)
  while (date.getDay() === 5 || date.getDay() === 6) {
    date = addDays(date, 1);
  }
  
  return setMinutes(setHours(date, hour), randomNumber(0, 59));
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedCalendarAppointments() {
  console.log('🌱 Seeding Calendar & Appointments...\n');

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@novacrm.com' },
  });

  if (!user) {
    throw new Error('Demo user not found. Run previous seeds first.');
  }

  // Get sample data
  const [customers, properties, seekers, owners] = await Promise.all([
    prisma.customer.findMany({ where: { userId: user.id }, take: 20 }),
    prisma.ownerProperty.findMany({ where: { userId: user.id }, take: 20 }),
    prisma.propertySeeker.findMany({ where: { userId: user.id }, take: 10 }),
    prisma.propertyOwner.findMany({ where: { userId: user.id }, take: 10 }),
  ]);

  // ============================================
  // 1. CREATE CALENDAR SETTINGS
  // ============================================
  console.log('⚙️  Creating calendar settings...');

  await prisma.calendarSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      workingDays: JSON.stringify([0, 1, 2, 3, 4]), // Sun-Thu (Saudi work week)
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      defaultAppointmentDuration: 60,
      defaultReminderBefore: 60,
      allowWeekendAppointments: false,
      allowOverlapping: false,
      emailReminders: true,
      smsReminders: true,
      pushReminders: true,
      defaultView: 'week',
      weekStartsOn: 6, // Saturday
      timezone: 'Asia/Riyadh',
    },
  });

  console.log('✅ Calendar settings created');

  // ============================================
  // 2. CREATE APPOINTMENTS
  // ============================================
  console.log('\n📅 Creating appointments...');

  const appointmentTypes = [
    { type: 'viewing', title: 'معاينة عقار', duration: 30 },
    { type: 'meeting', title: 'اجتماع', duration: 60 },
    { type: 'call', title: 'مكالمة', duration: 15 },
    { type: 'signing', title: 'توقيع عقد', duration: 45 },
    { type: 'inspection', title: 'فحص عقار', duration: 90 },
  ];

  const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
  const outcomes = ['interested', 'not_interested', 'need_more_time', 'deal_closed'];

  const appointments = [];

  // Create 100 appointments (past, present, future)
  for (let i = 0; i < 100; i++) {
    const appointmentType = randomElement(appointmentTypes);
    const customer = customers.length > 0 ? randomElement(customers) : null;
    const property = properties.length > 0 ? randomElement(properties) : null;
    const seeker = seekers.length > 0 && Math.random() > 0.5 ? randomElement(seekers) : null;
    const owner = owners.length > 0 && Math.random() > 0.5 ? randomElement(owners) : null;

    // Distribute appointments across time
    let startDatetime: Date;
    let status: string;
    let isPast: boolean;

    if (i < 30) {
      // Past appointments (last 30 days)
      startDatetime = getWorkingDateTime(-randomNumber(1, 30), randomNumber(9, 16));
      status = randomElement(['completed', 'completed', 'completed', 'cancelled', 'no_show']);
      isPast = true;
    } else if (i < 50) {
      // Today's appointments
      startDatetime = setMinutes(
        setHours(new Date(), randomNumber(9, 16)),
        randomNumber(0, 59)
      );
      status = randomElement(['scheduled', 'confirmed', 'confirmed']);
      isPast = false;
    } else {
      // Future appointments (next 30 days)
      startDatetime = getWorkingDateTime(randomNumber(1, 30), randomNumber(9, 16));
      status = randomElement(['scheduled', 'scheduled', 'confirmed']);
      isPast = false;
    }

    const endDatetime = addMinutes(startDatetime, appointmentType.duration);

    const appointmentData: any = {
      userId: user.id,
      customerId: customer?.id,
      propertyId: property?.id,
      seekerId: seeker?.id,
      ownerId: owner?.id,
      title: property
        ? `${appointmentType.title} - ${property.title}`
        : appointmentType.title,
      description: `${appointmentType.title} ${customer ? `مع ${customer.name}` : ''}`,
      type: appointmentType.type,
      startDatetime,
      endDatetime,
      duration: appointmentType.duration,
      locationType: randomElement(['physical', 'physical', 'virtual', 'phone']),
      status,
      confirmationStatus: status === 'confirmed' ? 'confirmed' : 'pending',
      reminderEnabled: true,
      reminderMinutesBefore: randomElement([15, 30, 60, 120, 1440]), // 1440 = 1 day
    };

    if (appointmentData.locationType === 'physical' && property) {
      appointmentData.locationAddress = `${property.city}, ${property.district}`;
    } else if (appointmentData.locationType === 'virtual') {
      appointmentData.meetingUrl = `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`;
      appointmentData.meetingPlatform = randomElement(['zoom', 'teams', 'meet']);
    }

    if (status === 'confirmed') {
      appointmentData.confirmedAt = new Date(startDatetime.getTime() - randomNumber(1, 24) * 60 * 60 * 1000);
    }

    if (status === 'completed') {
      appointmentData.completedAt = endDatetime;
      appointmentData.outcome = randomElement(outcomes);
      appointmentData.rating = randomNumber(3, 5);
      appointmentData.requiresFollowup = appointmentData.outcome === 'interested';
    }

    if (status === 'cancelled') {
      appointmentData.cancelledAt = new Date(startDatetime.getTime() - randomNumber(1, 48) * 60 * 60 * 1000);
      appointmentData.cancellationReason = randomElement([
        'تم إعادة الجدولة',
        'العميل ألغى الموعد',
        'العقار لم يعد متاحاً',
        'ظرف طارئ',
      ]);
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData,
    });

    appointments.push(appointment);

    // Create reminder for future/today appointments
    if (!isPast && status !== 'cancelled') {
      const reminderTime = addMinutes(
        startDatetime,
        -appointmentData.reminderMinutesBefore
      );

      await prisma.appointmentReminder.create({
        data: {
          appointmentId: appointment.id,
          reminderType: randomElement(['email', 'sms', 'push']),
          minutesBefore: appointmentData.reminderMinutesBefore,
          scheduledAt: reminderTime,
          status: reminderTime < new Date() ? 'sent' : 'pending',
          sentAt: reminderTime < new Date() ? reminderTime : null,
          subject: `تذكير: ${appointment.title}`,
          body: `لديك موعد ${appointment.title} في ${startDatetime.toLocaleString('ar-SA')}`,
        },
      });

      if (reminderTime < new Date()) {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            reminderSent: true,
            reminderSentAt: reminderTime,
          },
        });
      }
    }
  }

  console.log(`✅ Created ${appointments.length} appointments`);

  // ============================================
  // 3. CREATE APPOINTMENT TEMPLATES
  // ============================================
  console.log('\n📝 Creating appointment templates...');

  const templates = [
    {
      name: 'معاينة عقار',
      description: 'قالب لجدولة معاينة عقار مع العميل',
      type: 'viewing',
      defaultDuration: 30,
      defaultReminderBefore: 60,
      titleTemplate: 'معاينة {{propertyTitle}}',
      descriptionTemplate: 'معاينة عقار مع {{customerName}}\nالموقع: {{propertyLocation}}',
      requiresConfirmation: true,
      autoCreateFollowup: true,
      isDefault: true,
    },
    {
      name: 'اجتماع عميل',
      description: 'قالب لاجتماع مع العميل',
      type: 'meeting',
      defaultDuration: 60,
      defaultReminderBefore: 120,
      titleTemplate: 'اجتماع مع {{customerName}}',
      descriptionTemplate: 'اجتماع لمناقشة {{purpose}}',
      requiresConfirmation: true,
      autoCreateFollowup: false,
    },
    {
      name: 'مكالمة متابعة',
      description: 'قالب لمكالمة المتابعة',
      type: 'call',
      defaultDuration: 15,
      defaultReminderBefore: 30,
      titleTemplate: 'مكالمة متابعة - {{customerName}}',
      descriptionTemplate: 'مكالمة للمتابعة مع العميل',
      requiresConfirmation: false,
      autoCreateFollowup: false,
    },
    {
      name: 'توقيع عقد',
      description: 'قالب لموعد توقيع العقد',
      type: 'signing',
      defaultDuration: 45,
      defaultReminderBefore: 1440, // 1 day
      titleTemplate: 'توقيع عقد {{propertyTitle}}',
      descriptionTemplate: 'موعد توقيع عقد العقار\nإحضار: الهوية الوطنية، الشيكات',
      requiresConfirmation: true,
      autoCreateFollowup: false,
    },
  ];

  for (const templateData of templates) {
    await prisma.appointmentTemplate.create({
      data: {
        ...templateData,
        userId: user.id,
        usageCount: randomNumber(0, 50),
      },
    });
  }

  console.log(`✅ Created ${templates.length} templates`);

  // ============================================
  // 4. CREATE APPOINTMENT STATS
  // ============================================
  console.log('\n📊 Creating appointment stats...');

  // Create stats for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const totalScheduled = randomNumber(3, 10);
    const totalCompleted = randomNumber(2, totalScheduled);
    const totalCancelled = randomNumber(0, 2);
    const totalNoShow = randomNumber(0, 1);

    await prisma.appointmentStats.create({
      data: {
        userId: user.id,
        date,
        totalScheduled,
        totalCompleted,
        totalCancelled,
        totalNoShow,
        viewings: randomNumber(1, 5),
        meetings: randomNumber(1, 3),
        calls: randomNumber(0, 4),
        signings: randomNumber(0, 1),
        completionRate: totalScheduled > 0
          ? ((totalCompleted / totalScheduled) * 100).toFixed(2)
          : 0,
        averageRating: randomNumber(35, 50) / 10, // 3.5 - 5.0
      },
    });
  }

  console.log('✅ Created 30 days of stats');

  // ============================================
  // 5. DETECT CONFLICTS (Sample)
  // ============================================
  console.log('\n⚠️  Detecting sample conflicts...');

  // Find overlapping appointments
  const todayAppointments = await prisma.appointment.findMany({
    where: {
      userId: user.id,
      startDatetime: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      status: { in: ['scheduled', 'confirmed'] },
    },
    orderBy: { startDatetime: 'asc' },
  });

  let conflictCount = 0;

  for (let i = 0; i < todayAppointments.length - 1; i++) {
    const current = todayAppointments[i];
    const next = todayAppointments[i + 1];

    // Check if appointments overlap
    if (current.endDatetime > next.startDatetime) {
      await prisma.appointmentConflict.create({
        data: {
          appointmentId: next.id,
          conflictType: 'time_overlap',
          conflictWithId: current.id,
          severity: 'warning',
          message: `هذا الموعد يتعارض مع موعد آخر (${current.title})`,
        },
      });
      conflictCount++;
    }
  }

  console.log(`✅ Detected ${conflictCount} conflicts`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ Calendar & Appointments Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Calendar Settings: 1`);
  console.log(`   - Appointments:      ${appointments.length}`);
  console.log(`   - Templates:         ${templates.length}`);
  console.log(`   - Stats:             30 days`);
  console.log(`   - Conflicts:         ${conflictCount}`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedCalendarAppointments };

// If running directly
if (require.main === module) {
  seedCalendarAppointments()
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

📄 **File:** `/FEATURE-5-CALENDAR-APPOINTMENTS.md`  
🎯 **Status:** Part 1 Complete (DB + Seeding)  
⏱️ **Next:** Backend APIs + Reminder Service + Conflict Detection
