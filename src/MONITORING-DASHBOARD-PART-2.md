# 📊 **MONITORING DASHBOARD - PART 2**
## **Dashboard Frontend + Alert System + Analytics**

---

# 3️⃣ **DASHBOARD FRONTEND**

## **Monitoring Dashboard Page**

File: `frontend/src/app/(dashboard)/admin/monitoring/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Database, Cpu, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Real-Time Monitoring Dashboard
 */

interface MetricsSnapshot {
  timestamp: Date;
  system: {
    cpu: { usage: number };
    memory: { usagePercent: number };
  };
  api: {
    avgResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  };
  database: {
    avgQueryTime: number;
    totalQueries: number;
  };
  socket: {
    activeConnections: number;
    eventsPerMinute: number;
  };
}

export default function MonitoringDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<MetricsSnapshot | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // ============================================
  // CONNECT TO REAL-TIME UPDATES
  // ============================================

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
    });

    socketInstance.on('connect', () => {
      console.log('📊 Connected to monitoring socket');
      
      // Subscribe to metrics
      socketInstance.emit('subscribe:monitoring');
    });

    socketInstance.on('metrics:snapshot', (data: MetricsSnapshot) => {
      setCurrentMetrics(data);
      
      // Add to historical data (keep last 60 points = 2 minutes at 2s interval)
      setHistoricalData((prev) => {
        const updated = [...prev, data];
        return updated.slice(-60);
      });
    });

    socketInstance.on('alert', (alert: any) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // ============================================
  // FETCH INITIAL DATA
  // ============================================

  useEffect(() => {
    fetchHistoricalData();
    fetchAlerts();
  }, []);

  async function fetchHistoricalData() {
    const res = await fetch('/api/monitoring/historical?hours=1', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    const { data } = await res.json();
    setHistoricalData(data);
  }

  async function fetchAlerts() {
    const res = await fetch('/api/monitoring/alerts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    const { data } = await res.json();
    setAlerts(data);
  }

  // ============================================
  // RENDER
  // ============================================

  if (!currentMetrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">جاري تحميل بيانات المراقبة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة المراقبة</h1>
          <p className="text-gray-600">مراقبة الأداء في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">متصل</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <StatCard
          title="استخدام المعالج"
          value={`${currentMetrics.system.cpu.usage.toFixed(1)}%`}
          icon={<Cpu className="h-6 w-6" />}
          color={currentMetrics.system.cpu.usage > 80 ? 'red' : 'blue'}
          trend={currentMetrics.system.cpu.usage > 80 ? 'up' : 'stable'}
        />

        {/* Memory Usage */}
        <StatCard
          title="استخدام الذاكرة"
          value={`${currentMetrics.system.memory.usagePercent.toFixed(1)}%`}
          icon={<HardDrive className="h-6 w-6" />}
          color={currentMetrics.system.memory.usagePercent > 80 ? 'red' : 'blue'}
          trend={currentMetrics.system.memory.usagePercent > 80 ? 'up' : 'stable'}
        />

        {/* API Response Time */}
        <StatCard
          title="متوسط زمن الاستجابة"
          value={`${currentMetrics.api.avgResponseTime}ms`}
          icon={<Activity className="h-6 w-6" />}
          color={currentMetrics.api.avgResponseTime > 500 ? 'red' : 'green'}
          trend={currentMetrics.api.avgResponseTime > 500 ? 'up' : 'down'}
        />

        {/* Database Query Time */}
        <StatCard
          title="متوسط استعلامات قاعدة البيانات"
          value={`${currentMetrics.database.avgQueryTime}ms`}
          icon={<Database className="h-6 w-6" />}
          color={currentMetrics.database.avgQueryTime > 500 ? 'red' : 'green'}
          trend={currentMetrics.database.avgQueryTime > 500 ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response Time Chart */}
        <ChartCard title="زمن استجابة API">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(time) =>
                  new Date(time).toLocaleTimeString('ar-SA')
                }
              />
              <Area
                type="monotone"
                dataKey="api.avgResponseTime"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                name="زمن الاستجابة (ms)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Database Query Time Chart */}
        <ChartCard title="زمن استعلامات قاعدة البيانات">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="database.avgQueryTime"
                stroke="#10b981"
                name="زمن الاستعلام (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CPU & Memory Chart */}
        <ChartCard title="استخدام الموارد">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="system.cpu.usage"
                stroke="#f59e0b"
                name="المعالج (%)"
              />
              <Line
                type="monotone"
                dataKey="system.memory.usagePercent"
                stroke="#8b5cf6"
                name="الذاكرة (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests & Errors Chart */}
        <ChartCard title="الطلبات والأخطاء">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="left" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="api.requestsPerMinute"
                fill="#3b82f6"
                name="الطلبات/دقيقة"
              />
              <Bar
                yAxisId="right"
                dataKey="api.errorRate"
                fill="#ef4444"
                name="معدل الأخطاء (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          التنبيهات
        </h2>

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>لا توجد تنبيهات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <AlertItem key={idx} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function AlertItem({ alert }: { alert: any }) {
  const severityColors = {
    critical: 'bg-red-100 border-red-500 text-red-900',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    info: 'bg-blue-100 border-blue-500 text-blue-900',
  };

  return (
    <div
      className={`p-4 border-r-4 rounded ${
        severityColors[alert.severity as keyof typeof severityColors]
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{alert.message}</p>
          <p className="text-sm opacity-75">
            {new Date(alert.timestamp).toLocaleString('ar-SA')}
          </p>
        </div>
        <AlertTriangle className="h-5 w-5" />
      </div>
    </div>
  );
}
```

---

# 4️⃣ **ALERT SYSTEM**

## **Alert Manager Service**

File: `backend/src/services/alert-manager.service.ts`

```typescript
import { prisma } from '../lib/prisma';
import { metricsCollector } from './metrics-collector.service';
import { emailQueue } from './queue.service';

