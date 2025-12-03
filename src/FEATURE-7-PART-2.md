# 🚀 **FEATURE 7: REPORTS & ANALYTICS - PART 2**
## **Backend APIs + Report Generation + AI Insights**

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Reports Controller**

File: `backend/src/controllers/report.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { ReportGenerationService } from '../services/report-generation.service';
import { AIInsightsService } from '../services/ai-insights.service';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createReportSchema = z.object({
  title: z.string().min(3),
  reportType: z.enum(['sales', 'finance', 'properties', 'customers', 'calendar', 'commissions', 'analytics']),
  format: z.enum(['pdf', 'csv', 'excel', 'json']).default('pdf'),
  filters: z.object({}).passthrough().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  templateId: z.string().uuid().optional(),
});

// ============================================
// REPORT CONTROLLER
// ============================================

export class ReportController {
  
  // Get all reports
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        reportType,
        status,
        format,
        page = '1',
        limit = '20',
      } = req.query;

      const where: any = { userId };

      if (reportType) where.reportType = reportType;
      if (status) where.status = status;
      if (format) where.format = format;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                logs: true,
              },
            },
          },
        }),
        prisma.report.count({ where }),
      ]);

      res.json({
        success: true,
        data: reports,
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

  // Get single report
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const report = await prisma.report.findFirst({
        where: { id, userId },
        include: {
          logs: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found',
        });
      }

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create and generate report
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createReportSchema.parse(req.body);

      // Create report record
      const report = await prisma.report.create({
        data: {
          userId,
          title: data.title,
          reportType: data.reportType,
          format: data.format,
          filters: JSON.stringify(data.filters || {}),
          dateFrom: data.dateFrom ? new Date(data.dateFrom) : null,
          dateTo: data.dateTo ? new Date(data.dateTo) : null,
          status: 'pending',
        },
      });

      // Log start
      await prisma.reportLog.create({
        data: {
          reportId: report.id,
          level: 'info',
          message: 'بدء توليد التقرير',
        },
      });

      // Generate report asynchronously
      ReportGenerationService.generateReport(report.id)
        .catch((error) => {
          console.error('Report generation failed:', error);
        });

      res.status(201).json({
        success: true,
        data: report,
        message: 'Report generation started',
      });
    } catch (error) {
      next(error);
    }
  }

  // Download report file
  static async download(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const report = await prisma.report.findFirst({
        where: { id, userId, status: 'completed' },
      });

      if (!report || !report.fileUrl) {
        return res.status(404).json({
          success: false,
          message: 'Report file not found',
        });
      }

      // In production, serve from cloud storage (S3, etc.)
      const filePath = report.fileUrl;
      
      res.download(filePath, report.fileName || 'report.pdf');
    } catch (error) {
      next(error);
    }
  }

  // Delete report
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.report.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Report not found',
        });
      }

      // TODO: Delete file from storage
      if (existing.fileUrl) {
        // await deleteFile(existing.fileUrl);
      }

      await prisma.report.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Report deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get report templates
  static async getTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { reportType } = req.query;

      const where: any = { userId, isActive: true };
      if (reportType) where.reportType = reportType;

      const templates = await prisma.reportTemplate.findMany({
        where,
        orderBy: { usageCount: 'desc' },
      });

      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get analytics snapshot
  static async getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { days = '30', type = 'daily' } = req.query;

      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const snapshots = await prisma.analyticsSnapshot.findMany({
        where: {
          userId,
          snapshotType: type as string,
          snapshotDate: { gte: startDate },
        },
        orderBy: { snapshotDate: 'asc' },
      });

      res.json({
        success: true,
        data: snapshots,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get KPI metrics
  static async getKPIs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { category } = req.query;

      const where: any = { userId, isActive: true };
      if (category) where.category = category;

      const kpis = await prisma.kPIMetric.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
      });

      res.json({
        success: true,
        data: kpis,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get AI insights
  static async getInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status = 'active', category, priority } = req.query;

      const where: any = { userId, status };
      if (category) where.category = category;
      if (priority) where.priority = priority;

      const insights = await prisma.aIInsight.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { impactScore: 'desc' },
        ],
        take: 10,
      });

      res.json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }

  // Generate AI insights
  static async generateInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      // Generate new insights
      const insights = await AIInsightsService.generateInsights(userId);

      res.json({
        success: true,
        data: insights,
        message: `Generated ${insights.length} new insights`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Dismiss insight
  static async dismissInsight(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const insight = await prisma.aIInsight.findFirst({
        where: { id, userId },
      });

      if (!insight) {
        return res.status(404).json({
          success: false,
          message: 'Insight not found',
        });
      }

      await prisma.aIInsight.update({
        where: { id },
        data: {
          status: 'dismissed',
          dismissedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'Insight dismissed',
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

# 4️⃣ **REPORT GENERATION SERVICE**

File: `backend/src/services/report-generation.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

