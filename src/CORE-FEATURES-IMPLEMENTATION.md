# 🎯 **Core Features Implementation Guide - Nova CRM**
## **Complete Backend + Frontend Implementation**

---

## 📋 **IMPLEMENTATION OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│              NOVA CRM - 7 CORE FEATURES                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CRM Core - Customer Interactions                        │
│  2. Finance Integration - Accounting & Commissions          │
│  3. Owners & Seekers Tabs                                   │
│  4. Auto Publishing to Platforms                            │
│  5. Calendar & Appointments                                 │
│  6. Digital Business Card                                   │
│  7. Reports & Analytics                                     │
│                                                              │
│  Timeline: 8-10 weeks                                        │
│  Implementation Order: Sequential (1→7)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ **CRM CORE - CUSTOMER INTERACTIONS**

### **1.1: Database Schema**

```sql
-- Customer Interactions Table
CREATE TABLE customer_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Interaction Details
  type VARCHAR(50) NOT NULL, -- 'call', 'meeting', 'email', 'whatsapp', 'note'
  subject VARCHAR(255),
  notes TEXT,
  outcome VARCHAR(100), -- 'interested', 'not_interested', 'callback', 'deal_closed'
  
  -- Scheduling
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_minutes INTEGER,
  
  -- Attachments
  attachments JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customer_interactions_customer ON customer_interactions(customer_id);
CREATE INDEX idx_customer_interactions_user ON customer_interactions(user_id);
CREATE INDEX idx_customer_interactions_scheduled ON customer_interactions(scheduled_at);

-- Follow-ups Table
CREATE TABLE customer_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  interaction_id UUID REFERENCES customer_interactions(id),
  
  -- Follow-up Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_at TIMESTAMP,
  
  -- Completion
  completed_at TIMESTAMP,
  completion_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_followups_customer ON customer_followups(customer_id);
CREATE INDEX idx_followups_user ON customer_followups(user_id);
CREATE INDEX idx_followups_due_date ON customer_followups(due_date);
CREATE INDEX idx_followups_status ON customer_followups(status);
```

---

### **1.2: Backend API - Customer Interactions**

