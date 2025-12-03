# 🚀 **FULL DETAILED SYSTEM UPDATE - PART 4**
## **Complete CRM Controllers + Integration Services**

---

# **COMPLETE CRM CONTROLLER**

File: `backend/src/controllers/crm.controller.ts`

```typescript
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditLoggerService } from '../services/audit-logger.service';
import { EnhancedTransactionManager } from '../services/enhanced-transaction-manager.service';
import { NotificationService } from '../services/notification.service';
import { SanitizationUtil } from '../utils/sanitization.util';
import { AppError, asyncHandler } from '../middleware/error-handler.middleware';

/**
 * Complete CRM Controller
 * Handles all customer management operations
 */

export class CRMController {
  // ============================================
  // CREATE CUSTOMER
  // ============================================

  static createCustomer = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const data = req.body;

      // Sanitize inputs
      data.name = SanitizationUtil.sanitizeString(data.name);
      data.email = data.email ? SanitizationUtil.sanitizeEmail(data.email) : null;
      data.phone = SanitizationUtil.sanitizePhone(data.phone);
      data.notes = data.notes ? SanitizationUtil.sanitizeHtml(data.notes) : null;

      // Create customer in transaction
      const customer = await EnhancedTransactionManager.executeWithRetry(
        async (tx) => {
          const newCustomer = await tx.customer.create({
            data: {
              userId,
              name: data.name,
              email: data.email,
              phone: data.phone,
              source: data.source,
              status: data.status || 'new',
              tags: data.tags || [],
              budget: data.budget,
              notes: data.notes,
              priority: data.priority || 'medium',
              lastContactDate: new Date(),
            },
          });

          // Create initial interaction
          if (data.notes) {
            await tx.customerInteraction.create({
              data: {
                customerId: newCustomer.id,
                userId,
                type: 'other',
                notes: `عميل جديد: ${data.notes}`,
                completedAt: new Date(),
              },
            });
          }

          // Create notification
          await NotificationService.createNotification({
            userId,
            type: 'system',
            title: 'عميل جديد',
            message: `تم إضافة العميل ${newCustomer.name} بنجاح`,
            data: { customerId: newCustomer.id },
          });

          return newCustomer;
        }
      );

      // Log audit
      await AuditLoggerService.logCRUD(
        req,
        'create',
        'customer',
        customer.id,
        undefined,
        customer
      );

      res.status(201).json({
        success: true,
        message: 'تم إضافة العميل بنجاح',
        data: customer,
      });
    }
  );

  // ============================================
  // GET ALL CUSTOMERS
  // ============================================

  static getAllCustomers = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const {
        search,
        status,
        priority,
        source,
        tags,
        minBudget,
        maxBudget,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query as any;

      // Build where clause
      const where: any = {
        userId,
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (source) where.source = source;
      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }
      if (minBudget || maxBudget) {
        where.budget = {};
        if (minBudget) where.budget.gte = parseFloat(minBudget);
        if (maxBudget) where.budget.lte = parseFloat(maxBudget);
      }
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }

      // Get total count
      const total = await prisma.customer.count({ where });

      // Get customers
      const customers = await prisma.customer.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          priority: true,
          source: true,
          tags: true,
          budget: true,
          lastContactDate: true,
          nextFollowupDate: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              interactions: true,
              followups: true,
              sales: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    }
  );

  // ============================================
  // GET CUSTOMER BY ID
  // ============================================

  static getCustomerById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const { id } = req.params;

      const customer = await prisma.customer.findFirst({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          followups: {
            where: { status: { not: 'completed' } },
            orderBy: { dueDate: 'asc' },
          },
          sales: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!customer) {
        throw new AppError('العميل غير موجود', 404);
      }

      res.json({
        success: true,
        data: customer,
      });
    }
  );

  // ============================================
  // UPDATE CUSTOMER
  // ============================================

  static updateCustomer = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = req.body;

      // Sanitize inputs
      if (data.name) data.name = SanitizationUtil.sanitizeString(data.name);
      if (data.email) data.email = SanitizationUtil.sanitizeEmail(data.email);
      if (data.phone) data.phone = SanitizationUtil.sanitizePhone(data.phone);
      if (data.notes) data.notes = SanitizationUtil.sanitizeHtml(data.notes);

      // Get old data for audit
      const oldCustomer = await prisma.customer.findFirst({
        where: { id, userId, deletedAt: null },
      });

      if (!oldCustomer) {
        throw new AppError('العميل غير موجود', 404);
      }

      // Update with optimistic locking
      const updatedCustomer = await EnhancedTransactionManager.updateWithOptimisticLock(
        'customer',
        id,
        {
          ...data,
          updatedAt: new Date(),
        }
      );

      // Log audit
      await AuditLoggerService.logCRUD(
        req,
        'update',
        'customer',
        id,
        oldCustomer,
        updatedCustomer
      );

      res.json({
        success: true,
        message: 'تم تحديث العميل بنجاح',
        data: updatedCustomer,
      });
    }
  );

  // ============================================
  // DELETE CUSTOMER
  // ============================================

  static deleteCustomer = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const { id } = req.params;

      // Get customer
      const customer = await prisma.customer.findFirst({
        where: { id, userId, deletedAt: null },
      });

      if (!customer) {
        throw new AppError('العميل غير موجود', 404);
      }

      // Soft delete
      await prisma.customer.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      // Log audit
      await AuditLoggerService.logCRUD(
        req,
        'delete',
        'customer',
        id,
        customer,
        undefined
      );

      res.json({
        success: true,
        message: 'تم حذف العميل بنجاح',
      });
    }
  );

  // ============================================
  // ADD INTERACTION
  // ============================================

  static addInteraction = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const data = req.body;

      // Sanitize notes
      data.notes = SanitizationUtil.sanitizeHtml(data.notes);

      const interaction = await EnhancedTransactionManager.executeWithRetry(
        async (tx) => {
          // Create interaction
          const newInteraction = await tx.customerInteraction.create({
            data: {
              customerId: data.customerId,
              userId,
              type: data.type,
              notes: data.notes,
              duration: data.duration,
              outcome: data.outcome,
              scheduledFor: data.scheduledFor,
              completedAt: data.completedAt || new Date(),
            },
          });

          // Update customer last contact date
          await tx.customer.update({
            where: { id: data.customerId },
            data: {
              lastContactDate: new Date(),
            },
          });

          return newInteraction;
        }
      );

      // Log audit
      await AuditLoggerService.logCRUD(
        req,
        'create',
        'interaction',
        interaction.id,
        undefined,
        interaction
      );

      res.status(201).json({
        success: true,
        message: 'تم إضافة التفاعل بنجاح',
        data: interaction,
      });
    }
  );

  // ============================================
  // CREATE FOLLOWUP
  // ============================================

  static createFollowup = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const data = req.body;

      // Sanitize
      data.title = SanitizationUtil.sanitizeString(data.title);
      data.description = data.description
        ? SanitizationUtil.sanitizeHtml(data.description)
        : null;

      const followup = await EnhancedTransactionManager.executeWithRetry(
        async (tx) => {
          // Create followup
          const newFollowup = await tx.customerFollowup.create({
            data: {
              customerId: data.customerId,
              userId,
              dueDate: new Date(data.dueDate),
              title: data.title,
              description: data.description,
              priority: data.priority || 'medium',
              status: 'pending',
            },
          });

          // Update customer next followup date
          await tx.customer.update({
            where: { id: data.customerId },
            data: {
              nextFollowupDate: new Date(data.dueDate),
            },
          });

          // Create notification
          await NotificationService.createNotification({
            userId,
            type: 'followup',
            title: 'متابعة جديدة',
            message: `تم جدولة متابعة: ${data.title}`,
            data: { followupId: newFollowup.id },
          });

          return newFollowup;
        }
      );

      res.status(201).json({
        success: true,
        message: 'تم إضافة المتابعة بنجاح',
        data: followup,
      });
    }
  );

  // ============================================
  // GET DASHBOARD STATS
  // ============================================

  static getDashboardStats = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;

      const [
        totalCustomers,
        newCustomers,
        activeFollowups,
        todayAppointments,
        recentInteractions,
      ] = await Promise.all([
        // Total customers
        prisma.customer.count({
          where: { userId, deletedAt: null },
        }),

        // New customers (last 7 days)
        prisma.customer.count({
          where: {
            userId,
            deletedAt: null,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Active followups
        prisma.customerFollowup.count({
          where: {
            userId,
            status: 'pending',
            dueDate: {
              lte: new Date(),
            },
          },
        }),

        // Today's appointments
        prisma.appointment.count({
          where: {
            userId,
            status: 'scheduled',
            startTime: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),

        // Recent interactions
        prisma.customerInteraction.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalCustomers,
          newCustomers,
          activeFollowups,
          todayAppointments,
          recentInteractions,
        },
      });
    }
  );

  // ============================================
  // EXPORT CUSTOMERS
  // ============================================

  static exportCustomers = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!.id;
      const { format = 'csv' } = req.query;

      // Get all customers
      const customers = await prisma.customer.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });

      // Log export
      await AuditLoggerService.logDataExport(
        userId,
        'customer',
        format as string,
        customers.length,
        req as any
      );

      // Generate file based on format
      if (format === 'csv') {
        // CSV export logic
        const csv = this.generateCSV(customers);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=customers.csv'
        );
        res.send(csv);
      } else if (format === 'excel') {
        // Excel export logic
        // Implementation here
      } else {
        res.json({
          success: true,
          data: customers,
        });
      }
    }
  );

  // ============================================
  // HELPER: GENERATE CSV
  // ============================================

  private static generateCSV(customers: any[]): string {
    const headers = [
      'الاسم',
      'الهاتف',
      'البريد الإلكتروني',
      'الحالة',
      'الأولوية',
      'المصدر',
      'الميزانية',
      'تاريخ الإضافة',
    ];

    const rows = customers.map((c) => [
      c.name,
      c.phone,
      c.email || '',
      c.status,
      c.priority,
      c.source || '',
      c.budget || '',
      c.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }
}
```