export class ReportGenerationService {
  
  // ============================================
  // GENERATE REPORT
  // ============================================
  
  static async generateReport(reportId: string): Promise<void> {
    const startTime = Date.now();

    try {
      // Update status
      await prisma.report.update({
        where: { id: reportId },
        data: { status: 'generating' },
      });

      // Get report details
      const report = await prisma.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        throw new Error('Report not found');
      }

      // Log
      await this.log(reportId, 'info', 'جاري جمع البيانات...');

      // Fetch data based on report type
      const data = await this.fetchReportData(report);

      await this.log(reportId, 'info', `تم جمع ${data.length} سجل`);

      // Generate file based on format
      let filePath: string;
      let fileName: string;

      await this.log(reportId, 'info', 'جاري إنشاء الملف...');

      switch (report.format) {
        case 'pdf':
          filePath = await this.generatePDF(report, data);
          fileName = `${report.reportType}_${Date.now()}.pdf`;
          break;
        case 'csv':
          filePath = await this.generateCSV(report, data);
          fileName = `${report.reportType}_${Date.now()}.csv`;
          break;
        case 'excel':
          filePath = await this.generateExcel(report, data);
          fileName = `${report.reportType}_${Date.now()}.xlsx`;
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Get file size
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      const processingTime = Date.now() - startTime;

      // Update report
      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'completed',
          generatedAt: new Date(),
          fileUrl: filePath,
          fileName,
          fileSize,
          totalRecords: data.length,
          processingTime,
        },
      });

      await this.log(reportId, 'info', 'اكتمل إنشاء التقرير بنجاح');

      console.log(`✅ Report ${reportId} generated successfully`);
    } catch (error) {
      console.error(`❌ Report generation failed:`, error);

      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          retryCount: { increment: 1 },
        },
      });

      await this.log(
        reportId,
        'error',
        `فشل إنشاء التقرير: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      );
    }
  }

  // ============================================
  // FETCH REPORT DATA
  // ============================================
  
  private static async fetchReportData(report: any): Promise<any[]> {
    const filters = JSON.parse(report.filters);
    const where: any = { userId: report.userId };

    // Apply date filters
    if (report.dateFrom && report.dateTo) {
      where.createdAt = {
        gte: report.dateFrom,
        lte: report.dateTo,
      };
    }

    switch (report.reportType) {
      case 'sales':
        return await prisma.sale.findMany({
          where: {
            ...where,
            status: { not: 'draft' },
          },
          include: {
            customer: true,
            property: true,
          },
          orderBy: { contractDate: 'desc' },
        });

      case 'finance':
        const [sales, payments, commissions, expenses] = await Promise.all([
          prisma.sale.findMany({ where }),
          prisma.payment.findMany({ where }),
          prisma.commission.findMany({ where }),
          prisma.expense.findMany({ where }),
        ]);
        return [{ sales, payments, commissions, expenses }];

      case 'properties':
        return await prisma.ownerProperty.findMany({
          where,
          include: {
            owner: true,
          },
          orderBy: { createdAt: 'desc' },
        });

      case 'customers':
        return await prisma.customer.findMany({
          where,
          include: {
            _count: {
              select: {
                interactions: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

      case 'calendar':
        return await prisma.appointment.findMany({
          where: {
            ...where,
            startDatetime: {
              gte: report.dateFrom,
              lte: report.dateTo,
            },
          },
          include: {
            customer: true,
            property: true,
          },
          orderBy: { startDatetime: 'asc' },
        });

      case 'commissions':
        return await prisma.commission.findMany({
          where,
          include: {
            sale: {
              include: {
                customer: true,
              },
            },
            broker: true,
          },
          orderBy: { createdAt: 'desc' },
        });

      default:
        return [];
    }
  }

  // ============================================
  // GENERATE PDF
  // ============================================
  
  private static async generatePDF(report: any, data: any[]): Promise<string> {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filePath = path.join(process.cwd(), 'reports', `${report.id}.pdf`);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text(report.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(
      `تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}`,
      { align: 'center' }
    );
    doc.moveDown();

    // Date range
    if (report.dateFrom && report.dateTo) {
      doc.fontSize(12).text(
        `الفترة: ${new Date(report.dateFrom).toLocaleDateString('ar-SA')} - ${new Date(report.dateTo).toLocaleDateString('ar-SA')}`,
        { align: 'center' }
      );
      doc.moveDown();
    }

    // Summary
    doc.fontSize(14).text('ملخص:', { underline: true });
    doc.fontSize(12).text(`إجمالي السجلات: ${data.length}`);
    doc.moveDown();

    // Content based on report type
    if (report.reportType === 'sales') {
      this.addSalesTableToPDF(doc, data);
    } else if (report.reportType === 'customers') {
      this.addCustomersTableToPDF(doc, data);
    } else if (report.reportType === 'properties') {
      this.addPropertiesTableToPDF(doc, data);
    }

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    });
  }

  private static addSalesTableToPDF(doc: any, sales: any[]): void {
    doc.fontSize(14).text('تفاصيل المبيعات:', { underline: true });
    doc.moveDown();

    let y = doc.y;
    sales.forEach((sale, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(10);
      doc.text(`${index + 1}. ${sale.contractNumber || '-'}`, 50, y);
      doc.text(sale.customer?.name || '-', 150, y);
      doc.text(`${sale.saleAmount} ريال`, 300, y);
      doc.text(sale.status, 450, y);

      y += 20;
    });
  }

  private static addCustomersTableToPDF(doc: any, customers: any[]): void {
    doc.fontSize(14).text('قائمة العملاء:', { underline: true });
    doc.moveDown();

    let y = doc.y;
    customers.forEach((customer, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(10);
      doc.text(`${index + 1}. ${customer.name}`, 50, y);
      doc.text(customer.phone, 200, y);
      doc.text(customer.status, 350, y);

      y += 20;
    });
  }

  private static addPropertiesTableToPDF(doc: any, properties: any[]): void {
    doc.fontSize(14).text('قائمة العقارات:', { underline: true });
    doc.moveDown();

    let y = doc.y;
    properties.forEach((property, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(10);
      doc.text(`${index + 1}. ${property.title}`, 50, y);
      doc.text(property.city, 250, y);
      doc.text(`${property.price} ريال`, 350, y);

      y += 20;
    });
  }

  // ============================================
  // GENERATE CSV
  // ============================================
  
  private static async generateCSV(report: any, data: any[]): Promise<string> {
    const filePath = path.join(process.cwd(), 'reports', `${report.id}.csv`);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let headers: any[] = [];
    let records: any[] = [];

    if (report.reportType === 'sales') {
      headers = [
        { id: 'contractNumber', title: 'رقم العقد' },
        { id: 'customerName', title: 'العميل' },
        { id: 'propertyTitle', title: 'العقار' },
        { id: 'saleAmount', title: 'المبلغ' },
        { id: 'commission', title: 'العمولة' },
        { id: 'status', title: 'الحالة' },
      ];

      records = data.map((sale) => ({
        contractNumber: sale.contractNumber,
        customerName: sale.customer?.name,
        propertyTitle: sale.property?.title,
        saleAmount: sale.saleAmount.toString(),
        commission: sale.commissionAmount.toString(),
        status: sale.status,
      }));
    } else if (report.reportType === 'customers') {
      headers = [
        { id: 'name', title: 'الاسم' },
        { id: 'phone', title: 'الهاتف' },
        { id: 'email', title: 'البريد' },
        { id: 'status', title: 'الحالة' },
      ];

      records = data.map((customer) => ({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        status: customer.status,
      }));
    }

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers,
    });

    await csvWriter.writeRecords(records);

    return filePath;
  }

  // ============================================
  // GENERATE EXCEL
  // ============================================
  
  private static async generateExcel(report: any, data: any[]): Promise<string> {
    const filePath = path.join(process.cwd(), 'reports', `${report.id}.xlsx`);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(report.reportType);

    if (report.reportType === 'sales') {
      worksheet.columns = [
        { header: 'رقم العقد', key: 'contractNumber', width: 15 },
        { header: 'العميل', key: 'customerName', width: 20 },
        { header: 'العقار', key: 'propertyTitle', width: 25 },
        { header: 'المبلغ', key: 'saleAmount', width: 15 },
        { header: 'العمولة', key: 'commission', width: 15 },
        { header: 'الحالة', key: 'status', width: 15 },
      ];

      data.forEach((sale) => {
        worksheet.addRow({
          contractNumber: sale.contractNumber,
          customerName: sale.customer?.name,
          propertyTitle: sale.property?.title,
          saleAmount: sale.saleAmount.toNumber(),
          commission: sale.commissionAmount.toNumber(),
          status: sale.status,
        });
      });
    }

    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

  // ============================================
  // LOGGING
  // ============================================
  
  private static async log(
    reportId: string,
    level: string,
    message: string
  ): Promise<void> {
    await prisma.reportLog.create({
      data: {
        reportId,
        level,
        message,
      },
    });
  }
}
```

