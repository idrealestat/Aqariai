# 🚀 **FEATURE 1: CRM CORE - PART 2**
## **Frontend Components + AI + Testing**

---

# 4️⃣ **FRONTEND COMPONENTS**

## **Customer List Page**

File: `frontend/src/app/(dashboard)/customers/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CreateCustomerDialog } from '@/components/customers/CreateCustomerDialog';
import { useCustomers } from '@/hooks/useCustomers';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });

  const { customers, loading, refetch } = useCustomers({
    search: searchQuery,
    ...filters,
  });

  return (
    <div className="container mx-auto p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">العملاء</h1>
          <p className="text-gray-500 mt-1">
            إدارة قاعدة عملائك وتتبع تفاعلاتهم
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#01411C] hover:bg-[#01411C]/90"
        >
          <Plus className="ml-2 h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="ابحث عن عميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">كل الأنواع</option>
          <option value="buyer">مشترون</option>
          <option value="seller">بائعون</option>
          <option value="both">كلاهما</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="إجمالي العملاء"
          value={customers?.length || 0}
          icon="👥"
          color="bg-blue-500"
        />
        <StatsCard
          title="عملاء نشطون"
          value={customers?.filter((c: any) => c.status === 'active').length || 0}
          icon="✅"
          color="bg-green-500"
        />
        <StatsCard
          title="مشترون"
          value={customers?.filter((c: any) => c.type === 'buyer').length || 0}
          icon="🏠"
          color="bg-purple-500"
        />
        <StatsCard
          title="بائعون"
          value={customers?.filter((c: any) => c.type === 'seller').length || 0}
          icon="💰"
          color="bg-orange-500"
        />
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </>
        ) : customers?.length > 0 ? (
          customers.map((customer: any) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onUpdate={refetch}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">لا توجد عملاء</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="mt-4"
              variant="outline"
            >
              إضافة عميل جديد
            </Button>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <CreateCustomerDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

function StatsCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${color} text-white rounded-full p-3 text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
```

## **Customer Card Component**

