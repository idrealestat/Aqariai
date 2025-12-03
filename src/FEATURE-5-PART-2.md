# 🚀 **FEATURE 5: CALENDAR & APPOINTMENTS - PART 2**
## **Backend APIs + Reminder Service + Conflict Detection**

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Appointment Controller**

File: `backend/src/controllers/appointment.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { ConflictDetectionService } from '../services/conflict-detection.service';
import { ReminderService } from '../services/reminder.service';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createAppointmentSchema = z.object({
  customerId: z.string().uuid().optional().nullable(),
  propertyId: z.string().uuid().optional().nullable(),
  seekerId: z.string().uuid().optional().nullable(),
  ownerId: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional().nullable(),
  type: z.enum(['viewing', 'meeting', 'call', 'signing', 'inspection', 'other']),
  startDatetime: z.string().datetime(),
  endDatetime: z.string().datetime(),
  locationType: z.enum(['physical', 'virtual', 'phone']).default('physical'),
  locationAddress: z.string().optional().nullable(),
  meetingUrl: z.string().url().optional().nullable(),
  reminderEnabled: z.boolean().default(true),
  reminderMinutesBefore: z.number().int().positive().default(60),
});

const updateAppointmentSchema = createAppointmentSchema.partial();

// ============================================
// APPOINTMENT CONTROLLER
// ============================================

export class AppointmentController {
  
  // Get all appointments
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        startDate,
        endDate,
        status,
        type,
        customerId,
        propertyId,
        view = 'month',
      } = req.query;

      const where: any = { userId };

      // Date range filter
      if (startDate && endDate) {
        where.startDatetime = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      if (status) where.status = status;
      if (type) where.type = type;
      if (customerId) where.customerId = customerId;
      if (propertyId) where.propertyId = propertyId;

      const appointments = await prisma.appointment.findMany({
        where,
        orderBy: { startDatetime: 'asc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              address: true,
            },
          },
          seeker: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          _count: {
            select: {
              reminders: true,
              conflicts: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single appointment
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const appointment = await prisma.appointment.findFirst({
        where: { id, userId },
        include: {
          customer: true,
          property: true,
          seeker: true,
          owner: true,
          reminders: {
            orderBy: { scheduledAt: 'asc' },
          },
          conflicts: {
            where: { status: 'unresolved' },
          },
          participants: true,
        },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create appointment
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createAppointmentSchema.parse(req.body);

      const startDatetime = new Date(data.startDatetime);
      const endDatetime = new Date(data.endDatetime);

      // Validate dates
      if (endDatetime <= startDatetime) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time',
        });
      }

      // Calculate duration
      const duration = Math.round(
        (endDatetime.getTime() - startDatetime.getTime()) / (1000 * 60)
      );

      // Check for conflicts
      const conflicts = await ConflictDetectionService.detectConflicts(
        userId,
        startDatetime,
        endDatetime,
        null // No existing appointment ID
      );

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          userId,
          customerId: data.customerId,
          propertyId: data.propertyId,
          seekerId: data.seekerId,
          ownerId: data.ownerId,
          title: data.title,
          description: data.description,
          type: data.type,
          startDatetime,
          endDatetime,
          duration,
          locationType: data.locationType,
          locationAddress: data.locationAddress,
          meetingUrl: data.meetingUrl,
          reminderEnabled: data.reminderEnabled,
          reminderMinutesBefore: data.reminderMinutesBefore,
        },
        include: {
          customer: true,
          property: true,
        },
      });

      // Schedule reminder
      if (data.reminderEnabled) {
        await ReminderService.scheduleReminder(appointment.id);
      }

      // Create conflict records if any
      if (conflicts.length > 0) {
        for (const conflict of conflicts) {
          await prisma.appointmentConflict.create({
            data: {
              appointmentId: appointment.id,
              conflictType: 'time_overlap',
              conflictWithId: conflict.id,
              severity: 'warning',
              message: `هذا الموعد يتعارض مع: ${conflict.title}`,
            },
          });
        }
      }

      res.status(201).json({
        success: true,
        data: appointment,
        conflicts: conflicts.length > 0 ? conflicts : undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update appointment
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateAppointmentSchema.parse(req.body);

      const existing = await prisma.appointment.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      // Parse dates if provided
      const startDatetime = data.startDatetime ? new Date(data.startDatetime) : undefined;
      const endDatetime = data.endDatetime ? new Date(data.endDatetime) : undefined;

      let duration = undefined;
      if (startDatetime && endDatetime) {
        duration = Math.round(
          (endDatetime.getTime() - startDatetime.getTime()) / (1000 * 60)
        );
      }

      // Check for conflicts if dates changed
      if (startDatetime || endDatetime) {
        const finalStart = startDatetime || existing.startDatetime;
        const finalEnd = endDatetime || existing.endDatetime;

        const conflicts = await ConflictDetectionService.detectConflicts(
          userId,
          finalStart,
          finalEnd,
          id // Exclude current appointment
        );

        if (conflicts.length > 0) {
          // Clear old conflicts
          await prisma.appointmentConflict.deleteMany({
            where: { appointmentId: id },
          });

          // Create new conflicts
          for (const conflict of conflicts) {
            await prisma.appointmentConflict.create({
              data: {
                appointmentId: id,
                conflictType: 'time_overlap',
                conflictWithId: conflict.id,
                severity: 'warning',
                message: `هذا الموعد يتعارض مع: ${conflict.title}`,
              },
            });
          }
        }
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          ...data,
          startDatetime,
          endDatetime,
          duration,
        },
        include: {
          customer: true,
          property: true,
        },
      });

      // Reschedule reminder if needed
      if (data.reminderEnabled !== undefined || startDatetime) {
        await ReminderService.rescheduleReminder(id);
      }

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete appointment
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.appointment.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      await prisma.appointment.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Confirm appointment
  static async confirm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.appointment.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'confirmed',
          confirmationStatus: 'confirmed',
          confirmedAt: new Date(),
        },
      });

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel appointment
  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { reason } = req.body;

      const existing = await prisma.appointment.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
      });

      // Cancel reminders
      await prisma.appointmentReminder.updateMany({
        where: {
          appointmentId: id,
          status: 'pending',
        },
        data: {
          status: 'cancelled',
        },
      });

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Complete appointment
  static async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { outcome, outcomeNotes, rating } = req.body;

      const existing = await prisma.appointment.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          outcome,
          outcomeNotes,
          rating,
          requiresFollowup: outcome === 'interested',
        },
      });

      // Create follow-up if interested
      if (outcome === 'interested' && existing.customerId) {
        await prisma.customerFollowup.create({
          data: {
            customerId: existing.customerId,
            userId,
            title: `متابعة بعد ${existing.title}`,
            description: outcomeNotes || 'متابعة بعد الموعد',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            priority: 'high',
          },
        });

        await prisma.appointment.update({
          where: { id },
          data: { followupCreated: true },
        });
      }

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get upcoming appointments
  static async getUpcoming(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { days = '7' } = req.query;

      const daysNum = parseInt(days as string);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysNum);

      const appointments = await prisma.appointment.findMany({
        where: {
          userId,
          startDatetime: {
            gte: new Date(),
            lte: endDate,
          },
          status: { in: ['scheduled', 'confirmed'] },
        },
        orderBy: { startDatetime: 'asc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              city: true,
            },
          },
        },
        take: 20,
      });

      res.json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get appointment stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { days = '30' } = req.query;

      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const [
        totalAppointments,
        scheduledCount,
        completedCount,
        cancelledCount,
        stats,
      ] = await Promise.all([
        prisma.appointment.count({ where: { userId } }),
        prisma.appointment.count({
          where: {
            userId,
            status: { in: ['scheduled', 'confirmed'] },
            startDatetime: { gte: new Date() },
          },
        }),
        prisma.appointment.count({
          where: {
            userId,
            status: 'completed',
            completedAt: { gte: startDate },
          },
        }),
        prisma.appointment.count({
          where: {
            userId,
            status: 'cancelled',
            cancelledAt: { gte: startDate },
          },
        }),
        prisma.appointmentStats.findMany({
          where: {
            userId,
            date: { gte: startDate },
          },
          orderBy: { date: 'asc' },
        }),
      ]);

      const completionRate =
        totalAppointments > 0
          ? ((completedCount / totalAppointments) * 100).toFixed(2)
          : 0;

      res.json({
        success: true,
        data: {
          overview: {
            totalAppointments,
            scheduledCount,
            completedCount,
            cancelledCount,
            completionRate,
          },
          history: stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

# 4️⃣ **REMINDER SERVICE**

## **Auto-Reminder Service**

File: `backend/src/services/reminder.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import cron from 'node-cron';
import { io } from '../server';

