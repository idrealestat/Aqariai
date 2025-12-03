# 🚀 **FULL DETAILED SYSTEM UPDATE - PART 5**
## **Performance Optimization + Caching + Real-Time Services**

---

# **ADVANCED CACHING SERVICE**

File: `backend/src/services/enhanced-cache.service.ts`

```typescript
import Redis from 'ioredis';
import { promisify } from 'util';

/**
 * Enhanced Caching Service
 * Multi-level caching with automatic invalidation
 */

const redis = new Redis(process.env.REDIS_URL);

export class EnhancedCacheService {
  private static defaultTTL = 300; // 5 minutes

  // ============================================
  // GET FROM CACHE
  // ============================================

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);

      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as T;
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
    ttl: number = this.defaultTTL
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
  // CACHE-ASIDE PATTERN
  // ============================================

  static async cacheAside<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

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
    await Promise.all([
      this.deletePattern(`user:${userId}:*`),
      this.deletePattern(`customers:${userId}:*`),
      this.deletePattern(`sales:${userId}:*`),
      this.deletePattern(`properties:${userId}:*`),
      this.deletePattern(`stats:${userId}:*`),
    ]);
  }

  // ============================================
  // INVALIDATE RESOURCE CACHE
  // ============================================

  static async invalidateResourceCache(
    resource: string,
    resourceId: string
  ): Promise<void> {
    await this.deletePattern(`${resource}:${resourceId}:*`);
  }

  // ============================================
  // BATCH GET
  // ============================================

  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await redis.mget(...keys);

      return values.map((v) => (v ? JSON.parse(v) : null));
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  // ============================================
  // BATCH SET
  // ============================================

  static async mset(
    items: Array<{ key: string; value: any; ttl?: number }>
  ): Promise<void> {
    try {
      const pipeline = redis.pipeline();

      items.forEach((item) => {
        const ttl = item.ttl || this.defaultTTL;
        pipeline.setex(item.key, ttl, JSON.stringify(item.value));
      });

      await pipeline.exec();
    } catch (error) {
      console.error('Cache mset error:', error);
    }
  }

  // ============================================
  // INCREMENT
  // ============================================

  static async increment(key: string, ttl?: number): Promise<number> {
    try {
      const value = await redis.incr(key);

      if (ttl) {
        await redis.expire(key, ttl);
      }

      return value;
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  // ============================================
  // CACHE STATISTICS
  // ============================================

  static async getStats(): Promise<any> {
    try {
      const info = await redis.info('stats');
      const memory = await redis.info('memory');

      return {
        info,
        memory,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }

  // ============================================
  // WARM UP CACHE
  // ============================================

  static async warmUpUserCache(userId: string): Promise<void> {
    // Pre-load common queries into cache
    try {
      const { prisma } = await import('../lib/prisma');

      // Get customer count
      const customerCount = await prisma.customer.count({
        where: { userId, deletedAt: null },
      });

      await this.set(`stats:${userId}:customers:count`, customerCount, 600);

      // Get recent customers
      const recentCustomers = await prisma.customer.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      await this.set(
        `customers:${userId}:recent`,
        recentCustomers,
        300
      );

      // Get pending followups
      const pendingFollowups = await prisma.customerFollowup.count({
        where: {
          userId,
          status: 'pending',
          dueDate: { lte: new Date() },
        },
      });

      await this.set(
        `stats:${userId}:followups:pending`,
        pendingFollowups,
        300
      );

      console.log(`✅ Cache warmed up for user ${userId}`);
    } catch (error) {
      console.error('Cache warm-up error:', error);
    }
  }
}
```

---

# **CACHING MIDDLEWARE**

File: `backend/src/middleware/cache.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { EnhancedCacheService } from '../services/enhanced-cache.service';
import crypto from 'crypto';

/**
 * Caching Middleware
 * Automatically caches GET requests
 */

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching if no user
    if (!req.user) {
      return next();
    }

    // Generate cache key
    const cacheKey = generateCacheKey(req);

    try {
      // Try to get from cache
      const cached = await EnhancedCacheService.get(cacheKey);

      if (cached) {
        return res.json(cached);
      }

      // Store original send function
      const originalSend = res.json;

      // Override send to cache response
      res.json = function (data: any): Response {
        // Cache the response
        EnhancedCacheService.set(cacheKey, data, ttl);

        // Call original send
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Generate cache key from request
function generateCacheKey(req: AuthRequest): string {
  const userId = req.user?.id || 'anonymous';
  const path = req.path;
  const query = JSON.stringify(req.query);

  const hash = crypto
    .createHash('md5')
    .update(`${path}:${query}`)
    .digest('hex');

  return `cache:${userId}:${hash}`;
}

// Invalidate cache on write operations
export const invalidateCacheMiddleware = (resourceType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Store original send
    const originalSend = res.json;

    // Override to invalidate cache after response
    res.json = function (data: any): Response {
      // Invalidate cache
      setImmediate(async () => {
        if (req.user) {
          await EnhancedCacheService.invalidateUserCache(req.user.id);

          if (req.params.id) {
            await EnhancedCacheService.invalidateResourceCache(
              resourceType,
              req.params.id
            );
          }
        }
      });

      return originalSend.call(this, data);
    };

    next();
  };
};
```

