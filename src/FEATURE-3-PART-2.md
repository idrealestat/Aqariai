# 🚀 **FEATURE 3: OWNERS & SEEKERS - PART 2**
## **Backend APIs + Auto-Matching Algorithm**

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Property Owner Controller**

File: `backend/src/controllers/owner.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createOwnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  email: z.string().email().optional().nullable(),
  secondaryPhone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  ownerType: z.enum(['individual', 'company', 'government']).default('individual'),
  companyName: z.string().optional().nullable(),
  preferredPayment: z.string().optional(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateOwnerSchema = createOwnerSchema.partial();

// ============================================
// OWNER CONTROLLER
// ============================================

export class OwnerController {
  
  // Get all owners
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        page = '1',
        limit = '10',
        search,
        city,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = { userId };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (city) where.city = city;
      if (status) where.status = status;

      // Get owners with property count
      const [owners, total] = await Promise.all([
        prisma.propertyOwner.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            _count: {
              select: {
                properties: true,
              },
            },
          },
        }),
        prisma.propertyOwner.count({ where }),
      ]);

      res.json({
        success: true,
        data: owners,
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

  // Get single owner
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const owner = await prisma.propertyOwner.findFirst({
        where: { id, userId },
        include: {
          properties: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: {
              properties: true,
              contracts: true,
            },
          },
        },
      });

      if (!owner) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
        });
      }

      res.json({
        success: true,
        data: owner,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create owner
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createOwnerSchema.parse(req.body);

      const owner = await prisma.propertyOwner.create({
        data: {
          ...data,
          userId,
          tags: data.tags ? JSON.stringify(data.tags) : '[]',
        },
      });

      res.status(201).json({
        success: true,
        data: owner,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update owner
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateOwnerSchema.parse(req.body);

      const existing = await prisma.propertyOwner.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
        });
      }

      const owner = await prisma.propertyOwner.update({
        where: { id },
        data: {
          ...data,
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
        },
      });

      res.json({
        success: true,
        data: owner,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete owner
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.propertyOwner.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
        });
      }

      await prisma.propertyOwner.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Owner deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get owner stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const [
        totalOwners,
        activeOwners,
        verifiedOwners,
        totalProperties,
        totalValue,
      ] = await Promise.all([
        prisma.propertyOwner.count({ where: { userId } }),
        prisma.propertyOwner.count({ where: { userId, status: 'active' } }),
        prisma.propertyOwner.count({ where: { userId, isVerified: true } }),
        prisma.ownerProperty.count({ where: { userId } }),
        prisma.propertyOwner.aggregate({
          where: { userId },
          _sum: { totalValue: true },
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalOwners,
          activeOwners,
          verifiedOwners,
          totalProperties,
          totalValue: totalValue._sum.totalValue || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

## **Property Controller**

File: `backend/src/controllers/property.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createPropertySchema = z.object({
  ownerId: z.string().uuid(),
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().optional().nullable(),
  propertyType: z.enum(['apartment', 'villa', 'land', 'commercial', 'building']),
  purpose: z.enum(['sale', 'rent']),
  price: z.number().positive('Price must be positive'),
  city: z.string(),
  district: z.string().optional().nullable(),
  area: z.number().positive('Area must be positive'),
  bedrooms: z.number().int().optional().nullable(),
  bathrooms: z.number().int().optional().nullable(),
  features: z.array(z.string()).optional(),
  furnishingStatus: z.enum(['furnished', 'semi_furnished', 'unfurnished']).optional(),
  isPublished: z.boolean().optional(),
});

const updatePropertySchema = createPropertySchema.partial();

// ============================================
// PROPERTY CONTROLLER
// ============================================

export class PropertyController {
  
