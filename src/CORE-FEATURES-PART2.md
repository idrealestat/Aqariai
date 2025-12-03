# 🎯 **Core Features Implementation - Part 2**
## **Features 3-7: Owners, Publishing, Calendar, Digital Card & Analytics**

---

## 3️⃣ **OWNERS & SEEKERS TABS**

### **3.1: Database Schema**

```sql
-- Property Owners Table
CREATE TABLE property_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Owner Details
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  national_id VARCHAR(50),
  
  -- Contact Preferences
  preferred_contact_method VARCHAR(20) DEFAULT 'phone', -- 'phone', 'email', 'whatsapp'
  contact_times JSONB DEFAULT '[]', -- Array of time slots
  
  -- Properties
  properties_count INTEGER DEFAULT 0,
  total_value DECIMAL(15, 2) DEFAULT 0,
  
  -- Location
  city VARCHAR(100),
  district VARCHAR(100),
  address TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'blocked'
  rating DECIMAL(3, 2), -- 1.00 to 5.00
  
  -- Notes
  notes TEXT,
  tags JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_owners_user ON property_owners(user_id);
CREATE INDEX idx_owners_phone ON property_owners(phone);
CREATE INDEX idx_owners_status ON property_owners(status);

-- Property Seekers Table
CREATE TABLE property_seekers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Seeker Details
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  national_id VARCHAR(50),
  
  -- Requirements
  property_type VARCHAR(50), -- 'apartment', 'villa', 'land', 'commercial'
  purpose VARCHAR(20), -- 'buy', 'rent'
  budget_min DECIMAL(15, 2),
  budget_max DECIMAL(15, 2),
  
  -- Location Preferences
  preferred_cities JSONB DEFAULT '[]',
  preferred_districts JSONB DEFAULT '[]',
  
  -- Property Specs
  bedrooms_min INTEGER,
  bedrooms_max INTEGER,
  bathrooms_min INTEGER,
  area_min DECIMAL(10, 2),
  area_max DECIMAL(10, 2),
  
  -- Additional Preferences
  features JSONB DEFAULT '[]', -- ['parking', 'pool', 'garden', etc.]
  floor_preference VARCHAR(50), -- 'ground', 'first', 'high', 'any'
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'matched', 'completed', 'inactive'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  -- Engagement
  last_contact TIMESTAMP,
  matches_count INTEGER DEFAULT 0,
  viewings_count INTEGER DEFAULT 0,
  
  -- Notes
  notes TEXT,
  tags JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_seekers_user ON property_seekers(user_id);
CREATE INDEX idx_seekers_phone ON property_seekers(phone);
CREATE INDEX idx_seekers_status ON property_seekers(status);
CREATE INDEX idx_seekers_purpose ON property_seekers(purpose);

-- Owner-Property Relationship
CREATE TABLE owner_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES property_owners(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  ownership_percentage DECIMAL(5, 2) DEFAULT 100.00,
  
  -- Relationship Details
  relationship_type VARCHAR(20) DEFAULT 'owner', -- 'owner', 'authorized_agent'
  authorization_document_url TEXT,
  authorization_expiry DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(owner_id, property_id)
);

CREATE INDEX idx_owner_properties_owner ON owner_properties(owner_id);
CREATE INDEX idx_owner_properties_property ON owner_properties(property_id);

-- Seeker-Property Matches
CREATE TABLE seeker_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seeker_id UUID NOT NULL REFERENCES property_seekers(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Match Details
  match_score DECIMAL(5, 2), -- 0.00 to 100.00
  match_reason TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'viewed', 'interested', 'rejected', 'deal'
  seeker_feedback TEXT,
  
  -- Actions
  viewed_at TIMESTAMP,
  contacted_at TIMESTAMP,
  viewing_scheduled_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(seeker_id, property_id)
);

CREATE INDEX idx_matches_seeker ON seeker_matches(seeker_id);
CREATE INDEX idx_matches_property ON seeker_matches(property_id);
CREATE INDEX idx_matches_status ON seeker_matches(status);
```

---

### **3.2: Backend API - Owners & Seekers**