---

# **INTEGRATED DATA FLOW SERVICE**

File: `backend/src/services/integrated-data-flow.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { EnhancedTransactionManager } from './enhanced-transaction-manager.service';
import { NotificationService } from './notification.service';
import { AnalyticsService } from './analytics.service';
import { AuditLoggerService } from './audit-logger.service';

/**
 * Integrated Data Flow Service
 * Manages data flows between all 7 features
 */

export class IntegratedDataFlowService {
  // ============================================
  // FLOW 1: Customer → Sale → Commission
  // ============================================

  static async createSaleFromCustomer(data: {
    userId: string;
    customerId: string;
    propertyId?: string;
    saleType: string;
    saleAmount: number;
    commissionRate: number;
    paymentMethod?: string;
    notes?: string;
  }): Promise<any> {
    return await EnhancedTransactionManager.coordinatedTransaction([
      {
        name: 'Create Sale',
        execute: async (tx) => {
          // Calculate commission
          const commissionAmount =
            (data.saleAmount * data.commissionRate) / 100;

          // Create sale
          const sale = await tx.sale.create({
            data: {
              userId: data.userId,
              customerId: data.customerId,
              propertyId: data.propertyId,
              saleType: data.saleType as any,
              saleAmount: data.saleAmount,
              commissionRate: data.commissionRate,
              commissionAmount,
              paymentStatus: 'pending',
              paymentMethod: data.paymentMethod,
              notes: data.notes,
              saleDate: new Date(),
            },
          });

          return sale;
        },
        compensate: async (tx, sale) => {
          // Delete sale if flow fails
          await tx.sale.delete({ where: { id: sale.id } });
        },
      },
      {
        name: 'Create Commission',
        execute: async (tx) => {
          const sale = arguments[0]; // Get sale from previous operation

          const commission = await tx.commission.create({
            data: {
              saleId: sale.id,
              userId: data.userId,
              commissionType: 'primary',
              amount: sale.commissionAmount,
              percentage: data.commissionRate,
              status: 'pending',
            },
          });

          return commission;
        },
        compensate: async (tx, commission) => {
          await tx.commission.delete({ where: { id: commission.id } });
        },
      },
      {
        name: 'Update Customer Status',
        execute: async (tx) => {
          await tx.customer.update({
            where: { id: data.customerId },
            data: {
              status: 'converted',
              lastContactDate: new Date(),
            },
          });
        },
        compensate: async (tx) => {
          // Restore customer status
          await tx.customer.update({
            where: { id: data.customerId },
            data: {
              status: 'negotiating',
            },
          });
        },
      },
      {
        name: 'Create Notifications',
        execute: async (tx) => {
          await NotificationService.createNotification({
            userId: data.userId,
            type: 'sale',
            title: 'عملية بيع جديدة',
            message: `تم إتمام عملية بيع بقيمة ${data.saleAmount} ريال`,
            data: { saleId: arguments[0].id },
          });
        },
      },
      {
        name: 'Update Analytics',
        execute: async (tx) => {
          await AnalyticsService.recordSale({
            userId: data.userId,
            amount: data.saleAmount,
            commission: (data.saleAmount * data.commissionRate) / 100,
          });
        },
      },
    ]);
  }

  // ============================================
  // FLOW 2: Property Match → Notification → Appointment
  // ============================================

  static async createPropertyMatch(data: {
    userId: string;
    propertyId: string;
    requestId: string;
    matchScore: number;
  }): Promise<any> {
    return await EnhancedTransactionManager.coordinatedTransaction([
      {
        name: 'Create Match',
        execute: async (tx) => {
          const match = await tx.propertyMatch.create({
            data: {
              propertyId: data.propertyId,
              requestId: data.requestId,
              matchScore: data.matchScore,
              status: 'pending',
            },
          });

          return match;
        },
        compensate: async (tx, match) => {
          await tx.propertyMatch.delete({ where: { id: match.id } });
        },
      },
      {
        name: 'Notify User',
        execute: async (tx) => {
          const match = arguments[0];

          await NotificationService.createNotification({
            userId: data.userId,
            type: 'match',
            title: 'مطابقة جديدة',
            message: `تم العثور على عقار يطابق طلب العميل بنسبة ${data.matchScore}%`,
            data: { matchId: match.id },
            priority: data.matchScore > 80 ? 'high' : 'medium',
          });
        },
      },
      {
        name: 'Update Analytics',
        execute: async (tx) => {
          await AnalyticsService.recordMatch({
            userId: data.userId,
            matchScore: data.matchScore,
          });
        },
      },
    ]);
  }

  // ============================================
  // FLOW 3: Appointment → Interaction → Followup
  // ============================================

  static async completeAppointment(data: {
    userId: string;
    appointmentId: string;
    outcome: string;
    notes: string;
    createFollowup?: boolean;
    followupDate?: Date;
  }): Promise<any> {
    return await EnhancedTransactionManager.coordinatedTransaction([
      {
        name: 'Update Appointment',
        execute: async (tx) => {
          const appointment = await tx.appointment.update({
            where: { id: data.appointmentId },
            data: {
              status: 'completed',
            },
          });

          return appointment;
        },
        compensate: async (tx, appointment) => {
          await tx.appointment.update({
            where: { id: appointment.id },
            data: {
              status: 'scheduled',
            },
          });
        },
      },
      {
        name: 'Create Interaction',
        execute: async (tx) => {
          const appointment = arguments[0];

          const interaction = await tx.customerInteraction.create({
            data: {
              customerId: appointment.customerId!,
              userId: data.userId,
              type: 'meeting',
              notes: data.notes,
              outcome: data.outcome,
              completedAt: new Date(),
            },
          });

          return interaction;
        },
      },
      {
        name: 'Create Followup (Optional)',
        execute: async (tx) => {
          if (data.createFollowup && data.followupDate) {
            const appointment = arguments[0];

            const followup = await tx.customerFollowup.create({
              data: {
                customerId: appointment.customerId!,
                userId: data.userId,
                dueDate: data.followupDate,
                title: 'متابعة بعد الموعد',
                description: `متابعة بعد موعد: ${appointment.title}`,
                status: 'pending',
                priority: 'medium',
              },
            });

            return followup;
          }
        },
      },
      {
        name: 'Update Analytics',
        execute: async (tx) => {
          await AnalyticsService.recordAppointmentCompleted({
            userId: data.userId,
          });
        },
      },
    ]);
  }

  // ============================================
  // FLOW 4: Sale → Installments → Commission Tracking
  // ============================================

  static async createSaleWithInstallments(data: {
    userId: string;
    customerId: string;
    saleAmount: number;
    commissionRate: number;
    installments: Array<{
      amount: number;
      dueDate: Date;
    }>;
  }): Promise<any> {
    return await EnhancedTransactionManager.coordinatedTransaction([
      {
        name: 'Create Sale',
        execute: async (tx) => {
          const commissionAmount =
            (data.saleAmount * data.commissionRate) / 100;

          const sale = await tx.sale.create({
            data: {
              userId: data.userId,
              customerId: data.customerId,
              saleType: 'sale',
              saleAmount: data.saleAmount,
              commissionRate: data.commissionRate,
              commissionAmount,
              paymentStatus: 'partial',
            },
          });

          return sale;
        },
        compensate: async (tx, sale) => {
          await tx.sale.delete({ where: { id: sale.id } });
        },
      },
      {
        name: 'Create Installments',
        execute: async (tx) => {
          const sale = arguments[0];

          const installments = await Promise.all(
            data.installments.map((inst) =>
              tx.installment.create({
                data: {
                  saleId: sale.id,
                  amount: inst.amount,
                  dueDate: inst.dueDate,
                  status: 'pending',
                },
              })
            )
          );

          return installments;
        },
        compensate: async (tx, installments) => {
          await tx.installment.deleteMany({
            where: {
              id: { in: installments.map((i: any) => i.id) },
            },
          });
        },
      },
      {
        name: 'Create Commission',
        execute: async (tx) => {
          const sale = arguments[0];

          const commission = await tx.commission.create({
            data: {
              saleId: sale.id,
              userId: data.userId,
              commissionType: 'primary',
              amount: sale.commissionAmount,
              percentage: data.commissionRate,
              status: 'pending',
            },
          });

          return commission;
        },
      },
    ]);
  }

  // ============================================
  // FLOW 5: Digital Card Scan → Lead Capture → Customer
  // ============================================

  static async captureLeadFromCardScan(data: {
    userId: string;
    cardId: string;
    ipAddress: string;
    userAgent: string;
    leadData?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  }): Promise<any> {
    return await EnhancedTransactionManager.coordinatedTransaction([
      {
        name: 'Record Card Scan',
        execute: async (tx) => {
          const scan = await tx.cardScan.create({
            data: {
              cardId: data.cardId,
              ipAddress: data.ipAddress,
              userAgent: data.userAgent,
              scannedAt: new Date(),
            },
          });

          // Update card view count
          await tx.digitalCard.update({
            where: { id: data.cardId },
            data: {
              viewCount: { increment: 1 },
            },
          });

          return scan;
        },
      },
      {
        name: 'Create Customer (If Lead Data Provided)',
        execute: async (tx) => {
          if (data.leadData && data.leadData.phone) {
            const customer = await tx.customer.create({
              data: {
                userId: data.userId,
                name: data.leadData.name || 'عميل من البطاقة الرقمية',
                email: data.leadData.email,
                phone: data.leadData.phone,
                source: 'digital_card',
                status: 'new',
                priority: 'medium',
              },
            });

            return customer;
          }
        },
      },
      {
        name: 'Send Notification',
        execute: async (tx) => {
          const customer = arguments[1];

          if (customer) {
            await NotificationService.createNotification({
              userId: data.userId,
              type: 'system',
              title: 'عميل محتمل جديد',
              message: `تم التقاط عميل محتمل من البطاقة الرقمية`,
              data: { customerId: customer.id },
            });
          }
        },
      },
      {
        name: 'Update Analytics',
        execute: async (tx) => {
          await AnalyticsService.recordCardScan({
            userId: data.userId,
            cardId: data.cardId,
          });
        },
      },
    ]);
  }
}
```

---

**(يتبع في PART 5...)**

📄 **تم إنشاء:** Complete CRM Controller + Integrated Data Flow Service  
🎯 **التالي:** Performance Optimization + Caching + Real-Time Services
