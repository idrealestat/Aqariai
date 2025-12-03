# 🚀 **نظام المشاركة الكامل - دليل التنفيذ الشامل**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║      🎯 COMPLETE SHARE SYSTEM IMPLEMENTATION 🎯             ║
║                                                               ║
║  نظام مشاركة متكامل مع جميع الميزات المطلوبة              ║
║  11 ميزة رئيسية + Backend + Frontend + Analytics          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📍 **الموقع الحالي لزر المشاركة**

### ✅ المواقع الموجودة حالياً:
```
1. /components/SubOfferDetailModal.tsx (Line 1417)
   - Modal تفاصيل العرض
   - زر مشاركة موجود ✅

2. /components/ShareOfferModal.tsx
   - Modal المشاركة الحالي ✅
   - يدعم: WhatsApp, Email, SMS, Facebook
```

### ⚠️ المواقع المطلوب إضافتها:
```
1. /components/MyPlatform.tsx
   - قسم العروض الرئيسي
   - زر مشاركة على كل عرض ❌

2. /components/owners/MyOffersView.tsx
   - عروض المالك
   - زر مشاركة على كل عرض ❌

3. /components/OffersControlDashboard.tsx
   - لوحة التحكم
   - زر مشاركة سريع ❌
```

---

## 🎯 **الميزات المطلوبة (11 ميزة)**

### 1️⃣ مشاركة عبر الواتساب مع علامة مائية
### 2️⃣ إنشاء كتالوج PDF
### 3️⃣ مشاركة الروابط المباشرة (Touch to Copy)
### 4️⃣ مشاركة الوسائط المتعددة
### 5️⃣ مشاركة عبر منصات متعددة
### 6️⃣ إحصائيات المشاركة والتحليلات
### 7️⃣ تخصيص المشاركة
### 8️⃣ مشاركة جماعية (Bulk Sharing)
### 9️⃣ رموز QR
### 🔟 إدارة جهات الاتصال
### 1️⃣1️⃣ ميزات ذكية إضافية

---

## 📁 **البنية الكاملة**

```
├── Backend (New)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── share.controller.ts           ← جديد
│   │   ├── services/
│   │   │   ├── watermark.service.ts          ← جديد (علامة مائية)
│   │   │   ├── pdf.service.ts                ← جديد (PDF)
│   │   │   ├── qr.service.ts                 ← جديد (QR Codes)
│   │   │   └── share-analytics.service.ts    ← جديد (تحليلات)
│   │   ├── routes/
│   │   │   └── share.routes.ts               ← جديد
│   │   └── types/
│   │       └── share.types.ts                ← جديد
│   └── prisma/
│       └── schema.prisma                      ← تحديث
│
├── Frontend
│   ├── components/
│   │   ├── ShareOfferModal.tsx               ← تحديث كامل
│   │   ├── share/
│   │   │   ├── WatermarkSettings.tsx         ← جديد
│   │   │   ├── PDFGenerator.tsx              ← جديد
│   │   │   ├── QRCodeDisplay.tsx             ← جديد
│   │   │   ├── BulkShareModal.tsx            ← جديد
│   │   │   ├── ShareAnalytics.tsx            ← جديد
│   │   │   ├── ContactsManager.tsx           ← جديد
│   │   │   ├── ScheduleShare.tsx             ← جديد
│   │   │   └── TouchToCopy.tsx               ← جديد
│   │   ├── MyPlatform.tsx                    ← إضافة زر مشاركة
│   │   └── owners/
│   │       └── MyOffersView.tsx              ← إضافة زر مشاركة
│   ├── hooks/
│   │   ├── useShare.ts                       ← جديد
│   │   ├── useWatermark.ts                   ← جديد
│   │   ├── usePDFGenerator.ts                ← جديد
│   │   └── useShareAnalytics.ts              ← جديد
│   └── services/
│       └── api/
│           └── share.ts                      ← جديد
```

---

## 💾 **1. Database Schema (Prisma)**

