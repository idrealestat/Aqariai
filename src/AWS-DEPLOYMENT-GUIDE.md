# ☁️ **AWS Deployment Guide - Nova CRM**
## **Complete Production Deployment on AWS**

---

## 📋 **Prerequisites**

- AWS Account with admin access
- AWS CLI installed and configured
- Domain name (e.g., nova-crm.com)
- SSL Certificate (AWS ACM)
- Basic knowledge of AWS services

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         CloudFront (CDN) + ACM (SSL Certificate)        │
└─────────────────────────────────────────────────────────┘
                            ↓
              ┌─────────────┴─────────────┐
              ↓                           ↓
┌────────────────────────┐   ┌─────────────────────────┐
│   S3 (Frontend Build)   │   │  ALB (Load Balancer)    │
└────────────────────────┘   └─────────────────────────┘
                                          ↓
                            ┌─────────────┴─────────────┐
                            │   ECS / EC2 (Backend)     │
                            │   - Node.js API           │
                            │   - Socket.io             │
                            └─────────────┬─────────────┘
                                          ↓
              ┌───────────────────────────┼───────────────────────────┐
              ↓                           ↓                           ↓
┌────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  RDS PostgreSQL    │   │  ElastiCache Redis  │   │      S3 Storage     │
│  (Multi-AZ)        │   │   (Cluster Mode)    │   │  (Images, Files)    │
└────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## 🚀 **Step 1: Setup VPC & Networking**

### **1.1 Create VPC:**

```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=nova-crm-vpc}]'

# Note the VPC ID (e.g., vpc-xxxxx)
export VPC_ID=vpc-xxxxx
```

### **1.2 Create Subnets:**

```bash
# Public Subnet 1 (us-east-1a)
aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nova-public-1a}]'

export PUBLIC_SUBNET_1=subnet-xxxxx

# Public Subnet 2 (us-east-1b)
aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nova-public-1b}]'

export PUBLIC_SUBNET_2=subnet-yyyyy

# Private Subnet 1 (us-east-1a)
aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.11.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nova-private-1a}]'

export PRIVATE_SUBNET_1=subnet-zzzzz

# Private Subnet 2 (us-east-1b)
aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.12.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nova-private-1b}]'

export PRIVATE_SUBNET_2=subnet-wwwww
```

### **1.3 Create Internet Gateway:**

```bash
# Create IGW
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=nova-igw}]'

export IGW_ID=igw-xxxxx

# Attach to VPC
aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID
```

### **1.4 Create Route Tables:**

```bash
# Public Route Table
aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nova-public-rt}]'

export PUBLIC_RT=rtb-xxxxx

# Add route to IGW
aws ec2 create-route \
  --route-table-id $PUBLIC_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID

# Associate with public subnets
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_1 --route-table-id $PUBLIC_RT
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_2 --route-table-id $PUBLIC_RT
```

### **1.5 Create NAT Gateway:**

```bash
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

export EIP_ALLOC=eipalloc-xxxxx

# Create NAT Gateway in public subnet
aws ec2 create-nat-gateway \
  --subnet-id $PUBLIC_SUBNET_1 \
  --allocation-id $EIP_ALLOC \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nova-nat}]'

export NAT_GW=nat-xxxxx

# Wait for NAT Gateway to be available
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW

# Create private route table
aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nova-private-rt}]'

export PRIVATE_RT=rtb-yyyyy

# Add route to NAT Gateway
aws ec2 create-route \
  --route-table-id $PRIVATE_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id $NAT_GW

# Associate with private subnets
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_1 --route-table-id $PRIVATE_RT
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_2 --route-table-id $PRIVATE_RT
```

---

## 🛡️ **Step 2: Security Groups**

### **2.1 ALB Security Group:**

```bash
aws ec2 create-security-group \
  --group-name nova-alb-sg \
  --description "Security group for ALB" \
  --vpc-id $VPC_ID

export ALB_SG=sg-xxxxx

# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### **2.2 ECS/EC2 Security Group:**

```bash
aws ec2 create-security-group \
  --group-name nova-backend-sg \
  --description "Security group for backend" \
  --vpc-id $VPC_ID