---

# **REAL-TIME NOTIFICATION SERVICE**

File: `backend/src/services/realtime-notification.service.ts`

```typescript
import { Server as SocketServer } from 'socket.io';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';
import { secretsManager } from '../config/secrets.config';

/**
 * Real-Time Notification Service
 * Manages Socket.IO connections and real-time updates
 */

let io: SocketServer;

export class RealtimeNotificationService {
  // ============================================
  // INITIALIZE SOCKET.IO
  // ============================================

  static initialize(socketServer: SocketServer): void {
    io = socketServer;

    // Authentication middleware
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error('Authentication required'));
        }

        // Verify JWT
        const decoded = jwt.verify(
          token,
          secretsManager.getSecret('JWT_SECRET')
        ) as any;

        socket.data.userId = decoded.userId;
        socket.data.role = decoded.role;

        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    // Connection handler
    io.on('connection', (socket) => {
      const userId = socket.data.userId;

      console.log(`✅ User connected: ${userId}`);

      // Join user room
      socket.join(`user:${userId}`);

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${userId}`);
      });

      // Handle mark notification as read
      socket.on('notification:read', async (notificationId: string) => {
        await this.markAsRead(notificationId);
      });

      // Handle typing indicator
      socket.on('typing:start', (data: any) => {
        socket.to(`customer:${data.customerId}`).emit('typing', {
          userId,
          typing: true,
        });
      });

      socket.on('typing:stop', (data: any) => {
        socket.to(`customer:${data.customerId}`).emit('typing', {
          userId,
          typing: false,
        });
      });
    });

    console.log('✅ Socket.IO initialized');
  }

  // ============================================
  // SEND NOTIFICATION TO USER
  // ============================================

  static sendToUser(userId: string, event: string, data: any): void {
    if (!io) {
      console.error('Socket.IO not initialized');
      return;
    }

    io.to(`user:${userId}`).emit(event, data);
  }

  // ============================================
  // SEND TO MULTIPLE USERS
  // ============================================

  static sendToUsers(userIds: string[], event: string, data: any): void {
    if (!io) {
      console.error('Socket.IO not initialized');
      return;
    }

    userIds.forEach((userId) => {
      io.to(`user:${userId}`).emit(event, data);
    });
  }

  // ============================================
  // BROADCAST TO ALL
  // ============================================

  static broadcast(event: string, data: any): void {
    if (!io) {
      console.error('Socket.IO not initialized');
      return;
    }

    io.emit(event, data);
  }

  // ============================================
  // SEND NOTIFICATION
  // ============================================

  static async sendNotification(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    priority?: string;
  }): Promise<void> {
    // Create notification in database
    const created = await prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type as any,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: (notification.priority as any) || 'medium',
        isRead: false,
      },
    });

    // Send via Socket.IO
    this.sendToUser(notification.userId, 'notification', created);

    // Also send push notification if configured
    // await this.sendPushNotification(notification);
  }

  // ============================================
  // MARK AS READ
  // ============================================

  static async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // ============================================
  // SEND REAL-TIME UPDATE
  // ============================================

  static sendUpdate(
    userId: string,
    resource: string,
    action: string,
    data: any
  ): void {
    this.sendToUser(userId, 'update', {
      resource,
      action,
      data,
      timestamp: new Date(),
    });
  }

  // ============================================
  // SEND ANALYTICS UPDATE
  // ============================================

  static sendAnalyticsUpdate(userId: string, metrics: any): void {
    this.sendToUser(userId, 'analytics:update', metrics);
  }

  // ============================================
  // SEND SYSTEM ALERT
  // ============================================

  static sendSystemAlert(userId: string, alert: any): void {
    this.sendToUser(userId, 'system:alert', alert);
  }

  // ============================================
  // GET ONLINE USERS COUNT
  // ============================================

  static async getOnlineUsersCount(): Promise<number> {
    if (!io) return 0;

    const sockets = await io.fetchSockets();
    return sockets.length;
  }

  // ============================================
  // GET USER CONNECTION STATUS
  // ============================================

  static async isUserOnline(userId: string): Promise<boolean> {
    if (!io) return false;

    const sockets = await io.in(`user:${userId}`).fetchSockets();
    return sockets.length > 0;
  }
}
```

---

# **DATABASE QUERY OPTIMIZER**

File: `backend/src/services/query-optimizer.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Query Optimizer Service
 * Optimizes database queries for better performance
 */

