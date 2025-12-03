# 🚀 **FEATURE 6: DIGITAL BUSINESS CARD - PART 2**
## **Backend APIs + QR/NFC Generation + Analytics**

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Digital Card Controller**

File: `backend/src/controllers/digital-card.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { QRCodeService } from '../services/qrcode.service';
import { VCardService } from '../services/vcard.service';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createCardSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  fullName: z.string().min(2),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  template: z.enum(['modern', 'luxury', 'minimal', 'creative']).optional(),
  layout: z.enum(['standard', 'creative', 'compact']).optional(),
});

const updateCardSchema = createCardSchema.partial();

// ============================================
// DIGITAL CARD CONTROLLER
// ============================================

export class DigitalCardController {
  
  // Get all cards for user
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { isActive, page = '1', limit = '20' } = req.query;

      const where: any = { userId };
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [cards, total] = await Promise.all([
        prisma.digitalCard.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                scans: true,
                interactions: true,
              },
            },
          },
        }),
        prisma.digitalCard.count({ where }),
      ]);

      res.json({
        success: true,
        data: cards,
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

  // Get single card
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const card = await prisma.digitalCard.findFirst({
        where: { id, userId },
        include: {
          _count: {
            select: {
              scans: true,
              interactions: true,
            },
          },
        },
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      res.json({
        success: true,
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get card by slug (public)
  static async getBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const card = await prisma.digitalCard.findUnique({
        where: { slug, isActive: true, isPublic: true },
        select: {
          id: true,
          slug: true,
          fullName: true,
          jobTitle: true,
          company: true,
          bio: true,
          phone: true,
          email: true,
          website: true,
          whatsapp: true,
          address: true,
          city: true,
          country: true,
          linkedin: true,
          twitter: true,
          instagram: true,
          facebook: true,
          snapchat: true,
          profilePhoto: true,
          coverPhoto: true,
          logo: true,
          primaryColor: true,
          secondaryColor: true,
          template: true,
          layout: true,
          enableDirectCall: true,
          enableDirectWhatsApp: true,
          enableDirectEmail: true,
          enableSaveContact: true,
          enableShare: true,
          portfolioItems: true,
          services: true,
          testimonials: true,
          featuredProperties: true,
        },
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      // Track view
      await this.trackView(card.id, req);

      res.json({
        success: true,
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create card
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createCardSchema.parse(req.body);

      // Check slug uniqueness
      const existing = await prisma.digitalCard.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Slug already taken',
        });
      }

      // Create card
      const card = await prisma.digitalCard.create({
        data: {
          userId,
          ...data,
        },
      });

      // Generate QR code
      const qrCodeUrl = await QRCodeService.generateQRCode(card.id, card.slug);

      // Update card with QR code
      const updatedCard = await prisma.digitalCard.update({
        where: { id: card.id },
        data: { qrCode: qrCodeUrl },
      });

      res.status(201).json({
        success: true,
        data: updatedCard,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update card
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateCardSchema.parse(req.body);

      const existing = await prisma.digitalCard.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      // Check slug uniqueness if changed
      if (data.slug && data.slug !== existing.slug) {
        const slugTaken = await prisma.digitalCard.findUnique({
          where: { slug: data.slug },
        });

        if (slugTaken) {
          return res.status(400).json({
            success: false,
            message: 'Slug already taken',
          });
        }

        // Regenerate QR code if slug changed
        const qrCodeUrl = await QRCodeService.generateQRCode(id, data.slug);
        data.qrCode = qrCodeUrl;
      }

      const card = await prisma.digitalCard.update({
        where: { id },
        data,
      });

      res.json({
        success: true,
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete card
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.digitalCard.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      await prisma.digitalCard.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Card deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Track scan
  static async trackScan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { scanType = 'link' } = req.body;

      const card = await prisma.digitalCard.findUnique({
        where: { id },
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      // Create scan record
      await prisma.cardScan.create({
        data: {
          cardId: id,
          scanType,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          scannedAt: new Date(),
        },
      });

      // Update total scans
      await prisma.digitalCard.update({
        where: { id },
        data: { totalScans: { increment: 1 } },
      });

      res.json({
        success: true,
        message: 'Scan tracked',
      });
    } catch (error) {
      next(error);
    }
  }

  // Track interaction
  static async trackInteraction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { interactionType, targetValue, targetLabel } = req.body;

      const card = await prisma.digitalCard.findUnique({
        where: { id },
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      // Create interaction record
      await prisma.cardInteraction.create({
        data: {
          cardId: id,
          interactionType,
          targetValue,
          targetLabel,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      });

      // Update total clicks
      await prisma.digitalCard.update({
        where: { id },
        data: { totalClicks: { increment: 1 } },
      });

      res.json({
        success: true,
        message: 'Interaction tracked',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get analytics
  static async getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { days = '30' } = req.query;

      const card = await prisma.digitalCard.findFirst({
        where: { id, userId },
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const analytics = await prisma.cardAnalytics.findMany({
        where: {
          cardId: id,
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
      });

      const scans = await prisma.cardScan.findMany({
        where: {
          cardId: id,
          scannedAt: { gte: startDate },
        },
        orderBy: { scannedAt: 'desc' },
        take: 50,
      });

      const interactions = await prisma.cardInteraction.groupBy({
        by: ['interactionType'],
        where: {
          cardId: id,
          createdAt: { gte: startDate },
        },
        _count: true,
      });

      res.json({
        success: true,
        data: {
          summary: {
            totalViews: card.totalViews,
            totalScans: card.totalScans,
            totalClicks: card.totalClicks,
          },
          analytics,
          recentScans: scans,
          interactions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Download VCard
  static async downloadVCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const card = await prisma.digitalCard.findUnique({
        where: { slug, isActive: true },
      });

      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }

      // Generate VCard
      const vcard = VCardService.generateVCard(card);

      // Track download
      await prisma.vCardDownload.create({
        data: {
          cardId: card.id,
          fileName: `${card.slug}.vcf`,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      });

      // Update save count
      await prisma.digitalCard.update({
        where: { id: card.id },
        data: { totalSaves: { increment: 1 } },
      });

      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', `attachment; filename="${card.slug}.vcf"`);
      res.send(vcard);
    } catch (error) {
      next(error);
    }
  }

  // Get templates
  static async getTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;

      const where: any = { isActive: true };
      if (category) where.category = category;

      const templates = await prisma.cardTemplate.findMany({
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

  // Helper: Track view
  private static async trackView(cardId: string, req: any): Promise<void> {
    try {
      await prisma.digitalCard.update({
        where: { id: cardId },
        data: {
          totalViews: { increment: 1 },
          lastViewedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  }
}
```

