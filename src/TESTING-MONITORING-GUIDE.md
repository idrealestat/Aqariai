# 🧪 **Testing & Monitoring Guide - Nova CRM**
## **Complete Testing Strategy + Production Monitoring**

---

## 📋 **Table of Contents**

1. [Testing Strategy](#testing-strategy)
2. [Test Automation](#test-automation)
3. [Performance Testing](#performance-testing)
4. [Security Testing](#security-testing)
5. [Monitoring Setup](#monitoring-setup)
6. [Alerting](#alerting)
7. [Logging](#logging)
8. [Analytics](#analytics)

---

## 🎯 **TESTING STRATEGY**

### **Testing Pyramid**

```
                  ▲
                 / \
                /   \
               /  E2E \          10% - End-to-End Tests
              /─────────\        (Playwright, Cypress)
             /           \
            / Integration \      30% - Integration Tests
           /───────────────\     (API, Database)
          /                 \
         /    Unit Tests      \  60% - Unit Tests
        /─────────────────────\ (Jest, Vitest)
```

### **Coverage Targets**

| Type | Target | Tools |
|------|--------|-------|
| Unit Tests | 80%+ | Jest, Vitest |
| Integration Tests | 70%+ | Supertest, Prisma |
| E2E Tests | Critical paths | Playwright |
| Performance | <100ms API | Autocannon, k6 |
| Security | 0 critical | OWASP ZAP, Snyk |

---

## 🧪 **TEST AUTOMATION**

### **1. Jest Configuration**

```javascript
// backend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/server.ts',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
```

---

### **2. Test Setup**

```typescript
// backend/src/__tests__/setup.ts
import { prisma } from '../config/database';

// Setup
beforeAll(async () => {
  // Reset test database
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE customers CASCADE`;
  // ... other tables
});

// Teardown
afterAll(async () => {
  await prisma.$disconnect();
});

// Mock external services
jest.mock('../services/twilio', () => ({
  sendSMS: jest.fn().mockResolvedValue({ sid: 'test-sid' }),
}));

jest.mock('../services/aws-s3', () => ({
  uploadFile: jest.fn().mockResolvedValue({ url: 'https://example.com/file.jpg' }),
}));
```

---

### **3. Component Testing (Frontend)**

```typescript
// frontend/src/components/__tests__/CustomerCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerCard } from '../CustomerCard';

const mockCustomer = {
  id: '1',
  name: 'Ahmed Test',
  phone: '0501234567',
  email: 'ahmed@test.com',
  category: 'مشتري',
  interestLevel: 'مهتم جداً',
  isVip: false,
  tags: ['جديد', 'محتمل'],
};

describe('CustomerCard', () => {
  it('renders customer information', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    expect(screen.getByText('Ahmed Test')).toBeInTheDocument();
    expect(screen.getByText('0501234567')).toBeInTheDocument();
    expect(screen.getByText('ahmed@test.com')).toBeInTheDocument();
    expect(screen.getByText('مشتري')).toBeInTheDocument();
  });

  it('shows VIP badge for VIP customers', () => {
    const vipCustomer = { ...mockCustomer, isVip: true };
    render(<CustomerCard customer={vipCustomer} />);
    
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<CustomerCard customer={mockCustomer} onEdit={onEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockCustomer.id);
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn();
    render(<CustomerCard customer={mockCustomer} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith(mockCustomer.id);
  });

  it('displays tags correctly', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    expect(screen.getByText('جديد')).toBeInTheDocument();
    expect(screen.getByText('محتمل')).toBeInTheDocument();
  });
});
```

---

### **4. E2E Test Suite**

```typescript
// frontend/tests/e2e/complete-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete CRM Workflow', () => {
  test('should complete full customer journey', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@nova.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // 2. Create Customer
    await page.goto('/crm/customers');
    await page.click('button:has-text("إضافة عميل")');
    await page.fill('input[name="name"]', 'E2E Test Customer');
    await page.fill('input[name="phone"]', '0501234567');
    await page.selectOption('select[name="category"]', 'مشتري');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=تم إضافة العميل بنجاح')).toBeVisible();

    // 3. Create Property
    await page.goto('/properties');
    await page.click('button:has-text("إضافة عقار")');
    await page.fill('input[name="title"]', 'فيلا اختبار');
    await page.selectOption('select[name="propertyType"]', 'فيلا');
    await page.fill('input[name="price"]', '1000000');
    await page.fill('input[name="area"]', '400');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=تم إضافة العقار بنجاح')).toBeVisible();

    // 4. Create Appointment
    await page.goto('/calendar');
    await page.click('button:has-text("موعد جديد")');
    await page.fill('input[name="title"]', 'معاينة فيلا');
    await page.fill('input[name="startDatetime"]', '2024-12-25T10:00');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=تم إنشاء الموعد بنجاح')).toBeVisible();

    // 5. Verify in Calendar
    const appointment = page.locator('text=معاينة فيلا');
    await expect(appointment).toBeVisible();

    // 6. Check Notifications
    await page.click('[data-testid="notifications-button"]');
    const notificationCount = await page.locator('[data-testid="notification-count"]').textContent();
    expect(parseInt(notificationCount || '0')).toBeGreaterThan(0);

    // 7. Check Analytics Dashboard
    await page.goto('/analytics');
    await expect(page.locator('text=إحصائيات شاملة')).toBeVisible();
    await expect(page.locator('[data-testid="total-customers"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-properties"]')).toBeVisible();
  });

  test('should handle smart matching flow', async ({ page }) => {
    await page.goto('/login');
    // ... login

    // Create Request
    await page.goto('/marketplace/requests');
    await page.click('button:has-text("إضافة طلب")');
    await page.selectOption('select[name="type"]', 'BUY');
    await page.fill('input[name="priceMin"]', '800000');
    await page.fill('input[name="priceMax"]', '1200000');
    await page.click('button[type="submit"]');

    // Wait for smart matches
    await page.waitForTimeout(2000);
    await page.goto('/smart-matches');

    // Verify matches appear
    const matches = page.locator('[data-testid="match-card"]');
    const matchCount = await matches.count();
    expect(matchCount).toBeGreaterThan(0);

    // Accept first match
    await matches.first().locator('button:has-text("قبول")').click();
    await expect(page.locator('text=تم قبول الفرصة')).toBeVisible();

    // Verify in Accepted Offers
    await page.goto('/offers/accepted');
    await expect(page.locator('text=فيلا اختبار')).toBeVisible();
  });
});
```

---

## ⚡ **PERFORMANCE TESTING**

### **1. Load Testing with k6**

```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

const BASE_URL = 'http://localhost:4000/api';
let authToken = '';

export function setup() {
  // Login once
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    identifier: 'test@nova.com',
    password: 'Test1234!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  authToken = loginRes.json('token');
  return { authToken };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.authToken}`,
  };

  // Test 1: Get Customers
  const customersRes = http.get(`${BASE_URL}/customers`, { headers });
  check(customersRes, {
    'customers status is 200': (r) => r.status === 200,
    'customers response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test 2: Create Customer
  const customerData = {
    name: `Customer ${__VU}-${__ITER}`,
    phone: `05012345${Math.floor(Math.random() * 100)}`,
    email: `customer-${__VU}-${__ITER}@test.com`,
    category: 'مشتري',
  };

  const createRes = http.post(
    `${BASE_URL}/customers`,
    JSON.stringify(customerData),
    { headers }
  );

  check(createRes, {
    'create status is 201': (r) => r.status === 201,
    'create response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Test 3: Get Properties
  const propertiesRes = http.get(`${BASE_URL}/properties`, { headers });
  check(propertiesRes, {
    'properties status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function teardown(data) {
  // Cleanup if needed
}
```

**Run Load Test:**
```bash
k6 run tests/performance/load-test.js
```

---

### **2. Stress Testing**

```javascript
// tests/performance/stress-test.js
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // Push to breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'], // 99% under 3s (relaxed)
    http_req_failed: ['rate<0.05'],    // Error rate < 5% (relaxed)
  },
};

// Same tests as load test
```

---

## 🔒 **SECURITY TESTING**

### **1. OWASP ZAP Automation**

```yaml
# tests/security/zap-scan.yaml
env:
  contexts:
    - name: "Nova CRM"
      urls:
        - "http://localhost:4000"
      includePaths:
        - "http://localhost:4000/api/.*"
      excludePaths:
        - "http://localhost:4000/health"
      authentication:
        method: "json"
        parameters:
          loginUrl: "http://localhost:4000/api/auth/login"
          loginRequestData: '{"identifier":"test@nova.com","password":"Test1234!"}'
        verification:
          method: "response"
          pollFrequency: 60
          pollUnits: "requests"

jobs:
  - type: spider
    parameters:
      maxDuration: 5
      
  - type: activeScan
    parameters:
      policy: "API-scan"
      
  - type: passiveScan-wait
    parameters:
      maxDuration: 5

  - type: report
    parameters:
      template: "risk-confidence-html"
      reportDir: "reports"
      reportFile: "security-report"
```

**Run Security Scan:**
```bash
docker run -v $(pwd):/zap/wrk/:rw owasp/zap2docker-stable \
  zap-cli quick-scan --self-contained \
  -r security-report.html \
  http://localhost:4000
```

---

### **2. Dependency Scanning**

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Use Snyk
npx snyk test

# GitHub Dependabot (auto-enabled)
```

---

## 📊 **MONITORING SETUP**

### **1. Prometheus Metrics**

```typescript
// backend/src/middleware/metrics.ts
import promClient from 'prom-client';
import { Request, Response, NextFunction } from 'express';

const register = new promClient.Registry();

// Default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeUsers = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of currently active users',
});