export class QueryOptimizerService {
  // ============================================
  // OPTIMIZE CUSTOMER QUERY
  // ============================================

  static optimizeCustomerQuery(filters: any) {
    const select: Prisma.CustomerSelect = {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      priority: true,
      source: true,
      tags: true,
      budget: true,
      lastContactDate: true,
      nextFollowupDate: true,
      createdAt: true,
      updatedAt: true,
      // Only include counts, not full relations
      _count: {
        select: {
          interactions: true,
          followups: {
            where: { status: 'pending' },
          },
          sales: true,
        },
      },
    };

    return select;
  }

  // ============================================
  // PAGINATE WITH CURSOR
  // ============================================

  static async paginateWithCursor<T>(
    model: any,
    where: any,
    orderBy: any,
    cursor: string | undefined,
    limit: number = 20
  ): Promise<{ items: T[]; nextCursor: string | null }> {
    const items = await model.findMany({
      where,
      orderBy,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: limit + 1, // Get one extra to know if there's more
    });

    let nextCursor: string | null = null;

    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem.id;
    }

    return {
      items,
      nextCursor,
    };
  }

  // ============================================
  // BATCH LOAD RELATIONS
  // ============================================

  static async batchLoadRelations<T>(
    items: any[],
    relationKey: string,
    relationModel: any,
    foreignKey: string
  ): Promise<Map<string, T[]>> {
    const ids = items.map((item) => item.id);

    const relations = await relationModel.findMany({
      where: {
        [foreignKey]: { in: ids },
      },
    });

    // Group by foreign key
    const grouped = new Map<string, T[]>();

    relations.forEach((rel: any) => {
      const key = rel[foreignKey];
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(rel);
    });

    return grouped;
  }

  // ============================================
  // OPTIMIZE FULL-TEXT SEARCH
  // ============================================

  static buildFullTextSearchQuery(
    searchTerm: string,
    fields: string[]
  ): any {
    const sanitized = searchTerm.replace(/[^\w\s]/g, '');
    const words = sanitized.split(/\s+/).filter((w) => w.length > 0);

    if (words.length === 0) {
      return {};
    }

    return {
      OR: fields.flatMap((field) =>
        words.map((word) => ({
          [field]: {
            contains: word,
            mode: 'insensitive',
          },
        }))
      ),
    };
  }

  // ============================================
  // GET QUERY EXECUTION PLAN
  // ============================================

  static async getQueryPlan(sql: string): Promise<any> {
    try {
      const plan = await prisma.$queryRaw`EXPLAIN ANALYZE ${Prisma.raw(sql)}`;
      return plan;
    } catch (error) {
      console.error('Query plan error:', error);
      return null;
    }
  }

  // ============================================
  // DETECT SLOW QUERIES
  // ============================================

  static async getSlowQueries(minDuration: number = 1000): Promise<any[]> {
    try {
      const slowQueries = await prisma.$queryRaw`
        SELECT 
          query,
          mean_exec_time,
          calls,
          total_exec_time
        FROM pg_stat_statements
        WHERE mean_exec_time > ${minDuration}
        ORDER BY mean_exec_time DESC
        LIMIT 20
      `;

      return slowQueries as any[];
    } catch (error) {
      console.error('Slow queries error:', error);
      return [];
    }
  }

  // ============================================
  // ANALYZE TABLE
  // ============================================

  static async analyzeTable(tableName: string): Promise<void> {
    try {
      await prisma.$executeRaw`ANALYZE ${Prisma.raw(tableName)}`;
      console.log(`✅ Table ${tableName} analyzed`);
    } catch (error) {
      console.error(`Table analyze error:`, error);
    }
  }

  // ============================================
  // VACUUM TABLE
  // ============================================

  static async vacuumTable(tableName: string): Promise<void> {
    try {
      await prisma.$executeRaw`VACUUM ${Prisma.raw(tableName)}`;
      console.log(`✅ Table ${tableName} vacuumed`);
    } catch (error) {
      console.error(`Table vacuum error:`, error);
    }
  }
}
```

---

**(يتبع في PART 6...)**

📄 **تم إنشاء:** Performance Optimization + Caching + Real-Time Services  
🎯 **التالي:** Complete Testing Suite + Deployment Scripts + Final Setup
