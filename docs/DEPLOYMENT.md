# Deployment Guide

## Overview

This guide covers deploying the Psychologist Directory Platform to production across AWS, Vercel, and other cloud services.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CloudFront (CDN)                     │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┬──────────────────┐
    │                         │                  │
┌───▼──────┐            ┌─────▼────┐      ┌─────▼────┐
│  Vercel  │            │    S3    │      │ Route53  │
│Frontend  │            │  Assets  │      │  (DNS)   │
└──────────┘            └──────────┘      └──────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                ┌───▼────┐          ┌────▼────┐
                │  ECS   │          │  Backup │
                │Backend │          │   S3    │
                └───┬────┘          └─────────┘
                    │
            ┌───────┴───────┐
            │               │
        ┌───▼────┐     ┌────▼────┐
        │  RDS   │     │ Secrets  │
        │PostgreSQL    │ Manager  │
        └────────┘     └──────────┘
```

## 1. Frontend Deployment (Vercel)

Vercel is the optimal platform for Next.js applications with zero-config deployments.

### Prerequisites
- Vercel account (free or paid)
- GitHub repository connected
- Environment variables configured

### Steps

1. **Connect Git Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Select "Next.js" template
   - Connect GitHub account
   - Select the Website repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.psychologistdirectory.com/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=https://psychologistdirectory.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys on every push to main
   - Staging deployments created for pull requests

### Vercel Features
- Automatic SSL/TLS certificates
- Auto-scaling
- Edge caching and CDN
- Built-in analytics
- Serverless functions for API routes

---

## 2. Backend Deployment (AWS ECS)

AWS ECS provides container orchestration for the Express.js backend.

### Prerequisites
- AWS account
- Docker installed locally
- AWS CLI configured
- ECR (Elastic Container Registry) repository

### Step 1: Create Docker Image

Create `backend/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
ENV NODE_ENV=production
EXPOSE 5000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

Create `.dockerignore`:
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
dist
```

### Step 2: Build and Push to ECR

```bash
# Authenticate Docker with ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t psychologist-directory-backend:latest ./backend

# Tag image for ECR
docker tag psychologist-directory-backend:latest [AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/psychologist-directory-backend:latest

# Push to ECR
docker push [AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/psychologist-directory-backend:latest
```

### Step 3: Set Up ECS Cluster

```bash
# Create ECS Cluster
aws ecs create-cluster --cluster-name psychologist-directory-prod

# Create CloudWatch Log Group
aws logs create-log-group --log-group-name /ecs/psychologist-directory

# Create IAM Role for ECS Tasks
aws iam create-role --role-name ecsTaskRole --assume-role-policy-document file://trust-policy.json
```

### Step 4: Create Task Definition

Create `backend/ecs-task-definition.json`:
```json
{
  "family": "psychologist-directory-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "psychologist-directory-backend",
      "image": "[AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/psychologist-directory-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/psychologist-directory",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ],
      "secrets": [
        {
          "name": "DB_HOST",
          "valueFrom": "/psychologist-directory/db-host"
        },
        {
          "name": "DB_PASSWORD",
          "valueFrom": "/psychologist-directory/db-password"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "/psychologist-directory/jwt-secret"
        },
        {
          "name": "STRIPE_SECRET_KEY",
          "valueFrom": "/psychologist-directory/stripe-secret"
        }
      ]
    }
  ],
  "taskRoleArn": "arn:aws:iam::[AWS_ACCOUNT_ID]:role/ecsTaskRole"
}
```

### Step 5: Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://backend/ecs-task-definition.json
```

### Step 6: Create Service

```bash
aws ecs create-service \
  --cluster psychologist-directory-prod \
  --service-name psychologist-directory-backend \
  --task-definition psychologist-directory-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:[ACCOUNT]:targetgroup/psychologist-directory/xxxx,containerName=psychologist-directory-backend,containerPort=5000"
```

### Step 7: Set Up Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/psychologist-directory-prod/psychologist-directory-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/psychologist-directory-prod/psychologist-directory-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

---

## 3. Database Deployment (AWS RDS)

Set up managed PostgreSQL database on AWS RDS.

### Step 1: Create RDS Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier psychologist-directory-prod \
  --db-instance-class db.t3.small \
  --engine postgres \
  --engine-version 15.3 \
  --master-username postgres \
  --master-user-password [SECURE_PASSWORD] \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports '["postgresql"]' \
  --deletion-protection
```

### Step 2: Create Database

```bash
# Connect to RDS instance
psql -h psychologist-directory-prod.xxxx.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d postgres

# Create application database
CREATE DATABASE psychologist_directory;