---

# 5️⃣ **AI INSIGHTS ENGINE**

File: `backend/src/services/ai-insights.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class AIInsightsService {
  
  // ============================================
  // GENERATE INSIGHTS
  // ============================================
  
  static async generateInsights(userId: string): Promise<any[]> {
    const insights: any[] = [];

    // Run all analysis functions
    const [
      salesInsights,
      customerInsights,
      propertyInsights,
      performanceInsights,
    ] = await Promise.all([
      this.analyzeSales(userId),
      this.analyzeCustomers(userId),
      this.analyzeProperties(userId),
      this.analyzePerformance(userId),
    ]);

    insights.push(...salesInsights, ...customerInsights, ...propertyInsights, ...performanceInsights);

    // Save to database
    for (const insight of insights) {
      await prisma.aIInsight.create({
        data: {
          ...insight,
          userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    return insights;
  }

  // ============================================
  // ANALYZE SALES
  // ============================================
  
  private static async analyzeSales(userId: string): Promise<any[]> {
    const insights: any[] = [];

    // Get sales data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentSales, previousSales] = await Promise.all([
      prisma.sale.findMany({
        where: {
          userId,
          status: 'completed',
          completedAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.sale.findMany({
        where: {
          userId,
          status: 'completed',
          completedAt: {
            gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
            lt: thirtyDaysAgo,
          },
        },
      }),
    ]);

    const recentTotal = recentSales.reduce((sum, s) => sum + s.saleAmount.toNumber(), 0);
    const previousTotal = previousSales.reduce((sum, s) => sum + s.saleAmount.toNumber(), 0);

    const changePercentage = previousTotal > 0
      ? ((recentTotal - previousTotal) / previousTotal) * 100
      : 0;

    // Insight: Sales trend
    if (Math.abs(changePercentage) > 15) {
      insights.push({
        insightType: changePercentage > 0 ? 'opportunity' : 'warning',
        category: 'sales',
        title: changePercentage > 0 ? 'ارتفاع في المبيعات' : 'انخفاض في المبيعات',
        description: `المبيعات ${changePercentage > 0 ? 'ارتفعت' : 'انخفضت'} بنسبة ${Math.abs(changePercentage).toFixed(1)}% خلال الـ 30 يوم الماضية`,
        priority: Math.abs(changePercentage) > 30 ? 'high' : 'medium',
        confidenceScore: new Decimal(85),
        impactScore: new Decimal(90),
        suggestedActions: JSON.stringify(
          changePercentage > 0
            ? ['الحفاظ على الزخم', 'زيادة المخزون', 'توسيع فريق المبيعات']
            : ['مراجعة استراتيجية التسعير', 'تكثيف التسويق', 'تحليل المنافسين']
        ),
      });
    }

    return insights;
  }

  // ============================================
  // ANALYZE CUSTOMERS
  // ============================================
  
  private static async analyzeCustomers(userId: string): Promise<any[]> {
    const insights: any[] = [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find inactive customers
    const inactiveCustomers = await prisma.customer.findMany({
      where: {
        userId,
        status: 'active',
        lastContactedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    if (inactiveCustomers.length > 10) {
      insights.push({
        insightType: 'warning',
        category: 'customers',
        title: 'عملاء بحاجة للمتابعة',
        description: `لديك ${inactiveCustomers.length} عميل لم يتم التواصل معهم منذ أكثر من 30 يوم`,
        priority: 'high',
        confidenceScore: new Decimal(95),
        impactScore: new Decimal(75),
        suggestedActions: JSON.stringify([
          'إنشاء حملة متابعة',
          'جدولة مكالمات',
          'إرسال عروض خاصة',
        ]),
      });
    }

    // Analyze customer conversion rate
    const [leads, conversions] = await Promise.all([
      prisma.customer.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.sale.count({
        where: {
          userId,
          status: 'completed',
          completedAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    const conversionRate = leads > 0 ? (conversions / leads) * 100 : 0;

    if (conversionRate < 20) {
      insights.push({
        insightType: 'recommendation',
        category: 'customers',
        title: 'تحسين معدل التحويل',
        description: `معدل التحويل الحالي ${conversionRate.toFixed(1)}% أقل من المتوسط`,
        priority: 'medium',
        confidenceScore: new Decimal(80),
        impactScore: new Decimal(85),
        suggestedActions: JSON.stringify([
          'تحسين عملية المتابعة',
          'تدريب فريق المبيعات',
          'تحليل أسباب فقدان العملاء',
        ]),
      });
    }

    return insights;
  }

  // ============================================
  // ANALYZE PROPERTIES
  // ============================================
  
  private static async analyzeProperties(userId: string): Promise<any[]> {
    const insights: any[] = [];

    // Find properties with high views but no sales
    const properties = await prisma.ownerProperty.findMany({
      where: {
        userId,
        status: 'available',
      },
      include: {
        _count: {
          select: {
            // Assuming there's a views relation
          },
        },
      },
    });

    // Analyze pricing
    const propertiesByCity = properties.reduce((acc: any, prop) => {
      if (!acc[prop.city]) {
        acc[prop.city] = [];
      }
      acc[prop.city].push(prop.price.toNumber());
      return acc;
    }, {});

    for (const [city, prices] of Object.entries(propertiesByCity)) {
      const pricesArray = prices as number[];
      const avgPrice = pricesArray.reduce((sum, p) => sum + p, 0) / pricesArray.length;

      // Check if any property is significantly below market
      const lowPricedCount = pricesArray.filter((p) => p < avgPrice * 0.85).length;

      if (lowPricedCount > 0) {
        insights.push({
          insightType: 'opportunity',
          category: 'properties',
          title: 'فرصة لتعديل الأسعار',
          description: `${lowPricedCount} عقار في ${city} أقل من متوسط السوق بنسبة 15%`,
          priority: 'medium',
          confidenceScore: new Decimal(82),
          impactScore: new Decimal(75),
          suggestedActions: JSON.stringify([
            'مراجعة الأسعار',
            'تحديث التقييم',
            'التواصل مع الملاك',
          ]),
        });
      }
    }

    return insights;
  }

  // ============================================
  // ANALYZE PERFORMANCE
  // ============================================
  
  private static async analyzePerformance(userId: string): Promise<any[]> {
    const insights: any[] = [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Analyze appointment completion rate
    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        startDatetime: { gte: thirtyDaysAgo },
      },
    });

    const completed = appointments.filter((a) => a.status === 'completed').length;
    const completionRate = appointments.length > 0
      ? (completed / appointments.length) * 100
      : 0;

    if (completionRate < 70) {
      insights.push({
        insightType: 'warning',
        category: 'operations',
        title: 'انخفاض معدل إتمام المواعيد',
        description: `معدل إتمام المواعيد ${completionRate.toFixed(1)}% أقل من المستهدف`,
        priority: 'high',
        confidenceScore: new Decimal(90),
        impactScore: new Decimal(80),
        suggestedActions: JSON.stringify([
          'تحسين جدولة المواعيد',
          'تفعيل التذكيرات التلقائية',
          'تحليل أسباب الإلغاء',
        ]),
      });
    }

    return insights;
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/FEATURE-7-PART-2.md`  
🎯 **Status:** Part 2 Complete (Backend + Report Generation + AI)  
⏱️ **Next:** Frontend Components + Export Handlers + Testing
