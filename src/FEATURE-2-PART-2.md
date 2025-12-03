# 🚀 **FEATURE 2: FINANCE INTEGRATION - PART 2**
## **Backend APIs + Commission Service + Payment Processing**

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Sales Controller**

File: `backend/src/controllers/sale.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { CommissionService } from '../services/commission.service';
import { Decimal } from '@prisma/client/runtime/library';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createSaleSchema = z.object({
  propertyId: z.string().uuid().optional().nullable(),
  customerId: z.string().uuid().optional().nullable(),
  ownerId: z.string().uuid().optional().nullable(),
  seekerId: z.string().uuid().optional().nullable(),
  saleType: z.enum(['sale', 'rent', 'lease']),
  propertyPrice: z.number().positive(),
  saleAmount: z.number().positive(),
  downPayment: z.number().min(0).default(0),
  commissionPercentage: z.number().min(0).max(100).optional(),
  contractDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const updateSaleSchema = createSaleSchema.partial();

// ============================================
// SALE CONTROLLER
// ============================================

export class SaleController {
  
  // Get all sales
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        status,
        saleType,
        paymentStatus,
        customerId,
        propertyId,
        startDate,
        endDate,
        page = '1',
        limit = '20',
      } = req.query;

      const where: any = { userId };

      if (status) where.status = status;
      if (saleType) where.saleType = saleType;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      if (customerId) where.customerId = customerId;
      if (propertyId) where.propertyId = propertyId;

      if (startDate && endDate) {
        where.contractDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [sales, total] = await Promise.all([
        prisma.sale.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
          include: {
            property: {
              select: {
                id: true,
                title: true,
                propertyType: true,
                city: true,
              },
            },
            customer: {
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
              },
            },
            _count: {
              select: {
                payments: true,
                commissions: true,
              },
            },
          },
        }),
        prisma.sale.count({ where }),
      ]);

      res.json({
        success: true,
        data: sales,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single sale
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const sale = await prisma.sale.findFirst({
        where: { id, userId },
        include: {
          property: true,
          customer: true,
          owner: true,
          seeker: true,
          payments: {
            orderBy: { paymentDate: 'desc' },
          },
          commissions: {
            include: {
              broker: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          installments: {
            orderBy: { dueDate: 'asc' },
          },
          invoices: {
            orderBy: { issueDate: 'desc' },
          },
        },
      });

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found',
        });
      }

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create sale
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createSaleSchema.parse(req.body);

      const propertyPrice = new Decimal(data.propertyPrice);
      const saleAmount = new Decimal(data.saleAmount);
      const downPayment = new Decimal(data.downPayment);
      const remainingAmount = new Decimal(saleAmount.toNumber() - downPayment.toNumber());

      // Auto-calculate commission if not provided
      let commissionPercentage: Decimal;
      if (data.commissionPercentage) {
        commissionPercentage = new Decimal(data.commissionPercentage);
      } else {
        // Get from commission tiers
        commissionPercentage = await CommissionService.getCommissionRate(
          userId,
          data.saleType,
          saleAmount.toNumber(),
          null // property type
        );
      }

      const commissionAmount = new Decimal(
        (saleAmount.toNumber() * commissionPercentage.toNumber()) / 100
      );

      // Generate contract number
      const contractNumber = data.contractDate
        ? await this.generateContractNumber()
        : null;

      const sale = await prisma.sale.create({
        data: {
          userId,
          propertyId: data.propertyId,
          customerId: data.customerId,
          ownerId: data.ownerId,
          seekerId: data.seekerId,
          saleType: data.saleType,
          contractNumber,
          propertyPrice,
          saleAmount,
          downPayment,
          remainingAmount,
          commissionPercentage,
          commissionAmount,
          contractDate: data.contractDate ? new Date(data.contractDate) : null,
          notes: data.notes,
        },
        include: {
          property: true,
          customer: true,
        },
      });

      // Create commission record
      if (sale.status !== 'draft') {
        await CommissionService.createCommission(sale.id, userId);
      }

      res.status(201).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update sale
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateSaleSchema.parse(req.body);

      const existing = await prisma.sale.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found',
        });
      }

      // Recalculate if amounts changed
      let updateData: any = { ...data };

      if (data.saleAmount || data.downPayment) {
        const saleAmount = data.saleAmount
          ? new Decimal(data.saleAmount)
          : existing.saleAmount;
        const downPayment = data.downPayment !== undefined
          ? new Decimal(data.downPayment)
          : existing.downPayment;

        updateData.saleAmount = saleAmount;
        updateData.downPayment = downPayment;
        updateData.remainingAmount = new Decimal(
          saleAmount.toNumber() - downPayment.toNumber()
        );

        // Recalculate commission
        const commissionPercentage = data.commissionPercentage
          ? new Decimal(data.commissionPercentage)
          : existing.commissionPercentage;

        updateData.commissionPercentage = commissionPercentage;
        updateData.commissionAmount = new Decimal(
          (saleAmount.toNumber() * commissionPercentage.toNumber()) / 100
        );
      }

      if (data.propertyPrice) {
        updateData.propertyPrice = new Decimal(data.propertyPrice);
      }

      if (data.contractDate) {
        updateData.contractDate = new Date(data.contractDate);
      }

      const sale = await prisma.sale.update({
        where: { id },
        data: updateData,
        include: {
          property: true,
          customer: true,
        },
      });

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete sale
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.sale.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found',
        });
      }

      // Can only delete drafts
      if (existing.status !== 'draft') {
        return res.status(400).json({
          success: false,
          message: 'Can only delete draft sales',
        });
      }

      await prisma.sale.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Sale deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Approve sale
  static async approve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.sale.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found',
        });
      }

      if (existing.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Sale already approved',
        });
      }

      const sale = await prisma.sale.update({
        where: { id },
        data: {
          status: 'approved',
          approvedAt: new Date(),
        },
      });

      // Create commission if not exists
      const existingCommission = await prisma.commission.findFirst({
        where: { saleId: id },
      });

      if (!existingCommission) {
        await CommissionService.createCommission(id, userId);
      }

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  // Complete sale
  static async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.sale.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found',
        });
      }

      const sale = await prisma.sale.update({
        where: { id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      // Update commission status
      await prisma.commission.updateMany({
        where: { saleId: id, status: 'pending' },
        data: { status: 'approved' },
      });

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel sale
  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { reason } = req.body;

      const existing = await prisma.sale.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found',
        });
      }

      const sale = await prisma.sale.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
      });

      // Cancel commissions
      await prisma.commission.updateMany({
        where: { saleId: id },
        data: { status: 'rejected' },
      });

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sales stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { days = '30' } = req.query;

      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const [
        totalSales,
        completedSales,
        pendingSales,
        totalRevenue,
        totalCommissions,
      ] = await Promise.all([
        prisma.sale.count({ where: { userId } }),
        prisma.sale.count({
          where: { userId, status: 'completed' },
        }),
        prisma.sale.count({
          where: {
            userId,
            status: { in: ['draft', 'pending', 'approved'] },
          },
        }),
        prisma.sale.aggregate({
          where: {
            userId,
            status: 'completed',
            completedAt: { gte: startDate },
          },
          _sum: { saleAmount: true },
        }),
        prisma.commission.aggregate({
          where: {
            userId,
            paid: true,
            paidAt: { gte: startDate },
          },
          _sum: { totalAmount: true },
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalSales,
          completedSales,
          pendingSales,
          totalRevenue: totalRevenue._sum.saleAmount || 0,
          totalCommissions: totalCommissions._sum.totalAmount || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper: Generate contract number
  private static async generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.sale.count({
      where: {
        contractNumber: {
          startsWith: `CON-${year}-`,
        },
      },
    });

    return `CON-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }
}
```

---

# 4️⃣ **COMMISSION SERVICE**

File: `backend/src/services/commission.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class CommissionService {
  
  // ============================================
  // GET COMMISSION RATE
  // ============================================
  
  static async getCommissionRate(
    userId: string,
    saleType: string,
    saleAmount: number,
    propertyType: string | null
  ): Promise<Decimal> {
    // Find matching tier
    const tiers = await prisma.commissionTier.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { saleType },
          { saleType: null },
        ],
      },
      orderBy: { priority: 'asc' },
    });

    for (const tier of tiers) {
      // Check property type match
      if (tier.propertyType && propertyType && tier.propertyType !== propertyType) {
        continue;
      }

      // Check amount range
      const minAmount = tier.minAmount.toNumber();
      const maxAmount = tier.maxAmount?.toNumber();

      if (saleAmount >= minAmount && (maxAmount === null || saleAmount <= maxAmount)) {
        return tier.percentage;
      }
    }

    // Default rate
    return new Decimal(2.5);
  }

  // ============================================
  // CREATE COMMISSION
  // ============================================
  
  static async createCommission(
    saleId: string,
    brokerId: string
  ): Promise<void> {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Check if commission already exists
    const existing = await prisma.commission.findFirst({
      where: { saleId, brokerId },
    });

    if (existing) {
      return; // Already created
    }

    const baseAmount = sale.saleAmount;
    const percentage = sale.commissionPercentage;
    const commissionAmount = sale.commissionAmount;

    // Tax calculation (15% VAT in Saudi Arabia)
    const taxPercentage = new Decimal(15);
    const netAmount = commissionAmount;
    const taxAmount = new Decimal(
      (netAmount.toNumber() * taxPercentage.toNumber()) / 100
    );
    const totalAmount = new Decimal(netAmount.toNumber() + taxAmount.toNumber());

    // Due date: 30 days after sale completion
    const dueDate = sale.completedAt
      ? new Date(sale.completedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      : null;

    await prisma.commission.create({
      data: {
        userId: sale.userId,
        saleId,
        brokerId,
        brokerRole: 'primary',
        commissionType: sale.saleType,
        percentage,
        baseAmount,
        commissionAmount,
        deductions: new Decimal(0),
        netAmount,
        taxPercentage,
        taxAmount,
        totalAmount,
        status: 'pending',
        dueDate,
      },
    });

    console.log(`✅ Commission created for sale ${saleId}`);
  }

  // ============================================
  // APPROVE COMMISSION
  // ============================================
  
  static async approveCommission(
    commissionId: string,
    approvedBy: string
  ): Promise<void> {
    await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'approved',
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }

  // ============================================
  // PAY COMMISSION
  // ============================================
  
  static async payCommission(
    commissionId: string,
    paymentMethod: string,
    paymentReference?: string
  ): Promise<void> {
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: { sale: true },
    });

    if (!commission) {
      throw new Error('Commission not found');
    }

    if (commission.paid) {
      throw new Error('Commission already paid');
    }

    // Update commission
    await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'paid',
        paid: true,
        paidAt: new Date(),
        paymentMethod,
        paymentReference,
      },
    });

    // Update sale
    await prisma.sale.update({
      where: { id: commission.saleId },
      data: {
        commissionPaid: true,
        commissionPaidAt: new Date(),
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: commission.userId,
        saleId: commission.saleId,
        paymentType: 'commission_payment',
        amount: commission.totalAmount,
        paymentMethod,
        paymentDate: new Date(),
        status: 'completed',
        transferReference: paymentReference,
        recipientType: 'broker',
        recipientId: commission.brokerId,
      },
    });

    console.log(`✅ Commission ${commissionId} marked as paid`);
  }

  // ============================================
  // CALCULATE TOTAL COMMISSIONS
  // ============================================
  
  static async calculateTotalCommissions(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    total: number;
    paid: number;
    pending: number;
    approved: number;
  }> {
    const where: any = { userId };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [total, paid, pending, approved] = await Promise.all([
      prisma.commission.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
      prisma.commission.aggregate({
        where: { ...where, paid: true },
        _sum: { totalAmount: true },
      }),
      prisma.commission.aggregate({
        where: { ...where, status: 'pending' },
        _sum: { totalAmount: true },
      }),
      prisma.commission.aggregate({
        where: { ...where, status: 'approved' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      total: total._sum.totalAmount?.toNumber() || 0,
      paid: paid._sum.totalAmount?.toNumber() || 0,
      pending: pending._sum.totalAmount?.toNumber() || 0,
      approved: approved._sum.totalAmount?.toNumber() || 0,
    };
  }

  // ============================================
  // SPLIT COMMISSION
  // ============================================
  
  static async splitCommission(
    saleId: string,
    splits: Array<{
      brokerId: string;
      percentage: number;
      role: string;
    }>
  ): Promise<void> {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Validate percentages total 100
    const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Split percentages must total 100%');
    }

    // Delete existing commissions
    await prisma.commission.deleteMany({
      where: { saleId },
    });

    // Create split commissions
    for (const split of splits) {
      const commissionAmount = new Decimal(
        (sale.commissionAmount.toNumber() * split.percentage) / 100
      );

      const taxPercentage = new Decimal(15);
      const netAmount = commissionAmount;
      const taxAmount = new Decimal(
        (netAmount.toNumber() * taxPercentage.toNumber()) / 100
      );
      const totalAmount = new Decimal(netAmount.toNumber() + taxAmount.toNumber());

      await prisma.commission.create({
        data: {
          userId: sale.userId,
          saleId,
          brokerId: split.brokerId,
          brokerRole: split.role,
          commissionType: sale.saleType,
          percentage: new Decimal(split.percentage),
          baseAmount: sale.saleAmount,
          commissionAmount,
          netAmount,
          taxPercentage,
          taxAmount,
          totalAmount,
          status: 'pending',
        },
      });
    }

    // Update sale
    await prisma.sale.update({
      where: { id: saleId },
      data: {
        splitCommission: true,
      },
    });

    console.log(`✅ Commission split created for sale ${saleId}`);
  }
}
```

---

# 5️⃣ **PAYMENT PROCESSING**

File: `backend/src/controllers/payment.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { Decimal } from '@prisma/client/runtime/library';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createPaymentSchema = z.object({
  saleId: z.string().uuid().optional().nullable(),
  paymentType: z.enum(['sale_payment', 'commission_payment', 'refund', 'advance']),
  amount: z.number().positive(),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'cheque', 'online']),
  paymentDate: z.string().datetime().optional(),
  cardLastFour: z.string().optional(),
  chequeNumber: z.string().optional(),
  transferReference: z.string().optional(),
  bankName: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================
// PAYMENT CONTROLLER
// ============================================

export class PaymentController {
  
  // Get all payments
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        saleId,
        status,
        paymentMethod,
        startDate,
        endDate,
        page = '1',
        limit = '20',
      } = req.query;

      const where: any = { userId };

      if (saleId) where.saleId = saleId;
      if (status) where.status = status;
      if (paymentMethod) where.paymentMethod = paymentMethod;

      if (startDate && endDate) {
        where.paymentDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { paymentDate: 'desc' },
          include: {
            sale: {
              select: {
                id: true,
                contractNumber: true,
                saleType: true,
                customer: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        prisma.payment.count({ where }),
      ]);

      res.json({
        success: true,
        data: payments,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Create payment
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createPaymentSchema.parse(req.body);

      const amount = new Decimal(data.amount);
      const paymentDate = data.paymentDate
        ? new Date(data.paymentDate)
        : new Date();

      // Generate receipt number
      const receiptNumber = await this.generateReceiptNumber();

      const payment = await prisma.payment.create({
        data: {
          userId,
          saleId: data.saleId,
          paymentType: data.paymentType,
          amount,
          paymentMethod: data.paymentMethod,
          paymentDate,
          status: 'completed',
          cardLastFour: data.cardLastFour,
          chequeNumber: data.chequeNumber,
          transferReference: data.transferReference,
          bankName: data.bankName,
          receiptNumber,
          notes: data.notes,
        },
        include: {
          sale: true,
        },
      });

      // Update sale payment status if applicable
      if (data.saleId) {
        await this.updateSalePaymentStatus(data.saleId);
      }

      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update sale payment status
  private static async updateSalePaymentStatus(saleId: string): Promise<void> {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        payments: {
          where: { status: 'completed' },
        },
      },
    });

    if (!sale) return;

    const totalPaid = sale.payments.reduce(
      (sum, p) => sum + p.amount.toNumber(),
      0
    );

    const saleAmount = sale.saleAmount.toNumber();

    let paymentStatus: string;
    if (totalPaid >= saleAmount) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    } else {
      paymentStatus = 'unpaid';
    }

    await prisma.sale.update({
      where: { id: saleId },
      data: { paymentStatus },
    });
  }

  // Get payment stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { days = '30' } = req.query;

      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const [totalPayments, totalAmount, byMethod] = await Promise.all([
        prisma.payment.count({
          where: {
            userId,
            status: 'completed',
            paymentDate: { gte: startDate },
          },
        }),
        prisma.payment.aggregate({
          where: {
            userId,
            status: 'completed',
            paymentDate: { gte: startDate },
          },
          _sum: { amount: true },
        }),
        prisma.payment.groupBy({
          by: ['paymentMethod'],
          where: {
            userId,
            status: 'completed',
            paymentDate: { gte: startDate },
          },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalPayments,
          totalAmount: totalAmount._sum.amount || 0,
          byMethod,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Generate receipt number
  private static async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.payment.count({
      where: {
        receiptNumber: {
          startsWith: `RCP-${year}-`,
        },
      },
    });

    return `RCP-${year}-${(count + 1).toString().padStart(5, '0')}`;
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/FEATURE-2-PART-2.md`  
🎯 **Status:** Part 2 Complete (Backend + Commission + Payment)  
⏱️ **Next:** Frontend Components + Reports + Testing