```prisma
// ملف: backend/prisma/schema.prisma

// إضافة Models جديدة للمشاركة

// تتبع المشاركات
model Share {
  id                String        @id @default(cuid())
  offerId           String
  offer             Property      @relation(fields: [offerId], references: [id], onDelete: Cascade)
  userId            String
  user              User          @relation(fields: [userId], references: [id])
  
  // نوع المشاركة
  shareType         ShareType
  platform          SharePlatform
  
  // الإعدادات
  settings          Json?         // إعدادات المشاركة (watermark, etc)
  
  // التتبع
  shareCount        Int           @default(0)
  viewCount         Int           @default(0)
  clickCount        Int           @default(0)
  
  // الروابط
  shareUrl          String?       @unique
  qrCodeUrl         String?
  pdfUrl            String?
  
  // الحالة
  status            ShareStatus   @default(ACTIVE)
  scheduledFor      DateTime?
  expiresAt         DateTime?
  
  // جهات الاتصال المرسل لهم
  contacts          ShareContact[]
  
  // التحليلات
  analytics         ShareAnalytic[]
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@map("shares")
  @@index([offerId])
  @@index([userId])
  @@index([shareType])
  @@index([platform])
  @@index([createdAt])
}

// جهات الاتصال المشاركة معهم
model ShareContact {
  id                String        @id @default(cuid())
  shareId           String
  share             Share         @relation(fields: [shareId], references: [id], onDelete: Cascade)
  
  contactName       String?
  contactPhone      String?
  contactEmail      String?
  
  status            ContactStatus @default(SENT)
  sentAt            DateTime      @default(now())
  viewedAt          DateTime?
  clickedAt         DateTime?
  
  @@map("share_contacts")
  @@index([shareId])
}

// تحليلات المشاركة
model ShareAnalytic {
  id                String        @id @default(cuid())
  shareId           String
  share             Share         @relation(fields: [shareId], references: [id], onDelete: Cascade)
  
  eventType         AnalyticEvent
  eventData         Json?
  ipAddress         String?
  userAgent         String?
  location          String?
  
  createdAt         DateTime      @default(now())
  
  @@map("share_analytics")
  @@index([shareId])
  @@index([eventType])
  @@index([createdAt])
}

// Enums
enum ShareType {
  SINGLE              // عرض واحد
  MULTIPLE            // عدة عروض
  CATEGORY            // قسم كامل
  CUSTOM              // مخصص
}

enum SharePlatform {
  WHATSAPP
  WHATSAPP_BUSINESS
  TELEGRAM
  FACEBOOK
  INSTAGRAM
  TWITTER
  EMAIL
  SMS
  PDF
  QR_CODE
  DIRECT_LINK
  OTHER
}

enum ShareStatus {
  ACTIVE
  SCHEDULED
  EXPIRED
  CANCELLED
}

enum ContactStatus {
  SENT
  VIEWED
  CLICKED
  CONVERTED
  FAILED
}

enum AnalyticEvent {
  SHARE_CREATED
  SHARE_SENT
  SHARE_VIEWED
  SHARE_CLICKED
  PDF_GENERATED
  QR_GENERATED
  WATERMARK_APPLIED
  LINK_COPIED
  CONTACT_ADDED
}

// تحديث Property model
model Property {
  // ... الحقول الموجودة
  
  // إضافة
  shares            Share[]
  
  // ... باقي الحقول
}

// تحديث User model
model User {
  // ... الحقول الموجودة
  
  // إضافة
  shares            Share[]
  
  // ... باقي الحقول
}
```

### Migration:

```bash
# في: backend/
npx prisma migrate dev --name add_complete_share_system
npx prisma generate
```

---

## 🔧 **2. Backend Services**

### A. Watermark Service