export BACKEND_SG=sg-yyyyy

# Allow traffic from ALB
aws ec2 authorize-security-group-ingress \
  --group-id $BACKEND_SG \
  --protocol tcp \
  --port 4000 \
  --source-group $ALB_SG
```

### **2.3 RDS Security Group:**

```bash
aws ec2 create-security-group \
  --group-name nova-rds-sg \
  --description "Security group for RDS" \
  --vpc-id $VPC_ID

export RDS_SG=sg-zzzzz

# Allow PostgreSQL from backend
aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG \
  --protocol tcp \
  --port 5432 \
  --source-group $BACKEND_SG
```

### **2.4 ElastiCache Security Group:**

```bash
aws ec2 create-security-group \
  --group-name nova-redis-sg \
  --description "Security group for Redis" \
  --vpc-id $VPC_ID

export REDIS_SG=sg-wwwww

# Allow Redis from backend
aws ec2 authorize-security-group-ingress \
  --group-id $REDIS_SG \
  --protocol tcp \
  --port 6379 \
  --source-group $BACKEND_SG
```

---

## 🗄️ **Step 3: RDS PostgreSQL**

### **3.1 Create DB Subnet Group:**

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name nova-db-subnet-group \
  --db-subnet-group-description "Subnet group for Nova CRM" \
  --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2 \
  --tags Key=Name,Value=nova-db-subnet-group
```

### **3.2 Create RDS Instance:**

```bash
aws rds create-db-instance \
  --db-instance-identifier nova-crm-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username novaadmin \
  --master-user-password "YourStrongPassword123!" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids $RDS_SG \
  --db-subnet-group-name nova-db-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted \
  --publicly-accessible false \
  --tags Key=Name,Value=nova-crm-db

# Wait for DB to be available (takes 5-10 minutes)
aws rds wait db-instance-available --db-instance-identifier nova-crm-db

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier nova-crm-db \
  --query "DBInstances[0].Endpoint.Address" \
  --output text

export DB_ENDPOINT=nova-crm-db.xxxxxx.us-east-1.rds.amazonaws.com
```

---

## 🚀 **Step 4: ElastiCache Redis**

### **4.1 Create Cache Subnet Group:**

```bash
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name nova-redis-subnet-group \
  --cache-subnet-group-description "Subnet group for Redis" \
  --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2
```

### **4.2 Create Redis Cluster:**

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id nova-crm-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-subnet-group-name nova-redis-subnet-group \
  --security-group-ids $REDIS_SG \
  --tags Key=Name,Value=nova-crm-redis

# Wait for cache cluster
aws elasticache wait cache-cluster-available --cache-cluster-id nova-crm-redis

# Get endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id nova-crm-redis \
  --query "CacheClusters[0].CacheNodes[0].Endpoint.Address" \
  --output text

export REDIS_ENDPOINT=nova-crm-redis.xxxxxx.0001.use1.cache.amazonaws.com
```

---

## 📦 **Step 5: S3 Buckets**

### **5.1 Create Frontend Bucket:**

```bash
# Create bucket
aws s3 mb s3://nova-crm-frontend

# Configure for static website
aws s3 website s3://nova-crm-frontend \
  --index-document index.html \
  --error-document index.html

# Block public access (CloudFront will access it)
aws s3api put-public-access-block \
  --bucket nova-crm-frontend \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### **5.2 Create Storage Bucket:**

```bash
# Create bucket for user uploads
aws s3 mb s3://nova-crm-storage

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket nova-crm-storage \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket nova-crm-storage \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

# CORS configuration
aws s3api put-bucket-cors \
  --bucket nova-crm-storage \
  --cors-configuration file://cors.json
```

**cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://nova-crm.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

## 🔐 **Step 6: IAM Roles**

### **6.1 ECS Task Execution Role:**

```bash
# Create role
aws iam create-role \
  --role-name nova-ecs-task-execution-role \
  --assume-role-policy-document file://ecs-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name nova-ecs-task-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

**ecs-trust-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### **6.2 ECS Task Role (for S3 access):**

```bash
# Create role
aws iam create-role \
  --role-name nova-ecs-task-role \
  --assume-role-policy-document file://ecs-trust-policy.json