File: `frontend/src/components/customers/CustomerCard.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Star, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'buyer' | 'seller' | 'both';
  status: 'active' | 'inactive';
  rating: number;
  tags: string[];
  preferredCity?: string;
  budgetMin?: number;
  budgetMax?: number;
  _count?: {
    interactions: number;
    followups: number;
  };
}

interface Props {
  customer: Customer;
  onUpdate: () => void;
}

export function CustomerCard({ customer, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const typeLabels = {
    buyer: 'مشتري',
    seller: 'بائع',
    both: 'مشتري وبائع',
  };

  const typeColors = {
    buyer: 'bg-blue-100 text-blue-800',
    seller: 'bg-green-100 text-green-800',
    both: 'bg-purple-100 text-purple-800',
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/customers/${customer.id}`}>
              <h3 className="font-semibold text-lg hover:text-[#01411C] cursor-pointer">
                {customer.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={typeColors[customer.type]}>
                {typeLabels[customer.type]}
              </Badge>
              <Badge
                variant={customer.status === 'active' ? 'default' : 'secondary'}
              >
                {customer.status === 'active' ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/customers/${customer.id}`}>عرض التفاصيل</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/customers/${customer.id}/edit`}>تعديل</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600"
              >
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <a href={`tel:${customer.phone}`} className="hover:text-[#01411C]">
              {customer.phone}
            </a>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <a
                href={`mailto:${customer.email}`}
                className="hover:text-[#01411C]"
              >
                {customer.email}
              </a>
            </div>
          )}
          {customer.preferredCity && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{customer.preferredCity}</span>
            </div>
          )}
        </div>

        {/* Budget (for buyers) */}
        {(customer.type === 'buyer' || customer.type === 'both') &&
          customer.budgetMin &&
          customer.budgetMax && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">الميزانية</p>
              <p className="font-semibold">
                {customer.budgetMin.toLocaleString()} -{' '}
                {customer.budgetMax.toLocaleString()} ريال
              </p>
            </div>
          )}

        {/* Rating */}
        {customer.rating > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < customer.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {customer.tags.map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#01411C]">
              {customer._count?.interactions || 0}
            </p>
            <p className="text-xs text-gray-500">تفاعل</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#D4AF37]">
              {customer._count?.followups || 0}
            </p>
            <p className="text-xs text-gray-500">متابعة</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## **Create Customer Dialog**

File: `frontend/src/components/customers/CreateCustomerDialog.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const customerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  type: z.enum(['buyer', 'seller', 'both']),
  source: z.string().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  preferredCity: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCustomerDialog({ open, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      type: 'buyer',
    },
  });

  const customerType = form.watch('type');

  const onSubmit = async (data: CustomerForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('تم إضافة العميل بنجاح');
        form.reset();
        onClose();
        onSuccess();
      } else {
        throw new Error('Failed to create customer');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة العميل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة عميل جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم *</FormLabel>
                    <FormControl>
                      <Input placeholder="محمد أحمد" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف *</FormLabel>
                    <FormControl>
                      <Input placeholder="0501234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع العميل *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buyer">مشتري</SelectItem>
                        <SelectItem value="seller">بائع</SelectItem>
                        <SelectItem value="both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المصدر</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المصدر" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">الموقع الإلكتروني</SelectItem>
                        <SelectItem value="referral">إحالة</SelectItem>
                        <SelectItem value="social">وسائل التواصل</SelectItem>
                        <SelectItem value="direct">مباشر</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buyer-specific fields */}
            {(customerType === 'buyer' || customerType === 'both') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الميزانية من (ريال)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="300000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الميزانية إلى (ريال)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="500000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="preferredCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة المفضلة</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="الرياض">الرياض</SelectItem>
                          <SelectItem value="جدة">جدة</SelectItem>
                          <SelectItem value="الدمام">الدمام</SelectItem>
                          <SelectItem value="مكة المكرمة">مكة المكرمة</SelectItem>
                          <SelectItem value="المدينة المنورة">
                            المدينة المنورة
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-[#01411C] hover:bg-[#01411C]/90"
                disabled={loading}
              >
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## **Custom Hook: useCustomers**

File: `frontend/src/hooks/useCustomers.ts`

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UseCustomersOptions {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useCustomers(options: UseCustomersOptions = {}) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (options.search) params.append('search', options.search);
      if (options.type) params.append('type', options.type);
      if (options.status) params.append('status', options.status);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());

      const res = await fetch(`/api/customers?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCustomers(data.data);
      } else {
        throw new Error('Failed to fetch customers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token, options.search, options.type, options.status]);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
  };
}
```

---

# 5️⃣ **REAL-TIME INTEGRATION**

## **Socket.IO Server Setup**

File: `backend/src/server.ts`

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import crmRoutes from './routes/crm.routes';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', crmRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Join user room
  socket.on('join:user', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { io };
```

## **Real-Time Notifications Component**

File: `frontend/src/components/notifications/NotificationPanel.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications
    socket.on('notification:new', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(notification.title, {
        description: notification.message,
      });
    });

    // Listen for new interactions
    socket.on('interaction:created', (data: any) => {
      toast.success('تفاعل جديد', {
        description: `تم إضافة تفاعل مع ${data.interaction.customer.name}`,
      });
    });

    // Listen for new follow-ups
    socket.on('followup:created', (data: any) => {
      toast.info('متابعة جديدة', {
        description: data.followup.title,
      });
    });

    return () => {
      socket.off('notification:new');
      socket.off('interaction:created');
      socket.off('followup:created');
    };
  }, [socket]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" dir="rtl">
        <div className="space-y-4">
          <h3 className="font-semibold">الإشعارات</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                لا توجد إشعارات
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('ar-SA')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

---

# 6️⃣ **AI INTEGRATION**

## **AI Service**

File: `backend/src/services/ai.service.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  
  // Generate follow-up suggestions based on interaction history
  static async generateFollowupSuggestions(
    customerName: string,
    interactions: any[]
  ): Promise<string[]> {
    try {
      const prompt = `
أنت مساعد ذكي لوسيط عقاري سعودي. بناءً على تاريخ التفاعلات التالي مع العميل "${customerName}":

${interactions.map((i, index) => `
${index + 1}. ${i.type} - ${i.subject || 'بدون عنوان'}
   النتيجة: ${i.outcome || 'غير محددة'}
   الملاحظات: ${i.notes || 'لا توجد ملاحظات'}
   التاريخ: ${new Date(i.createdAt).toLocaleDateString('ar-SA')}
`).join('\n')}

قدم 3 اقتراحات للمتابعة القادمة (كل اقتراح في سطر واحد):
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت مساعد وسيط عقاري محترف في السعودية. تقدم اقتراحات عملية ومفيدة.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const suggestions =
        response.choices[0]?.message?.content
          ?.split('\n')
          .filter((s) => s.trim().length > 0) || [];

      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('AI suggestion error:', error);
      return [
        'الاتصال بالعميل للمتابعة',
        'إرسال عروض جديدة مناسبة',
        'جدولة موعد معاينة',
      ];
    }
  }

  // Generate smart reply for customer message
  static async generateSmartReply(
    customerMessage: string,
    context: any
  ): Promise<string> {
    try {
      const prompt = `
العميل أرسل الرسالة التالية:
"${customerMessage}"

السياق:
- اسم العميل: ${context.customerName}
- نوع العميل: ${context.customerType === 'buyer' ? 'مشتري' : 'بائع'}
${context.budget ? `- الميزانية: ${context.budget} ريال` : ''}

اقترح رداً احترافياً ومناسباً (100 كلمة كحد أقصى):
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت وسيط عقاري محترف في السعودية. ردودك مهذبة واحترافية.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI reply error:', error);
      return '';
    }
  }

  // Analyze customer sentiment
  static async analyzeCustomerSentiment(
    interactionNotes: string
  ): Promise<'positive' | 'neutral' | 'negative'> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of this interaction note. Respond with only one word: positive, neutral, or negative.',
          },
          {
            role: 'user',
            content: interactionNotes,
          },
        ],
        max_tokens: 10,
        temperature: 0.3,
      });

      const sentiment = response.choices[0]?.message?.content?.toLowerCase().trim();

      if (sentiment === 'positive' || sentiment === 'negative') {
        return sentiment;
      }
      return 'neutral';
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return 'neutral';
    }
  }
}
```

## **AI Suggestions Controller**

File: `backend/src/controllers/ai.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { AIService } from '../services/ai.service';

export class AIController {
  
  // Get follow-up suggestions for a customer
  static async getFollowupSuggestions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const { customerId } = req.params;

      // Get customer and recent interactions
      const customer = await prisma.customer.findFirst({
        where: { id: customerId, userId },
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      // Generate AI suggestions
      const suggestions = await AIService.generateFollowupSuggestions(
        customer.name,
        customer.interactions
      );

      res.json({
        success: true,
        data: {
          suggestions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get smart reply suggestion
  static async getSmartReply(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { message, customerId } = req.body;
      const userId = req.user!.id;

      const customer = await prisma.customer.findFirst({
        where: { id: customerId, userId },
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      const reply = await AIService.generateSmartReply(message, {
        customerName: customer.name,
        customerType: customer.type,
        budget: customer.budgetMax,
      });

      res.json({
        success: true,
        data: {
          reply,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

**(Continued in next file...)**

📄 **File:** `/FEATURE-1-PART-2.md`  
🎯 **Status:** Part 2 Complete (Frontend + AI)  
⏱️ **Next:** Testing Scripts + Setup Instructions
