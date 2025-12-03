# 🚀 **PERFORMANCE OPTIMIZATION - PART 2**
## **Frontend + Real-Time + Caching + Load Testing**

---

# 3️⃣ **FRONTEND PERFORMANCE**

## **Next.js Configuration Optimization**

File: `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Optimize images
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Production optimizations
  swcMinify: true,
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

module.exports = nextConfig;
```

## **React Component Optimization**

File: `frontend/src/components/optimized/CustomerList.tsx`

```typescript
import { memo, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Optimized Customer List Component
 * Uses virtualization for large lists
 */

interface Customer {
  id: string;
  name: string;
  phone: string;
  status: string;
}

interface CustomerListProps {
  customers: Customer[];
  onCustomerClick: (id: string) => void;
}

export const CustomerList = memo(({ customers, onCustomerClick }: CustomerListProps) => {
  // Virtualization for large lists
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: customers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5, // Render 5 extra items
  });

  // Memoize click handler
  const handleClick = useCallback(
    (id: string) => {
      onCustomerClick(id);
    },
    [onCustomerClick]
  );

  // Memoize items
  const items = useMemo(() => {
    return virtualizer.getVirtualItems();
  }, [virtualizer]);

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualItem) => {
          const customer = customers[virtualItem.index];
          
          return (
            <div
              key={customer.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              onClick={() => handleClick(customer.id)}
            >
              <CustomerRow customer={customer} />
            </div>
          );
        })}
      </div>
    </div>
  );
});

CustomerList.displayName = 'CustomerList';

// Separate row component for better re-render control
const CustomerRow = memo(({ customer }: { customer: Customer }) => {
  return (
    <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{customer.name}</h3>
          <p className="text-sm text-gray-600">{customer.phone}</p>
        </div>
        <span className="text-sm text-gray-500">{customer.status}</span>
      </div>
    </div>
  );
});

CustomerRow.displayName = 'CustomerRow';
```

## **Lazy Loading Implementation**

File: `frontend/src/app/(dashboard)/layout.tsx`

```typescript
'use client';

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ReportsChart = dynamic(() => import('@/components/charts/ReportsChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Don't render on server
});

const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics/AnalyticsDashboard'),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false,
  }
);

// Skeleton components
function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Immediate content */}
      <header>Dashboard Header</header>

      {/* Lazy loaded content */}
      <Suspense fallback={<DashboardSkeleton />}>
        <AnalyticsDashboard />
      </Suspense>

      <main>{children}</main>
    </div>
  );
}
```

## **Image Optimization**

File: `frontend/src/components/optimized/OptimizedImage.tsx`