# Create custom policy
aws iam create-policy \
  --policy-name nova-s3-access \
  --policy-document file://s3-policy.json

# Attach policy
aws iam attach-role-policy \
  --role-name nova-ecs-task-role \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/nova-s3-access
```

**s3-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::nova-crm-storage/*",
        "arn:aws:s3:::nova-crm-storage"
      ]
    }
  ]
}
```

---

## 🐳 **Step 7: ECS Cluster**

### **7.1 Create ECS Cluster:**

```bash
aws ecs create-cluster --cluster-name nova-crm-cluster
```

### **7.2 Create Task Definition:**

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

**task-definition.json:**
```json
{
  "family": "nova-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/nova-ecs-task-execution-role",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/nova-ecs-task-role",
  "containerDefinitions": [
    {
      "name": "nova-backend",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nova-backend:latest",
      "portMappings": [
        {
          "containerPort": 4000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "4000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nova/db-url"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nova/redis-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nova/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nova-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### **7.3 Create CloudWatch Log Group:**

```bash
aws logs create-log-group --log-group-name /ecs/nova-backend
```

---

## ⚖️ **Step 8: Application Load Balancer**

### **8.1 Create ALB:**

```bash
aws elbv2 create-load-balancer \
  --name nova-alb \
  --subnets $PUBLIC_SUBNET_1 $PUBLIC_SUBNET_2 \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

export ALB_ARN=arn:aws:elasticloadbalancing:...
```

### **8.2 Create Target Group:**

```bash
aws elbv2 create-target-group \
  --name nova-backend-tg \
  --protocol HTTP \
  --port 4000 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30

export TG_ARN=arn:aws:elasticloadbalancing:...
```

### **8.3 Create Listeners:**

```bash
# HTTP Listener (redirect to HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"

# HTTPS Listener
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/xxxxx \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN
```

---

## 🚀 **Step 9: ECS Service**

```bash
aws ecs create-service \
  --cluster nova-crm-cluster \
  --service-name nova-backend-service \
  --task-definition nova-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1,$PRIVATE_SUBNET_2],securityGroups=[$BACKEND_SG],assignPublicIp=DISABLED}" \
  --load-balancers targetGroupArn=$TG_ARN,containerName=nova-backend,containerPort=4000 \
  --health-check-grace-period-seconds 60
```

---

## 🌐 **Step 10: CloudFront & Route 53**

### **10.1 Create CloudFront Distribution:**

```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**
```json
{
  "CallerReference": "nova-crm-2024",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-nova-crm-frontend",
        "DomainName": "nova-crm-frontend.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-nova-crm-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "Enabled": true,
  "Aliases": {
    "Quantity": 1,
    "Items": ["nova-crm.com"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/xxxxx",
    "SSLSupportMethod": "sni-only"
  }
}
```

### **10.2 Configure Route 53:**

```bash
# Create hosted zone (if not exists)
aws route53 create-hosted-zone --name nova-crm.com --caller-reference 2024-01-01

# Create A record for frontend
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch file://frontend-record.json

# Create A record for API
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch file://api-record.json
```

---

## 💰 **Cost Estimation**

### **Monthly Costs (Approximate):**

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **ECS Fargate** | 2 tasks × 0.5 vCPU, 1GB RAM | ~$30 |
| **RDS PostgreSQL** | db.t3.micro (Multi-AZ) | ~$30 |
| **ElastiCache Redis** | cache.t3.micro | ~$15 |
| **ALB** | Application Load Balancer | ~$20 |
| **NAT Gateway** | 1 NAT Gateway | ~$35 |
| **S3** | 50GB storage + transfer | ~$5 |
| **CloudFront** | 100GB transfer | ~$10 |
| **Route 53** | 1 hosted zone | ~$0.50 |
| **Secrets Manager** | 3 secrets | ~$1.20 |
| **CloudWatch Logs** | 10GB logs | ~$5 |
| **Data Transfer** | Outbound | ~$10 |
| **TOTAL** | | **~$161.70/month** |