const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeUsers);
register.registerMetric(databaseQueryDuration);

// Middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration.labels(req.method, route, res.statusCode.toString()).observe(duration);
    httpRequestTotal.labels(req.method, route, res.statusCode.toString()).inc();
  });

  next();
};

// Metrics endpoint
export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
```

---

### **2. CloudWatch Integration**

```typescript
// backend/src/config/cloudwatch.ts
import AWS from 'aws-sdk';

const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION,
});

export const publishMetric = async (metricName: string, value: number, unit: string = 'Count') => {
  const params = {
    Namespace: 'NovaCRM',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
      },
    ],
  };

  try {
    await cloudwatch.putMetricData(params).promise();
  } catch (error) {
    console.error('Failed to publish metric:', error);
  }
};

// Example usage
export const trackAPICall = (endpoint: string, duration: number, success: boolean) => {
  publishMetric(`API_${endpoint}_Duration`, duration, 'Milliseconds');
  publishMetric(`API_${endpoint}_${success ? 'Success' : 'Error'}`, 1);
};
```

---

### **3. Application Insights**

```typescript
// backend/src/config/app-insights.ts
import * as appInsights from 'applicationinsights';

appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(true)
  .start();

export const trackEvent = (name: string, properties?: { [key: string]: string }) => {
  appInsights.defaultClient.trackEvent({
    name,
    properties,
  });
};

