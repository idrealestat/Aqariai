# 🚀 **FEATURE 4: AUTO PUBLISHING - PART 2**
## **Backend APIs + Platform Integrations + Scheduler**

---

# 3️⃣ **BACKEND IMPLEMENTATION**

## **Publishing Controller**

File: `backend/src/controllers/publishing.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { PublishingService } from '../services/publishing.service';
import { SchedulerService } from '../services/scheduler.service';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createTaskSchema = z.object({
  propertyId: z.string().uuid(),
  platformId: z.string().uuid(),
  action: z.enum(['publish', 'update', 'unpublish', 'refresh']).default('publish'),
  scheduledAt: z.string().datetime().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

const bulkPublishSchema = z.object({
  propertyIds: z.array(z.string().uuid()),
  platformIds: z.array(z.string().uuid()),
  scheduledAt: z.string().datetime().optional(),
});

// ============================================
// PUBLISHING CONTROLLER
// ============================================

export class PublishingController {
  
  // Get all platforms
  static async getPlatforms(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const platforms = await prisma.publishingPlatform.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: platforms,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get platform details
  static async getPlatform(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const platform = await prisma.publishingPlatform.findFirst({
        where: { id, userId },
        include: {
          _count: {
            select: {
              tasks: true,
              logs: true,
            },
          },
        },
      });

      if (!platform) {
        return res.status(404).json({
          success: false,
          message: 'Platform not found',
        });
      }

      res.json({
        success: true,
        data: platform,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get publishing queue
  static async getQueue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        status,
        platformId,
        priority,
        page = '1',
        limit = '20',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { userId };
      if (status) where.status = status;
      if (platformId) where.platformId = platformId;
      if (priority) where.priority = priority;

      const [tasks, total] = await Promise.all([
        prisma.publishingTask.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: [
            { priority: 'desc' },
            { scheduledAt: 'asc' },
          ],
          include: {
            property: {
              select: {
                id: true,
                title: true,
                city: true,
                price: true,
                propertyType: true,
              },
            },
            platform: {
              select: {
                id: true,
                name: true,
                displayName: true,
                logo: true,
              },
            },
          },
        }),
        prisma.publishingTask.count({ where }),
      ]);

      res.json({
        success: true,
        data: tasks,
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

  // Schedule publishing task
  static async scheduleTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = createTaskSchema.parse(req.body);

      // Verify property ownership
      const property = await prisma.ownerProperty.findFirst({
        where: { id: data.propertyId, userId },
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }

      // Verify platform exists
      const platform = await prisma.publishingPlatform.findFirst({
        where: { id: data.platformId, userId },
      });

      if (!platform) {
        return res.status(404).json({
          success: false,
          message: 'Platform not found',
        });
      }

      // Check if already scheduled
      const existing = await prisma.publishingTask.findFirst({
        where: {
          propertyId: data.propertyId,
          platformId: data.platformId,
          status: { in: ['pending', 'scheduled', 'processing'] },
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Property already scheduled for this platform',
        });
      }

      // Create task
      const scheduledAt = data.scheduledAt 
        ? new Date(data.scheduledAt)
        : new Date(Date.now() + 5 * 60 * 1000); // Default: 5 minutes from now

      const task = await prisma.publishingTask.create({
        data: {
          userId,
          propertyId: data.propertyId,
          platformId: data.platformId,
          action: data.action,
          priority: data.priority,
          status: scheduledAt <= new Date() ? 'pending' : 'scheduled',
          scheduledAt,
          maxRetries: platform.maxRetries,
        },
        include: {
          property: true,
          platform: true,
        },
      });

      // If immediate, queue for execution
      if (scheduledAt <= new Date()) {
        await SchedulerService.queueTask(task.id);
      }

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk schedule
  static async bulkSchedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = bulkPublishSchema.parse(req.body);

      const scheduledAt = data.scheduledAt 
        ? new Date(data.scheduledAt)
        : new Date(Date.now() + 5 * 60 * 1000);

      const tasks = [];

      for (const propertyId of data.propertyIds) {
        for (const platformId of data.platformIds) {
          // Check if already scheduled
          const existing = await prisma.publishingTask.findFirst({
            where: {
              propertyId,
              platformId,
              status: { in: ['pending', 'scheduled', 'processing'] },
            },
          });

          if (!existing) {
            const task = await prisma.publishingTask.create({
              data: {
                userId,
                propertyId,
                platformId,
                action: 'publish',
                priority: 'normal',
                status: scheduledAt <= new Date() ? 'pending' : 'scheduled',
                scheduledAt,
              },
            });

            tasks.push(task);

            if (scheduledAt <= new Date()) {
              await SchedulerService.queueTask(task.id);
            }
          }
        }
      }

      res.json({
        success: true,
        data: {
          scheduled: tasks.length,
          tasks,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Execute task immediately
  static async executeTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const task = await prisma.publishingTask.findFirst({
        where: { id, userId },
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      if (task.status === 'processing') {
        return res.status(400).json({
          success: false,
          message: 'Task is already being processed',
        });
      }

      if (task.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Task is already completed',
        });
      }

      // Execute immediately
      await PublishingService.executeTask(id);

      // Get updated task
      const updatedTask = await prisma.publishingTask.findUnique({
        where: { id },
        include: {
          property: true,
          platform: true,
        },
      });

      res.json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  // Retry failed task
  static async retryTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const task = await prisma.publishingTask.findFirst({
        where: { id, userId },
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      if (task.status !== 'failed') {
        return res.status(400).json({
          success: false,
          message: 'Only failed tasks can be retried',
        });
      }

      if (task.retryCount >= task.maxRetries) {
        return res.status(400).json({
          success: false,
          message: 'Maximum retries exceeded',
        });
      }

      // Reset and retry
      await prisma.publishingTask.update({
        where: { id },
        data: {
          status: 'pending',
          retryCount: { increment: 1 },
          lastRetryAt: new Date(),
          nextRetryAt: null,
          errorMessage: null,
        },
      });

      await PublishingService.executeTask(id);

      const updatedTask = await prisma.publishingTask.findUnique({
        where: { id },
        include: {
          property: true,
          platform: true,
        },
      });

      res.json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel task
  static async cancelTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const task = await prisma.publishingTask.findFirst({
        where: { id, userId },
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      if (task.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel completed task',
        });
      }

      await prisma.publishingTask.update({
        where: { id },
        data: { status: 'cancelled' },
      });

      res.json({
        success: true,
        message: 'Task cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get publishing logs
  static async getLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        taskId,
        platformId,
        status,
        level,
        page = '1',
        limit = '50',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (taskId) where.taskId = taskId;
      if (platformId) where.platformId = platformId;
      if (status) where.status = status;
      if (level) where.level = level;

      const [logs, total] = await Promise.all([
        prisma.publishingLog.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
          include: {
            task: {
              select: {
                id: true,
                action: true,
                property: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
            platform: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        }),
        prisma.publishingLog.count({ where }),
      ]);

      res.json({
        success: true,
        data: logs,
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

  // Get publishing stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { days = '30' } = req.query;

      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const [
        totalTasks,
        pendingTasks,
        completedTasks,
        failedTasks,
        stats,
      ] = await Promise.all([
        prisma.publishingTask.count({ where: { userId } }),
        prisma.publishingTask.count({ where: { userId, status: 'pending' } }),
        prisma.publishingTask.count({ where: { userId, status: 'completed' } }),
        prisma.publishingTask.count({ where: { userId, status: 'failed' } }),
        prisma.publishingStats.findMany({
          where: {
            userId,
            date: { gte: startDate },
          },
          orderBy: { date: 'asc' },
        }),
      ]);

      const successRate = totalTasks > 0
        ? ((completedTasks / totalTasks) * 100).toFixed(2)
        : 0;

      res.json({
        success: true,
        data: {
          overview: {
            totalTasks,
            pendingTasks,
            completedTasks,
            failedTasks,
            successRate,
          },
          history: stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

# 4️⃣ **PLATFORM INTEGRATIONS**

## **Publishing Service**

File: `backend/src/services/publishing.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import axios from 'axios';
import { io } from '../server';