/**
 * Alert Manager Service
 * Manages alerts and notifications
 */

export interface Alert {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  data?: any;
  timestamp?: Date;
}

class AlertManager {
  private alertThresholds = {
    cpuUsage: 80,
    memoryUsage: 80,
    apiResponseTime: 500,
    dbQueryTime: 500,
    errorRate: 5,
    queueLength: 100,
  };

  private alertCooldowns = new Map<string, number>();
  private cooldownPeriod = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.setupListeners();
  }

  // ============================================
  // SETUP LISTENERS
  // ============================================

  private setupListeners(): void {
    metricsCollector.on('alert', (alert: Alert) => {
      this.handleAlert(alert);
    });
  }

  // ============================================
  // HANDLE ALERT
  // ============================================

  private async handleAlert(alert: Alert): Promise<void> {
    const alertKey = `${alert.type}:${alert.severity}`;

    // Check cooldown
    const lastAlertTime = this.alertCooldowns.get(alertKey);
    const now = Date.now();

    if (lastAlertTime && now - lastAlertTime < this.cooldownPeriod) {
      console.log(`⏸️  Alert ${alertKey} in cooldown, skipping`);
      return;
    }

    // Set cooldown
    this.alertCooldowns.set(alertKey, now);

    // Store alert
    await this.storeAlert(alert);

    // Send notifications
    await this.sendNotifications(alert);

    console.log(`🚨 Alert triggered: ${alert.type} - ${alert.message}`);
  }

  // ============================================
  // STORE ALERT
  // ============================================

  private async storeAlert(alert: Alert): Promise<void> {
    try {
      await prisma.alert.create({
        data: {
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          data: alert.data ? JSON.stringify(alert.data) : null,
          status: 'active',
        },
      });
    } catch (error) {
      console.error('Failed to store alert:', error);
    }
  }

  // ============================================
  // SEND NOTIFICATIONS
  // ============================================

  private async sendNotifications(alert: Alert): Promise<void> {
    // Send email for critical alerts
    if (alert.severity === 'critical') {
      await emailQueue.add({
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 تنبيه حرج: ${alert.type}`,
        body: `
          <h2>تنبيه حرج</h2>
          <p><strong>النوع:</strong> ${alert.type}</p>
          <p><strong>الرسالة:</strong> ${alert.message}</p>
          <p><strong>الوقت:</strong> ${new Date().toLocaleString('ar-SA')}</p>
        `,
      });
    }

    // Send to Slack/Teams (if configured)
    if (process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackNotification(alert);
    }
  }

  // ============================================
  // SEND SLACK NOTIFICATION
  // ============================================

  private async sendSlackNotification(alert: Alert): Promise<void> {
    try {
      const color = alert.severity === 'critical' ? 'danger' : 'warning';

      await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachments: [
            {
              color,
              title: `🚨 ${alert.type}`,
              text: alert.message,
              fields: [
                {
                  title: 'Severity',
                  value: alert.severity,
                  short: true,
                },
                {
                  title: 'Time',
                  value: new Date().toISOString(),
                  short: true,
                },
              ],
            },
          ],
        }),
      });
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }

  // ============================================
  // ACKNOWLEDGE ALERT
  // ============================================

  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: 'acknowledged',
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
    });
  }

  // ============================================
  // RESOLVE ALERT
  // ============================================

  async resolveAlert(alertId: string, userId: string): Promise<void> {
    await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: 'resolved',
        resolvedBy: userId,
        resolvedAt: new Date(),
      },
    });
  }

  // ============================================
  // GET ACTIVE ALERTS
  // ============================================

  async getActiveAlerts(): Promise<any[]> {
    return await prisma.alert.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const alertManager = new AlertManager();
```

---

**(يتبع في Part 3...)**

📄 **File:** `/MONITORING-DASHBOARD-PART-2.md`  
🎯 **Next:** Historical Analytics + Deployment + Complete Setup