```typescript
// ملف: backend/src/services/watermark.service.ts

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface WatermarkOptions {
  showTitle?: boolean;
  showPrice?: boolean;
  showSKU?: boolean;
  showSellerName?: boolean;
  addLogo?: boolean;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  customText?: string;
}

export class WatermarkService {
  private static UPLOAD_DIR = path.join(__dirname, '../../uploads/watermarked');

  /**
   * إضافة علامة مائية على صورة
   */
  static async addWatermark(
    imagePath: string,
    options: WatermarkOptions,
    offerData: {
      title: string;
      price: number;
      sku: string;
      sellerName: string;
      logo?: string;
    }
  ): Promise<string> {
    try {
      // إنشاء المجلد إذا لم يكن موجوداً
      if (!fs.existsSync(this.UPLOAD_DIR)) {
        fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
      }

      // قراءة الصورة الأصلية
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // إنشاء SVG للعلامة المائية
      const watermarkSvg = this.createWatermarkSVG(
        metadata.width || 800,
        metadata.height || 600,
        options,
        offerData
      );

      // دمج العلامة المائية
      const filename = `watermarked-${uuidv4()}.jpg`;
      const outputPath = path.join(this.UPLOAD_DIR, filename);

      await image
        .composite([
          {
            input: Buffer.from(watermarkSvg),
            top: 0,
            left: 0,
          },
        ])
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      return `/uploads/watermarked/${filename}`;
    } catch (error) {
      console.error('Watermark error:', error);
      throw new Error('فشل في إضافة العلامة المائية');
    }
  }

  /**
   * إنشاء SVG للعلامة المائية
   */
  private static createWatermarkSVG(
    width: number,
    height: number,
    options: WatermarkOptions,
    data: any
  ): string {
    const elements: string[] = [];

    // الخلفية الشفافة
    elements.push(`
      <rect 
        x="0" 
        y="${height - 100}" 
        width="${width}" 
        height="100" 
        fill="rgba(0, 0, 0, 0.7)"
      />
    `);

    // العنوان
    if (options.showTitle) {
      elements.push(`
        <text 
          x="20" 
          y="${height - 70}" 
          font-family="Arial, sans-serif" 
          font-size="24" 
          font-weight="bold" 
          fill="#FFFFFF"
        >
          ${this.escapeXml(data.title)}
        </text>
      `);
    }

    // السعر
    if (options.showPrice) {
      elements.push(`
        <text 
          x="20" 
          y="${height - 40}" 
          font-family="Arial, sans-serif" 
          font-size="20" 
          font-weight="bold" 
          fill="#D4AF37"
        >
          ${data.price.toLocaleString()} ريال
        </text>
      `);
    }

    // SKU
    if (options.showSKU) {
      elements.push(`
        <text 
          x="${width - 150}" 
          y="${height - 70}" 
          font-family="Arial, sans-serif" 
          font-size="16" 
          fill="#FFFFFF"
        >
          رقم: ${data.sku}
        </text>
      `);
    }

    // اسم البائع
    if (options.showSellerName) {
      elements.push(`
        <text 
          x="${width - 150}" 
          y="${height - 40}" 
          font-family="Arial, sans-serif" 
          font-size="14" 
          fill="#CCCCCC"
        >
          ${this.escapeXml(data.sellerName)}
        </text>
      `);
    }

    // الشعار
    if (options.addLogo && data.logo) {
      const logoPosition = this.getLogoPosition(
        width,
        height,
        options.logoPosition || 'top-right'
      );
      elements.push(`
        <image 
          x="${logoPosition.x}" 
          y="${logoPosition.y}" 
          width="80" 
          height="80" 
          href="${data.logo}"
        />
      `);
    }

    return `
      <svg width="${width}" height="${height}">
        ${elements.join('')}
      </svg>
    `;
  }

  private static getLogoPosition(
    width: number,
    height: number,
    position: string
  ): { x: number; y: number } {
    const margin = 20;
    const logoSize = 80;

    switch (position) {
      case 'top-left':
        return { x: margin, y: margin };
      case 'top-right':
        return { x: width - logoSize - margin, y: margin };
      case 'bottom-left':
        return { x: margin, y: height - logoSize - margin };
      case 'bottom-right':
        return { x: width - logoSize - margin, y: height - logoSize - margin };
      default:
        return { x: width - logoSize - margin, y: margin };
    }
  }

  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * معالجة دفعة من الصور
   */
  static async processBatch(
    images: string[],
    options: WatermarkOptions,
    offerData: any
  ): Promise<string[]> {
    const results: string[] = [];

    for (const image of images) {
      try {
        const watermarked = await this.addWatermark(image, options, offerData);
        results.push(watermarked);
      } catch (error) {
        console.error(`Failed to watermark ${image}:`, error);
        results.push(image); // استخدام الصورة الأصلية
      }
    }

    return results;
  }
}
```

---

### B. PDF Service

