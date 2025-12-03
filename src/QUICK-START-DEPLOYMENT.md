# 🚀 **QUICK START & DEPLOYMENT GUIDE**
## **Get Nova CRM Running in 15 Minutes**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         NOVA CRM - QUICK START & DEPLOYMENT GUIDE             ║
║                                                               ║
║  ⏱️  Setup Time: 15 minutes                                   ║
║  🎯 Production Ready                                          ║
║  ✅ Complete System Integration                               ║
║  📦 All 7 Features Included                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 📋 **TABLE OF CONTENTS**

1. [Prerequisites](#1-prerequisites)
2. [Quick Start (Development)](#2-quick-start-development)
3. [Production Deployment](#3-production-deployment)
4. [Docker Setup](#4-docker-setup)
5. [Monitoring & Maintenance](#5-monitoring--maintenance)

---

# 1️⃣ **PREREQUISITES**

## **Required Software**

```bash
# Node.js (v20.x or higher)
node --version  # Should output: v20.x.x

# PostgreSQL (v15 or higher)
psql --version  # Should output: psql (PostgreSQL) 15.x

# Redis (v7 or higher)
redis-server --version  # Should output: Redis server v=7.x

# npm or yarn
npm --version  # Should output: 10.x.x
```

## **Installation Commands**

### **macOS (using Homebrew)**

```bash
# Install Node.js
brew install node@20

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install Redis
brew install redis
brew services start redis

# Install Git
brew install git
```

### **Ubuntu/Debian**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install Git
sudo apt install git
```

### **Windows**

```powershell
# Install using Chocolatey
choco install nodejs-lts
choco install postgresql
choco install redis-64
choco install git
```

---

# 2️⃣ **QUICK START (DEVELOPMENT)**

## **Step 1: Clone & Install**

```bash
# Clone repository
git clone https://github.com/your-org/nova-crm.git
cd nova-crm

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

## **Step 2: Database Setup**

```bash
# Create database
createdb nova_crm

# Or using psql
psql -U postgres
CREATE DATABASE nova_crm;
\q

# Configure environment
cd backend
cp .env.example .env

# Edit .env file
# Update DATABASE_URL with your credentials:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/nova_crm"
```

## **Step 3: Run Migrations & Seed**

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run seed:all
```

**Expected Output:**
```
🌱 Seeding Users...
✅ Created demo user

🌱 Seeding CRM Core...
✅ Created 100 customers

🌱 Seeding Finance...
✅ Created 100 sales, 200+ payments

🌱 Seeding Owners & Seekers...
✅ Created 50 property owners, 30 seekers

🌱 Seeding Auto Publishing...
✅ Created 80 published listings

🌱 Seeding Calendar & Appointments...
✅ Created 100 appointments

🌱 Seeding Digital Business Cards...
✅ Created 21 digital cards

🌱 Seeding Reports & Analytics...
✅ Created 50 reports, 90 days analytics

╔═══════════════════════════════════════════════════════╗
║         ✨ ALL SEEDING COMPLETE! ✨                   ║
║  👤 Demo user: demo@novacrm.com / Demo@123           ║
╚═══════════════════════════════════════════════════════╝
```

## **Step 4: Start Development Servers**

### **Terminal 1: Backend**

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 4000
✅ Database connected
✅ Redis connected
⏰ Starting Reminder Service...
✅ Reminder Service started
📤 Starting Publishing Service...
✅ Publishing Service started
🔍 Starting Matching Service...
✅ Matching Service started
✅ All services started
```

### **Terminal 2: Frontend**

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Ready in 2.5s
```

### **Terminal 3: Redis (if not running as service)**

```bash
redis-server
```

## **Step 5: Access Application**

```
Frontend:  http://localhost:3000
Backend:   http://localhost:4000
API Docs:  http://localhost:4000/api-docs (if configured)

Demo Login:
Email:     demo@novacrm.com
Password:  Demo@123
```

---

# 3️⃣ **PRODUCTION DEPLOYMENT**

## **Option 1: VPS Deployment (Ubuntu)**

### **Server Requirements**

```
Minimum:
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- OS: Ubuntu 22.04 LTS

Recommended:
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB+ SSD
- OS: Ubuntu 22.04 LTS
```

### **Step 1: Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y nodejs npm postgresql redis-server nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### **Step 2: Deploy Application**

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-org/nova-crm.git
cd nova-crm

# Set permissions
sudo chown -R $USER:$USER /var/www/nova-crm

# Install dependencies
cd backend && npm ci --production
cd ../frontend && npm ci --production

# Build frontend
npm run build

# Configure environment
cd ../backend
cp .env.example .env
nano .env  # Edit with production values
```

### **Step 3: Database Setup (Production)**

```bash
# Create database user
sudo -u postgres psql
CREATE USER nova_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE nova_crm_prod OWNER nova_user;
GRANT ALL PRIVILEGES ON DATABASE nova_crm_prod TO nova_user;
\q

# Run migrations
cd /var/www/nova-crm/backend
npx prisma migrate deploy

# Seed production data (optional)
npm run seed:users  # Only create admin user
```

### **Step 4: Start with PM2**

```bash
# Backend
cd /var/www/nova-crm/backend
pm2 start npm --name "nova-backend" -- start

# Frontend
cd /var/www/nova-crm/frontend
pm2 start npm --name "nova-frontend" -- start

# Save PM2 config
pm2 save
pm2 startup
```

### **Step 5: Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/nova-crm
```

**Nginx Configuration:**

```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nova-crm /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **Step 6: SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## **Option 2: Docker Deployment**

### **Docker Compose Setup**

File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: nova_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: nova_crm
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nova_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://nova_user:${DB_PASSWORD}@postgres:5432/nova_crm
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 4000
    ports:
      - "4000:4000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run start

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    command: npm start

volumes:
  postgres_data:
  redis_data:
```

### **Backend Dockerfile**

File: `backend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

### **Frontend Dockerfile**

File: `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### **Deploy with Docker**

```bash
# Create .env file
cp .env.example .env

# Edit environment variables
nano .env

# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run seed:all

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

# 4️⃣ **DOCKER SETUP**

## **Complete Docker Files**

### **Docker Ignore**

File: `.dockerignore`

```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.next
dist
build
coverage
*.log
```

### **Docker Commands**

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose stop

# Remove everything
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build backend

# Execute commands
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run seed:all

# Check status
docker-compose ps
```

---

# 5️⃣ **MONITORING & MAINTENANCE**

## **Health Checks**

```bash
# Backend health
curl http://localhost:4000/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "uptime": 12345
# }

# Database connection
cd backend
npx prisma studio  # Opens in browser

# Redis connection
redis-cli ping  # Should return PONG

# PM2 status
pm2 status
pm2 logs
pm2 monit
```

## **Backup Strategy**

### **Database Backup**

```bash
# Create backup script
nano /home/user/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="nova_crm_prod"

mkdir -p $BACKUP_DIR

pg_dump -U nova_user $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/user/backup-db.sh
```

### **Restore Database**

```bash
# Restore from backup
gunzip -c /backups/postgres/backup_20240101_020000.sql.gz | psql -U nova_user nova_crm_prod
```

## **Log Management**

```bash
# PM2 logs
pm2 logs --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u postgresql
sudo journalctl -u redis-server
```

## **Performance Monitoring**

```bash
# Install monitoring tools
npm install -g pm2
pm2 install pm2-logrotate

# Monitor resources
pm2 monit

# System resources
htop
free -h
df -h
```

---

# 🎉 **QUICK REFERENCE**

## **Essential Commands**

```bash
# Development
npm run dev                    # Start dev server
npm run seed:all              # Seed all data
npx prisma studio             # Open database GUI

# Production
pm2 start npm --name app      # Start with PM2
pm2 restart app               # Restart
pm2 logs app                  # View logs
pm2 stop app                  # Stop

# Database
npx prisma migrate dev        # Create migration
npx prisma migrate deploy     # Deploy migration
npx prisma generate           # Generate client

# Docker
docker-compose up -d          # Start
docker-compose logs -f        # Logs
docker-compose down           # Stop
```

## **Default Credentials**

```
Demo User:
Email:    demo@novacrm.com
Password: Demo@123

Database:
User:     nova_user
Database: nova_crm
Port:     5432

Redis:
Port:     6379
```

---

# ✅ **CHECKLIST**

## **Development Setup**
- [ ] Node.js installed
- [ ] PostgreSQL installed
- [ ] Redis installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Database created
- [ ] Migrations run
- [ ] Data seeded
- [ ] Backend running
- [ ] Frontend running
- [ ] Can login with demo user

## **Production Deployment**
- [ ] Server provisioned
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Database secured
- [ ] Environment variables set
- [ ] Application deployed
- [ ] PM2/Docker running
- [ ] Nginx configured
- [ ] Backups scheduled
- [ ] Monitoring setup

---

# 🎊 **SUCCESS!**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║      🎉 NOVA CRM IS NOW RUNNING! 🎉                          ║
║                                                               ║
║  ✅ All 7 Features Integrated                                 ║
║  ✅ Database Seeded with Sample Data                          ║
║  ✅ Real-Time Services Active                                 ║
║  ✅ Ready for Development/Production                          ║
║                                                               ║
║  📱 Frontend: http://localhost:3000                           ║
║  🔌 Backend:  http://localhost:4000                           ║
║  👤 Login:    demo@novacrm.com / Demo@123                     ║
║                                                               ║
║         Happy Coding! 🚀                                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

**Need Help?**
- Documentation: Check all 56 feature documentation files
- Issues: Create an issue in the repository
- Support: Contact your development team

**🎯 You now have a complete, production-ready CRM system!**