```typescript
// backend/src/modules/crm/owners-controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { z } from 'zod';

const createOwnerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  national_id: z.string().optional(),
  preferred_contact_method: z.enum(['phone', 'email', 'whatsapp']).default('phone'),
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export class OwnersController {
  // POST /api/owners
  async createOwner(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const data = createOwnerSchema.parse(req.body);

      // Check for duplicate phone
      const existing = await prisma.propertyOwner.findFirst({
        where: { user_id: userId, phone: data.phone },
      });

      if (existing) {
        return res.status(400).json({ error: 'Owner with this phone already exists' });
      }

      const owner = await prisma.propertyOwner.create({
        data: {
          user_id: userId,
          ...data,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          user_id: userId,
          title: 'تم إضافة مالك جديد',
          message: `تم إضافة المالك: ${data.name}`,
          type: 'OWNER',
          link: `/owners/${owner.id}`,
        },
      });

      res.status(201).json(owner);
    } catch (error) {
      console.error('Create owner error:', error);
      res.status(400).json({ error: 'Failed to create owner' });
    }
  }

  // PUT /api/owners/:id
  async updateOwner(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.sub;

      const updateSchema = createOwnerSchema.partial();
      const data = updateSchema.parse(req.body);

      // Verify ownership
      const owner = await prisma.propertyOwner.findFirst({
        where: { id, user_id: userId },
      });

      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }

      const updated = await prisma.propertyOwner.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          user_id: userId,
          title: 'تم تحديث بيانات مالك',
          message: `تم تحديث بيانات المالك: ${updated.name}`,
          type: 'OWNER',
          link: `/owners/${id}`,
        },
      });

      res.json(updated);
    } catch (error) {
      console.error('Update owner error:', error);
      res.status(400).json({ error: 'Failed to update owner' });
    }
  }

  // GET /api/owners
  async getOwners(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const {
        page = 1,
        limit = 20,
        search,
        status,
        city,
        sort = 'created_at',
        order = 'desc',
      } = req.query;

      // Build filters
      const where: any = { user_id: userId };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (status) where.status = status;
      if (city) where.city = city;

      // Get owners with pagination
      const [owners, total] = await Promise.all([
        prisma.propertyOwner.findMany({
          where,
          include: {
            _count: {
              select: { properties: true },
            },
          },
          orderBy: { [sort as string]: order },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.propertyOwner.count({ where }),
      ]);

      res.json({
        data: owners,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get owners error:', error);
      res.status(500).json({ error: 'Failed to get owners' });
    }
  }

  // GET /api/owners/:id
  async getOwner(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.sub;

      const owner = await prisma.propertyOwner.findFirst({
        where: { id, user_id: userId },
        include: {
          properties: {
            include: {
              property: {
                include: {
                  _count: { select: { matches: true } },
                },
              },
            },
          },
        },
      });

      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }

      res.json(owner);
    } catch (error) {
      console.error('Get owner error:', error);
      res.status(500).json({ error: 'Failed to get owner' });
    }
  }

  // POST /api/owners/:id/properties
  async linkProperty(req: Request, res: Response) {
    try {
      const { id: ownerId } = req.params;
      const userId = (req as any).user.sub;

      const schema = z.object({
        property_id: z.string().uuid(),
        ownership_percentage: z.number().min(0).max(100).default(100),
        relationship_type: z.enum(['owner', 'authorized_agent']).default('owner'),
      });

      const data = schema.parse(req.body);

      // Verify owner
      const owner = await prisma.propertyOwner.findFirst({
        where: { id: ownerId, user_id: userId },
      });

      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }

      // Verify property
      const property = await prisma.property.findFirst({
        where: { id: data.property_id, user_id: userId },
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Link property to owner
      const link = await prisma.ownerProperty.create({
        data: {
          owner_id: ownerId,
          property_id: data.property_id,
          ownership_percentage: data.ownership_percentage,
          relationship_type: data.relationship_type,
        },
      });

      // Update owner's property count and total value
      await this.updateOwnerStats(ownerId);

      res.status(201).json(link);
    } catch (error) {
      console.error('Link property error:', error);
      res.status(400).json({ error: 'Failed to link property' });
    }
  }

  private async updateOwnerStats(ownerId: string) {
    const properties = await prisma.ownerProperty.findMany({
      where: { owner_id: ownerId },
      include: { property: true },
    });

    const totalValue = properties.reduce(
      (sum, op) => sum + (op.property.price || 0) * (op.ownership_percentage / 100),
      0
    );

    await prisma.propertyOwner.update({
      where: { id: ownerId },
      data: {
        properties_count: properties.length,
        total_value: totalValue,
      },
    });
  }
}

// backend/src/modules/crm/seekers-controller.ts
const createSeekerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  property_type: z.string().optional(),
  purpose: z.enum(['buy', 'rent']),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  preferred_cities: z.array(z.string()).default([]),
  preferred_districts: z.array(z.string()).default([]),
  bedrooms_min: z.number().int().min(0).optional(),
  bedrooms_max: z.number().int().min(0).optional(),
  area_min: z.number().positive().optional(),
  area_max: z.number().positive().optional(),
  features: z.array(z.string()).default([]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().optional(),
});

export class SeekersController {
  // POST /api/seekers
  async createSeeker(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const data = createSeekerSchema.parse(req.body);

      const seeker = await prisma.propertySeeker.create({
        data: {
          user_id: userId,
          ...data,
        },
      });

      // Auto-match with existing properties
      await this.autoMatchProperties(seeker.id, userId);

      // Create notification
      await prisma.notification.create({
        data: {
          user_id: userId,
          title: 'تم إضافة باحث جديد',
          message: `تم إضافة الباحث: ${data.name}`,
          type: 'SEEKER',
          link: `/seekers/${seeker.id}`,
        },
      });

      res.status(201).json(seeker);
    } catch (error) {
      console.error('Create seeker error:', error);
      res.status(400).json({ error: 'Failed to create seeker' });
    }
  }

  // PUT /api/seekers/:id
  async updateSeeker(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.sub;

      const updateSchema = createSeekerSchema.partial();
      const data = updateSchema.parse(req.body);

      const seeker = await prisma.propertySeeker.findFirst({
        where: { id, user_id: userId },
      });

      if (!seeker) {
        return res.status(404).json({ error: 'Seeker not found' });
      }

      const updated = await prisma.propertySeeker.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });

      // Re-run auto-matching if criteria changed
      if (
        data.property_type ||
        data.budget_min ||
        data.budget_max ||
        data.preferred_cities
      ) {
        await this.autoMatchProperties(id, userId);
      }

      res.json(updated);
    } catch (error) {
      console.error('Update seeker error:', error);
      res.status(400).json({ error: 'Failed to update seeker' });
    }
  }

  // GET /api/seekers
  async getSeekers(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const {
        page = 1,
        limit = 20,
        search,
        status,
        purpose,
        priority,
        sort = 'created_at',
        order = 'desc',
      } = req.query;

      const where: any = { user_id: userId };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string } },
        ];
      }

      if (status) where.status = status;
      if (purpose) where.purpose = purpose;
      if (priority) where.priority = priority;

      const [seekers, total] = await Promise.all([
        prisma.propertySeeker.findMany({
          where,
          include: {
            _count: {
              select: { matches: true },
            },
          },
          orderBy: { [sort as string]: order },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.propertySeeker.count({ where }),
      ]);

      res.json({
        data: seekers,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get seekers error:', error);
      res.status(500).json({ error: 'Failed to get seekers' });
    }
  }

  // GET /api/seekers/:id/matches
  async getSeekerMatches(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.sub;
      const { status } = req.query;

      const seeker = await prisma.propertySeeker.findFirst({
        where: { id, user_id: userId },
      });

      if (!seeker) {
        return res.status(404).json({ error: 'Seeker not found' });
      }

      const where: any = { seeker_id: id };
      if (status) where.status = status;

      const matches = await prisma.seekerMatch.findMany({
        where,
        include: {
          property: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { match_score: 'desc' },
      });

      res.json(matches);
    } catch (error) {
      console.error('Get matches error:', error);
      res.status(500).json({ error: 'Failed to get matches' });
    }
  }

  private async autoMatchProperties(seekerId: string, userId: string) {
    const seeker = await prisma.propertySeeker.findUnique({
      where: { id: seekerId },
    });

    if (!seeker) return;

    // Build property query based on seeker preferences
    const where: any = {
      user_id: userId,
      status: 'active',
    };

    if (seeker.property_type) {
      where.property_type = seeker.property_type;
    }

    if (seeker.budget_min || seeker.budget_max) {
      where.price = {};
      if (seeker.budget_min) where.price.gte = seeker.budget_min;
      if (seeker.budget_max) where.price.lte = seeker.budget_max;
    }

    if (seeker.preferred_cities.length > 0) {
      where.city = { in: seeker.preferred_cities };
    }

    if (seeker.bedrooms_min || seeker.bedrooms_max) {
      where.bedrooms = {};
      if (seeker.bedrooms_min) where.bedrooms.gte = seeker.bedrooms_min;
      if (seeker.bedrooms_max) where.bedrooms.lte = seeker.bedrooms_max;
    }

    // Find matching properties
    const properties = await prisma.property.findMany({ where });

    // Create matches with scores
    for (const property of properties) {
      const score = this.calculateMatchScore(seeker, property);

      if (score >= 50) {
        // Only create matches with 50%+ score
        await prisma.seekerMatch.upsert({
          where: {
            seeker_id_property_id: {
              seeker_id: seekerId,
              property_id: property.id,
            },
          },
          create: {
            seeker_id: seekerId,
            property_id: property.id,
            user_id: userId,
            match_score: score,
            match_reason: this.generateMatchReason(seeker, property),
            status: 'pending',
          },
          update: {
            match_score: score,
            match_reason: this.generateMatchReason(seeker, property),
          },
        });
      }
    }

    // Update seeker's match count
    const matchCount = await prisma.seekerMatch.count({
      where: { seeker_id: seekerId },
    });

    await prisma.propertySeeker.update({
      where: { id: seekerId },
      data: { matches_count: matchCount },
    });

    // Notify user of new matches
    if (properties.length > 0) {
      await prisma.notification.create({
        data: {
          user_id: userId,
          title: 'مطابقات جديدة متاحة',
          message: `تم إيجاد ${properties.length} عقار مطابق للباحث ${seeker.name}`,
          type: 'MATCH',
          link: `/seekers/${seekerId}/matches`,
        },
      });
    }
  }

  private calculateMatchScore(seeker: any, property: any): number {
    let score = 0;
    let maxScore = 0;

    // Property type match (20 points)
    maxScore += 20;
    if (seeker.property_type === property.property_type) {
      score += 20;
    }

    // Price match (30 points)
    maxScore += 30;
    if (seeker.budget_min && seeker.budget_max) {
      if (property.price >= seeker.budget_min && property.price <= seeker.budget_max) {
        score += 30;
      } else {
        const priceDiff = Math.min(
          Math.abs(property.price - seeker.budget_min),
          Math.abs(property.price - seeker.budget_max)
        );
        const budgetRange = seeker.budget_max - seeker.budget_min;
        score += Math.max(0, 30 * (1 - priceDiff / budgetRange));
      }
    }

    // Location match (25 points)
    maxScore += 25;
    if (seeker.preferred_cities.includes(property.city)) {
      score += 15;
    }
    if (seeker.preferred_districts.includes(property.district)) {
      score += 10;
    }

    // Bedrooms match (15 points)
    maxScore += 15;
    if (seeker.bedrooms_min && seeker.bedrooms_max) {
      if (
        property.bedrooms >= seeker.bedrooms_min &&
        property.bedrooms <= seeker.bedrooms_max
      ) {
        score += 15;
      }
    }

    // Area match (10 points)
    maxScore += 10;
    if (seeker.area_min && seeker.area_max) {
      if (property.area >= seeker.area_min && property.area <= seeker.area_max) {
        score += 10;
      }
    }

    // Normalize to 100
    return Math.round((score / maxScore) * 100);
  }

  private generateMatchReason(seeker: any, property: any): string {
    const reasons: string[] = [];

    if (seeker.property_type === property.property_type) {
      reasons.push('نوع العقار مطابق');
    }

    if (
      seeker.budget_min &&
      seeker.budget_max &&
      property.price >= seeker.budget_min &&
      property.price <= seeker.budget_max
    ) {
      reasons.push('السعر ضمن الميزانية');
    }

    if (seeker.preferred_cities.includes(property.city)) {
      reasons.push('الموقع مناسب');
    }

    if (
      seeker.bedrooms_min &&
      property.bedrooms >= seeker.bedrooms_min &&
      property.bedrooms <= (seeker.bedrooms_max || 999)
    ) {
      reasons.push('عدد الغرف مناسب');
    }

    return reasons.join(' • ');
  }
}
```

