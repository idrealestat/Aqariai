# 🚀 **FULL DETAILED SYSTEM UPDATE - PART 6 (FINAL)**
## **Complete Testing Suite + Deployment Scripts + Production Setup**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🎯 FINAL PART - COMPLETE SYSTEM READY 🎯             ║
║                                                               ║
║  ✅ Complete Testing Suite                                   ║
║  ✅ Load Testing Scripts (K6)                                ║
║  ✅ E2E Integration Tests                                    ║
║  ✅ Security Penetration Tests                               ║
║  ✅ Production Deployment Scripts                            ║
║  ✅ Docker + Nginx Configuration                             ║
║  ✅ Complete Setup Commands                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# **COMPLETE E2E INTEGRATION TESTS**

File: `backend/tests/e2e/complete-integration.test.ts`

```typescript
import request from 'supertest';
import { app } from '../../src/server';
import { prisma } from '../../src/lib/prisma';
import { EnhancedCacheService } from '../../src/services/enhanced-cache.service';

/**
 * Complete E2E Integration Tests
 * Tests all 7 features and their integrations
 */

describe('Complete E2E Integration Tests', () => {
  let authToken: string;
  let userId: string;
  let customerId: string;
  let propertyId: string;
  let saleId: string;
  let appointmentId: string;

  beforeAll(async () => {
    // Clear cache
    await EnhancedCacheService.deletePattern('*');

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'demo@novacrm.com',
        password: 'Demo@123',
      });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.data.accessToken;
    userId = loginRes.body.data.user.id;
  });

  // ============================================
  // TEST FLOW 1: Customer → Sale → Commission
  // ============================================

  describe('Flow 1: Customer to Sale to Commission', () => {
    it('should create a customer', async () => {
      const res = await request(app)
        .post('/api/crm/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Customer',
          phone: '0512345678',
          email: 'test@example.com',
          status: 'new',
          priority: 'high',
          budget: 500000,
          notes: 'Integration test customer',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');

      customerId = res.body.data.id;
    });

    it('should add interaction to customer', async () => {
      const res = await request(app)
        .post('/api/crm/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerId,
          type: 'call',
          notes: 'Initial contact call',
          duration: 15,
          outcome: 'Interested in property',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should create a sale for customer', async () => {
      const res = await request(app)
        .post('/api/finance/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerId,
          saleType: 'sale',
          saleAmount: 500000,
          commissionRate: 2.5,
          paymentMethod: 'bank_transfer',
          notes: 'Integration test sale',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.commissionAmount).toBe(12500);

      saleId = res.body.data.id;
    });

    it('should create commission automatically', async () => {
      const res = await request(app)
        .get(`/api/finance/commissions?saleId=${saleId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.commissions.length).toBeGreaterThan(0);
      expect(res.body.data.commissions[0].amount).toBe(12500);
    });

    it('should update customer status to converted', async () => {
      const res = await request(app)
        .get(`/api/crm/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('converted');
    });
  });

  // ============================================
  // TEST FLOW 2: Property → Match → Notification
  // ============================================

  describe('Flow 2: Property Matching', () => {
    it('should create a property', async () => {
      const res = await request(app)
        .post('/api/owners/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Villa',
          description: 'Beautiful villa for test',
          propertyType: 'villa',
          price: 800000,
          area: 300,
          location: 'Riyadh',
          city: 'Riyadh',
          neighborhood: 'Al Malqa',
          bedrooms: 5,
          bathrooms: 4,
          features: ['pool', 'garden'],
          status: 'available',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      propertyId = res.body.data.id;
    });

    it('should create a seeker request', async () => {
      const res = await request(app)
        .post('/api/seekers/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          propertyType: 'villa',
          minPrice: 700000,
          maxPrice: 900000,
          minArea: 250,
          maxArea: 350,
          city: 'Riyadh',
          neighborhoods: ['Al Malqa', 'Al Nakheel'],
          bedrooms: 5,
          features: ['pool'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should find property matches', async () => {
      // Trigger matching algorithm
      const res = await request(app)
        .post('/api/matching/find-matches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ propertyId });

      expect(res.status).toBe(200);
      expect(res.body.data.matches.length).toBeGreaterThan(0);
      expect(res.body.data.matches[0].matchScore).toBeGreaterThan(80);
    });
  });

  // ============================================
  // TEST FLOW 3: Appointment → Interaction → Followup
  // ============================================

  describe('Flow 3: Appointment Management', () => {
    it('should create an appointment', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);

      const res = await request(app)
        .post('/api/calendar/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerId,
          title: 'Property Viewing',
          description: 'Show villa to customer',
          location: 'Al Malqa',
          startTime: tomorrow.toISOString(),
          endTime: endTime.toISOString(),
          type: 'viewing',
          reminderMinutes: 30,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      appointmentId = res.body.data.id;
    });

    it('should complete appointment and create interaction', async () => {
      const res = await request(app)
        .post(`/api/calendar/appointments/${appointmentId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          outcome: 'Customer liked the property',
          notes: 'Very interested, will decide soon',
          createFollowup: true,
          followupDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should have created followup', async () => {
      const res = await request(app)
        .get(`/api/crm/followups?customerId=${customerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.followups.length).toBeGreaterThan(0);
      expect(res.body.data.followups[0].status).toBe('pending');
    });
  });

  // ============================================
  // TEST FLOW 4: Digital Card → Lead Capture
  // ============================================

  describe('Flow 4: Digital Card Lead Capture', () => {
    let cardId: string;
    let cardSlug: string;

    it('should create digital card', async () => {
      const res = await request(app)
        .post('/api/cards/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Broker',
          title: 'Real Estate Broker',
          company: 'Nova CRM',
          email: 'test@novacrm.com',
          phone: '0512345678',
          whatsapp: '0512345678',
          website: 'https://novacrm.com',
          bio: 'Professional real estate broker',
          theme: 'modern',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      cardId = res.body.data.id;
      cardSlug = res.body.data.slug;
    });

    it('should scan card and capture lead', async () => {
      const res = await request(app)
        .post(`/api/cards/${cardSlug}/scan`)
        .send({
          leadData: {
            name: 'Potential Customer',
            phone: '0599999999',
            email: 'potential@example.com',
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should have created customer from lead', async () => {
      const res = await request(app)
        .get('/api/crm/customers?source=digital_card')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.customers.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // TEST FLOW 5: Analytics & Reports
  // ============================================

  describe('Flow 5: Analytics and Reports', () => {
    it('should get dashboard analytics', async () => {
      const res = await request(app)
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalCustomers');
      expect(res.body.data).toHaveProperty('totalSales');
      expect(res.body.data).toHaveProperty('totalCommissions');
    });

    it('should generate sales report', async () => {
      const res = await request(app)
        .post('/api/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'sales',
          title: 'Monthly Sales Report',
          filters: {
            dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            dateTo: new Date(),
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.report).toHaveProperty('totalSales');
    });
  });

  // ============================================
  // TEST TRANSACTION ROLLBACK
  // ============================================

  describe('Transaction Rollback', () => {
    it('should rollback on error', async () => {
      const initialCount = await prisma.customer.count({
        where: { userId },
      });

      // Try to create customer with duplicate phone
      try {
        await request(app)
          .post('/api/crm/customers')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Duplicate',
            phone: '0512345678', // Same as first customer
            email: 'duplicate@example.com',
          });
      } catch (error) {
        // Expected to fail
      }

      const finalCount = await prisma.customer.count({
        where: { userId },
      });

      // Count should be same (transaction rolled back)
      expect(finalCount).toBe(initialCount);
    });
  });

  // ============================================
  // TEST CACHE
  // ============================================

  describe('Caching', () => {
    it('should cache GET requests', async () => {
      // First request (cache miss)
      const start1 = Date.now();
      const res1 = await request(app)
        .get('/api/crm/customers')
        .set('Authorization', `Bearer ${authToken}`);
      const time1 = Date.now() - start1;

      expect(res1.status).toBe(200);

      // Second request (cache hit)
      const start2 = Date.now();
      const res2 = await request(app)
        .get('/api/crm/customers')
        .set('Authorization', `Bearer ${authToken}`);
      const time2 = Date.now() - start2;

      expect(res2.status).toBe(200);

      // Cache should be faster
      expect(time2).toBeLessThan(time1);
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });
});
```

---

# **LOAD TESTING SCRIPTS (K6)**

File: `tests/load/load-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

/**
 * K6 Load Testing Script
 * Tests system under 5000+ concurrent users
 */

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 500 },  // Ramp up to 500
    { duration: '5m', target: 500 },  // Stay at 500
    { duration: '2m', target: 1000 }, // Ramp up to 1000
    { duration: '5m', target: 1000 }, // Stay at 1000
    { duration: '5m', target: 2000 }, // Spike to 2000
    { duration: '5m', target: 5000 }, // Peak at 5000
    { duration: '10m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.05'],   // Error rate under 5%
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

let authToken = '';

export function setup() {
  // Login to get auth token
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'demo@novacrm.com',
    password: 'Demo@123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('data.accessToken');
  return { token };
}

export default function (data) {
  authToken = data.token;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  // Test 1: Get dashboard stats
  let res = http.get(`${BASE_URL}/api/crm/dashboard`, { headers });
  check(res, {
    'dashboard status 200': (r) => r.status === 200,
    'dashboard response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: Get customers list
  res = http.get(`${BASE_URL}/api/crm/customers?page=1&limit=20`, { headers });
  check(res, {
    'customers status 200': (r) => r.status === 200,
    'customers response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);

  // Test 3: Create customer
  res = http.post(`${BASE_URL}/api/crm/customers`, JSON.stringify({
    name: `Test Customer ${__VU}-${__ITER}`,
    phone: `05${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `test${__VU}${__ITER}@example.com`,
    status: 'new',
    priority: 'medium',
  }), { headers });

  check(res, {
    'create customer status 201': (r) => r.status === 201,
    'create customer response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);

  // Test 4: Get analytics
  res = http.get(`${BASE_URL}/api/analytics/dashboard`, { headers });
  check(res, {
    'analytics status 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(2);
}

export function teardown(data) {
  console.log('Load test completed');
}
```

---

# **DOCKER CONFIGURATION**

File: `Dockerfile`

```dockerfile
# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN cd backend && npx prisma generate

# Build backend
RUN cd backend && npm run build

# Build frontend
RUN cd frontend && npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/package*.json ./backend/

COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package*.json ./frontend/

# Install PM2
RUN npm install -g pm2

# Create PM2 ecosystem file
COPY ecosystem.config.js .

# Expose ports
EXPOSE 4000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node backend/dist/health-check.js || exit 1

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: nova-crm-postgres
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-nova_crm}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: nova-crm-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nova-crm-backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-nova_crm}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
    ports:
      - "4000:4000"
      - "3000:3000"
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

# **NGINX PRODUCTION CONFIGURATION**

File: `nginx.conf`

```nginx
upstream backend {
    least_conn;
    server localhost:4000;
    # Add more backend servers for load balancing
    # server localhost:4001;
    # server localhost:4002;
}

upstream frontend {
    least_conn;
    server localhost:3000;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

# Cache
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Max body size
    client_max_body_size 50M;

    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Auth endpoints with stricter rate limit
    location /api/auth/ {
        limit_req zone=auth_limit burst=3 nodelay;

        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeouts
        proxy_read_timeout 86400;
    }

    # Static files with caching
    location /_next/static/ {
        proxy_pass http://frontend;
        proxy_cache my_cache;
        proxy_cache_valid 200 30d;
        proxy_cache_valid 404 10m;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

**(Final Part Continues...)**
