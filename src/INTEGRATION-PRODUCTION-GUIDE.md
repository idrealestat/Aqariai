# 🚀 **دليل التكامل الكامل والإنتاج - Nova CRM**
## **من Development إلى Production-Ready System**

---

## 📋 **Overview**

هذا الدليل يغطي:
- ✅ Backend ↔ Frontend Integration
- ✅ Real-time Communication
- ✅ Testing Strategy (Unit, Integration, E2E)
- ✅ Performance Optimization
- ✅ Security Implementation
- ✅ CI/CD Pipeline
- ✅ Production Deployment
- ✅ Monitoring & Alerts

---

## 🔗 **Phase 5: Integration & Workflow**

### **5.1: API Client Setup**

```typescript
// frontend/src/lib/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          window.location.href = '/unauthorized';
        }

        // Handle 429 Too Many Requests
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiClient = new APIClient();
```

---

### **5.2: React Query Setup**

```typescript
// frontend/src/lib/react-query.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys factory
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
  customers: {
    all: (filters?: any) => ['customers', 'list', filters],
    detail: (id: string) => ['customers', 'detail', id],
    activities: (id: string) => ['customers', 'activities', id],
  },
  properties: {
    all: (filters?: any) => ['properties', 'list', filters],
    detail: (id: string) => ['properties', 'detail', id],
    myProperties: ['properties', 'mine'],
  },
  smartMatches: {
    all: (filters?: any) => ['smart-matches', 'list', filters],
    pending: ['smart-matches', 'pending'],
    accepted: ['smart-matches', 'accepted'],
  },
  appointments: {
    all: (filters?: any) => ['appointments', 'list', filters],
    upcoming: ['appointments', 'upcoming'],
    calendar: (month: string) => ['appointments', 'calendar', month],
  },
  tasks: {
    all: (filters?: any) => ['tasks', 'list', filters],
    myTasks: ['tasks', 'mine'],
    detail: (id: string) => ['tasks', 'detail', id],
  },
  notifications: {
    all: ['notifications', 'list'],
    unread: ['notifications', 'unread'],
    count: ['notifications', 'count'],
  },
  analytics: {
    dashboard: ['analytics', 'dashboard'],
    customers: (period: string) => ['analytics', 'customers', period],
    properties: (period: string) => ['analytics', 'properties', period],
    performance: (period: string) => ['analytics', 'performance', period],
  },
};
```

---

### **5.3: Custom Hooks for API Integration**

```typescript
// frontend/src/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

export const useCustomers = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.customers.all(filters),
    queryFn: () => apiClient.get('/customers', { params: filters }),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => apiClient.get(`/customers/${id}`),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
      toast.success('تم إضافة العميل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'حدث خطأ');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/customers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.id) });
      toast.success('تم تحديث العميل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'حدث خطأ');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
      toast.success('تم حذف العميل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'حدث خطأ');
    },
  });
};
```

---

### **5.4: Real-time Integration**

```typescript
// frontend/src/providers/RealtimeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  socket: null,
  isConnected: false,
});

export const useRealtime = () => useContext(RealtimeContext);

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Initialize socket
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to real-time server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection failed:', error);
    });

    // Business events
    newSocket.on('notification', (data) => {
      // Invalidate notifications query
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.count });

      // Show toast
      toast.info(data.title, {
        description: data.message,
        action: data.actionUrl ? {
          label: data.actionLabel || 'عرض',
          onClick: () => window.location.href = data.actionUrl,
        } : undefined,
      });
    });

    newSocket.on('smart-match', (data) => {
      // Invalidate smart matches queries
      queryClient.invalidateQueries({ queryKey: queryKeys.smartMatches.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.smartMatches.pending });

      // Show notification
      toast.success('فرصة ذكية جديدة! 🎯', {
        description: `تم العثور على ${data.count} فرص مطابقة لطلباتك`,
        action: {
          label: 'عرض',
          onClick: () => window.location.href = '/smart-matches',
        },
      });
    });

    newSocket.on('appointment-reminder', (data) => {
      // Show reminder
      toast.warning('تذكير بموعد! 📅', {
        description: `${data.title} خلال ${data.minutesBefore} دقيقة`,
        duration: 10000,
      });
    });

    newSocket.on('task-assigned', (data) => {
      // Invalidate tasks queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.myTasks });

      // Show notification
      toast.info('تم تعيين مهمة جديدة', {
        description: data.title,
      });
    });

    newSocket.on('customer-updated', (data) => {
      // Invalidate specific customer
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(data.id) });
    });

    newSocket.on('property-updated', (data) => {
      // Invalidate specific property
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(data.id) });
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, token, queryClient]);

  return (
    <RealtimeContext.Provider value={{ socket, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};
```