---

### **3.3: Frontend - Owners & Seekers Tabs**

```typescript
// frontend/src/app/(dashboard)/owners/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Phone, Mail, MapPin, Plus, Search } from 'lucide-react';

export default function OwnersPage() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    notes: '',
  });

  const queryClient = useQueryClient();

  // Fetch owners
  const { data: owners, isLoading } = useQuery({
    queryKey: ['owners', search],
    queryFn: () => apiClient.get('/owners', { params: { search } }),
  });

  // Create owner mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/owners', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      setIsCreateOpen(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        district: '',
        notes: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">الملاك</h1>
          <p className="text-gray-600">إدارة ملاك العقارات</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مالك
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، أو البريد..."
            className="pr-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الملاك</p>
              <p className="text-2xl font-bold">{owners?.pagination?.total || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">نشط</p>
              <p className="text-2xl font-bold">
                {owners?.data?.filter((o: any) => o.status === 'active').length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي العقارات</p>
              <p className="text-2xl font-bold">
                {owners?.data?.reduce((sum: number, o: any) => sum + o.properties_count, 0) || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">القيمة الإجمالية</p>
              <p className="text-xl font-bold">
                {(
                  owners?.data?.reduce((sum: number, o: any) => sum + (o.total_value || 0), 0) ||
                  0
                ).toLocaleString()}{' '}
                ر.س
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Owners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">جاري التحميل...</div>
        ) : owners?.data?.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">لا يوجد ملاك</div>
        ) : (
          owners?.data?.map((owner: any) => (
            <Card key={owner.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{owner.name}</h3>
                    <Badge variant={owner.status === 'active' ? 'default' : 'secondary'}>
                      {owner.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span dir="ltr">{owner.phone}</span>
                </div>
                {owner.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{owner.email}</span>
                  </div>
                )}
                {owner.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {owner.city}
                      {owner.district && ` - ${owner.district}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">العقارات:</span>
                  <span className="font-semibold">{owner.properties_count}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">القيمة:</span>
                  <span className="font-semibold">
                    {(owner.total_value || 0).toLocaleString()} ر.س
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Owner Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة مالك جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الجوال *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">المدينة</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الحي</label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ملاحظات</label>
              <textarea
                className="w-full border rounded-lg p-2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 📊 **IMPLEMENTATION STATUS**

```markdown
═══════════════════════════════════════════════════════════════
           ✅ FEATURES 1-3 COMPLETE
═══════════════════════════════════════════════════════════════

✅ Feature 1: CRM Core (100%)
✅ Feature 2: Finance Integration (100%)
✅ Feature 3: Owners & Seekers (100%)

⏳ Remaining: Features 4-7 (Coming next...)

Files Created:
- CORE-FEATURES-IMPLEMENTATION.md (Features 1-2)
- CORE-FEATURES-PART2.md (Feature 3, 4-7 in progress)

Next Steps:
1. Implement Feature 4: Auto Publishing System
2. Implement Feature 5: Calendar & Appointments
3. Implement Feature 6: Digital Business Card
4. Implement Feature 7: Reports & Analytics

═══════════════════════════════════════════════════════════════
```

---

📄 **File:** `/CORE-FEATURES-PART2.md`  
🎯 **Purpose:** Features 3-7 implementation  
⏱️ **Progress:** Feature 3 complete (Owners & Seekers)  
📍 **Next:** Features 4-7 (Auto Publishing, Calendar, Digital Card, Analytics)