export const trackMetric = (name: string, value: number) => {
  appInsights.defaultClient.trackMetric({
    name,
    value,
  });
};
```

---

## 🚨 **ALERTING**

### **1. CloudWatch Alarms**

```typescript
// infrastructure/monitoring/cloudwatch-alarms.ts
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class MonitoringStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // SNS Topic for alerts
    const alertTopic = new sns.Topic(this, 'AlertTopic', {
      displayName: 'Nova CRM Alerts',
    });

    alertTopic.addSubscription(
      new subscriptions.EmailSubscription('devops@nova-crm.com')
    );

    // API Error Rate Alarm
    new cloudwatch.Alarm(this, 'APIErrorRateAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ApplicationELB',
        metricName: 'HTTPCode_Target_5XX_Count',
        statistic: 'Sum',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 10,
      evaluationPeriods: 2,
      alarmDescription: 'Alert when API error rate is high',
      actionsEnabled: true,
    }).addAlarmAction(new cloudwatch_actions.SnsAction(alertTopic));

    // Database Connection Alarm
    new cloudwatch.Alarm(this, 'DatabaseConnectionAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'DatabaseConnections',
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      alarmDescription: 'Alert when database connections are high',
    }).addAlarmAction(new cloudwatch_actions.SnsAction(alertTopic));

    // CPU Utilization Alarm
    new cloudwatch.Alarm(this, 'CPUAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ECS',
        metricName: 'CPUUtilization',
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 3,
      alarmDescription: 'Alert when CPU is high',
    }).addAlarmAction(new cloudwatch_actions.SnsAction(alertTopic));
  }
}
```

---

### **2. PagerDuty Integration**

```typescript
// backend/src/services/pagerduty.ts
import axios from 'axios';