---

### **5.5: AI Assistant Integration**

```typescript
// frontend/src/components/ai/AIAssistant.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        message: input,
        context: {
          currentPage: window.location.pathname,
          previousMessages: messages.slice(-5),
        },
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {!isOpen && (
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <Bot className="w-6 h-6" />
          </Button>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card className="flex flex-col h-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-primary-500 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">مساعد نوڤا الذكي</h3>
                    <p className="text-xs text-gray-500">متاح دائماً للمساعدة</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-10">
                    <Bot className="w-12 h-12 mx-auto mb-2 text-primary-500" />
                    <p>مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب رسالتك..."
                    disabled={loading}
                  />
                  <Button onClick={handleSend} disabled={loading || !input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

---

## ✅ **Checkpoint 5: Integration Complete**

```bash
# Test API Integration
# 1. Check if API calls work
# 2. Verify React Query caching
# 3. Test real-time updates
# 4. Confirm AI assistant responds

✅ All systems integrated and communicating!
```

---

## 🧪 **Phase 6: Testing Strategy**

### **6.1: Unit Tests (Backend)**

```typescript
// backend/src/modules/customers/__tests__/customers.service.test.ts
import { CustomersService } from '../customers.service';
import { prisma } from '../../../config/database';

jest.mock('../../../config/database', () => ({
  prisma: {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    customerActivity: {
      create: jest.fn(),
    },
    userStats: {
      upsert: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('CustomersService', () => {
  let service: CustomersService;
  const userId = 'user-123';

  beforeEach(() => {
    service = new CustomersService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const customerData = {
        name: 'Test Customer',
        phone: '0501234567',
        email: 'test@example.com',
        category: 'مشتري',
      };

      const mockCustomer = { id: 'customer-123', ...customerData, userId };

      (prisma.customer.create as jest.Mock).mockResolvedValue(mockCustomer);
      (prisma.customerActivity.create as jest.Mock).mockResolvedValue({});
      (prisma.userStats.upsert as jest.Mock).mockResolvedValue({});

      const result = await service.create(userId, customerData);

      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...customerData,
          userId,
        }),
      });
      expect(prisma.customerActivity.create).toHaveBeenCalled();
      expect(prisma.userStats.upsert).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        name: 'Te', // Too short
        phone: '123', // Invalid format
      };

      await expect(service.create(userId, invalidData as any)).rejects.toThrow();
    });
  });

  describe('getAll', () => {
    it('should return paginated customers', async () => {
      const mockCustomers = [
        { id: '1', name: 'Customer 1' },
        { id: '2', name: 'Customer 2' },
      ];

      (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
      (prisma.customer.count as jest.Mock).mockResolvedValue(2);

      const result = await service.getAll(userId, { page: 1, limit: 20 });

      expect(result.customers).toEqual(mockCustomers);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
    });

    it('should filter by search term', async () => {
      const filters = { search: 'Ahmed' };

      (prisma.customer.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.customer.count as jest.Mock).mockResolvedValue(0);

      await service.getAll(userId, filters);

      expect(prisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });
  });
});
```

---

### **6.2: Integration Tests (API)**

```typescript
// backend/src/__tests__/integration/customers.test.ts
import request from 'supertest';
import { app } from '../../server';
import { prisma } from '../../config/database';
import { generateToken } from '../../utils/jwt';