interface PublishingResult {
  success: boolean;
  externalId?: string;
  externalUrl?: string;
  responseCode?: number;
  responseMessage?: string;
  errorMessage?: string;
}

export class PublishingService {
  
  // ============================================
  // EXECUTE PUBLISHING TASK
  // ============================================
  
  static async executeTask(taskId: string): Promise<void> {
    console.log(`📤 Executing task: ${taskId}`);

    // Get task with relations
    const task = await prisma.publishingTask.findUnique({
      where: { id: taskId },
      include: {
        property: true,
        platform: true,
      },
    });

    if (!task) {
      console.error(`Task not found: ${taskId}`);
      return;
    }

    // Update status to processing
    await prisma.publishingTask.update({
      where: { id: taskId },
      data: {
        status: 'processing',
        executedAt: new Date(),
      },
    });

    try {
      // Execute based on action
      let result: PublishingResult;

      switch (task.action) {
        case 'publish':
          result = await this.publishProperty(task);
          break;
        case 'update':
          result = await this.updateProperty(task);
          break;
        case 'unpublish':
          result = await this.unpublishProperty(task);
          break;
        case 'refresh':
          result = await this.refreshProperty(task);
          break;
        default:
          throw new Error(`Unknown action: ${task.action}`);
      }

      if (result.success) {
        // Update task as completed
        await prisma.publishingTask.update({
          where: { id: taskId },
          data: {
            status: 'completed',
            completedAt: new Date(),
            externalId: result.externalId,
            externalUrl: result.externalUrl,
            responseCode: result.responseCode,
            responseMessage: result.responseMessage,
          },
        });

        // Update platform stats
        await prisma.publishingPlatform.update({
          where: { id: task.platformId },
          data: {
            totalPublished: { increment: 1 },
            publishedToday: { increment: 1 },
            publishedThisMonth: { increment: 1 },
            lastConnectedAt: new Date(),
          },
        });

        // Log success
        await this.createLog(task, 'success', result);

        // Send notification
        io.to(`user:${task.userId}`).emit('publishing:success', {
          taskId,
          propertyTitle: task.property.title,
          platformName: task.platform.displayName,
          externalUrl: result.externalUrl,
        });

        console.log(`✅ Task completed: ${taskId}`);
      } else {
        throw new Error(result.errorMessage || 'Publishing failed');
      }
    } catch (error) {
      console.error(`❌ Task failed: ${taskId}`, error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update task as failed
      await prisma.publishingTask.update({
        where: { id: taskId },
        data: {
          status: 'failed',
          errorMessage,
          lastRetryAt: new Date(),
          nextRetryAt: this.calculateNextRetry(task.retryCount + 1),
        },
      });

      // Update platform stats
      await prisma.publishingPlatform.update({
        where: { id: task.platformId },
        data: {
          totalFailed: { increment: 1 },
          lastErrorAt: new Date(),
          lastError: errorMessage,
        },
      });

      // Log failure
      await this.createLog(task, 'failed', { errorMessage });

      // Send notification
      io.to(`user:${task.userId}`).emit('publishing:failed', {
        taskId,
        propertyTitle: task.property.title,
        platformName: task.platform.displayName,
        error: errorMessage,
      });

      // Schedule retry if applicable
      if (task.platform.retryOnFailure && task.retryCount < task.maxRetries) {
        await this.scheduleRetry(taskId);
      }
    }
  }

  // ============================================
  // PUBLISH PROPERTY
  // ============================================
  
  private static async publishProperty(task: any): Promise<PublishingResult> {
    const { property, platform } = task;

    console.log(`Publishing ${property.title} to ${platform.displayName}...`);

    // Prepare property data
    const propertyData = this.preparePropertyData(property, platform);

    // Call platform API
    const result = await this.callPlatformAPI(
      platform,
      'POST',
      '/listings',
      propertyData
    );

    return result;
  }

  // ============================================
  // UPDATE PROPERTY
  // ============================================
  
  private static async updateProperty(task: any): Promise<PublishingResult> {
    const { property, platform } = task;

    if (!task.externalId) {
      throw new Error('Cannot update: No external ID found');
    }

    console.log(`Updating ${property.title} on ${platform.displayName}...`);

    const propertyData = this.preparePropertyData(property, platform);

    const result = await this.callPlatformAPI(
      platform,
      'PUT',
      `/listings/${task.externalId}`,
      propertyData
    );

    return result;
  }

  // ============================================
  // UNPUBLISH PROPERTY
  // ============================================
  
  private static async unpublishProperty(task: any): Promise<PublishingResult> {
    const { property, platform } = task;

    if (!task.externalId) {
      throw new Error('Cannot unpublish: No external ID found');
    }

    console.log(`Unpublishing ${property.title} from ${platform.displayName}...`);

    const result = await this.callPlatformAPI(
      platform,
      'DELETE',
      `/listings/${task.externalId}`,
      {}
    );

    return result;
  }

  // ============================================
  // REFRESH PROPERTY
  // ============================================
  
  private static async refreshProperty(task: any): Promise<PublishingResult> {
    const { property, platform } = task;

    if (!task.externalId) {
      throw new Error('Cannot refresh: No external ID found');
    }

    console.log(`Refreshing ${property.title} on ${platform.displayName}...`);

    const result = await this.callPlatformAPI(
      platform,
      'POST',
      `/listings/${task.externalId}/refresh`,
      {}
    );

    return result;
  }

  // ============================================
  // PREPARE PROPERTY DATA
  // ============================================
  
  private static preparePropertyData(property: any, platform: any): any {
    // Parse features
    const features = JSON.parse(property.features || '[]');

    // Base data
    const data: any = {
      title: property.title,
      description: property.description,
      type: property.propertyType,
      purpose: property.purpose,
      price: Number(property.price),
      currency: property.currency,
      area: Number(property.area),
      city: property.city,
      district: property.district,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      features,
    };

    // Add images
    if (property.images) {
      const images = JSON.parse(property.images);
      data.images = images.slice(0, platform.maxImages).map((img: any) => img.url);
    }

    // Add video if supported
    if (platform.supportsVideo && property.videos) {
      const videos = JSON.parse(property.videos);
      if (videos.length > 0) {
        data.videoUrl = videos[0].url;
      }
    }

    // Add virtual tour if supported
    if (platform.supportsVirtualTour && property.virtualTourUrl) {
      data.virtualTourUrl = property.virtualTourUrl;
    }

    // Platform-specific transformations
    switch (platform.name) {
      case 'aqar':
        data.location = {
          city: property.city,
          district: property.district,
          latitude: property.latitude,
          longitude: property.longitude,
        };
        break;

      case 'bayut':
        data.property_type = this.mapPropertyType(property.propertyType, 'bayut');
        data.listing_type = property.purpose === 'sale' ? 'for-sale' : 'for-rent';
        break;

      case 'haraj':
        data.category = this.mapPropertyType(property.propertyType, 'haraj');
        data.location_name = `${property.city} - ${property.district}`;
        break;
    }

    return data;
  }

  // ============================================
  // CALL PLATFORM API
  // ============================================
  
  private static async callPlatformAPI(
    platform: any,
    method: string,
    endpoint: string,
    data: any
  ): Promise<PublishingResult> {
    // For demo purposes, simulate API call
    // In production, replace with actual API calls

    const isDemo = process.env.NODE_ENV === 'development' || !platform.apiKey.startsWith('live_');

    if (isDemo) {
      // Simulate API call
      console.log(`🔧 [DEMO] ${method} ${platform.apiEndpoint}${endpoint}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, randomNumber(500, 2000)));

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        return {
          success: true,
          externalId: `demo_${platform.name}_${Date.now()}`,
          externalUrl: `${platform.website}/listing/demo_${Date.now()}`,
          responseCode: 200,
          responseMessage: 'Listing published successfully',
        };
      } else {
        return {
          success: false,
          responseCode: randomElement([400, 401, 429, 500, 503]),
          errorMessage: randomElement([
            'API rate limit exceeded',
            'Invalid API key',
            'Property validation failed',
            'Platform service temporarily unavailable',
          ]),
        };
      }
    }

    // Real API call
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add authentication
      switch (platform.authType) {
        case 'api_key':
          headers['X-API-Key'] = platform.apiKey;
          break;
        case 'bearer':
          headers['Authorization'] = `Bearer ${platform.accessToken}`;
          break;
        case 'basic':
          const auth = Buffer.from(`${platform.username}:${platform.password}`).toString('base64');
          headers['Authorization'] = `Basic ${auth}`;
          break;
      }

      const response = await axios({
        method,
        url: `${platform.apiEndpoint}${endpoint}`,
        headers,
        data: method !== 'GET' ? data : undefined,
        timeout: 30000,
      });

      return {
        success: true,
        externalId: response.data.id || response.data.listing_id,
        externalUrl: response.data.url || response.data.listing_url,
        responseCode: response.status,
        responseMessage: response.data.message || 'Success',
      };
    } catch (error: any) {
      return {
        success: false,
        responseCode: error.response?.status || 500,
        errorMessage: error.response?.data?.message || error.message,
      };
    }
  }

  // ============================================
  // CREATE LOG
  // ============================================
  
  private static async createLog(
    task: any,
    status: 'success' | 'failed' | 'retry',
    result: any
  ): Promise<void> {
    await prisma.publishingLog.create({
      data: {
        taskId: task.id,
        platformId: task.platformId,
        propertyId: task.propertyId,
        action: task.action,
        status,
        level: status === 'success' ? 'info' : 'error',
        responseCode: result.responseCode,
        responseTime: randomNumber(200, 2000),
        errorMessage: result.errorMessage,
        externalId: result.externalId,
        externalUrl: result.externalUrl,
      },
    });
  }

  // ============================================
  // RETRY LOGIC
  // ============================================
  
  private static calculateNextRetry(retryCount: number): Date {
    // Exponential backoff: 5min, 15min, 30min
    const minutes = [5, 15, 30][Math.min(retryCount - 1, 2)];
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private static async scheduleRetry(taskId: string): Promise<void> {
    const task = await prisma.publishingTask.findUnique({
      where: { id: taskId },
    });

    if (!task) return;

    const nextRetry = this.calculateNextRetry(task.retryCount + 1);

    await prisma.publishingTask.update({
      where: { id: taskId },
      data: {
        status: 'scheduled',
        nextRetryAt: nextRetry,
      },
    });

    console.log(`🔄 Retry scheduled for ${taskId} at ${nextRetry.toISOString()}`);
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  private static mapPropertyType(type: string, platform: string): string {
    const mappings: Record<string, Record<string, string>> = {
      bayut: {
        apartment: 'AP',
        villa: 'VH',
        land: 'LP',
        commercial: 'CO',
        building: 'BU',
      },
      haraj: {
        apartment: 'شقق',
        villa: 'فلل',
        land: 'أراضي',
        commercial: 'عقارات تجارية',
        building: 'عمائر',
      },
    };

    return mappings[platform]?.[type] || type;
  }
}

// Utility functions
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
```

---

**(يتبع في الجزء الثالث...)**

📄 **File:** `/FEATURE-4-PART-2.md`  
🎯 **Status:** Part 2 Complete (Backend + Platform APIs)  
⏱️ **Next:** Scheduler + Frontend + Testing