  // Get all properties
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        page = '1',
        limit = '10',
        search,
        ownerId,
        city,
        propertyType,
        purpose,
        minPrice,
        maxPrice,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = { userId };

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { city: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (ownerId) where.ownerId = ownerId;
      if (city) where.city = city;
      if (propertyType) where.propertyType = propertyType;
      if (purpose) where.purpose = purpose;
      if (status) where.status = status;

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice as string);
        if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
      }

      // Get properties
      const [properties, total] = await Promise.all([
        prisma.ownerProperty.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            _count: {
              select: {
                matches: true,
              },
            },
          },
        }),
        prisma.ownerProperty.count({ where }),
      ]);

      res.json({
        success: true,
        data: properties,
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

  // Get single property
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const property = await prisma.ownerProperty.findFirst({
        where: { id, userId },
        include: {
          owner: true,
          matches: {
            where: { status: { not: 'rejected' } },
            include: {
              seeker: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  budgetMin: true,
                  budgetMax: true,
                },
              },
            },
            orderBy: { matchScore: 'desc' },
            take: 10,
          },
        },
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }

      // Increment views count
      await prisma.ownerProperty.update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
      });

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create property
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createPropertySchema.parse(req.body);

      // Verify owner ownership
      const owner = await prisma.propertyOwner.findFirst({
        where: { id: data.ownerId, userId },
      });

      if (!owner) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
        });
      }

      const property = await prisma.ownerProperty.create({
        data: {
          ...data,
          userId,
          features: data.features ? JSON.stringify(data.features) : '[]',
          pricePerMeter: data.price / data.area,
        },
        include: {
          owner: true,
        },
      });

      // Update owner stats
      await prisma.propertyOwner.update({
        where: { id: data.ownerId },
        data: {
          propertiesCount: { increment: 1 },
          totalValue: { increment: data.price },
        },
      });

      // Trigger auto-matching if published
      if (data.isPublished) {
        // This will be handled by the matching service
        // For now, just emit event
        req.app.get('io')?.emit('property:created', { property });
      }

      res.status(201).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update property
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updatePropertySchema.parse(req.body);

      const existing = await prisma.ownerProperty.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }

      const property = await prisma.ownerProperty.update({
        where: { id },
        data: {
          ...data,
          features: data.features ? JSON.stringify(data.features) : undefined,
          pricePerMeter: data.price && data.area ? data.price / data.area : undefined,
        },
      });

      // If price changed, update owner total value
      if (data.price && data.price !== existing.price) {
        const priceDiff = data.price - Number(existing.price);
        await prisma.propertyOwner.update({
          where: { id: existing.ownerId },
          data: {
            totalValue: { increment: priceDiff },
          },
        });
      }

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete property
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.ownerProperty.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }

      await prisma.ownerProperty.delete({ where: { id } });

      // Update owner stats
      await prisma.propertyOwner.update({
        where: { id: existing.ownerId },
        data: {
          propertiesCount: { decrement: 1 },
          totalValue: { decrement: existing.price },
        },
      });

      res.json({
        success: true,
        message: 'Property deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
```

## **Seeker Controller**

File: `backend/src/controllers/seeker.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { MatchingService } from '../services/matching.service';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createSeekerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  email: z.string().email().optional().nullable(),
  propertyType: z.enum(['apartment', 'villa', 'land', 'commercial', 'building']).optional().nullable(),
  purpose: z.enum(['buy', 'rent']),
  budgetMin: z.number().optional().nullable(),
  budgetMax: z.number().optional().nullable(),
  preferredCities: z.array(z.string()).optional(),
  bedroomsMin: z.number().int().optional().nullable(),
  bedroomsMax: z.number().int().optional().nullable(),
  areaMin: z.number().optional().nullable(),
  areaMax: z.number().optional().nullable(),
  requiredFeatures: z.array(z.string()).optional(),
  urgency: z.enum(['urgent', 'normal', 'flexible']).optional(),
  notes: z.string().optional().nullable(),
});

const updateSeekerSchema = createSeekerSchema.partial();

// ============================================
// SEEKER CONTROLLER
// ============================================

export class SeekerController {
  
