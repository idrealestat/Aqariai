# 🛠️ **Post-Launch Operations Guide - Nova CRM**
## **Monitoring, Support & Continuous Improvement**

---

## 📋 **POST-LAUNCH ROADMAP**

```
Week 1-2:   Intensive Monitoring & Rapid Response
Week 3-4:   Feedback Collection & Quick Wins
Month 2-3:  Performance Optimization & AI Tuning
Month 4+:   Continuous Improvement & Scaling
```

---

## 🔍 **Phase 1: Monitoring & Alerts**

### **1.1: Comprehensive Monitoring Dashboard**

```typescript
// monitoring/dashboards/post-launch-dashboard.ts
import { CloudWatch, Prometheus, Sentry } from './integrations';

export const postLaunchDashboard = {
  // Real-time Health Metrics
  health: {
    api: {
      uptime: { target: 99.9, alert: 99.5 },
      responseTime: { target: 500, alert: 1000, unit: 'ms' },
      errorRate: { target: 0.1, alert: 1, unit: '%' },
      throughput: { target: 1000, alert: 500, unit: 'req/min' },
    },
    database: {
      connections: { target: 50, alert: 80, max: 100 },
      queryTime: { target: 50, alert: 200, unit: 'ms' },
      deadlocks: { target: 0, alert: 1 },
      replication_lag: { target: 0, alert: 5, unit: 's' },
    },
    redis: {
      memory: { target: 70, alert: 85, unit: '%' },
      hitRate: { target: 95, alert: 80, unit: '%' },
      evictions: { target: 0, alert: 100, unit: 'per_hour' },
    },
    storage: {
      s3_availability: { target: 99.99, alert: 99.9 },
      cdn_hitRate: { target: 90, alert: 80, unit: '%' },
    },
  },

  // User Experience Metrics
  ux: {
    frontend: {
      fcp: { target: 1.8, alert: 3, unit: 's' }, // First Contentful Paint
      lcp: { target: 2.5, alert: 4, unit: 's' }, // Largest Contentful Paint
      fid: { target: 100, alert: 300, unit: 'ms' }, // First Input Delay
      cls: { target: 0.1, alert: 0.25 }, // Cumulative Layout Shift
      ttfb: { target: 600, alert: 1000, unit: 'ms' }, // Time to First Byte
    },
    realtime: {
      socketLatency: { target: 100, alert: 500, unit: 'ms' },
      reconnections: { target: 0, alert: 5, unit: 'per_hour' },
      messageDelay: { target: 50, alert: 200, unit: 'ms' },
    },
  },

  // Business Metrics
  business: {
    users: {
      dau: { target: 300, alert: 100 }, // Daily Active Users
      mau: { target: 1000, alert: 500 }, // Monthly Active Users
      retention_day7: { target: 60, alert: 40, unit: '%' },
      retention_day30: { target: 40, alert: 20, unit: '%' },
    },
    engagement: {
      sessionDuration: { target: 10, alert: 5, unit: 'min' },
      actionsPerSession: { target: 15, alert: 5 },
      customerCreated: { target: 50, alert: 20, unit: 'per_day' },
      propertiesCreated: { target: 30, alert: 10, unit: 'per_day' },
    },
    revenue: {
      mrr: { target: 50000, alert: 20000, unit: 'SAR' },
      churnRate: { target: 5, alert: 10, unit: '%' },
      ltv: { target: 10000, alert: 5000, unit: 'SAR' },
      conversionRate: { target: 10, alert: 5, unit: '%' },
    },
  },

  // AI Performance
  ai: {
    smartMatches: {
      accuracy: { target: 95, alert: 85, unit: '%' },
      avgMatchScore: { target: 75, alert: 60 },
      matchesPerDay: { target: 100, alert: 50 },
      acceptanceRate: { target: 30, alert: 15, unit: '%' },
    },
    assistant: {
      responseTime: { target: 2000, alert: 5000, unit: 'ms' },
      accuracy: { target: 90, alert: 75, unit: '%' },
      satisfaction: { target: 4, alert: 3, unit: '/5' },
      usage: { target: 200, alert: 50, unit: 'queries_per_day' },
    },
  },
};
```

