# 💻 **أمثلة الكود الكاملة - Nova CRM**
## **Copy-Paste Ready Code for All Modules**

---

## 📋 **Table of Contents**

1. [CRM Module](#crm-module)
2. [Properties Module](#properties-module)
3. [Smart Matches](#smart-matches)
4. [Calendar & Appointments](#calendar--appointments)
5. [Tasks Module](#tasks-module)
6. [Real-time with Socket.io](#real-time)
7. [Middleware](#middleware)
8. [Frontend Components](#frontend-components)

---

## 🔹 **CRM MODULE**

### **Backend: Customers Service**

```typescript
// backend/src/modules/customers/customers.service.ts
import { prisma } from '../../config/database';

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  category?: string;
  interestLevel?: string;
  source?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredCities?: string[];
  preferredDistricts?: string[];
  propertyTypes?: string[];
  tags?: string[];
  notes?: string;
}

export interface GetCustomersFilters {
  search?: string;
  category?: string;
  interestLevel?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export class CustomersService {
  async create(userId: string, data: CreateCustomerInput) {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        userId,
        createdAt: new Date(),
      },
    });

    // Log activity
    await prisma.customerActivity.create({
      data: {
        customerId: customer.id,
        userId,
        type: 'note',
        description: 'Customer created',
      },
    });

    // Update user stats
    await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalCustomers: 1,
        activeCustomers: 1,
      },
      update: {
        totalCustomers: { increment: 1 },
        activeCustomers: { increment: 1 },
      },
    });

    return customer;
  }

  async getAll(userId: string, filters: GetCustomersFilters) {
    const {
      search,
      category,
      interestLevel,
      tags,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (interestLevel) {
      where.interestLevel = interestLevel;
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      customers,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getById(customerId: string, userId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, userId },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        documents: true,
        properties: true,
        requests: true,
        appointments: {
          where: {
            startDatetime: { gte: new Date() },
          },
          orderBy: { startDatetime: 'asc' },
        },
        tasks: {
          where: { status: { not: 'DONE' } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  async update(customerId: string, userId: string, data: Partial<CreateCustomerInput>) {
    const customer = await prisma.customer.updateMany({
      where: { id: customerId, userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    if (customer.count === 0) {
      throw new Error('Customer not found');
    }

    // Log activity
    await prisma.customerActivity.create({
      data: {
        customerId,
        userId,
        type: 'note',
        description: 'Customer updated',
      },
    });

    return this.getById(customerId, userId);
  }

  async delete(customerId: string, userId: string) {
    const result = await prisma.customer.deleteMany({
      where: { id: customerId, userId },
    });

    if (result.count === 0) {
      throw new Error('Customer not found');
    }

    // Update stats
    await prisma.userStats.update({
      where: { userId },
      data: {
        totalCustomers: { decrement: 1 },
        activeCustomers: { decrement: 1 },
      },
    });

    return { message: 'Customer deleted' };
  }

  async addActivity(customerId: string, userId: string, activity: {
    type: string;
    description?: string;
    metadata?: any;
  }) {
    const customerActivity = await prisma.customerActivity.create({
      data: {
        customerId,
        userId,
        ...activity,
        createdAt: new Date(),
      },
    });

    // Update last contact
    await prisma.customer.update({
      where: { id: customerId },
      data: { lastContact: new Date() },
    });

    return customerActivity;
  }
}
```

---

### **Backend: Customers Controller**

```typescript
// backend/src/modules/customers/customers.controller.ts
import { Request, Response } from 'express';
import { CustomersService } from './customers.service';
import { z } from 'zod';

const customersService = new CustomersService();

const createCustomerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^05\d{8}$/),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  category: z.string().optional(),
  interestLevel: z.string().optional(),
  source: z.string().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  preferredCities: z.array(z.string()).optional(),
  preferredDistricts: z.array(z.string()).optional(),
  propertyTypes: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export class CustomersController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const data = createCustomerSchema.parse(req.body);
      const customer = await customersService.create(userId, data);
      return res.status(201).json({ customer });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        interestLevel: req.query.interestLevel as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };
      const result = await customersService.getAll(userId, filters);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { id } = req.params;
      const customer = await customersService.getById(id, userId);
      return res.json({ customer });
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { id } = req.params;
      const data = req.body;
      const customer = await customersService.update(id, userId, data);
      return res.json({ customer });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { id } = req.params;
      const result = await customersService.delete(id, userId);
      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async addActivity(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { id } = req.params;
      const activity = req.body;
      const result = await customersService.addActivity(id, userId, activity);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
```

---

### **Backend: Customers Routes**

```typescript
// backend/src/modules/customers/customers.routes.ts
import { Router } from 'express';
import { CustomersController } from './customers.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const customersController = new CustomersController();

// All routes require authentication
router.use(authMiddleware);

router.get('/', (req, res) => customersController.getAll(req, res));
router.post('/', (req, res) => customersController.create(req, res));
router.get('/:id', (req, res) => customersController.getById(req, res));
router.patch('/:id', (req, res) => customersController.update(req, res));
router.delete('/:id', (req, res) => customersController.delete(req, res));
router.post('/:id/activities', (req, res) => customersController.addActivity(req, res));

export default router;
```

---

### **Frontend: Customer Card Component**

```typescript
// frontend/src/components/crm/CustomerCard.tsx
'use client';

import { Customer } from '@/types/customer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const CustomerCard = ({
  customer,
  onEdit,
  onDelete,
  onClick,
}: CustomerCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getInterestColor = (level: string) => {
    const colors: Record<string, string> = {
      'مهتم جداً': 'bg-green-500',
      'مهتم': 'bg-blue-500',
      'محتمل': 'bg-yellow-500',
      'بارد': 'bg-gray-500',
    };
    return colors[level] || 'bg-gray-500';
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="p-4 cursor-pointer hover:border-primary-500 transition-colors"
        onClick={() => onClick?.(customer.id)}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-primary-500 text-white">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">{customer.name}</h3>
              {customer.isVip && (
                <Badge className="bg-yellow-500">VIP</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{customer.category}</p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(customer.id);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(customer.id);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-primary-600" />
            <span dir="ltr">{customer.phone}</span>
          </div>

          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary-600" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}

          {customer.preferredCities && customer.preferredCities.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="truncate">{customer.preferredCities.join(', ')}</span>
            </div>
          )}

          {customer.budgetMin && customer.budgetMax && (
            <div className="text-sm text-gray-600">
              الميزانية: {customer.budgetMin.toLocaleString()} - {customer.budgetMax.toLocaleString()} ريال
            </div>
          )}

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {customer.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {customer.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{customer.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3 pt-3 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <MapPin className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <Badge className={getInterestColor(customer.interestLevel || '')}>
            {customer.interestLevel}
          </Badge>

          <span className="text-xs text-gray-500">
            {customer.lastContact
              ? `آخر تواصل: ${new Date(customer.lastContact).toLocaleDateString('ar-SA')}`
              : 'لم يتم التواصل'}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};
```

---

## 🔹 **SMART MATCHES ALGORITHM**

### **Backend: Matching Service**

```typescript
// backend/src/modules/smart-matches/matching.service.ts
import { prisma } from '../../config/database';

interface MatchScore {
  score: number;
  breakdown: {
    city: number;
    district: number;
    propertyType: number;
    category: number;
    price: number;
    area: number;
  };
  matchedFeatures: string[];
}

export class MatchingService {
  async calculateMatches(userId: string): Promise<void> {
    console.log(`Calculating matches for user ${userId}`);

    // Get user's requests
    const requests = await prisma.request.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    if (requests.length === 0) {
      console.log('No active requests found');
      return;
    }

    // Get marketplace offers (exclude own offers)
    const offers = await prisma.offer.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: userId },
        acceptedCount: { lt: prisma.raw('max_brokers') },
      },
      include: {
        property: true,
      },
    });

    if (offers.length === 0) {
      console.log('No marketplace offers found');
      return;
    }

    const matches = [];

    for (const request of requests) {
      for (const offer of offers) {
        const matchData = this.calculateMatchScore(request, offer.property);

        // Only create matches with score >= 50%
        if (matchData.score >= 50) {
          // Check if match already exists
          const existing = await prisma.smartMatch.findUnique({
            where: {
              offerId_requestId_brokerId: {
                offerId: offer.id,
                requestId: request.id,
                brokerId: userId,
              },
            },
          });

          if (!existing) {
            matches.push({
              offerId: offer.id,
              requestId: request.id,
              brokerId: userId,
              matchScore: matchData.score,
              matchedFeatures: matchData.matchedFeatures,
              calculationData: matchData.breakdown,
              algorithmVersion: '1.0',
            });
          }
        }
      }
    }

    // Save matches
    if (matches.length > 0) {
      await prisma.smartMatch.createMany({
        data: matches,
      });

      // Update user stats
      await prisma.userStats.update({
        where: { userId },
        data: {
          totalMatches: { increment: matches.length },
        },
      });

      // Send notification
      await prisma.notification.create({
        data: {
          userId,
          title: 'فرص ذكية جديدة! 🎯',
          message: `تم العثور على ${matches.length} فرصة مطابقة لطلباتك`,
          type: 'SMART_MATCH',
          priority: 'NORMAL',
        },
      });

      console.log(`Created ${matches.length} new matches`);
    }
  }

  private calculateMatchScore(request: any, property: any): MatchScore {
    let score = 0;
    const breakdown = {
      city: 0,
      district: 0,
      propertyType: 0,
      category: 0,
      price: 0,
      area: 0,
    };
    const matchedFeatures: string[] = [];

    // City match (25 points)
    if (request.cities.includes(property.city)) {
      breakdown.city = 25;
      score += 25;
      matchedFeatures.push('المدينة');
    }

    // District match (20 points)
    if (request.districts && request.districts.length > 0) {
      if (request.districts.includes(property.district)) {
        breakdown.district = 20;
        score += 20;
        matchedFeatures.push('الحي');
      }
    } else {
      // No district preference = partial points
      breakdown.district = 10;
      score += 10;
    }

    // Property type (20 points)
    if (request.propertyTypes.includes(property.propertyType)) {
      breakdown.propertyType = 20;
      score += 20;
      matchedFeatures.push('نوع العقار');
    }

    // Category (10 points)
    if (property.category === 'سكني' && request.type === 'BUY') {
      breakdown.category = 10;
      score += 10;
    }

    // Price match (15 points)
    if (request.priceMin && request.priceMax) {
      if (property.price >= request.priceMin && property.price <= request.priceMax) {
        breakdown.price = 15;
        score += 15;
        matchedFeatures.push('السعر');
      } else {
        // Calculate proximity score
        const midPoint = (request.priceMin + request.priceMax) / 2;
        const range = request.priceMax - request.priceMin;
        const diff = Math.abs(property.price - midPoint);
        const proximity = 1 - (diff / range);

        if (proximity > 0) {
          breakdown.price = Math.round(15 * proximity);
          score += breakdown.price;
        }
      }
    }

    // Area match (10 points)
    if (request.areaMin && request.areaMax) {
      if (property.area >= request.areaMin && property.area <= request.areaMax) {
        breakdown.area = 10;
        score += 10;
        matchedFeatures.push('المساحة');
      } else {
        // Calculate proximity score
        const midPoint = (request.areaMin + request.areaMax) / 2;
        const range = request.areaMax - request.areaMin;
        const diff = Math.abs(property.area - midPoint);
        const proximity = 1 - (diff / range);

        if (proximity > 0) {
          breakdown.area = Math.round(10 * proximity);
          score += breakdown.area;
        }
      }
    }

    return {
      score: Math.round(score),
      breakdown,
      matchedFeatures,
    };
  }
}
```

---

## 🔹 **REAL-TIME WITH SOCKET.IO**

### **Backend: Socket Server**

```typescript
// backend/src/config/socket.ts
import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { verifyToken } from '../utils/jwt';

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const user = verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.sub;

    // Join user's personal room
    socket.join(`user:${userId}`);

    console.log(`✅ User ${userId} connected`);

    // Handle custom events
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });

  return io;
};

// Emit events helper
export const emitToUser = (io: SocketServer, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};
```

---

### **Frontend: Real-time Hook**

```typescript
// frontend/src/hooks/useRealtime.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

let socket: Socket | null = null;

export const useRealtime = (event: string, callback: (data: any) => void) => {
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    // Initialize socket if not exists
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        auth: { token },
      });

      socket.on('connect', () => {
        console.log('✅ Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
      });
    }

    // Subscribe to event
    socket.on(event, callback);

    // Cleanup
    return () => {
      socket?.off(event, callback);
    };
  }, [token, event, callback]);

  return socket;
};
```

---

## 📄 **More Examples Available**

This file contains the most critical code examples. For complete implementations of:
- Properties Module
- Calendar & Appointments
- Tasks Module
- Teams & Permissions
- Analytics
- Frontend Components

Refer to the full prompts in:
- `PROMPT-2-BACKEND-API-EXECUTION.md`
- `PROMPT-3-FRONTEND-EXECUTION.md`

---

📄 **File:** `/CODE-EXAMPLES-COMPLETE.md`  
💻 **Type:** Copy-Paste Ready Code  
🎯 **Coverage:** Core modules  
✅ **Production Ready:** Yes