---

# 4️⃣ **QR & NFC GENERATION**

## **QR Code Service**

File: `backend/src/services/qrcode.service.ts`

```typescript
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export class QRCodeService {
  
  // ============================================
  // GENERATE QR CODE
  // ============================================
  
  static async generateQRCode(cardId: string, slug: string): Promise<string> {
    const cardUrl = `${process.env.APP_URL}/cards/${slug}`;

    // Ensure directory exists
    const qrDir = path.join(process.cwd(), 'public', 'qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const fileName = `${cardId}.png`;
    const filePath = path.join(qrDir, fileName);

    // Generate QR code with custom styling
    await QRCode.toFile(filePath, cardUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#01411C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });

    return `/qrcodes/${fileName}`;
  }

  // ============================================
  // GENERATE QR CODE BASE64
  // ============================================
  
  static async generateQRCodeBase64(slug: string): Promise<string> {
    const cardUrl = `${process.env.APP_URL}/cards/${slug}`;

    const qrCode = await QRCode.toDataURL(cardUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#01411C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });

    return qrCode;
  }

  // ============================================
  // GENERATE QR CODE WITH LOGO
  // ============================================
  
  static async generateQRCodeWithLogo(
    cardId: string,
    slug: string,
    logoPath?: string
  ): Promise<string> {
    // TODO: Implement QR code with logo overlay
    // This would require image processing library like sharp
    return this.generateQRCode(cardId, slug);
  }
}
```

## **VCard Service**

File: `backend/src/services/vcard.service.ts`