export class ReminderService {
  
  // ============================================
  // START REMINDER SERVICE
  // ============================================
  
  static start(): void {
    console.log('⏰ Starting Reminder Service...');

    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.processDueReminders();
    });

    console.log('✅ Reminder Service started');
  }

  // ============================================
  // PROCESS DUE REMINDERS
  // ============================================
  
  private static async processDueReminders(): Promise<void> {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Find reminders that are due
    const dueReminders = await prisma.appointmentReminder.findMany({
      where: {
        status: 'pending',
        scheduledAt: {
          lte: fiveMinutesFromNow,
        },
      },
      include: {
        appointment: {
          include: {
            customer: true,
            property: true,
          },
        },
      },
      take: 50,
    });

    console.log(`📨 Found ${dueReminders.length} due reminders`);

    for (const reminder of dueReminders) {
      await this.sendReminder(reminder);
    }
  }

  // ============================================
  // SEND REMINDER
  // ============================================
  
  private static async sendReminder(reminder: any): Promise<void> {
    const { appointment } = reminder;

    console.log(`📤 Sending reminder for: ${appointment.title}`);

    try {
      // Send based on reminder type
      switch (reminder.reminderType) {
        case 'email':
          await this.sendEmailReminder(reminder);
          break;
        case 'sms':
          await this.sendSMSReminder(reminder);
          break;
        case 'push':
          await this.sendPushReminder(reminder);
          break;
        case 'whatsapp':
          await this.sendWhatsAppReminder(reminder);
          break;
      }

      // Mark as sent
      await prisma.appointmentReminder.update({
        where: { id: reminder.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
          deliveryStatus: 'delivered',
        },
      });

      // Update appointment
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          reminderSent: true,
          reminderSentAt: new Date(),
        },
      });

      console.log(`✅ Reminder sent successfully`);
    } catch (error) {
      console.error(`❌ Failed to send reminder:`, error);

      // Mark as failed
      await prisma.appointmentReminder.update({
        where: { id: reminder.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  // ============================================
  // SEND EMAIL REMINDER
  // ============================================
  
  private static async sendEmailReminder(reminder: any): Promise<void> {
    const { appointment } = reminder;

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`📧 [EMAIL] To: ${appointment.customer?.email}`);
    console.log(`   Subject: ${reminder.subject}`);
    console.log(`   Body: ${reminder.body}`);

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // ============================================
  // SEND SMS REMINDER
  // ============================================
  
  private static async sendSMSReminder(reminder: any): Promise<void> {
    const { appointment } = reminder;

    // In production, integrate with SMS service (Twilio, etc.)
    console.log(`📱 [SMS] To: ${appointment.customer?.phone}`);
    console.log(`   Message: ${reminder.body}`);

    // Simulate SMS sending
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // ============================================
  // SEND PUSH REMINDER
  // ============================================
  
  private static async sendPushReminder(reminder: any): Promise<void> {
    const { appointment } = reminder;

    // Send via Socket.IO
    io.to(`user:${appointment.userId}`).emit('appointment:reminder', {
      appointmentId: appointment.id,
      title: reminder.subject,
      message: reminder.body,
      startDatetime: appointment.startDatetime,
    });

    console.log(`🔔 [PUSH] Sent to user: ${appointment.userId}`);
  }

  // ============================================
  // SEND WHATSAPP REMINDER
  // ============================================
  
  private static async sendWhatsAppReminder(reminder: any): Promise<void> {
    const { appointment } = reminder;

    // In production, integrate with WhatsApp Business API
    console.log(`💬 [WHATSAPP] To: ${appointment.customer?.phone}`);
    console.log(`   Message: ${reminder.body}`);

    // Simulate WhatsApp sending
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // ============================================
  // SCHEDULE REMINDER
  // ============================================
  
  static async scheduleReminder(appointmentId: string): Promise<void> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: true,
        property: true,
      },
    });

    if (!appointment || !appointment.reminderEnabled) {
      return;
    }

    // Calculate reminder time
    const reminderTime = new Date(
      appointment.startDatetime.getTime() -
        appointment.reminderMinutesBefore * 60 * 1000
    );

    // Don't schedule if already past
    if (reminderTime < new Date()) {
      return;
    }

    // Get user settings
    const settings = await prisma.calendarSettings.findUnique({
      where: { userId: appointment.userId },
    });

    const reminderTypes: string[] = [];
    if (settings?.emailReminders) reminderTypes.push('email');
    if (settings?.smsReminders) reminderTypes.push('sms');
    if (settings?.pushReminders) reminderTypes.push('push');
    if (settings?.whatsappReminders) reminderTypes.push('whatsapp');

    // Default to push if no settings
    if (reminderTypes.length === 0) {
      reminderTypes.push('push');
    }

    // Create reminder for each type
    for (const type of reminderTypes) {
      await prisma.appointmentReminder.create({
        data: {
          appointmentId,
          reminderType: type,
          minutesBefore: appointment.reminderMinutesBefore,
          scheduledAt: reminderTime,
          subject: `تذكير: ${appointment.title}`,
          body: this.generateReminderBody(appointment),
        },
      });
    }

    console.log(
      `⏰ Scheduled ${reminderTypes.length} reminders for ${appointment.title}`
    );
  }

  // ============================================
  // RESCHEDULE REMINDER
  // ============================================
  
  static async rescheduleReminder(appointmentId: string): Promise<void> {
    // Delete old reminders
    await prisma.appointmentReminder.deleteMany({
      where: {
        appointmentId,
        status: 'pending',
      },
    });

    // Schedule new ones
    await this.scheduleReminder(appointmentId);
  }

  // ============================================
  // GENERATE REMINDER BODY
  // ============================================
  
  private static generateReminderBody(appointment: any): string {
    const date = appointment.startDatetime.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const time = appointment.startDatetime.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let body = `لديك موعد: ${appointment.title}\n`;
    body += `التاريخ: ${date}\n`;
    body += `الوقت: ${time}\n`;

    if (appointment.locationType === 'physical' && appointment.locationAddress) {
      body += `الموقع: ${appointment.locationAddress}\n`;
    } else if (appointment.locationType === 'virtual' && appointment.meetingUrl) {
      body += `رابط الاجتماع: ${appointment.meetingUrl}\n`;
    }

    if (appointment.customer) {
      body += `العميل: ${appointment.customer.name}\n`;
      body += `الهاتف: ${appointment.customer.phone}\n`;
    }

    if (appointment.property) {
      body += `العقار: ${appointment.property.title}\n`;
    }

    return body;
  }
}
```

---

# 5️⃣ **CONFLICT DETECTION**

## **Conflict Detection Service**

File: `backend/src/services/conflict-detection.service.ts`

```typescript
import { prisma } from '../lib/prisma';

export class ConflictDetectionService {
  
  // ============================================
  // DETECT CONFLICTS
  // ============================================
  
  static async detectConflicts(
    userId: string,
    startDatetime: Date,
    endDatetime: Date,
    excludeAppointmentId?: string | null
  ): Promise<any[]> {
    // Find overlapping appointments
    const where: any = {
      userId,
      status: { in: ['scheduled', 'confirmed'] },
      OR: [
        // New appointment starts during existing appointment
        {
          AND: [
            { startDatetime: { lte: startDatetime } },
            { endDatetime: { gt: startDatetime } },
          ],
        },
        // New appointment ends during existing appointment
        {
          AND: [
            { startDatetime: { lt: endDatetime } },
            { endDatetime: { gte: endDatetime } },
          ],
        },
        // New appointment completely contains existing appointment
        {
          AND: [
            { startDatetime: { gte: startDatetime } },
            { endDatetime: { lte: endDatetime } },
          ],
        },
      ],
    };

    // Exclude current appointment if updating
    if (excludeAppointmentId) {
      where.id = { not: excludeAppointmentId };
    }

    const conflicts = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        title: true,
        startDatetime: true,
        endDatetime: true,
        type: true,
      },
    });

    return conflicts;
  }

  // ============================================
  // CHECK WORKING HOURS
  // ============================================
  
  static async checkWorkingHours(
    userId: string,
    startDatetime: Date,
    endDatetime: Date
  ): Promise<{ isValid: boolean; message?: string }> {
    const settings = await prisma.calendarSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return { isValid: true }; // No settings, allow all
    }

    // Check if it's a working day
    const dayOfWeek = startDatetime.getDay();
    const workingDays = JSON.parse(settings.workingDays);

    if (!workingDays.includes(dayOfWeek)) {
      if (!settings.allowWeekendAppointments) {
        return {
          isValid: false,
          message: 'هذا اليوم ليس يوم عمل',
        };
      }
    }

    // Check working hours
    const startHour = startDatetime.getHours();
    const startMinute = startDatetime.getMinutes();
    const endHour = endDatetime.getHours();
    const endMinute = endDatetime.getMinutes();

    const [workStartHour, workStartMinute] = settings.workingHoursStart
      .split(':')
      .map(Number);
    const [workEndHour, workEndMinute] = settings.workingHoursEnd
      .split(':')
      .map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const workStart = workStartHour * 60 + workStartMinute;
    const workEnd = workEndHour * 60 + workEndMinute;

    if (startTime < workStart || endTime > workEnd) {
      return {
        isValid: false,
        message: `ساعات العمل من ${settings.workingHoursStart} إلى ${settings.workingHoursEnd}`,
      };
    }

    return { isValid: true };
  }

  // ============================================
  // GET AVAILABLE SLOTS
  // ============================================
  
  static async getAvailableSlots(
    userId: string,
    date: Date,
    duration: number // in minutes
  ): Promise<any[]> {
    // Get user settings
    const settings = await prisma.calendarSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return [];
    }

    // Get working hours
    const [workStartHour, workStartMinute] = settings.workingHoursStart
      .split(':')
      .map(Number);
    const [workEndHour, workEndMinute] = settings.workingHoursEnd
      .split(':')
      .map(Number);

    // Get existing appointments for the day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        status: { in: ['scheduled', 'confirmed'] },
        startDatetime: { gte: dayStart, lte: dayEnd },
      },
      orderBy: { startDatetime: 'asc' },
    });

    // Generate time slots
    const slots: any[] = [];
    let currentTime = new Date(date);
    currentTime.setHours(workStartHour, workStartMinute, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(workEndHour, workEndMinute, 0, 0);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);

      if (slotEnd > endTime) break;

      // Check if slot conflicts with any appointment
      const hasConflict = appointments.some((apt) => {
        return (
          (currentTime >= apt.startDatetime && currentTime < apt.endDatetime) ||
          (slotEnd > apt.startDatetime && slotEnd <= apt.endDatetime) ||
          (currentTime <= apt.startDatetime && slotEnd >= apt.endDatetime)
        );
      });

      if (!hasConflict) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(slotEnd),
          available: true,
        });
      }

      // Move to next slot (15-minute intervals)
      currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
    }

    return slots;
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/FEATURE-5-PART-2.md`  
🎯 **Status:** Part 2 Complete (Backend + Reminder + Conflict Detection)  
⏱️ **Next:** Frontend Components + Calendar Views + Testing