---

### **1.2: Automated Alert System**

```typescript
// monitoring/alerts/alert-manager.ts
import { sendSlackAlert, sendEmailAlert, sendSMS, createPagerDutyIncident } from './integrations';

interface Alert {
  severity: 'critical' | 'high' | 'medium' | 'low';
  metric: string;
  current: number;
  threshold: number;
  timestamp: Date;
}

class AlertManager {
  private alertHistory: Map<string, Date> = new Map();
  private readonly COOLDOWN_MINUTES = 15; // Don't spam alerts

  async processAlert(alert: Alert): Promise<void> {
    const alertKey = `${alert.metric}-${alert.severity}`;
    const lastAlert = this.alertHistory.get(alertKey);
    
    // Check cooldown
    if (lastAlert) {
      const minutesSinceLastAlert = (Date.now() - lastAlert.getTime()) / 1000 / 60;
      if (minutesSinceLastAlert < this.COOLDOWN_MINUTES) {
        console.log(`Alert ${alertKey} in cooldown, skipping`);
        return;
      }
    }

    // Send alerts based on severity
    switch (alert.severity) {
      case 'critical':
        await this.handleCriticalAlert(alert);
        break;
      case 'high':
        await this.handleHighAlert(alert);
        break;
      case 'medium':
        await this.handleMediumAlert(alert);
        break;
      case 'low':
        await this.handleLowAlert(alert);
        break;
    }

    this.alertHistory.set(alertKey, new Date());
  }

  private async handleCriticalAlert(alert: Alert): Promise<void> {
    console.error('🚨 CRITICAL ALERT:', alert);

    // 1. Create PagerDuty incident
    await createPagerDutyIncident({
      title: `CRITICAL: ${alert.metric}`,
      description: `${alert.metric} is at ${alert.current} (threshold: ${alert.threshold})`,
      severity: 'critical',
    });

    // 2. Send SMS to on-call
    await sendSMS({
      to: process.env.ONCALL_PHONE!,
      message: `🚨 CRITICAL: ${alert.metric} at ${alert.current}. Check PagerDuty immediately.`,
    });

    // 3. Slack alert
    await sendSlackAlert({
      channel: '#critical-alerts',
      text: '🚨 CRITICAL ALERT',
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🚨 CRITICAL ALERT' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Metric:*\n${alert.metric}` },
            { type: 'mrkdwn', text: `*Current:*\n${alert.current}` },
            { type: 'mrkdwn', text: `*Threshold:*\n${alert.threshold}` },
            { type: 'mrkdwn', text: `*Time:*\n${alert.timestamp.toISOString()}` },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Dashboard' },
              url: 'https://grafana.nova-crm.com',
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Acknowledge' },
              action_id: 'acknowledge_alert',
            },
          ],
        },
      ],
    });

    // 4. Email to team
    await sendEmailAlert({
      to: ['team@nova-crm.com'],
      subject: `🚨 CRITICAL: ${alert.metric}`,
      body: this.formatEmailAlert(alert),
    });
  }

  private async handleHighAlert(alert: Alert): Promise<void> {
    console.warn('⚠️ HIGH ALERT:', alert);

    await sendSlackAlert({
      channel: '#alerts',
      text: `⚠️ HIGH: ${alert.metric} at ${alert.current} (threshold: ${alert.threshold})`,
    });

    await sendEmailAlert({
      to: ['devops@nova-crm.com'],
      subject: `⚠️ HIGH: ${alert.metric}`,
      body: this.formatEmailAlert(alert),
    });
  }

  private async handleMediumAlert(alert: Alert): Promise<void> {
    console.warn('⚡ MEDIUM ALERT:', alert);

    await sendSlackAlert({
      channel: '#alerts',
      text: `⚡ MEDIUM: ${alert.metric} at ${alert.current}`,
    });
  }

  private async handleLowAlert(alert: Alert): Promise<void> {
    console.info('ℹ️ LOW ALERT:', alert);

    await sendSlackAlert({
      channel: '#monitoring',
      text: `ℹ️ LOW: ${alert.metric} at ${alert.current}`,
    });
  }

  private formatEmailAlert(alert: Alert): string {
    return `
      <html>
        <body>
          <h2>🚨 Nova CRM Alert</h2>
          <table>
            <tr><td><strong>Severity:</strong></td><td>${alert.severity.toUpperCase()}</td></tr>
            <tr><td><strong>Metric:</strong></td><td>${alert.metric}</td></tr>
            <tr><td><strong>Current Value:</strong></td><td>${alert.current}</td></tr>
            <tr><td><strong>Threshold:</strong></td><td>${alert.threshold}</td></tr>
            <tr><td><strong>Time:</strong></td><td>${alert.timestamp.toISOString()}</td></tr>
          </table>
          <p>
            <a href="https://grafana.nova-crm.com">View Dashboard</a> |
            <a href="https://logs.nova-crm.com">View Logs</a>
          </p>
        </body>
      </html>
    `;
  }
}