### **Production-Grade (Recommended):**

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **ECS Fargate** | 4 tasks × 1 vCPU, 2GB RAM | ~$120 |
| **RDS PostgreSQL** | db.t3.medium (Multi-AZ) | ~$130 |
| **ElastiCache Redis** | cache.t3.small (Cluster) | ~$50 |
| **ALB** | + WAF | ~$30 |
| **NAT Gateway** | 2 NAT Gateways (HA) | ~$70 |
| **S3** | 200GB + lifecycle policies | ~$10 |
| **CloudFront** | 500GB transfer | ~$40 |
| **Backups** | Automated backups | ~$20 |
| **Monitoring** | Enhanced monitoring | ~$30 |
| **TOTAL** | | **~$500/month** |

---

## 🔒 **Security Checklist**

- [ ] Enable MFA on AWS root account
- [ ] Use IAM roles (not access keys) for services
- [ ] Enable CloudTrail for audit logs
- [ ] Enable GuardDuty for threat detection
- [ ] Enable AWS Config for compliance
- [ ] Use Secrets Manager for sensitive data
- [ ] Enable VPC Flow Logs
- [ ] Configure AWS WAF rules
- [ ] Enable RDS encryption at rest
- [ ] Enable S3 bucket encryption
- [ ] Configure backup retention policies
- [ ] Set up billing alerts
- [ ] Implement least privilege IAM policies
- [ ] Enable DDoS protection (AWS Shield)
- [ ] Configure security groups (whitelist only)

---

## 📊 **Monitoring Setup**

### **CloudWatch Alarms:**

```bash
# CPU Utilization Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name nova-backend-high-cpu \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Database Connections Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name nova-db-high-connections \
  --alarm-description "Alert when connections > 80" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

---

## 🚀 **Deployment Commands**

### **Deploy Backend:**

```bash
# Build Docker image
docker build -t nova-backend ./backend

# Tag for ECR
docker tag nova-backend:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nova-backend:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nova-backend:latest

# Update ECS service
aws ecs update-service \
  --cluster nova-crm-cluster \
  --service nova-backend-service \
  --force-new-deployment
```

### **Deploy Frontend:**

```bash
# Build Next.js
cd frontend
npm run build

# Sync to S3
aws s3 sync out/ s3://nova-crm-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

---

## ✅ **Post-Deployment Verification**

```bash
# Check ALB health
curl https://api.nova-crm.com/health

# Check frontend
curl https://nova-crm.com

# Check database connection
psql -h $DB_ENDPOINT -U novaadmin -d nova_crm -c "SELECT 1;"

# Check Redis
redis-cli -h $REDIS_ENDPOINT ping
```

---

## 🔄 **Backup & Disaster Recovery**

### **Automated Backups:**

```bash
# RDS automated backups (already enabled, 7 days retention)

# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier nova-crm-db \
  --db-snapshot-identifier nova-crm-manual-backup-$(date +%Y%m%d)

# S3 versioning (already enabled)

# ElastiCache backup
aws elasticache create-snapshot \
  --cache-cluster-id nova-crm-redis \
  --snapshot-name nova-redis-backup-$(date +%Y%m%d)
```

---

## 📞 **Support & Troubleshooting**

### **View Logs:**

```bash
# ECS logs
aws logs tail /ecs/nova-backend --follow

# RDS error logs
aws rds download-db-log-file-portion \
  --db-instance-identifier nova-crm-db \
  --log-file-name error/postgresql.log.2024-01-01-00

# ALB logs (must enable first)
aws s3 ls s3://nova-alb-logs/
```

### **Common Issues:**

1. **503 Service Unavailable**
   - Check ECS tasks are running
   - Verify target group health checks

2. **Connection timeout to RDS**
   - Verify security group rules
   - Check VPC routing

3. **High costs**
   - Review CloudWatch metrics
   - Consider reserved instances
   - Enable S3 lifecycle policies

---

**✅ Deployment Complete!**

Your Nova CRM is now running on AWS with production-grade infrastructure! 🎉

---

📄 **File:** `/AWS-DEPLOYMENT-GUIDE.md`  
☁️ **Cloud:** Amazon Web Services  
💰 **Est. Cost:** $162-$500/month  
⏱️ **Setup Time:** 2-4 hours  
🎯 **Production Ready:** ✅