describe('Customers API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '0501234567',
        password: 'hashedpassword',
        role: 'BROKER',
      },
    });

    userId = user.id;
    authToken = generateToken({
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      subscription: { plan: 'trial', status: 'TRIAL' },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.customer.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const customerData = {
        name: 'Test Customer',
        phone: '0501234567',
        email: 'customer@example.com',
        category: 'مشتري',
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body.customer).toMatchObject(customerData);
      expect(response.body.customer.id).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .post('/api/customers')
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should return 400 for invalid data', async () => {
      await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Te' }) // Too short
        .expect(400);
    });
  });

  describe('GET /api/customers', () => {
    it('should return paginated customers', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('customers');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('pages');
      expect(Array.isArray(response.body.customers)).toBe(true);
    });

    it('should filter by search term', async () => {
      const response = await request(app)
        .get('/api/customers?search=Ahmed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.customers).toBeDefined();
    });
  });
});
```

---

### **6.3: E2E Tests (Frontend)**

```typescript
// frontend/tests/e2e/customers.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Customers Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="text"]', 'test@nova.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should create a new customer', async ({ page }) => {
    // Navigate to customers
    await page.goto('/crm/customers');
    
    // Click add button
    await page.click('button:has-text("إضافة عميل")');
    
    // Fill form
    await page.fill('input[name="name"]', 'Ahmed Test');
    await page.fill('input[name="phone"]', '0501234567');
    await page.fill('input[name="email"]', 'ahmed@test.com');
    await page.selectOption('select[name="category"]', 'مشتري');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('text=تم إضافة العميل بنجاح')).toBeVisible();
    
    // Verify customer appears in list
    await expect(page.locator('text=Ahmed Test')).toBeVisible();
  });

  test('should search for customers', async ({ page }) => {
    await page.goto('/crm/customers');
    
    // Enter search term
    await page.fill('input[placeholder*="بحث"]', 'Ahmed');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const customerCards = page.locator('[data-testid="customer-card"]');
    const count = await customerCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should edit a customer', async ({ page }) => {
    await page.goto('/crm/customers');
    
    // Click first customer
    await page.click('[data-testid="customer-card"]:first-child');
    
    // Click edit button
    await page.click('button:has-text("تعديل")');
    
    // Update name
    await page.fill('input[name="name"]', 'Ahmed Updated');
    
    // Save
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=تم تحديث العميل بنجاح')).toBeVisible();
    await expect(page.locator('text=Ahmed Updated')).toBeVisible();
  });

  test('should delete a customer', async ({ page }) => {
    await page.goto('/crm/customers');
    
    // Click delete on first customer
    await page.click('[data-testid="customer-card"]:first-child button:has-text("حذف")');
    
    // Confirm deletion
    await page.click('button:has-text("تأكيد الحذف")');
    
    // Verify success
    await expect(page.locator('text=تم حذف العميل بنجاح')).toBeVisible();
  });
});
```

---

### **6.4: Performance Tests**

```typescript
// backend/src/__tests__/performance/api-load.test.ts
import autocannon from 'autocannon';