```typescript
// ملف: backend/src/services/pdf.service.ts

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface PDFOptions {
  title: string;
  description: string;
  price: number;
  images: string[];
  sku: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  logo?: string;
  qrCode?: string;
  customFields?: Record<string, string>;
}

export class PDFService {
  private static UPLOAD_DIR = path.join(__dirname, '../../uploads/pdfs');

  /**
   * إنشاء كتالوج PDF
   */
  static async generateCatalog(options: PDFOptions): Promise<string> {
    try {
      // إنشاء المجلد
      if (!fs.existsSync(this.UPLOAD_DIR)) {
        fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
      }

      const filename = `catalog-${uuidv4()}.pdf`;
      const outputPath = path.join(this.UPLOAD_DIR, filename);

      // إنشاء PDF
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // إضافة محتوى PDF
      await this.addContent(doc, options);

      doc.end();

      // انتظار اكتمال الكتابة
      await new Promise((resolve) => stream.on('finish', resolve));

      return `/uploads/pdfs/${filename}`;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('فشل في إنشاء PDF');
    }
  }

  private static async addContent(doc: typeof PDFDocument, options: PDFOptions) {
    // الألوان
    const primaryColor = '#01411C';
    const secondaryColor = '#D4AF37';

    // Header
    if (options.logo) {
      doc.image(options.logo, 50, 50, { width: 100 });
    }

    doc
      .fontSize(28)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text(options.title, 50, options.logo ? 170 : 50, { align: 'right' });

    doc.moveDown();

    // السعر
    doc
      .fontSize(24)
      .fillColor(secondaryColor)
      .text(`${options.price.toLocaleString()} ريال`, { align: 'right' });

    doc.moveDown(2);

    // الوصف
    doc
      .fontSize(14)
      .fillColor('#000000')
      .font('Helvetica')
      .text(options.description, { align: 'right', width: 500 });

    doc.moveDown(2);

    // الصور
    if (options.images.length > 0) {
      doc
        .fontSize(18)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text('صور العقار', { align: 'right' });

      doc.moveDown();

      let yPosition = doc.y;
      const imagesPerRow = 2;
      const imageWidth = 220;
      const imageHeight = 150;
      const spacing = 20;

      for (let i = 0; i < Math.min(options.images.length, 6); i++) {
        const col = i % imagesPerRow;
        const row = Math.floor(i / imagesPerRow);

        const x = 50 + col * (imageWidth + spacing);
        const y = yPosition + row * (imageHeight + spacing);

        try {
          doc.image(options.images[i], x, y, {
            width: imageWidth,
            height: imageHeight,
            fit: [imageWidth, imageHeight],
          });
        } catch (error) {
          console.error(`Failed to add image ${i}:`, error);
        }
      }

      doc.moveDown(10);
    }

    // معلومات التواصل
    doc.addPage();

    doc
      .fontSize(18)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('معلومات التواصل', { align: 'right' });

    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor('#000000')
      .font('Helvetica')
      .text(`البائع: ${options.sellerName}`, { align: 'right' })
      .text(`الهاتف: ${options.sellerPhone}`, { align: 'right' })
      .text(`البريد: ${options.sellerEmail}`, { align: 'right' });

    doc.moveDown();

    // QR Code
    if (options.qrCode) {
      doc.moveDown();
      doc
        .fontSize(16)
        .fillColor(primaryColor)
        .text('مسح QR Code للمزيد', { align: 'center' });

      doc.image(options.qrCode, 200, doc.y + 20, { width: 150 });
    }

    // Footer
    doc
      .fontSize(10)
      .fillColor('#666666')
      .text(
        `رقم الإعلان: ${options.sku}`,
        50,
        doc.page.height - 100,
        { align: 'center' }
      );

    doc.text(
      `تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}`,
      50,
      doc.page.height - 80,
      { align: 'center' }
      );
  }

  /**
   * إنشاء PDF متعدد العروض
   */
  static async generateMultiCatalog(offers: PDFOptions[]): Promise<string> {
    try {
      if (!fs.existsSync(this.UPLOAD_DIR)) {
        fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
      }

      const filename = `multi-catalog-${uuidv4()}.pdf`;
      const outputPath = path.join(this.UPLOAD_DIR, filename);

      const doc = new PDFDocument({ size: 'A4' });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // صفحة غلاف
      doc
        .fontSize(32)
        .fillColor('#01411C')
        .text('كتالوج العروض العقارية', 50, 300, { align: 'center' });

      doc
        .fontSize(18)
        .fillColor('#D4AF37')
        .text(`${offers.length} عرض مميز`, 50, 350, { align: 'center' });

      // إضافة كل عرض
      for (let i = 0; i < offers.length; i++) {
        doc.addPage();
        await this.addContent(doc, offers[i]);
      }

      doc.end();
      await new Promise((resolve) => stream.on('finish', resolve));

      return `/uploads/pdfs/${filename}`;
    } catch (error) {
      console.error('Multi PDF generation error:', error);
      throw new Error('فشل في إنشاء الكتالوج');
    }
  }
}
```

---

### C. QR Code Service

```typescript
// ملف: backend/src/services/qr.service.ts

import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface QROptions {
  url: string;
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
}

export class QRService {
  private static UPLOAD_DIR = path.join(__dirname, '../../uploads/qr');

  /**
   * إنشاء QR Code
   */
  static async generateQR(options: QROptions): Promise<string> {
    try {
      if (!fs.existsSync(this.UPLOAD_DIR)) {
        fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
      }

      const filename = `qr-${uuidv4()}.png`;
      const outputPath = path.join(this.UPLOAD_DIR, filename);

      await QRCode.toFile(outputPath, options.url, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: options.size || 500,
        margin: 2,
        color: {
          dark: options.primaryColor || '#01411C',
          light: options.secondaryColor || '#FFFFFF',
        },
      });

      return `/uploads/qr/${filename}`;
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('فشل في إنشاء QR Code');
    }
  }

  /**
   * إنشاء QR Code مع شعار
   */
  static async generateQRWithLogo(
    url: string,
    logoPath: string
  ): Promise<string> {
    // TODO: دمج الشعار مع QR Code باستخدام Sharp
    return this.generateQR({ url });
  }
}
```

---

يتبع في الرسالة التالية بسبب الطول...

