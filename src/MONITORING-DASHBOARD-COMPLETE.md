# 📊 **PERFORMANCE DASHBOARD & REAL-TIME MONITORING**
## **Complete Monitoring System for Nova CRM**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    📊 NOVA CRM - MONITORING & DASHBOARD SYSTEM 📊            ║
║                                                               ║
║  ✅ Real-Time Metrics Collection                             ║
║  ✅ Performance Dashboard                                     ║
║  ✅ Alert System                                              ║
║  ✅ Historical Analytics                                      ║
║  ✅ Error Tracking                                            ║
║  ✅ Resource Monitoring                                       ║
║  ✅ User Activity Tracking                                    ║
║                                                               ║
║        Complete Observability Ready! 🔍                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 📋 **TABLE OF CONTENTS**

1. [Metrics Collection System](#1-metrics-collection-system)
2. [Monitoring Backend](#2-monitoring-backend)
3. [Dashboard Frontend](#3-dashboard-frontend)
4. [Alert System](#4-alert-system)
5. [Historical Analytics](#5-historical-analytics)
6. [Deployment](#6-deployment)

---

# 1️⃣ **METRICS COLLECTION SYSTEM**

## **Metrics Collector Service**

File: `backend/src/services/metrics-collector.service.ts`

```typescript
import { EventEmitter } from 'events';
import os from 'os';
import { prisma } from '../lib/prisma';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

/**
 * Metrics Collector Service
 * Collects system, API, database, and application metrics
 */

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  uptime: number;
}

export interface APIMetrics {
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  error?: string;
}

export interface DatabaseMetrics {
  timestamp: Date;
  query: string;
  duration: number;
  model?: string;
  operation?: string;
}

export interface QueueMetrics {
  timestamp: Date;
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface SocketMetrics {
  timestamp: Date;
  event: string;
  connections: number;
  duration?: number;
}

class MetricsCollector extends EventEmitter {
  private apiMetrics: APIMetrics[] = [];
  private dbMetrics: DatabaseMetrics[] = [];
  private queueMetrics: Map<string, QueueMetrics> = new Map();
  private socketMetrics: SocketMetrics[] = [];

  private collectionInterval: NodeJS.Timeout | null = null;

  // ============================================
  // START COLLECTION
  // ============================================

  start(intervalMs: number = 2000): void {
    console.log('📊 Starting metrics collection...');

    this.collectionInterval = setInterval(() => {
      this.collectAndPublish();
    }, intervalMs);
  }

  stop(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
  }

  // ============================================
  // COLLECT SYSTEM METRICS
  // ============================================

  private collectSystemMetrics(): SystemMetrics {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsage = 100 - ~~((100 * totalIdle) / totalTick);

    return {
      timestamp: new Date(),
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: (usedMem / totalMem) * 100,
      },
      uptime: process.uptime(),
    };
  }

  // ============================================
  // COLLECT API METRICS
  // ============================================

  trackAPIRequest(metrics: APIMetrics): void {
    this.apiMetrics.push(metrics);

    // Keep only last 1000 entries
    if (this.apiMetrics.length > 1000) {
      this.apiMetrics.shift();
    }

    // Store in Redis for persistence
    redis.lpush(
      'metrics:api',
      JSON.stringify(metrics)
    );
    redis.ltrim('metrics:api', 0, 9999); // Keep last 10000

    // Emit for real-time updates
    this.emit('api-metric', metrics);
  }

  getAPIMetrics(limit: number = 100): APIMetrics[] {
    return this.apiMetrics.slice(-limit);
  }

  getAPIStats(): {
    avgResponseTime: number;
    totalRequests: number;
    errorRate: number;
    requestsPerMinute: number;
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    const recentMetrics = this.apiMetrics.filter(
      (m) => m.timestamp.getTime() > oneMinuteAgo
    );

    const totalRequests = recentMetrics.length;
    const errors = recentMetrics.filter(
      (m) => m.statusCode >= 400
    ).length;

    const avgResponseTime =
      totalRequests > 0
        ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) /
          totalRequests
        : 0;

    return {
      avgResponseTime: Math.round(avgResponseTime),
      totalRequests,
      errorRate: totalRequests > 0 ? (errors / totalRequests) * 100 : 0,
      requestsPerMinute: totalRequests,
    };
  }

  // ============================================
  // COLLECT DATABASE METRICS
  // ============================================

  trackDatabaseQuery(metrics: DatabaseMetrics): void {
    this.dbMetrics.push(metrics);

    if (this.dbMetrics.length > 1000) {
      this.dbMetrics.shift();
    }

    redis.lpush('metrics:db', JSON.stringify(metrics));
    redis.ltrim('metrics:db', 0, 9999);

    this.emit('db-metric', metrics);

    // Alert on slow queries
    if (metrics.duration > 500) {
      this.emit('alert', {
        type: 'slow-query',
        severity: 'warning',
        message: `Slow database query detected: ${metrics.duration}ms`,
        data: metrics,
      });
    }
  }

  getDatabaseStats(): {
    avgQueryTime: number;
    totalQueries: number;
    slowQueries: number;
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    const recentMetrics = this.dbMetrics.filter(
      (m) => m.timestamp.getTime() > oneMinuteAgo
    );

    const totalQueries = recentMetrics.length;
    const slowQueries = recentMetrics.filter((m) => m.duration > 500).length;

    const avgQueryTime =
      totalQueries > 0
        ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalQueries
        : 0;

    return {
      avgQueryTime: Math.round(avgQueryTime),
      totalQueries,
      slowQueries,
    };
  }

  // ============================================
  // COLLECT QUEUE METRICS
  // ============================================

  updateQueueMetrics(queueName: string, metrics: Omit<QueueMetrics, 'timestamp' | 'queueName'>): void {
    const queueMetric: QueueMetrics = {
      timestamp: new Date(),
      queueName,
      ...metrics,
    };

    this.queueMetrics.set(queueName, queueMetric);
    this.emit('queue-metric', queueMetric);

    // Alert on high queue length
    if (metrics.waiting > 100) {
      this.emit('alert', {
        type: 'high-queue',
        severity: 'warning',
        message: `High queue length for ${queueName}: ${metrics.waiting} jobs waiting`,
        data: queueMetric,
      });
    }
  }

  getQueueMetrics(): QueueMetrics[] {
    return Array.from(this.queueMetrics.values());
  }

  // ============================================
  // COLLECT SOCKET METRICS
  // ============================================

  trackSocketEvent(metrics: SocketMetrics): void {
    this.socketMetrics.push(metrics);

    if (this.socketMetrics.length > 1000) {
      this.socketMetrics.shift();
    }

    this.emit('socket-metric', metrics);
  }

  getSocketStats(): {
    totalEvents: number;
    activeConnections: number;
    eventsPerMinute: number;
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    const recentMetrics = this.socketMetrics.filter(
      (m) => m.timestamp.getTime() > oneMinuteAgo
    );

    const activeConnections =
      this.socketMetrics.length > 0
        ? this.socketMetrics[this.socketMetrics.length - 1].connections
        : 0;

    return {
      totalEvents: recentMetrics.length,
      activeConnections,
      eventsPerMinute: recentMetrics.length,
    };
  }

  // ============================================
  // COLLECT AND PUBLISH
  // ============================================

  private async collectAndPublish(): Promise<void> {
    const systemMetrics = this.collectSystemMetrics();
    const apiStats = this.getAPIStats();
    const dbStats = this.getDatabaseStats();
    const queueMetrics = this.getQueueMetrics();
    const socketStats = this.getSocketStats();

    const snapshot = {
      timestamp: new Date(),
      system: systemMetrics,
      api: apiStats,
      database: dbStats,
      queues: queueMetrics,
      socket: socketStats,
    };

    // Publish to Redis for real-time updates
    await redis.publish('metrics:snapshot', JSON.stringify(snapshot));

    // Store in database for historical data
    await this.storeHistoricalMetrics(snapshot);

    // Emit event
    this.emit('snapshot', snapshot);

    // Check thresholds
    this.checkThresholds(snapshot);
  }

  // ============================================
  // STORE HISTORICAL METRICS
  // ============================================

  private async storeHistoricalMetrics(snapshot: any): Promise<void> {
    try {
      await prisma.metricsSnapshot.create({
        data: {
          timestamp: snapshot.timestamp,
          cpuUsage: snapshot.system.cpu.usage,
          memoryUsage: snapshot.system.memory.usagePercent,
          apiAvgResponseTime: snapshot.api.avgResponseTime,
          apiRequestsPerMinute: snapshot.api.requestsPerMinute,
          apiErrorRate: snapshot.api.errorRate,
          dbAvgQueryTime: snapshot.database.avgQueryTime,
          dbQueriesPerMinute: snapshot.database.totalQueries,
          socketActiveConnections: snapshot.socket.activeConnections,
          socketEventsPerMinute: snapshot.socket.eventsPerMinute,
        },
      });
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  // ============================================
  // CHECK THRESHOLDS
  // ============================================

  private checkThresholds(snapshot: any): void {
    // CPU threshold
    if (snapshot.system.cpu.usage > 80) {
      this.emit('alert', {
        type: 'high-cpu',
        severity: 'critical',
        message: `High CPU usage: ${snapshot.system.cpu.usage}%`,
        data: snapshot.system.cpu,
      });
    }

    // Memory threshold
    if (snapshot.system.memory.usagePercent > 80) {
      this.emit('alert', {
        type: 'high-memory',
        severity: 'critical',
        message: `High memory usage: ${snapshot.system.memory.usagePercent.toFixed(1)}%`,
        data: snapshot.system.memory,
      });
    }

    // API response time threshold
    if (snapshot.api.avgResponseTime > 500) {
      this.emit('alert', {
        type: 'slow-api',
        severity: 'warning',
        message: `Slow API responses: ${snapshot.api.avgResponseTime}ms average`,
        data: snapshot.api,
      });
    }

    // Error rate threshold
    if (snapshot.api.errorRate > 5) {
      this.emit('alert', {
        type: 'high-error-rate',
        severity: 'critical',
        message: `High error rate: ${snapshot.api.errorRate.toFixed(1)}%`,
        data: snapshot.api,
      });
    }
  }
}

// Singleton instance
export const metricsCollector = new MetricsCollector();
```

## **Metrics Middleware**

File: `backend/src/middleware/metrics.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { metricsCollector } from '../services/metrics-collector.service';
import { AuthRequest } from './auth.middleware';

/**
 * Metrics Middleware
 * Tracks all API requests
 */

export const metricsMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Capture response
  const originalSend = res.send;

  res.send = function (data: any): Response {
    const duration = Date.now() - startTime;

    // Track metrics
    metricsCollector.trackAPIRequest({
      timestamp: new Date(),
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime: duration,
      userId: req.user?.id,
      error: res.statusCode >= 400 ? 'Error' : undefined,
    });

    return originalSend.call(this, data);
  };

  next();
};
```

## **Database Metrics Extension**

File: `backend/src/lib/prisma-with-metrics.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { metricsCollector } from '../services/metrics-collector.service';

/**
 * Prisma Client with Metrics Tracking
 */

export const prisma = new PrismaClient().$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const startTime = Date.now();
      
      try {
        const result = await query(args);
        const duration = Date.now() - startTime;

        // Track metrics
        metricsCollector.trackDatabaseQuery({
          timestamp: new Date(),
          query: `${model}.${operation}`,
          duration,
          model: model || undefined,
          operation,
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        metricsCollector.trackDatabaseQuery({
          timestamp: new Date(),
          query: `${model}.${operation}`,
          duration,
          model: model || undefined,
          operation,
        });

        throw error;
      }
    },
  },
});
```

---

# 2️⃣ **MONITORING BACKEND**

## **Monitoring API Controller**

File: `backend/src/controllers/monitoring.controller.ts`

```typescript
import { Request, Response } from 'express';
import { metricsCollector } from '../services/metrics-collector.service';
import { prisma } from '../lib/prisma-with-metrics';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Monitoring Controller
 * Provides monitoring data to dashboard
 */

export class MonitoringController {
  // ============================================
  // GET CURRENT SNAPSHOT
  // ============================================

  static async getSnapshot(req: AuthRequest, res: Response) {
    try {
      const apiStats = metricsCollector.getAPIStats();
      const dbStats = metricsCollector.getDatabaseStats();
      const queueMetrics = metricsCollector.getQueueMetrics();
      const socketStats = metricsCollector.getSocketStats();

      res.json({
        success: true,
        data: {
          api: apiStats,
          database: dbStats,
          queues: queueMetrics,
          socket: socketStats,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get metrics snapshot',
      });
    }
  }

  // ============================================
  // GET HISTORICAL DATA
  // ============================================

  static async getHistoricalData(req: AuthRequest, res: Response) {
    try {
      const { hours = 24 } = req.query;

      const startDate = new Date();
      startDate.setHours(startDate.getHours() - Number(hours));

      const metrics = await prisma.metricsSnapshot.findMany({
        where: {
          timestamp: {
            gte: startDate,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get historical data',
      });
    }
  }

  // ============================================
  // GET API METRICS
  // ============================================

  static async getAPIMetrics(req: AuthRequest, res: Response) {
    try {
      const { limit = 100 } = req.query;

      const metrics = metricsCollector.getAPIMetrics(Number(limit));

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get API metrics',
      });
    }
  }

  // ============================================
  // GET ERROR LOGS
  // ============================================

  static async getErrorLogs(req: AuthRequest, res: Response) {
    try {
      const { limit = 50 } = req.query;

      const errors = await prisma.errorLog.findMany({
        orderBy: {
          timestamp: 'desc',
        },
        take: Number(limit),
      });

      res.json({
        success: true,
        data: errors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get error logs',
      });
    }
  }

  // ============================================
  // GET ALERTS
  // ============================================

  static async getAlerts(req: AuthRequest, res: Response) {
    try {
      const { status = 'active' } = req.query;

      const alerts = await prisma.alert.findMany({
        where: {
          status: status as string,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      });

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get alerts',
      });
    }
  }
}
```

## **Monitoring Routes**

File: `backend/src/routes/monitoring.routes.ts`

```typescript
import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoring.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All monitoring routes require admin access
router.use(authenticate);
router.use(authorize('admin'));

// Current snapshot
router.get('/snapshot', MonitoringController.getSnapshot);

// Historical data
router.get('/historical', MonitoringController.getHistoricalData);

// API metrics
router.get('/api-metrics', MonitoringController.getAPIMetrics);

// Error logs
router.get('/errors', MonitoringController.getErrorLogs);

// Alerts
router.get('/alerts', MonitoringController.getAlerts);

export { router as monitoringRouter };
```

---

**(يتبع...)**

📄 **File:** `/MONITORING-DASHBOARD-COMPLETE.md` (Part 1)  
🎯 **Next:** Dashboard Frontend + Alert System + Historical Analytics