export const alertManager = new AlertManager();
```

---

### **1.3: Real-time Error Tracking**

```typescript
// monitoring/error-tracking/sentry-enhanced.ts
import * as Sentry from '@sentry/node';

// Enhanced Sentry configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  
  // Set up release tracking
  release: process.env.RELEASE_VERSION,
  
  // Enhanced error filtering
  beforeSend(event, hint) {
    // Don't send certain errors
    if (event.exception?.values?.[0]?.type === 'ExpectedBusinessError') {
      return null;
    }
    
    // Add extra context
    event.tags = {
      ...event.tags,
      deployment: process.env.DEPLOYMENT_ID,
      region: process.env.AWS_REGION,
    };
    
    // Scrub sensitive data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers?.authorization) {
        event.request.headers.authorization = '[REDACTED]';
      }
    }
    
    return event;
  },
  
  // Custom integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Postgres(),
  ],
});

// Custom error tracking
export const trackError = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    level: 'error',
    tags: {
      component: context?.component,
      action: context?.action,
    },
    extra: {
      userId: context?.userId,
      request: context?.request,
      additionalInfo: context?.info,
    },
  });
};

// Track slow operations
export const trackSlowOperation = (operation: string, duration: number, threshold: number) => {
  if (duration > threshold) {
    Sentry.captureMessage(`Slow operation: ${operation}`, {
      level: 'warning',
      tags: {
        operation,
        performance: 'slow',
      },
      extra: {
        duration,
        threshold,
      },
    });
  }
};

// Track business events
export const trackBusinessEvent = (event: string, data: any) => {
  Sentry.addBreadcrumb({
    category: 'business',
    message: event,
    data,
    level: 'info',
  });
};
```

---

## 💬 **Phase 2: User Feedback & Support**

### **2.1: Feedback Collection System**

```typescript
// backend/src/modules/feedback/feedback.service.ts
import { prisma } from '../../config/database';
import { sendSlackAlert } from '../../services/slack';

export interface FeedbackInput {
  userId: string;
  type: 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise';
  category: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  metadata?: any;
}