```typescript
import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image Component
 * Lazy loading + blur placeholder
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,..." // Base64 blur placeholder
        onLoadingComplete={() => setIsLoading(false)}
        className={`
          duration-300 ease-in-out
          ${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'}
        `}
      />
    </div>
  );
}
```

---

# 4️⃣ **REAL-TIME OPTIMIZATION**

## **Optimized Socket.IO Client**

File: `frontend/src/lib/socket-optimized.ts`

```typescript
import { io, Socket } from 'socket.io-client';

/**
 * Optimized Socket.IO Client
 * Connection pooling + event batching
 */

class SocketManager {
  private socket: Socket | null = null;
  private eventQueue: Map<string, any[]> = new Map();
  private batchInterval: NodeJS.Timeout | null = null;

  connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      transports: ['websocket'], // Use WebSocket only (faster)
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      
      // Compression
      perMessageDeflate: {
        threshold: 1024, // Only compress messages > 1KB
      },
    });

    this.setupListeners();
    this.startEventBatching();

    return this.socket;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Batch events to reduce overhead
  private startEventBatching() {
    this.batchInterval = setInterval(() => {
      this.flushEventQueue();
    }, 100); // Flush every 100ms
  }

  private flushEventQueue() {
    if (this.eventQueue.size === 0) return;

    // Process all queued events
    this.eventQueue.forEach((events, eventName) => {
      if (events.length === 0) return;

      // Batch emit
      this.socket?.emit(`batch:${eventName}`, events);
      
      // Clear queue
      this.eventQueue.set(eventName, []);
    });
  }

  // Queue event instead of emitting immediately
  queueEvent(eventName: string, data: any) {
    if (!this.eventQueue.has(eventName)) {
      this.eventQueue.set(eventName, []);
    }
    this.eventQueue.get(eventName)!.push(data);
  }

  // Immediate emit (bypass queue)
  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.socket?.on(eventName, callback);
  }

  off(eventName: string, callback?: (...args: any[]) => void) {
    this.socket?.off(eventName, callback);
  }

  disconnect() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }
    this.socket?.disconnect();
  }
}

export const socketManager = new SocketManager();
```

## **Optimized Queue Processing**

File: `backend/src/queues/optimized-processor.ts`

```typescript
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

/**
 * Optimized Queue Processor
 * Concurrency + priority + retry logic
 */

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Email queue with optimized settings
export const emailQueue = new Queue('email', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep for 24 hours
      count: 1000, // Keep last 1000 jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep for 7 days
    },
  },
});

// Worker with concurrency
const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    console.log(`📧 Processing email job ${job.id}`);
    
    const { to, subject, body } = job.data;
    
    // Simulate email sending
    await sendEmail(to, subject, body);
    
    return { sent: true, timestamp: new Date() };
  },
  {
    connection: redis,
    concurrency: 10, // Process 10 jobs simultaneously
    limiter: {
      max: 100, // Max 100 jobs
      duration: 60000, // Per minute
    },
  }
);

// Event handlers
emailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

// Prioritize jobs
export async function addEmailJob(
  data: any,
  priority: 'high' | 'normal' | 'low' = 'normal'
) {
  const priorityMap = { high: 1, normal: 5, low: 10 };

  return await emailQueue.add('send-email', data, {
    priority: priorityMap[priority],
  });
}

async function sendEmail(to: string, subject: string, body: string) {
  // Email sending implementation
}
```

---

# 5️⃣ **CACHING STRATEGY**

## **Redis Caching Service**

File: `backend/src/services/cache.service.ts`

```typescript
import Redis from 'ioredis';

/**
 * Centralized Caching Service
 * Redis-based caching for performance
 */

const redis = new Redis(process.env.REDIS_URL!);

export class CacheService {
  // Default TTL: 5 minutes
  private static readonly DEFAULT_TTL = 300;

  // ============================================
  // GET FROM CACHE
  // ============================================
  
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // ============================================
  // SET TO CACHE
  // ============================================
  
  static async set(
    key: string,
    value: any,
    ttl: number = this.DEFAULT_TTL
  ): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // ============================================
  // DELETE FROM CACHE
  // ============================================
  
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // ============================================
  // DELETE PATTERN
  // ============================================
  
  static async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  // ============================================
  // GET OR SET (Cache-aside pattern)
  // ============================================
  
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Fetch from source
    const data = await fetchFn();

    // Store in cache
    await this.set(key, data, ttl);

    return data;
  }

  // ============================================
  // INVALIDATE USER CACHE
  // ============================================
  
  static async invalidateUserCache(userId: string): Promise<void> {
    await this.deletePattern(`user:${userId}:*`);
  }
}
```

## **Cached API Endpoints**

File: `backend/src/controllers/cached-customer.controller.ts`

```typescript
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma-optimized';
import { CacheService } from '../services/cache.service';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Customer Controller with Caching
 */

export class CachedCustomerController {
  // ============================================
  // GET CUSTOMERS (CACHED)
  // ============================================
  
  static async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 20 } = req.query;

      const cacheKey = `user:${userId}:customers:${page}:${limit}`;

      // Try cache first
      const data = await CacheService.getOrSet(
        cacheKey,
        async () => {
          // Fetch from database
          const [customers, total] = await Promise.all([
            prisma.customer.findMany({
              where: { userId },
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                status: true,
                createdAt: true,
              },
              orderBy: { createdAt: 'desc' },
              skip: (Number(page) - 1) * Number(limit),
              take: Number(limit),
            }),
            prisma.customer.count({ where: { userId } }),
          ]);

          return {
            data: customers,
            pagination: {
              page: Number(page),
              limit: Number(limit),
              total,
              pages: Math.ceil(total / Number(limit)),
            },
          };
        },
        300 // Cache for 5 minutes
      );

      res.json({ success: true, ...data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب البيانات',
      });
    }
  }

  // ============================================
  // CREATE CUSTOMER (INVALIDATE CACHE)
  // ============================================
  
  static async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const customer = await prisma.customer.create({
        data: {
          ...req.body,
          userId,
        },
      });

      // Invalidate all customer list caches for this user
      await CacheService.deletePattern(`user:${userId}:customers:*`);

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'خطأ في إنشاء العميل',
      });
    }
  }
}
```

---

**(يتبع في Part 3...)**

📄 **File:** `/PERFORMANCE-OPTIMIZATION-PART-2.md`  
🎯 **Next:** Load Testing + Production Hardening + Monitoring