# Create application user
CREATE USER app_user WITH PASSWORD 'secure_password';

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE psychologist_directory TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;
```

### Step 3: Run Migrations

```bash
# From backend directory
DB_HOST=psychologist-directory-prod.xxxx.us-east-1.rds.amazonaws.com \
DB_USER=app_user \
DB_PASSWORD=secure_password \
DB_NAME=psychologist_directory \
npm run migrate
```

### Step 4: Set Up Backups

- Enable automated backups (30 days retention)
- Enable backup encryption
- Create manual snapshots before major deployments
- Test restore procedures quarterly

---

## 4. Storage Setup (AWS S3)

For profile pictures and documents.

```bash
# Create S3 bucket
aws s3api create-bucket \
  --bucket psychologist-directory-assets \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket psychologist-directory-assets \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket psychologist-directory-assets \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Configure CORS
aws s3api put-bucket-cors \
  --bucket psychologist-directory-assets \
  --cors-configuration file://cors-config.json

# Create CloudFront distribution
# Use AWS Console or AWS CLI to create distribution
```

---

## 5. DNS Configuration (Route53)

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name psychologistdirectory.com \
  --caller-reference $(date +%s)

# Create A record for frontend (Vercel)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "psychologistdirectory.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "cname.vercel-dns.com",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# Create CNAME record for API (ALB)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.psychologistdirectory.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "alb-xxx.us-east-1.elb.amazonaws.com"}]
      }
    }]
  }'
```

---

## 6. SSL/TLS Certificates

### Frontend (Vercel)
- Automatic SSL provisioning with Let's Encrypt
- Auto-renewal before expiration
- No action needed

### Backend (AWS Certificate Manager)
```bash
# Request certificate
aws acm request-certificate \
  --domain-name api.psychologistdirectory.com \
  --domain-name psychologistdirectory.com \
  --validation-method DNS

# Validate and attach to ALB
# Use AWS Console for validation and attachment
```

---

## 7. Monitoring and Logging

### CloudWatch
```bash
# Create Dashboard
aws cloudwatch put-dashboard \
  --dashboard-name psychologist-directory \
  --dashboard-body file://dashboard-config.json

# Create Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name backend-cpu-high \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Application Insights
- Use X-Ray for API tracing
- CloudWatch Logs Insights for log analysis
- Application Performance Monitoring (APM) tools

---

## 8. Security Best Practices

1. **Secrets Management**
   ```bash
   # Store secrets in AWS Secrets Manager
   aws secretsmanager create-secret \
     --name psychologist-directory/db-password \
     --secret-string "secure_password"
   ```

2. **VPC Security**
   - Private subnets for RDS
   - Security groups for ECS
   - Network ACLs for additional layer
   - VPC Flow Logs enabled

3. **IAM Policies**
   - Least privilege principle
   - Separate roles for frontend, backend, database
   - Audit trail enabled

4. **DDoS Protection**
   - AWS Shield Standard (automatic)
   - AWS WAF rules for API
   - CloudFront protection

---

## 9. CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and Push to ECR
        run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
          docker build -t psychologist-directory-backend ./backend
          docker tag psychologist-directory-backend ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/psychologist-directory-backend:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/psychologist-directory-backend:latest
      
      - name: Update ECS Service
        run: |
          aws ecs update-service --cluster psychologist-directory-prod --service psychologist-directory-backend --force-new-deployment
```

---

## 10. Disaster Recovery

1. **Backup Strategy**
   - Daily RDS snapshots (30-day retention)
   - Monthly S3 cross-region replication
   - Test restore monthly

2. **Failover Plan**
   - RDS Multi-AZ for automatic failover
   - ECS auto-scaling for high availability
   - ALB health checks every 30 seconds

3. **Recovery Time Objectives (RTO)**
   - Database: 15 minutes
   - API: 5 minutes
   - Frontend: < 1 minute (via Vercel)

---

## 11. Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to ECS
- [ ] Database migrations run successfully
- [ ] SSL certificates valid
- [ ] DNS records propagated
- [ ] Monitoring and alerts configured
- [ ] Backup procedures tested
- [ ] Load testing completed (target: 1000 concurrent users)
- [ ] Security audit completed
- [ ] Documentation updated

---

## Troubleshooting

### Common Issues

**ECS Task fails to start**
- Check CloudWatch Logs
- Verify environment variables
- Check security group rules
- Verify IAM role permissions

**Database connection errors**
- Verify security group allows access from ECS
- Check RDS parameter groups
- Verify database credentials
- Test connectivity from EC2 instance

**Frontend not connecting to API**
- Verify CORS configuration
- Check API URL in environment variables
- Verify ALB DNS name
- Check security group rules

---

## Rollback Procedure

```bash
# Rollback to previous ECS task definition
aws ecs update-service \
  --cluster psychologist-directory-prod \
  --service psychologist-directory-backend \
  --task-definition psychologist-directory-backend:1

# Verify rollback
aws ecs describe-services \
  --cluster psychologist-directory-prod \
  --services psychologist-directory-backend
```

---

**Last Updated**: August 23, 2026
**Next Review**: September 23, 2026