const PAGERDUTY_API_KEY = process.env.PAGERDUTY_API_KEY;
const PAGERDUTY_SERVICE_ID = process.env.PAGERDUTY_SERVICE_ID;

export const triggerIncident = async (
  title: string,
  severity: 'critical' | 'error' | 'warning',
  details: any
) => {
  try {
    await axios.post(
      'https://api.pagerduty.com/incidents',
      {
        incident: {
          type: 'incident',
          title,
          service: {
            id: PAGERDUTY_SERVICE_ID,
            type: 'service_reference',
          },
          urgency: severity === 'critical' ? 'high' : 'low',
          body: {
            type: 'incident_body',
            details: JSON.stringify(details),
          },
        },
      },
      {
        headers: {
          'Authorization': `Token token=${PAGERDUTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to trigger PagerDuty incident:', error);
  }
};
```

---

## 📝 **LOGGING**

### **Winston Logger Setup**

```typescript
// backend/src/config/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'nova-crm-backend' },
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // Error logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // Combined logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Production: also send to CloudWatch
if (process.env.NODE_ENV === 'production') {
  // Add CloudWatch transport
}

export default logger;
```

---

## ✅ **TESTING CHECKLIST**

```markdown
# Pre-Production Testing Checklist

## Unit Tests
- [ ] Auth module (login, register, JWT)
- [ ] Customers CRUD
- [ ] Properties CRUD
- [ ] Smart Matches algorithm
- [ ] Appointments logic
- [ ] Tasks management
- [ ] Notifications
- [ ] All utility functions

## Integration Tests
- [ ] API endpoints (100+ tests)
- [ ] Database operations
- [ ] File uploads
- [ ] Email/SMS sending
- [ ] Payment processing
- [ ] Real-time events

## E2E Tests
- [ ] User registration flow
- [ ] Login/logout
- [ ] Customer management
- [ ] Property creation
- [ ] Smart matching flow
- [ ] Appointment scheduling
- [ ] Task creation
- [ ] Notifications

## Performance Tests
- [ ] Load test (100+ concurrent users)
- [ ] Stress test (find breaking point)
- [ ] Endurance test (24 hours)
- [ ] Spike test (sudden traffic)
- [ ] Database query performance

## Security Tests
- [ ] OWASP Top 10
- [ ] SQL injection
- [ ] XSS attacks
- [ ] CSRF protection
- [ ] Authentication bypass
- [ ] Authorization checks
- [ ] Dependency vulnerabilities
- [ ] API rate limiting

## Monitoring
- [ ] Metrics collection
- [ ] Logging setup
- [ ] Alert configuration
- [ ] Dashboard creation
- [ ] Error tracking
- [ ] Performance monitoring

## Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Device Testing
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile (iOS)
- [ ] Mobile (Android)

✅ ALL TESTS PASSING = READY FOR PRODUCTION
```

---

📄 **File:** `/TESTING-MONITORING-GUIDE.md`  
🎯 **Coverage:** Complete Testing + Monitoring  
🧪 **Tools:** Jest, Playwright, k6, Prometheus  
✅ **Production:** Enterprise-grade