describe('API Performance', () => {
  it('should handle 100 concurrent requests', async () => {
    const result = await autocannon({
      url: 'http://localhost:4000/health',
      connections: 100,
      duration: 10,
      pipelining: 1,
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.latency.mean).toBeLessThan(100); // Less than 100ms
    expect(result.requests.mean).toBeGreaterThan(1000); // More than 1000 req/s
  });

  it('should handle authenticated requests', async () => {
    const result = await autocannon({
      url: 'http://localhost:4000/api/customers',
      connections: 50,
      duration: 10,
      headers: {
        Authorization: 'Bearer <test-token>',
      },
    });

    expect(result.errors).toBe(0);
    expect(result.non2xx).toBe(0);
  });
});
```

---

## ✅ **Checkpoint 6: Testing Complete**

```bash
# Run all tests
cd backend
npm test                    # Unit + Integration tests
npm run test:coverage       # Coverage report

cd frontend
npm test                    # Component tests
npm run test:e2e           # Playwright E2E tests

# Expected Results:
✅ Unit tests: >80% coverage
✅ Integration tests: All API endpoints working
✅ E2E tests: All user flows working
✅ Performance: <100ms latency, >1000 req/s
```

---

## 🔒 **Phase 7: Security Implementation**

### **7.1: Rate Limiting**

```typescript
// backend/src/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

// General API rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints (stricter)
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// File upload (even stricter)
export const uploadLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:upload:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 uploads per hour
  message: 'Upload limit exceeded, please try again later.',
});
```

---

### **7.2: Input Validation & Sanitization**

```typescript
// backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize input
      req.body = sanitizeObject(req.body);
      
      // Validate with Zod
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
  };
};

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  return obj;
}
```

---

### **7.3: CSRF Protection**

```typescript
// backend/src/middleware/csrf.ts
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// Add to server.ts
app.use(cookieParser());
app.use(csrfProtection);

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

---

### **7.4: Content Security Policy**

```typescript
// backend/src/middleware/security.ts
import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL!],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});
```

---

## ✅ **Checkpoint 7: Security Hardened**

```bash
# Security Checklist:
✅ Rate limiting on all endpoints
✅ Input validation & sanitization
✅ CSRF protection
✅ CSP headers
✅ XSS protection
✅ SQL injection prevention (Prisma parameterized queries)
✅ Authentication & Authorization
✅ Secure session management
✅ HTTPS enforced in production
```

---

## 🚀 **Phase 8: Production Deployment**

### **8.1: Environment Variables**

```bash
# backend/.env.production
NODE_ENV=production
PORT=4000

# Database
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/nova_crm

# Redis
REDIS_URL=redis://elasticache-endpoint:6379

# JWT
JWT_SECRET=<strong-random-secret-256-bits>
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://nova-crm.com

# AWS
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=nova-crm-production

# Sentry
SENTRY_DSN=<sentry-dsn>

# Twilio
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_PHONE_NUMBER=<number>
```

---

### **8.2: Monitoring with Sentry**

```typescript
// backend/src/config/sentry.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Add to server.ts
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler (add after routes)
app.use(Sentry.Handlers.errorHandler());
```

---

### **8.3: Health Checks**

```typescript
// backend/src/routes/health.ts
import { Router } from 'express';
import { prisma } from '../config/database';
import { createClient } from 'redis';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'healthy';
  } catch (error) {
    health.checks.database = 'unhealthy';
    health.status = 'degraded';
  }

  // Check Redis
  try {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    await redis.ping();
    await redis.disconnect();
    health.checks.redis = 'healthy';
  } catch (error) {
    health.checks.redis = 'unhealthy';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

router.get('/health/ready', async (req, res) => {
  // Check if all systems are ready
  res.json({ ready: true });
});

router.get('/health/live', (req, res) => {
  // Liveness probe (simple check if server is running)
  res.json({ alive: true });
});

export default router;
```

---

## ✅ **Final Checkpoint: Production Ready**

```bash
# Pre-deployment Checklist:

🔧 Environment:
✅ All environment variables set
✅ Database migrated
✅ Redis configured
✅ SSL certificates installed

🔒 Security:
✅ Rate limiting enabled
✅ CSRF protection active
✅ CSP headers configured
✅ All secrets rotated

🧪 Testing:
✅ All tests passing
✅ Performance benchmarks met
✅ Security audit completed
✅ Penetration testing done

📊 Monitoring:
✅ Sentry configured
✅ CloudWatch alarms set
✅ Health checks responding
✅ Logging enabled

🚀 Deployment:
✅ CI/CD pipeline working
✅ Staging environment tested
✅ Rollback plan ready
✅ Documentation updated

🎉 READY FOR PRODUCTION!
```

---

📄 **File:** `/INTEGRATION-PRODUCTION-GUIDE.md`  
🎯 **Coverage:** Integration → Production  
⏱️ **Timeline:** Weeks 8-16  
✅ **Status:** Production-Ready Checklist