export class FeedbackService {
  async createFeedback(input: FeedbackInput) {
    // Save to database
    const feedback = await prisma.feedback.create({
      data: {
        ...input,
        status: 'new',
        createdAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            subscription: {
              include: { plan: true },
            },
          },
        },
      },
    });

    // Notify team based on priority
    if (input.priority === 'urgent' || input.type === 'bug') {
      await this.notifyTeam(feedback);
    }

    // Auto-categorize using AI
    const category = await this.autoCategorizeFeedback(input.description);
    if (category) {
      await prisma.feedback.update({
        where: { id: feedback.id },
        data: { aiCategory: category },
      });
    }

    return feedback;
  }

  async getAllFeedback(filters?: {
    type?: string;
    status?: string;
    priority?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    return prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getFeedbackAnalytics(period: string = '7d') {
    const startDate = this.getStartDate(period);

    const [
      totalFeedback,
      byType,
      byPriority,
      byStatus,
      avgResponseTime,
      satisfactionScore,
    ] = await Promise.all([
      // Total feedback
      prisma.feedback.count({
        where: { createdAt: { gte: startDate } },
      }),

      // By type
      prisma.feedback.groupBy({
        by: ['type'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),

      // By priority
      prisma.feedback.groupBy({
        by: ['priority'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),

      // By status
      prisma.feedback.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),

      // Avg response time
      prisma.$queryRaw`
        SELECT AVG(EXTRACT(EPOCH FROM (responded_at - created_at))) as avg_seconds
        FROM feedback
        WHERE created_at >= ${startDate}
        AND responded_at IS NOT NULL
      `,

      // Satisfaction score
      prisma.feedback.aggregate({
        where: {
          createdAt: { gte: startDate },
          satisfactionRating: { not: null },
        },
        _avg: { satisfactionRating: true },
      }),
    ]);

    return {
      totalFeedback,
      byType: Object.fromEntries(byType.map(t => [t.type, t._count])),
      byPriority: Object.fromEntries(byPriority.map(p => [p.priority, p._count])),
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
      avgResponseTime: avgResponseTime[0]?.avg_seconds || 0,
      satisfactionScore: satisfactionScore._avg.satisfactionRating || 0,
    };
  }

  private async notifyTeam(feedback: any) {
    const emoji = feedback.type === 'bug' ? '🐛' : '📝';
    const urgency = feedback.priority === 'urgent' ? '🚨 URGENT' : '';

    await sendSlackAlert({
      channel: '#user-feedback',
      text: `${urgency} ${emoji} New ${feedback.type}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${urgency} ${emoji} ${feedback.title}`,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Type:*\n${feedback.type}` },
            { type: 'mrkdwn', text: `*Priority:*\n${feedback.priority || 'medium'}` },
            { type: 'mrkdwn', text: `*User:*\n${feedback.user.name}` },
            { type: 'mrkdwn', text: `*Plan:*\n${feedback.user.subscription?.plan.name || 'None'}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${feedback.description}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View in Admin' },
              url: `https://admin.nova-crm.com/feedback/${feedback.id}`,
            },
          ],
        },
      ],
    });
  }

  private async autoCategorizeFeedback(description: string): Promise<string | null> {
    // Use AI to categorize
    // For now, simple keyword matching
    const categories: Record<string, string[]> = {
      'Performance': ['slow', 'lag', 'loading', 'performance', 'speed'],
      'UI/UX': ['design', 'layout', 'confusing', 'hard to use', 'interface'],
      'Feature Request': ['would be nice', 'add feature', 'suggestion', 'could you'],
      'Bug': ['error', 'broken', 'not working', 'crash', 'bug'],
      'Data': ['incorrect', 'wrong data', 'missing', 'lost'],
    };

    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }

    return null;
  }

  private getStartDate(period: string): Date {
    const now = new Date();
    const days = parseInt(period.replace('d', ''));
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }
}
```

---

### **2.2: In-App Support Widget**

```typescript
// frontend/src/components/support/SupportWidget.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<string>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/feedback', {
        type,
        title,
        description,
        priority,
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      });

      setSubmitted(true);
      toast.success('شكراً لملاحظاتك! سنتواصل معك قريباً');

      // Reset after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setTitle('');
        setDescription('');
      }, 3000);
    } catch (error) {
      toast.error('حدث خطأ، الرجاء المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
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
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
      </motion.div>

      {/* Support Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 left-6 z-50 w-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold">تواصل معنا</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-4">
                {!submitted ? (
                  <div className="space-y-4">
                    {/* Type Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        نوع الرسالة
                      </label>
                      <Select value={type} onValueChange={setType}>
                        <option value="bug">🐛 بلاغ عن خطأ</option>
                        <option value="feature">💡 اقتراح ميزة</option>
                        <option value="improvement">⚡ تحسين</option>
                        <option value="complaint">😞 شكوى</option>
                        <option value="praise">🎉 إعجاب</option>
                      </Select>
                    </div>

                    {/* Priority (only for bugs) */}
                    {type === 'bug' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          الأولوية
                        </label>
                        <Select value={priority} onValueChange={setPriority}>
                          <option value="low">منخفضة</option>
                          <option value="medium">متوسطة</option>
                          <option value="high">عالية</option>
                          <option value="urgent">عاجلة</option>
                        </Select>
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        العنوان
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="عنوان مختصر..."
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        الوصف
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="وصف تفصيلي..."
                        rows={4}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        'جارٍ الإرسال...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-2" />
                          إرسال
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">شكراً لك!</h3>
                    <p className="text-gray-600">
                      تم إرسال رسالتك بنجاح. سنتواصل معك قريباً
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t text-center text-sm text-gray-600">
                للدعم العاجل:{' '}
                <a href="tel:+966500000000" className="text-primary-600">
                  +966 50 000 0000
                </a>
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

## ⚡ **Phase 3: Performance Optimization**

### **3.1: Database Query Optimization**

```typescript
// backend/src/scripts/optimize-queries.ts
import { prisma } from '../config/database';

export const optimizeQueries = async () => {
  console.log('🔍 Analyzing slow queries...\n');

  // 1. Find slow queries from pg_stat_statements
  const slowQueries = await prisma.$queryRaw<any[]>`
    SELECT
      query,
      calls,
      total_exec_time / 1000 as total_seconds,
      mean_exec_time / 1000 as mean_seconds,
      max_exec_time / 1000 as max_seconds
    FROM pg_stat_statements
    WHERE mean_exec_time > 100  -- queries taking >100ms on average
    ORDER BY mean_exec_time DESC
    LIMIT 20
  `;

  console.log('📊 Top 20 Slow Queries:');
  console.log('═'.repeat(80));
  slowQueries.forEach((q, i) => {
    console.log(`${i + 1}. Query (${q.calls} calls, avg: ${q.mean_seconds.toFixed(2)}s)`);
    console.log(`   ${q.query.substring(0, 100)}...`);
    console.log();
  });

  // 2. Check for missing indexes
  console.log('\n🔍 Checking for missing indexes...\n');
  
  const missingIndexes = await prisma.$queryRaw<any[]>`
    SELECT
      schemaname,
      tablename,
      seq_scan,
      seq_tup_read,
      idx_scan,
      seq_tup_read / seq_scan as avg_seq_tup_read
    FROM pg_stat_user_tables
    WHERE seq_scan > 0
    AND seq_tup_read / seq_scan > 10000  -- tables with large sequential scans
    ORDER BY seq_tup_read DESC
    LIMIT 10
  `;

  console.log('📊 Tables with large sequential scans (need indexes):');
  console.log('═'.repeat(80));
  missingIndexes.forEach((t, i) => {
    console.log(`${i + 1}. ${t.tablename}`);
    console.log(`   Sequential scans: ${t.seq_scan}`);
    console.log(`   Rows read per scan: ${Math.round(t.avg_seq_tup_read)}`);
    console.log();
  });

  // 3. Suggest optimizations
  console.log('\n💡 Optimization Suggestions:\n');

  const suggestions = [
    {
      table: 'customers',
      column: ['userId', 'status'],
      reason: 'Frequently filtered together',
      sql: 'CREATE INDEX idx_customers_user_status ON customers(userId, status);',
    },
    {
      table: 'properties',
      column: ['city', 'propertyType', 'status'],
      reason: 'Smart matching queries',
      sql: 'CREATE INDEX idx_properties_matching ON properties(city, propertyType, status);',
    },
    {
      table: 'smart_matches',
      column: ['brokerId', 'status', 'matchScore'],
      reason: 'Broker dashboard queries',
      sql: 'CREATE INDEX idx_matches_broker_status ON smart_matches(brokerId, status, matchScore DESC);',
    },
    {
      table: 'appointments',
      column: ['userId', 'startDatetime'],
      reason: 'Calendar queries',
      sql: 'CREATE INDEX idx_appointments_user_date ON appointments(userId, startDatetime);',
    },
  ];

  suggestions.forEach((s, i) => {
    console.log(`${i + 1}. ${s.table}.${s.column.join(', ')}`);
    console.log(`   Reason: ${s.reason}`);
    console.log(`   SQL: ${s.sql}`);
    console.log();
  });

  // 4. Check for unused indexes
  console.log('\n🗑️ Checking for unused indexes...\n');

  const unusedIndexes = await prisma.$queryRaw<any[]>`
    SELECT
      schemaname,
      tablename,
      indexname,
      idx_scan,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
    AND indexname NOT LIKE '%_pkey'
    ORDER BY pg_relation_size(indexrelid) DESC
    LIMIT 10
  `;

  console.log('📊 Unused Indexes (consider removing):');
  console.log('═'.repeat(80));
  unusedIndexes.forEach((idx, i) => {
    console.log(`${i + 1}. ${idx.tablename}.${idx.indexname} (${idx.size})`);
    console.log(`   DROP INDEX ${idx.indexname};`);
    console.log();
  });

  console.log('✅ Query optimization analysis complete!');
};
```

---

### **3.2: Frontend Performance Monitoring**

```typescript
// frontend/src/lib/performance-monitor.ts
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  init() {
    // Core Web Vitals
    onCLS(this.sendToAnalytics);
    onFCP(this.sendToAnalytics);
    onFID(this.sendToAnalytics);
    onLCP(this.sendToAnalytics);
    onTTFB(this.sendToAnalytics);

    // Custom performance marks
    this.monitorComponentRenders();
    this.monitorAPIcalls();
    this.monitorRouteChanges();
  }

  private sendToAnalytics = (metric: any) => {
    const { name, value, id } = metric;

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_label: id,
        non_interaction: true,
      });
    }

    // Also send to your backend
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value, id }),
    });

    // Check thresholds
    this.checkThreshold(name, value);
  };

  private checkThreshold(metric: string, value: number) {
    const thresholds: Record<string, { good: number; poor: number }> = {
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      FID: { good: 100, poor: 300 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 600, poor: 1500 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return;

    if (value > threshold.poor) {
      console.warn(`⚠️ Poor ${metric}: ${value}`);
      // Alert team if consistently poor
      this.reportPoorPerformance(metric, value);
    }
  }

  private monitorComponentRenders() {
    if (typeof window === 'undefined') return;

    // Use React DevTools Profiler API
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.startsWith('⚛')) {
          const duration = entry.duration;
          if (duration > 16) { // Longer than one frame (60fps)
            console.warn(`Slow render: ${entry.name} took ${duration.toFixed(2)}ms`);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  private monitorAPIcalls() {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const start = performance.now();
      const url = args[0] instanceof Request ? args[0].url : args[0];

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;

        this.trackAPICall(url.toString(), duration, response.status);

        return response;
      } catch (error) {
        const duration = performance.now() - start;
        this.trackAPICall(url.toString(), duration, 0, error);
        throw error;
      }
    };
  }

  private trackAPICall(url: string, duration: number, status: number, error?: any) {
    console.log(`API Call: ${url} - ${duration.toFixed(2)}ms - ${status}`);

    // Alert if slow
    if (duration > 2000) {
      console.warn(`⚠️ Slow API call: ${url} took ${duration.toFixed(2)}ms`);
    }

    // Track in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'api_call', {
        event_category: 'Performance',
        url,
        duration: Math.round(duration),
        status,
        error: error ? error.message : undefined,
      });
    }
  }

  private monitorRouteChanges() {
    if (typeof window === 'undefined') return;

    let routeStart = performance.now();

    window.addEventListener('popstate', () => {
      const duration = performance.now() - routeStart;
      console.log(`Route change took ${duration.toFixed(2)}ms`);
      routeStart = performance.now();
    });
  }

  private reportPoorPerformance(metric: string, value: number) {
    // Rate limit: only report once per hour
    const key = `poor-${metric}`;
    const lastReport = this.metrics.get(key);
    const now = Date.now();

    if (lastReport && now - lastReport < 3600000) {
      return; // Already reported in last hour
    }

    this.metrics.set(key, now);

    // Send to backend
    fetch('/api/analytics/poor-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric,
        value,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-init in browser
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}
```

---

## 🤖 **Phase 4: AI Training & Tuning**

### **4.1: Smart Matching Algorithm Improvement**

```typescript
// backend/src/modules/smart-matches/ml-training.ts
import { prisma } from '../../config/database';
import * as tf from '@tensorflow/tfjs-node';

export class SmartMatchingML {
  private model: tf.LayersModel | null = null;

  async trainModel() {
    console.log('🧠 Training Smart Matching Model...\n');

    // 1. Collect training data from historical matches
    const trainingData = await this.collectTrainingData();
    console.log(`Collected ${trainingData.length} training examples`);

    // 2. Prepare features and labels
    const { features, labels } = this.prepareData(trainingData);

    // 3. Create model
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [features[0].length], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    // 4. Compile model
    this.model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    // 5. Train
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    const history = await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        },
      },
    });

    // 6. Save model
    await this.model.save('file://./models/smart-matching');
    console.log('✅ Model trained and saved!');

    // 7. Evaluate
    await this.evaluateModel();
  }

  private async collectTrainingData() {
    // Get historical matches with their outcomes
    const matches = await prisma.smartMatch.findMany({
      where: {
        status: { in: ['ACCEPTED', 'REJECTED'] },
      },
      include: {
        offer: {
          include: { property: true },
        },
        request: true,
      },
    });

    return matches.map(match => ({
      // Features
      cityMatch: match.request.cities.includes(match.offer.property.city) ? 1 : 0,
      districtMatch: match.request.districts?.includes(match.offer.property.district) ? 1 : 0,
      propertyTypeMatch: match.request.propertyTypes.includes(match.offer.property.propertyType) ? 1 : 0,
      priceInRange: this.isInRange(
        match.offer.property.price,
        match.request.priceMin,
        match.request.priceMax
      ) ? 1 : 0,
      areaInRange: this.isInRange(
        match.offer.property.area,
        match.request.areaMin,
        match.request.areaMax
      ) ? 1 : 0,
      pricePerSqm: match.offer.property.price / match.offer.property.area,
      propertyAge: match.offer.property.propertyAge || 0,
      bedrooms: match.offer.property.bedrooms || 0,
      
      // Label
      accepted: match.status === 'ACCEPTED' ? 1 : 0,
    }));
  }

  private prepareData(data: any[]) {
    const features = data.map(d => [
      d.cityMatch,
      d.districtMatch,
      d.propertyTypeMatch,
      d.priceInRange,
      d.areaInRange,
      d.pricePerSqm / 10000, // Normalize
      d.propertyAge / 50, // Normalize
      d.bedrooms / 10, // Normalize
    ]);

    const labels = data.map(d => [d.accepted]);

    return { features, labels };
  }

  private isInRange(value: number, min?: number, max?: number): boolean {
    if (!min && !max) return true;
    if (min && value < min) return false;
    if (max && value > max) return false;
    return true;
  }

  async evaluateModel() {
    if (!this.model) {
      console.error('Model not loaded');
      return;
    }

    // Get test data
    const testData = await this.collectTrainingData();
    const { features, labels } = this.prepareData(testData.slice(0, 100));

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    const result = await this.model.evaluate(xs, ys) as tf.Scalar[];
    const accuracy = (await result[1].data())[0];

    console.log(`\n📊 Model Accuracy: ${(accuracy * 100).toFixed(2)}%`);

    if (accuracy < 0.85) {
      console.warn('⚠️ Model accuracy below 85%, needs more training');
    } else {
      console.log('✅ Model performing well!');
    }
  }

  async predict(features: number[]): Promise<number> {
    if (!this.model) {
      // Load model
      this.model = await tf.loadLayersModel('file://./models/smart-matching/model.json');
    }

    const xs = tf.tensor2d([features]);
    const prediction = this.model.predict(xs) as tf.Tensor;
    const score = (await prediction.data())[0];

    return score;
  }
}
```

---

## 🚀 **Phase 5: Continuous Deployment**

### **5.1: Automated Deployment Script**

```bash
#!/bin/bash
# deploy.sh - Automated deployment script

set -e  # Exit on error

echo "🚀 Nova CRM Deployment Script"
echo "════════════════════════════════════════"

# Configuration
ENVIRONMENT=${1:-staging}
RELEASE_VERSION=$(git describe --tags --always)
SLACK_WEBHOOK=$SLACK_WEBHOOK_URL

# Functions
notify_slack() {
  curl -X POST $SLACK_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"$1\"}"
}

# 1. Pre-deployment checks
echo "1️⃣ Running pre-deployment checks..."
npm run test || { echo "❌ Tests failed"; exit 1; }
npm run lint || { echo "❌ Lint failed"; exit 1; }
echo "✅ Pre-deployment checks passed"

# 2. Build
echo "2️⃣ Building application..."
cd backend
npm run build || { echo "❌ Backend build failed"; exit 1; }
cd ../frontend
npm run build || { echo "❌ Frontend build failed"; exit 1; }
cd ..
echo "✅ Build complete"

# 3. Database migrations
echo "3️⃣ Running database migrations..."
cd backend
npx prisma migrate deploy
echo "✅ Migrations complete"

# 4. Deploy backend
echo "4️⃣ Deploying backend..."
pm2 reload nova-backend --update-env
echo "✅ Backend deployed"

# 5. Deploy frontend
echo "5️⃣ Deploying frontend..."
aws s3 sync frontend/out/ s3://nova-crm-$ENVIRONMENT --delete
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"
echo "✅ Frontend deployed"

# 6. Smoke tests
echo "6️⃣ Running smoke tests..."
sleep 10  # Wait for deployment
curl -f https://api.nova-crm.com/health || { echo "❌ API health check failed"; exit 1; }
curl -f https://nova-crm.com || { echo "❌ Frontend health check failed"; exit 1; }
echo "✅ Smoke tests passed"

# 7. Tag release
echo "7️⃣ Tagging release..."
git tag -a "release-$RELEASE_VERSION" -m "Release $RELEASE_VERSION"
git push origin "release-$RELEASE_VERSION"
echo "✅ Release tagged"

# 8. Notify team
echo "8️⃣ Notifying team..."
notify_slack "🚀 Nova CRM deployed to $ENVIRONMENT (v$RELEASE_VERSION)"
echo "✅ Team notified"

echo "════════════════════════════════════════"
echo "✅ Deployment complete!"
echo "Version: $RELEASE_VERSION"
echo "Environment: $ENVIRONMENT"
echo "Time: $(date)"
```

---

## ✅ **POST-LAUNCH CHECKLIST**

```markdown
# Week 1 Post-Launch Checklist

## Day 1
- [ ] Monitor all metrics (every hour)
- [ ] Respond to all feedback
- [ ] Fix critical bugs
- [ ] Scale if needed

## Day 2
- [ ] Review overnight metrics
- [ ] Analyze user behavior
- [ ] Identify pain points
- [ ] Plan quick fixes

## Day 3
- [ ] Deploy quick wins
- [ ] Update documentation
- [ ] Collect more feedback
- [ ] Adjust monitoring

## Day 4-7
- [ ] Weekly review meeting
- [ ] Performance optimization
- [ ] Feature tuning
- [ ] AI training update

═════════════════════════════════════
✅ SYSTEM RUNNING SMOOTHLY
═════════════════════════════════════
```

---

📄 **File:** `/POST-LAUNCH-OPERATIONS-GUIDE.md`  
🎯 **Coverage:** Complete post-launch operations  
⏱️ **Timeline:** Ongoing after launch  
✅ **Status:** Production operations ready