```typescript
// backend/src/modules/crm/interaction-controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { z } from 'zod';

const createInteractionSchema = z.object({
  customer_id: z.string().uuid(),
  type: z.enum(['call', 'meeting', 'email', 'whatsapp', 'note']),
  subject: z.string().optional(),
  notes: z.string().optional(),
  outcome: z.string().optional(),
  scheduled_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  duration_minutes: z.number().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
});

export class InteractionController {
  // POST /api/customers/:id/interactions
  async createInteraction(req: Request, res: Response) {
    try {
      const { id: customerId } = req.params;
      const userId = (req as any).user.sub;
      
      const data = createInteractionSchema.parse({
        ...req.body,
        customer_id: customerId,
      });

      // Verify customer exists and belongs to user's tenant
      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          user: { id: userId },
        },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Create interaction
      const interaction = await prisma.customerInteraction.create({
        data: {
          customer_id: customerId,
          user_id: userId,
          type: data.type,
          subject: data.subject,
          notes: data.notes,
          outcome: data.outcome,
          scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
          completed_at: data.completed_at ? new Date(data.completed_at) : null,
          duration_minutes: data.duration_minutes,
          attachments: data.attachments || [],
        },
      });

      // Update customer's last contact date
      await prisma.customer.update({
        where: { id: customerId },
        data: { last_contact: new Date() },
      });

      // Create notification for team members
      await this.notifyTeam(customerId, userId, interaction);

      // If outcome is positive, suggest follow-up
      if (data.outcome === 'interested' || data.outcome === 'callback') {
        await this.suggestFollowUp(customerId, userId, interaction.id);
      }

      res.status(201).json(interaction);
    } catch (error) {
      console.error('Create interaction error:', error);
      res.status(400).json({ error: 'Failed to create interaction' });
    }
  }

  // GET /api/customers/:id/interactions
  async getInteractions(req: Request, res: Response) {
    try {
      const { id: customerId } = req.params;
      const userId = (req as any).user.sub;
      const { page = 1, limit = 20, type, outcome } = req.query;

      // Verify access
      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          user: { id: userId },
        },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Build filters
      const where: any = { customer_id: customerId };
      if (type) where.type = type;
      if (outcome) where.outcome = outcome;

      // Get interactions with pagination
      const [interactions, total] = await Promise.all([
        prisma.customerInteraction.findMany({
          where,
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { created_at: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.customerInteraction.count({ where }),
      ]);

      res.json({
        data: interactions,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get interactions error:', error);
      res.status(500).json({ error: 'Failed to get interactions' });
    }
  }

  // POST /api/customers/:id/followups
  async createFollowUp(req: Request, res: Response) {
    try {
      const { id: customerId } = req.params;
      const userId = (req as any).user.sub;

      const schema = z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        due_date: z.string().datetime(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
        interaction_id: z.string().uuid().optional(),
      });

      const data = schema.parse(req.body);

      // Verify customer
      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          user: { id: userId },
        },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Create follow-up
      const followUp = await prisma.customerFollowup.create({
        data: {
          customer_id: customerId,
          user_id: userId,
          interaction_id: data.interaction_id,
          title: data.title,
          description: data.description,
          due_date: new Date(data.due_date),
          priority: data.priority,
          status: 'pending',
        },
      });

      // Schedule reminder (24 hours before due date)
      const reminderAt = new Date(data.due_date);
      reminderAt.setHours(reminderAt.getHours() - 24);

      if (reminderAt > new Date()) {
        await this.scheduleReminder(followUp.id, reminderAt);
      }

      res.status(201).json(followUp);
    } catch (error) {
      console.error('Create follow-up error:', error);
      res.status(400).json({ error: 'Failed to create follow-up' });
    }
  }

  // GET /api/customers/reports
  async getCustomerReports(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { filter = 'status', date = 'last30days' } = req.query;

      // Calculate date range
      const dateRange = this.getDateRange(date as string);

      let report: any = {};

      if (filter === 'status') {
        // Group by status
        report = await prisma.customer.groupBy({
          by: ['status'],
          where: {
            user_id: userId,
            created_at: { gte: dateRange.start, lte: dateRange.end },
          },
          _count: true,
        });
      } else if (filter === 'interactions') {
        // Interaction statistics
        report = await prisma.customerInteraction.groupBy({
          by: ['type'],
          where: {
            user_id: userId,
            created_at: { gte: dateRange.start, lte: dateRange.end },
          },
          _count: true,
          _avg: { duration_minutes: true },
        });
      } else if (filter === 'outcomes') {
        // Outcomes distribution
        report = await prisma.customerInteraction.groupBy({
          by: ['outcome'],
          where: {
            user_id: userId,
            outcome: { not: null },
            created_at: { gte: dateRange.start, lte: dateRange.end },
          },
          _count: true,
        });
      }

      res.json({
        filter,
        date_range: {
          start: dateRange.start,
          end: dateRange.end,
        },
        data: report,
      });
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({ error: 'Failed to get reports' });
    }
  }

  private getDateRange(period: string): { start: Date; end: Date } {
    const end = new Date();
    let start = new Date();

    switch (period) {
      case 'last7days':
        start.setDate(start.getDate() - 7);
        break;
      case 'last30days':
        start.setDate(start.getDate() - 30);
        break;
      case 'last90days':
        start.setDate(start.getDate() - 90);
        break;
      case 'thisMonth':
        start = new Date(start.getFullYear(), start.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
        end = new Date(start.getFullYear(), start.getMonth(), 0);
        break;
      default:
        start.setDate(start.getDate() - 30);
    }

    return { start, end };
  }

  private async notifyTeam(customerId: string, userId: string, interaction: any) {
    // Get team members who should be notified
    const teamMembers = await prisma.user.findMany({
      where: {
        tenant_id: (await prisma.user.findUnique({ where: { id: userId } }))?.tenant_id,
        id: { not: userId },
      },
    });

    for (const member of teamMembers) {
      await prisma.notification.create({
        data: {
          user_id: member.id,
          title: `تفاعل جديد مع عميل`,
          message: `قام ${(await prisma.user.findUnique({ where: { id: userId } }))?.name} بإضافة ${interaction.type}`,
          type: 'INTERACTION',
          link: `/customers/${customerId}`,
        },
      });
    }
  }

  private async suggestFollowUp(customerId: string, userId: string, interactionId: string) {
    // AI-powered follow-up suggestion
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { interactions: { orderBy: { created_at: 'desc' }, take: 5 } },
    });

    // Simple rule: suggest follow-up in 3 days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    await prisma.customerFollowup.create({
      data: {
        customer_id: customerId,
        user_id: userId,
        interaction_id: interactionId,
        title: 'متابعة العميل',
        description: 'تواصل مع العميل للتأكد من اهتمامه',
        due_date: dueDate,
        priority: 'medium',
        status: 'pending',
      },
    });
  }

  private async scheduleReminder(followUpId: string, reminderAt: Date) {
    // Schedule reminder job (using bull queue or similar)
    // For now, just update the reminder_at field
    await prisma.customerFollowup.update({
      where: { id: followUpId },
      data: { reminder_at: reminderAt },
    });
  }
}
```