```typescript
export class VCardService {
  
  // ============================================
  // GENERATE VCARD
  // ============================================
  
  static generateVCard(card: any): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.fullName}`,
      card.jobTitle ? `TITLE:${card.jobTitle}` : null,
      card.company ? `ORG:${card.company}` : null,
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : null,
      card.email ? `EMAIL:${card.email}` : null,
      card.website ? `URL:${card.website}` : null,
      card.address
        ? `ADR:;;${card.address};${card.city || ''};${card.country || ''}`
        : null,
      card.bio ? `NOTE:${card.bio}` : null,
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\r\n');

    return vcard;
  }

  // ============================================
  // GENERATE VCARD WITH PHOTO
  // ============================================
  
  static generateVCardWithPhoto(card: any, photoBase64?: string): string {
    const basicVCard = this.generateVCard(card);

    if (!photoBase64) {
      return basicVCard;
    }

    const lines = basicVCard.split('\r\n');
    const photoLine = `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`;

    // Insert photo before END:VCARD
    lines.splice(lines.length - 1, 0, photoLine);

    return lines.join('\r\n');
  }
}
```

## **NFC Service**

File: `backend/src/services/nfc.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export class NFCService {
  
  // ============================================
  // GENERATE NFC TAG ID
  // ============================================
  
  static generateNFCTagId(): string {
    // Generate unique NFC tag identifier
    return `NFC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  // ============================================
  // ASSIGN NFC TAG
  // ============================================
  
  static async assignNFCTag(cardId: string): Promise<string> {
    const nfcTagId = this.generateNFCTagId();

    await prisma.digitalCard.update({
      where: { id: cardId },
      data: { nfcTagId },
    });

    return nfcTagId;
  }

  // ============================================
  // VERIFY NFC TAG
  // ============================================
  
  static async verifyNFCTag(nfcTagId: string): Promise<any> {
    const card = await prisma.digitalCard.findUnique({
      where: { nfcTagId },
    });

    return card;
  }

  // ============================================
  // GENERATE NFC DATA
  // ============================================
  
  static generateNFCData(slug: string): any {
    const cardUrl = `${process.env.APP_URL}/cards/${slug}`;

    // NDEF (NFC Data Exchange Format) message
    return {
      type: 'url',
      url: cardUrl,
      payload: {
        uri: cardUrl,
        encoding: 'UTF-8',
      },
    };
  }

  // ============================================
  // WRITE NFC TAG (Simulation)
  // ============================================
  
  static async writeNFCTag(
    nfcTagId: string,
    cardId: string
  ): Promise<boolean> {
    try {
      const card = await prisma.digitalCard.findUnique({
        where: { id: cardId },
      });

      if (!card) {
        throw new Error('Card not found');
      }

      // In production, this would write to actual NFC hardware
      console.log(`Writing NFC tag: ${nfcTagId}`);
      console.log(`Card URL: ${process.env.APP_URL}/cards/${card.slug}`);

      return true;
    } catch (error) {
      console.error('NFC write failed:', error);
      return false;
    }
  }
}
```

---

# 5️⃣ **ANALYTICS TRACKING**

File: `backend/src/services/card-analytics.service.ts`

```typescript
import { prisma } from '../lib/prisma';

export class CardAnalyticsService {
  
  // ============================================
  // UPDATE DAILY ANALYTICS
  // ============================================
  
  static async updateDailyAnalytics(): Promise<void> {
    console.log('📊 Updating daily card analytics...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get all active cards
    const cards = await prisma.digitalCard.findMany({
      where: { isActive: true },
    });

    for (const card of cards) {
      // Count yesterday's scans
      const [qrScans, nfcScans, linkClicks] = await Promise.all([
        prisma.cardScan.count({
          where: {
            cardId: card.id,
            scanType: 'qr',
            scannedAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
        prisma.cardScan.count({
          where: {
            cardId: card.id,
            scanType: 'nfc',
            scannedAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
        prisma.cardScan.count({
          where: {
            cardId: card.id,
            scanType: 'link',
            scannedAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
      ]);

      // Count unique views (by IP)
      const scans = await prisma.cardScan.findMany({
        where: {
          cardId: card.id,
          scannedAt: {
            gte: yesterday,
            lt: today,
          },
        },
        select: { ipAddress: true },
      });

      const uniqueIPs = new Set(scans.map((s) => s.ipAddress));
      const uniqueViews = uniqueIPs.size;

      // Count interactions
      const interactions = await prisma.cardInteraction.groupBy({
        by: ['interactionType'],
        where: {
          cardId: card.id,
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _count: true,
      });

      const interactionCounts: any = {};
      interactions.forEach((i) => {
        interactionCounts[i.interactionType] = i._count;
      });

      // Device stats
      const deviceScans = await prisma.cardScan.groupBy({
        by: ['device'],
        where: {
          cardId: card.id,
          scannedAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _count: true,
      });

      const deviceCounts: any = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
      };

      deviceScans.forEach((d) => {
        if (d.device) {
          deviceCounts[d.device] = d._count;
        }
      });

      // Create analytics record
      await prisma.cardAnalytics.upsert({
        where: {
          cardId_date: {
            cardId: card.id,
            date: yesterday,
          },
        },
        update: {},
        create: {
          cardId: card.id,
          date: yesterday,
          views: qrScans + nfcScans + linkClicks,
          uniqueViews,
          qrScans,
          nfcScans,
          linkClicks,
          callClicks: interactionCounts.call || 0,
          emailClicks: interactionCounts.email || 0,
          whatsappClicks: interactionCounts.whatsapp || 0,
          saveContactClicks: interactionCounts.save || 0,
          shareClicks: interactionCounts.share || 0,
          propertyViews: interactionCounts.property_view || 0,
          mobileViews: deviceCounts.mobile,
          desktopViews: deviceCounts.desktop,
          tabletViews: deviceCounts.tablet,
        },
      });
    }

    console.log(`✅ Updated analytics for ${cards.length} cards`);
  }

  // ============================================
  // GET CARD SUMMARY
  // ============================================
  
  static async getCardSummary(cardId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await prisma.cardAnalytics.findMany({
      where: {
        cardId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const summary = analytics.reduce(
      (acc, a) => ({
        totalViews: acc.totalViews + a.views,
        totalScans: acc.totalScans + a.qrScans + a.nfcScans,
        totalClicks: acc.totalClicks + a.callClicks + a.emailClicks + a.whatsappClicks,
        qrScans: acc.qrScans + a.qrScans,
        nfcScans: acc.nfcScans + a.nfcScans,
      }),
      {
        totalViews: 0,
        totalScans: 0,
        totalClicks: 0,
        qrScans: 0,
        nfcScans: 0,
      }
    );

    return {
      summary,
      timeline: analytics,
    };
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/FEATURE-6-PART-2.md`  
🎯 **Status:** Part 2 Complete (Backend + QR/NFC + Analytics)  
⏱️ **Next:** Frontend Components + Card Designer + Testing