  // Get all seekers
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        page = '1',
        limit = '10',
        search,
        purpose,
        status,
        urgency,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = { userId };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (purpose) where.purpose = purpose;
      if (status) where.status = status;
      if (urgency) where.urgency = urgency;

      // Get seekers
      const [seekers, total] = await Promise.all([
        prisma.propertySeeker.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            _count: {
              select: {
                matches: true,
              },
            },
          },
        }),
        prisma.propertySeeker.count({ where }),
      ]);

      res.json({
        success: true,
        data: seekers,
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

  // Get single seeker
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const seeker = await prisma.propertySeeker.findFirst({
        where: { id, userId },
        include: {
          matches: {
            where: { status: { not: 'rejected' } },
            include: {
              property: {
                include: {
                  owner: {
                    select: {
                      id: true,
                      name: true,
                      phone: true,
                    },
                  },
                },
              },
            },
            orderBy: { matchScore: 'desc' },
            take: 20,
          },
          _count: {
            select: {
              matches: true,
            },
          },
        },
      });

      if (!seeker) {
        return res.status(404).json({
          success: false,
          message: 'Seeker not found',
        });
      }

      res.json({
        success: true,
        data: seeker,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create seeker
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createSeekerSchema.parse(req.body);

      const seeker = await prisma.propertySeeker.create({
        data: {
          ...data,
          userId,
          preferredCities: data.preferredCities ? JSON.stringify(data.preferredCities) : '[]',
          requiredFeatures: data.requiredFeatures ? JSON.stringify(data.requiredFeatures) : '[]',
        },
      });

      // Trigger auto-matching
      const matches = await MatchingService.findMatchesForSeeker(seeker.id);

      res.status(201).json({
        success: true,
        data: seeker,
        meta: {
          matchesFound: matches.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update seeker
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = updateSeekerSchema.parse(req.body);

      const existing = await prisma.propertySeeker.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Seeker not found',
        });
      }

      const seeker = await prisma.propertySeeker.update({
        where: { id },
        data: {
          ...data,
          preferredCities: data.preferredCities ? JSON.stringify(data.preferredCities) : undefined,
          requiredFeatures: data.requiredFeatures ? JSON.stringify(data.requiredFeatures) : undefined,
        },
      });

      // Re-run matching if criteria changed
      if (
        data.budgetMin || data.budgetMax || data.propertyType ||
        data.preferredCities || data.bedroomsMin || data.bedroomsMax
      ) {
        await MatchingService.findMatchesForSeeker(id);
      }

      res.json({
        success: true,
        data: seeker,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete seeker
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.propertySeeker.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Seeker not found',
        });
      }

      await prisma.propertySeeker.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Seeker deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get seeker matches
  static async getMatches(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { minScore = '50' } = req.query;

      const seeker = await prisma.propertySeeker.findFirst({
        where: { id, userId },
      });

      if (!seeker) {
        return res.status(404).json({
          success: false,
          message: 'Seeker not found',
        });
      }

      const matches = await prisma.seekerMatch.findMany({
        where: {
          seekerId: id,
          matchScore: { gte: parseFloat(minScore as string) },
        },
        include: {
          property: {
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { matchScore: 'desc' },
      });

      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      next(error);
    }
  }

  // Regenerate matches for seeker
  static async regenerateMatches(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const seeker = await prisma.propertySeeker.findFirst({
        where: { id, userId },
      });

      if (!seeker) {
        return res.status(404).json({
          success: false,
          message: 'Seeker not found',
        });
      }

      const matches = await MatchingService.findMatchesForSeeker(id);

      res.json({
        success: true,
        data: {
          matchesFound: matches.length,
          matches,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

# 4️⃣ **AUTO-MATCHING ALGORITHM**

## **Matching Service**

File: `backend/src/services/matching.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

interface MatchScore {
  total: number;
  price: number;
  location: number;
  specs: number;
  features: number;
  factors: string[];
  reason: string;
}

export class MatchingService {
  
  // ============================================
  // FIND MATCHES FOR A SEEKER
  // ============================================
  
  static async findMatchesForSeeker(seekerId: string): Promise<any[]> {
    // Get seeker with user preferences
    const seeker = await prisma.propertySeeker.findUnique({
      where: { id: seekerId },
      include: {
        user: {
          include: {
            matchPreferences: true,
          },
        },
      },
    });

    if (!seeker) {
      throw new Error('Seeker not found');
    }

    const preferences = seeker.user.matchPreferences || {
      minMatchScore: 50,
      maxMatchesPerSeeker: 10,
      priceWeight: 35,
      locationWeight: 30,
      specsWeight: 20,
      featuresWeight: 15,
    };

    // Find potential properties
    const properties = await this.findPotentialProperties(seeker);

    // Calculate match scores
    const matches: any[] = [];

    for (const property of properties) {
      const score = this.calculateMatchScore(seeker, property, preferences);

      if (score.total >= preferences.minMatchScore) {
        matches.push({
          property,
          score,
        });
      }
    }

    // Sort by score and take top N
    matches.sort((a, b) => b.score.total - a.score.total);
    const topMatches = matches.slice(0, preferences.maxMatchesPerSeeker);

    // Save matches to database
    const savedMatches = [];

    for (const match of topMatches) {
      const existingMatch = await prisma.seekerMatch.findUnique({
        where: {
          seekerId_propertyId: {
            seekerId,
            propertyId: match.property.id,
          },
        },
      });

      if (existingMatch) {
        // Update existing match
        const updated = await prisma.seekerMatch.update({
          where: { id: existingMatch.id },
          data: {
            matchScore: match.score.total,
            priceScore: match.score.price,
            locationScore: match.score.location,
            specsScore: match.score.specs,
            featuresScore: match.score.features,
            matchReason: match.score.reason,
            matchFactors: JSON.stringify(match.score.factors),
          },
          include: {
            property: {
              include: {
                owner: true,
              },
            },
          },
        });

        savedMatches.push(updated);
      } else {
        // Create new match
        const created = await prisma.seekerMatch.create({
          data: {
            seekerId,
            propertyId: match.property.id,
            userId: seeker.userId,
            matchScore: match.score.total,
            priceScore: match.score.price,
            locationScore: match.score.location,
            specsScore: match.score.specs,
            featuresScore: match.score.features,
            matchReason: match.score.reason,
            matchFactors: JSON.stringify(match.score.factors),
          },
          include: {
            property: {
              include: {
                owner: true,
              },
            },
          },
        });

        savedMatches.push(created);
      }
    }

    // Update seeker stats
    await prisma.propertySeeker.update({
      where: { id: seekerId },
      data: {
        matchesCount: savedMatches.length,
        lastMatchedAt: new Date(),
      },
    });

    // Send notification
    if (savedMatches.length > 0) {
      await prisma.notification.create({
        data: {
          userId: seeker.userId,
          type: 'seeker_matched',
          title: 'عقارات مطابقة جديدة',
          message: `تم إيجاد ${savedMatches.length} عقار مطابق لمتطلبات ${seeker.name}`,
          metadata: JSON.stringify({
            seekerId,
            matchCount: savedMatches.length,
          }),
        },
      });
    }

    return savedMatches;
  }

  // ============================================
  // FIND POTENTIAL PROPERTIES
  // ============================================
  
  private static async findPotentialProperties(seeker: any): Promise<any[]> {
    const where: any = {
      userId: seeker.userId,
      status: 'available',
      isPublished: true,
      purpose: seeker.purpose === 'buy' ? 'sale' : 'rent',
    };

    // Property type filter
    if (seeker.propertyType) {
      where.propertyType = seeker.propertyType;
    }

    // Price range filter (with 20% flexibility)
    if (seeker.budgetMin && seeker.budgetMax) {
      const flexibility = 0.2;
      where.price = {
        gte: seeker.budgetMin * (1 - flexibility),
        lte: seeker.budgetMax * (1 + flexibility),
      };
    }

    // City filter
    if (seeker.preferredCities && seeker.preferredCities.length > 0) {
      const cities = JSON.parse(seeker.preferredCities);
      if (cities.length > 0) {
        where.city = { in: cities };
      }
    }

    // Bedrooms filter (if specified)
    if (seeker.bedroomsMin || seeker.bedroomsMax) {
      where.bedrooms = {};
      if (seeker.bedroomsMin) where.bedrooms.gte = seeker.bedroomsMin;
      if (seeker.bedroomsMax) where.bedrooms.lte = seeker.bedroomsMax;
    }

    // Area filter (if specified)
    if (seeker.areaMin || seeker.areaMax) {
      where.area = {};
      if (seeker.areaMin) where.area.gte = seeker.areaMin;
      if (seeker.areaMax) where.area.lte = seeker.areaMax;
    }

    const properties = await prisma.ownerProperty.findMany({
      where,
      include: {
        owner: true,
      },
    });

    return properties;
  }

  // ============================================
  // CALCULATE MATCH SCORE
  // ============================================
  
  private static calculateMatchScore(
    seeker: any,
    property: any,
    preferences: any
  ): MatchScore {
    const scores = {
      price: this.calculatePriceScore(seeker, property),
      location: this.calculateLocationScore(seeker, property),
      specs: this.calculateSpecsScore(seeker, property),
      features: this.calculateFeaturesScore(seeker, property),
    };

    // Weighted total
    const total =
      (scores.price * preferences.priceWeight) / 100 +
      (scores.location * preferences.locationWeight) / 100 +
      (scores.specs * preferences.specsWeight) / 100 +
      (scores.features * preferences.featuresWeight) / 100;

    // Generate match factors
    const factors: string[] = [];
    if (scores.price >= 80) factors.push('price_perfect');
    if (scores.location >= 80) factors.push('location_perfect');
    if (scores.specs >= 80) factors.push('specs_match');
    if (scores.features >= 80) factors.push('features_match');

    // Generate reason
    const reason = this.generateMatchReason(seeker, property, scores);

    return {
      total: Math.round(total * 100) / 100,
      price: Math.round(scores.price * 100) / 100,
      location: Math.round(scores.location * 100) / 100,
      specs: Math.round(scores.specs * 100) / 100,
      features: Math.round(scores.features * 100) / 100,
      factors,
      reason,
    };
  }

  // ============================================
  // PRICE SCORE (0-100)
  // ============================================
  
  private static calculatePriceScore(seeker: any, property: any): number {
    const propertyPrice = Number(property.price);

    // If no budget specified, return neutral score
    if (!seeker.budgetMin || !seeker.budgetMax) {
      return 50;
    }

    const budgetMin = Number(seeker.budgetMin);
    const budgetMax = Number(seeker.budgetMax);
    const budgetMid = (budgetMin + budgetMax) / 2;

    // Perfect match if in budget
    if (propertyPrice >= budgetMin && propertyPrice <= budgetMax) {
      // Higher score if closer to mid-point
      const distanceFromMid = Math.abs(propertyPrice - budgetMid);
      const maxDistance = budgetMax - budgetMid;
      const score = 100 - (distanceFromMid / maxDistance) * 20; // 80-100
      return Math.max(80, score);
    }

    // Below budget
    if (propertyPrice < budgetMin) {
      const difference = budgetMin - propertyPrice;
      const flexibility = budgetMin * 0.2; // 20% below
      if (difference <= flexibility) {
        return 70 - (difference / flexibility) * 20; // 50-70
      }
      return 0;
    }

    // Above budget
    if (propertyPrice > budgetMax) {
      const difference = propertyPrice - budgetMax;
      const flexibility = budgetMax * 0.2; // 20% above
      if (difference <= flexibility) {
        return 60 - (difference / flexibility) * 30; // 30-60
      }
      return 0;
    }

    return 50;
  }

  // ============================================
  // LOCATION SCORE (0-100)
  // ============================================
  
  private static calculateLocationScore(seeker: any, property: any): number {
    let score = 0;

    // City match
    const preferredCities = JSON.parse(seeker.preferredCities || '[]');
    if (preferredCities.length === 0) {
      score += 50; // Neutral if no preference
    } else if (preferredCities.includes(property.city)) {
      score += 70; // City match

      // District match (bonus)
      const preferredDistricts = JSON.parse(seeker.preferredDistricts || '[]');
      if (
        preferredDistricts.length > 0 &&
        property.district &&
        preferredDistricts.includes(property.district)
      ) {
        score += 30; // District match bonus
      } else {
        score += 15; // No district specified or no match
      }
    } else {
      // Not in preferred city
      if (seeker.mustBeInCity) {
        return 0; // Must be in city
      } else {
        score += 20; // Still acceptable
      }
    }

    return Math.min(100, score);
  }

  // ============================================
  // SPECS SCORE (0-100)
  // ============================================
  
  private static calculateSpecsScore(seeker: any, property: any): number {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Bedrooms (30 points)
    if (seeker.bedroomsMin || seeker.bedroomsMax) {
      totalPoints += 30;
      if (property.bedrooms) {
        const bedrooms = property.bedrooms;
        if (
          (!seeker.bedroomsMin || bedrooms >= seeker.bedroomsMin) &&
          (!seeker.bedroomsMax || bedrooms <= seeker.bedroomsMax)
        ) {
          earnedPoints += 30;
        } else {
          // Partial points if close
          const minDiff = seeker.bedroomsMin ? Math.abs(bedrooms - seeker.bedroomsMin) : 0;
          const maxDiff = seeker.bedroomsMax ? Math.abs(bedrooms - seeker.bedroomsMax) : 0;
          const diff = Math.min(minDiff, maxDiff);
          if (diff <= 1) earnedPoints += 15;
        }
      }
    }

    // Bathrooms (20 points)
    if (seeker.bathroomsMin) {
      totalPoints += 20;
      if (property.bathrooms && property.bathrooms >= seeker.bathroomsMin) {
        earnedPoints += 20;
      } else if (property.bathrooms && property.bathrooms === seeker.bathroomsMin - 1) {
        earnedPoints += 10;
      }
    }

    // Area (30 points)
    if (seeker.areaMin || seeker.areaMax) {
      totalPoints += 30;
      const area = Number(property.area);
      if (
        (!seeker.areaMin || area >= seeker.areaMin) &&
        (!seeker.areaMax || area <= seeker.areaMax)
      ) {
        earnedPoints += 30;
      } else {
        // Partial points if close (within 20%)
        const midArea = (seeker.areaMin + seeker.areaMax) / 2;
        const flexibility = midArea * 0.2;
        const diff = Math.abs(area - midArea);
        if (diff <= flexibility) {
          earnedPoints += 15;
        }
      }
    }

    // Furnishing (20 points)
    if (seeker.furnishingStatus && seeker.furnishingStatus !== 'any') {
      totalPoints += 20;
      if (property.furnishingStatus === seeker.furnishingStatus) {
        earnedPoints += 20;
      } else {
        earnedPoints += 5; // Some points for not matching preference
      }
    }

    // If no specs specified, return neutral
    if (totalPoints === 0) {
      return 50;
    }

    return (earnedPoints / totalPoints) * 100;
  }

  // ============================================
  // FEATURES SCORE (0-100)
  // ============================================
  
  private static calculateFeaturesScore(seeker: any, property: any): number {
    const requiredFeatures = JSON.parse(seeker.requiredFeatures || '[]');
    const preferredFeatures = JSON.parse(seeker.preferredFeatures || '[]');
    const propertyFeatures = JSON.parse(property.features || '[]');

    if (requiredFeatures.length === 0 && preferredFeatures.length === 0) {
      return 50; // Neutral if no features specified
    }

    let score = 0;

    // Required features (70 points)
    if (requiredFeatures.length > 0) {
      const matchedRequired = requiredFeatures.filter((f: string) =>
        propertyFeatures.includes(f)
      );
      score += (matchedRequired.length / requiredFeatures.length) * 70;
    } else {
      score += 35; // Neutral for required
    }

    // Preferred features (30 points)
    if (preferredFeatures.length > 0) {
      const matchedPreferred = preferredFeatures.filter((f: string) =>
        propertyFeatures.includes(f)
      );
      score += (matchedPreferred.length / preferredFeatures.length) * 30;
    } else {
      score += 15; // Neutral for preferred
    }

    return Math.min(100, score);
  }

  // ============================================
  // GENERATE MATCH REASON
  // ============================================
  
  private static generateMatchReason(
    seeker: any,
    property: any,
    scores: any
  ): string {
    const reasons: string[] = [];

    if (scores.price >= 80) {
      reasons.push('السعر مطابق للميزانية');
    } else if (scores.price >= 60) {
      reasons.push('السعر قريب من الميزانية');
    }

    if (scores.location >= 80) {
      reasons.push('الموقع مثالي');
    } else if (scores.location >= 60) {
      reasons.push('الموقع مناسب');
    }

    if (scores.specs >= 80) {
      reasons.push('المواصفات مطابقة');
    }

    if (scores.features >= 80) {
      reasons.push('المميزات متوفرة');
    }

    if (reasons.length === 0) {
      return 'مطابقة جزئية للمتطلبات';
    }

    return reasons.join(' • ');
  }

  // ============================================
  // FIND MATCHES FOR PROPERTY
  // ============================================
  
  static async findMatchesForProperty(propertyId: string): Promise<any[]> {
    const property = await prisma.ownerProperty.findUnique({
      where: { id: propertyId },
      include: {
        owner: true,
      },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    // Find potential seekers
    const seekers = await prisma.propertySeeker.findMany({
      where: {
        userId: property.userId,
        status: 'active',
        purpose: property.purpose === 'sale' ? 'buy' : 'rent',
      },
      include: {
        user: {
          include: {
            matchPreferences: true,
          },
        },
      },
    });

    const matches: any[] = [];

    for (const seeker of seekers) {
      const preferences = seeker.user.matchPreferences || {
        minMatchScore: 50,
        priceWeight: 35,
        locationWeight: 30,
        specsWeight: 20,
        featuresWeight: 15,
      };

      const score = this.calculateMatchScore(seeker, property, preferences);

      if (score.total >= preferences.minMatchScore) {
        // Save match
        const match = await prisma.seekerMatch.upsert({
          where: {
            seekerId_propertyId: {
              seekerId: seeker.id,
              propertyId,
            },
          },
          update: {
            matchScore: score.total,
            priceScore: score.price,
            locationScore: score.location,
            specsScore: score.specs,
            featuresScore: score.features,
            matchReason: score.reason,
            matchFactors: JSON.stringify(score.factors),
          },
          create: {
            seekerId: seeker.id,
            propertyId,
            userId: property.userId,
            matchScore: score.total,
            priceScore: score.price,
            locationScore: score.location,
            specsScore: score.specs,
            featuresScore: score.features,
            matchReason: score.reason,
            matchFactors: JSON.stringify(score.factors),
          },
          include: {
            seeker: true,
          },
        });

        matches.push(match);
      }
    }

    // Update property stats
    await prisma.ownerProperty.update({
      where: { id: propertyId },
      data: {
        matchesCount: matches.length,
      },
    });

    return matches;
  }
}
```

---

**(يتبع...)**

📄 **File:** `/FEATURE-3-PART-2.md`  
🎯 **Status:** Part 2 Complete (Backend + Matching)  
⏱️ **Next:** Frontend + Testing + Setup