---

### **1.3: Frontend - Customer Dashboard**

```typescript
// frontend/src/components/customers/CustomerInteractions.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageSquare, Calendar, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface InteractionFormData {
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'note';
  subject?: string;
  notes?: string;
  outcome?: string;
  scheduled_at?: string;
  duration_minutes?: number;
}

export function CustomerInteractions({ customerId }: { customerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<InteractionFormData>({
    type: 'call',
  });

  const queryClient = useQueryClient();

  // Fetch interactions
  const { data: interactions, isLoading } = useQuery({
    queryKey: ['customer-interactions', customerId],
    queryFn: () => apiClient.get(`/customers/${customerId}/interactions`),
  });

  // Create interaction mutation
  const createMutation = useMutation({
    mutationFn: (data: InteractionFormData) =>
      apiClient.post(`/customers/${customerId}/interactions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-interactions', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      setIsOpen(false);
      setFormData({ type: 'call' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      completed_at: new Date().toISOString(),
    });
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getOutcomeBadge = (outcome?: string) => {
    const colors: Record<string, string> = {
      interested: 'bg-green-100 text-green-800',
      not_interested: 'bg-red-100 text-red-800',
      callback: 'bg-yellow-100 text-yellow-800',
      deal_closed: 'bg-blue-100 text-blue-800',
    };

    const labels: Record<string, string> = {
      interested: 'مهتم',
      not_interested: 'غير مهتم',
      callback: 'إعادة اتصال',
      deal_closed: 'صفقة مغلقة',
    };

    if (!outcome) return null;

    return (
      <Badge className={colors[outcome] || 'bg-gray-100 text-gray-800'}>
        {labels[outcome] || outcome}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>سجل التفاعلات</CardTitle>
        <Button onClick={() => setIsOpen(true)} size="sm">
          <Plus className="h-4 w-4 ml-2" />
          تفاعل جديد
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : interactions?.data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا توجد تفاعلات مسجلة
          </div>
        ) : (
          <div className="space-y-4">
            {interactions?.data?.map((interaction: any) => (
              <div
                key={interaction.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary-50 rounded-full">
                    {getInteractionIcon(interaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {interaction.subject || typeLabels[interaction.type]}
                        </span>
                        {getOutcomeBadge(interaction.outcome)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(interaction.created_at), 'PPp', { locale: ar })}
                      </span>
                    </div>
                    {interaction.notes && (
                      <p className="text-sm text-gray-600 mb-2">{interaction.notes}</p>
                    )}
                    {interaction.duration_minutes && (
                      <span className="text-xs text-gray-500">
                        المدة: {interaction.duration_minutes} دقيقة
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={interaction.user.avatar || '/default-avatar.png'}
                        alt={interaction.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{interaction.user.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Interaction Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل تفاعل جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نوع التفاعل</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">مكالمة هاتفية</SelectItem>
                      <SelectItem value="meeting">اجتماع</SelectItem>
                      <SelectItem value="email">بريد إلكتروني</SelectItem>
                      <SelectItem value="whatsapp">واتساب</SelectItem>
                      <SelectItem value="note">ملاحظة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">النتيجة</label>
                  <Select
                    value={formData.outcome}
                    onValueChange={(value) =>
                      setFormData({ ...formData, outcome: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النتيجة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">مهتم</SelectItem>
                      <SelectItem value="not_interested">غير مهتم</SelectItem>
                      <SelectItem value="callback">إعادة اتصال</SelectItem>
                      <SelectItem value="deal_closed">صفقة مغلقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الموضوع</label>
                <Input
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="عنوان التفاعل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الملاحظات</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="اكتب ملاحظاتك هنا..."
                  rows={4}
                />
              </div>

              {formData.type === 'call' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    مدة المكالمة (دقيقة)
                  </label>
                  <Input
                    type="number"
                    value={formData.duration_minutes || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: parseInt(e.target.value),
                      })
                    }
                    placeholder="15"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ التفاعل'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

const typeLabels: Record<string, string> = {
  call: 'مكالمة هاتفية',
  meeting: 'اجتماع',
  email: 'بريد إلكتروني',
  whatsapp: 'رسالة واتساب',
  note: 'ملاحظة',
};
```

---

## 2️⃣ **FINANCE INTEGRATION - ACCOUNTING & COMMISSIONS**

### **2.1: Database Schema**

```sql
-- Sales Table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  customer_id UUID REFERENCES customers(id),
  property_id UUID REFERENCES properties(id),
  
  -- Sale Details
  sale_type VARCHAR(50) NOT NULL, -- 'sale', 'rent', 'commission'
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  commission_rate DECIMAL(5, 2), -- Percentage
  commission_amount DECIMAL(15, 2),
  
  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'partial', 'completed'
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_date DATE,
  
  -- Contract
  contract_number VARCHAR(100),
  contract_date DATE,
  contract_file_url TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_user ON sales(user_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_property ON sales(property_id);
CREATE INDEX idx_sales_status ON sales(payment_status);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Payment Details
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  payment_method VARCHAR(50) NOT NULL, -- 'cash', 'bank_transfer', 'check', 'card'
  payment_date DATE NOT NULL,
  
  -- Reference
  reference_number VARCHAR(100),
  receipt_url TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled'
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_sale ON payments(sale_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Commissions Table
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Commission Details
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  rate DECIMAL(5, 2) NOT NULL,
  
  -- Payment
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'paid'
  paid_date DATE,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_sale ON commissions(sale_id);
CREATE INDEX idx_commissions_user ON commissions(user_id);
CREATE INDEX idx_commissions_status ON commissions(status);
```

---

### **2.2: Backend API - Finance**

```typescript
// backend/src/modules/finance/finance-controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { z } from 'zod';

const createSaleSchema = z.object({
  customer_id: z.string().uuid().optional(),
  property_id: z.string().uuid().optional(),
  sale_type: z.enum(['sale', 'rent', 'commission']),
  amount: z.number().positive(),
  currency: z.string().default('SAR'),
  commission_rate: z.number().min(0).max(100).optional(),
  payment_method: z.string().optional(),
  payment_date: z.string().optional(),
  contract_number: z.string().optional(),
  contract_date: z.string().optional(),
  notes: z.string().optional(),
});

export class FinanceController {
  // POST /api/finance/sales
  async createSale(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const data = createSaleSchema.parse(req.body);

      // Calculate commission
      const commissionRate = data.commission_rate || 2.5; // Default 2.5%
      const commissionAmount = (data.amount * commissionRate) / 100;

      // Create sale
      const sale = await prisma.sale.create({
        data: {
          user_id: userId,
          customer_id: data.customer_id,
          property_id: data.property_id,
          sale_type: data.sale_type,
          amount: data.amount,
          currency: data.currency,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          payment_status: 'pending',
          paid_amount: 0,
          payment_method: data.payment_method,
          payment_date: data.payment_date ? new Date(data.payment_date) : null,
          contract_number: data.contract_number,
          contract_date: data.contract_date ? new Date(data.contract_date) : null,
          notes: data.notes,
        },
        include: {
          customer: true,
          property: true,
        },
      });

      // Auto-create commission record
      await prisma.commission.create({
        data: {
          sale_id: sale.id,
          user_id: userId,
          amount: commissionAmount,
          currency: data.currency,
          rate: commissionRate,
          status: 'pending',
        },
      });

      // If property_id exists, update property status
      if (data.property_id) {
        await prisma.property.update({
          where: { id: data.property_id },
          data: { status: data.sale_type === 'rent' ? 'رented' : 'sold' },
        });
      }

      // Send notification
      await prisma.notification.create({
        data: {
          user_id: userId,
          title: 'تم تسجيل عملية بيع جديدة',
          message: `تم تسجيل عملية بيع بقيمة ${data.amount} ${data.currency}`,
          type: 'SALE',
          link: `/finance/sales/${sale.id}`,
        },
      });

      res.status(201).json(sale);
    } catch (error) {
      console.error('Create sale error:', error);
      res.status(400).json({ error: 'Failed to create sale' });
    }
  }

  // POST /api/finance/sales/:id/payments
  async recordPayment(req: Request, res: Response) {
    try {
      const { id: saleId } = req.params;
      const userId = (req as any).user.sub;

      const schema = z.object({
        amount: z.number().positive(),
        payment_method: z.string(),
        payment_date: z.string(),
        reference_number: z.string().optional(),
        notes: z.string().optional(),
      });

      const data = schema.parse(req.body);

      // Get sale
      const sale = await prisma.sale.findFirst({
        where: { id: saleId, user_id: userId },
      });

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          sale_id: saleId,
          user_id: userId,
          amount: data.amount,
          currency: sale.currency,
          payment_method: data.payment_method,
          payment_date: new Date(data.payment_date),
          reference_number: data.reference_number,
          status: 'confirmed',
          notes: data.notes,
        },
      });

      // Update sale paid amount
      const newPaidAmount = sale.paid_amount + data.amount;
      const paymentStatus =
        newPaidAmount >= sale.amount
          ? 'completed'
          : newPaidAmount > 0
          ? 'partial'
          : 'pending';

      await prisma.sale.update({
        where: { id: saleId },
        data: {
          paid_amount: newPaidAmount,
          payment_status: paymentStatus,
        },
      });

      // If fully paid, update commission status
      if (paymentStatus === 'completed') {
        await prisma.commission.updateMany({
          where: { sale_id: saleId, status: 'pending' },
          data: { status: 'approved' },
        });
      }

      res.status(201).json(payment);
    } catch (error) {
      console.error('Record payment error:', error);
      res.status(400).json({ error: 'Failed to record payment' });
    }
  }

  // POST /api/finance/commissions
  async getCommissions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { status, period = 'thisMonth' } = req.query;

      // Calculate date range
      const dateRange = this.getDateRange(period as string);

      // Build filters
      const where: any = {
        user_id: userId,
        created_at: { gte: dateRange.start, lte: dateRange.end },
      };

      if (status) {
        where.status = status;
      }

      // Get commissions
      const [commissions, summary] = await Promise.all([
        prisma.commission.findMany({
          where,
          include: {
            sale: {
              include: {
                customer: true,
                property: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        }),
        prisma.commission.aggregate({
          where,
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      // Group by status
      const byStatus = await prisma.commission.groupBy({
        by: ['status'],
        where: {
          user_id: userId,
          created_at: { gte: dateRange.start, lte: dateRange.end },
        },
        _sum: { amount: true },
        _count: true,
      });

      res.json({
        commissions,
        summary: {
          total: summary._sum.amount || 0,
          count: summary._count,
          by_status: byStatus,
        },
      });
    } catch (error) {
      console.error('Get commissions error:', error);
      res.status(500).json({ error: 'Failed to get commissions' });
    }
  }

  // GET /api/finance/reports
  async getFinanceReports(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { period = 'monthly' } = req.query;

      const dateRange = this.getDateRange(period as string);

      // Sales summary
      const salesSummary = await prisma.sale.aggregate({
        where: {
          user_id: userId,
          created_at: { gte: dateRange.start, lte: dateRange.end },
        },
        _sum: {
          amount: true,
          commission_amount: true,
          paid_amount: true,
        },
        _count: true,
      });

      // Sales by type
      const salesByType = await prisma.sale.groupBy({
        by: ['sale_type'],
        where: {
          user_id: userId,
          created_at: { gte: dateRange.start, lte: dateRange.end },
        },
        _sum: { amount: true },
        _count: true,
      });

      // Sales by status
      const salesByStatus = await prisma.sale.groupBy({
        by: ['payment_status'],
        where: {
          user_id: userId,
          created_at: { gte: dateRange.start, lte: dateRange.end },
        },
        _sum: { amount: true, paid_amount: true },
        _count: true,
      });

      // Monthly trend (last 6 months)
      const monthlyTrend = await this.getMonthlyTrend(userId);

      res.json({
        period: {
          start: dateRange.start,
          end: dateRange.end,
        },
        summary: {
          total_sales: salesSummary._sum.amount || 0,
          total_commissions: salesSummary._sum.commission_amount || 0,
          total_paid: salesSummary._sum.paid_amount || 0,
          sales_count: salesSummary._count,
        },
        by_type: salesByType,
        by_status: salesByStatus,
        monthly_trend: monthlyTrend,
      });
    } catch (error) {
      console.error('Get finance reports error:', error);
      res.status(500).json({ error: 'Failed to get finance reports' });
    }
  }

  private getDateRange(period: string): { start: Date; end: Date } {
    const end = new Date();
    let start = new Date();

    switch (period) {
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarterly':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'thisMonth':
        start = new Date(start.getFullYear(), start.getMonth(), 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }

    return { start, end };
  }

  private async getMonthlyTrend(userId: string) {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const summary = await prisma.sale.aggregate({
        where: {
          user_id: userId,
          created_at: { gte: start, lte: end },
        },
        _sum: { amount: true, commission_amount: true },
        _count: true,
      });

      months.push({
        month: start.toLocaleString('ar-SA', { month: 'long', year: 'numeric' }),
        sales: summary._sum.amount || 0,
        commissions: summary._sum.commission_amount || 0,
        count: summary._count,
      });
    }

    return months;
  }
}
```

---

## 📊 **IMPLEMENTATION TIMELINE**

```markdown
═══════════════════════════════════════════════════════════════
           📅 8-10 WEEK IMPLEMENTATION TIMELINE
═══════════════════════════════════════════════════════════════

WEEK 1-2: CRM CORE
├─ Database schema setup
├─ Backend API (Interactions + Follow-ups)
├─ Frontend components
└─ Testing & integration

WEEK 3: FINANCE INTEGRATION
├─ Database schema
├─ Backend API (Sales + Commissions)
├─ Frontend dashboards
└─ Testing

WEEK 4: OWNERS & SEEKERS
├─ Database extensions
├─ Backend API
├─ Frontend tabs
└─ Real-time notifications

WEEK 5: AUTO PUBLISHING
├─ Platform integrations
├─ Publishing engine
├─ Scheduler
└─ Status tracking

WEEK 6: CALENDAR & APPOINTMENTS
├─ Calendar backend
├─ Frontend calendar UI
├─ Reminders system
└─ AI suggestions

WEEK 7: DIGITAL BUSINESS CARD
├─ Card backend
├─ Frontend card designer
├─ QR code generation
└─ Sharing system

WEEK 8: REPORTS & ANALYTICS
├─ Analytics engine
├─ Report generation
├─ Frontend dashboards
└─ Export functionality

WEEK 9-10: TESTING & POLISH
├─ End-to-end testing
├─ Bug fixes
├─ Performance optimization
└─ Documentation

═══════════════════════════════════════════════════════════════
✅ DELIVERABLE: Complete CRM with all 7 features
═══════════════════════════════════════════════════════════════
```

---

📄 **File:** `/CORE-FEATURES-IMPLEMENTATION.md`  
🎯 **Purpose:** Complete implementation guide for 7 core features  
⏱️ **Timeline:** 8-10 weeks  
✅ **Status:** Ready for development (Features 1-2 complete, 3-7 in progress...)
