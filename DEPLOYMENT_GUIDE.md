# 🚀 Maroc-Cart Deployment Guide

## 📋 Overview
This guide provides comprehensive instructions for deploying Maroc-Cart e-commerce application with all enhanced features.

## 🏗️ Architecture
- **Backend**: Node.js/Express with MongoDB
- **Frontend**: React.js (deploy separately)
- **Database**: MongoDB with Redis caching
- **Reverse Proxy**: Nginx
- **Monitoring**: Winston logging with health checks

## 🎯 Features Included
- ✅ Advanced search with filters
- ✅ Stock management system
- ✅ Enhanced checkout process
- ✅ Comprehensive review system
- ✅ Analytics dashboard
- ✅ SEO optimization
- ✅ Caching system
- ✅ Image optimization
- ✅ Security enhancements

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Docker Deployment (Recommended)
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Manual Deployment

#### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis (optional for caching)
- PM2 for process management

#### Backend Setup
```bash
# Install dependencies
cd server
npm install

# Start MongoDB
mongod --dbpath /path/to/data

# Start Redis (optional)
redis-server

# Start application
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGO_URI_PRODUCTION=mongodb://your-connection-string

# Security
JWT_SECRET=your-super-secret-key

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (for caching)
REDIS_URL=redis://localhost:6379
```

## 📊 Monitoring

### Health Checks
```bash
# API Health
curl http://localhost:5000/api/health

# Database Connection
curl http://localhost:5000/api/health/db

# Cache Health
curl http://localhost:5000/api/health/cache
```

### Logs
```bash
# View application logs
tail -f server/logs/combined-$(date +%Y-%m-%d).log

# View error logs
tail -f server/logs/error-$(date +%Y-%m-%d).log
```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Comprehensive integration test
node test/comprehensive-test.js
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Product search with filters
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Review system
- [ ] Analytics dashboard
- [ ] Image upload
- [ ] SEO features

## 🚀 Production Deployment

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin
```

### 2. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d maroc-cart.com -d www.maroc-cart.com
```

### 3. Database Setup
```bash
# MongoDB replica set (production)
mongod --replSet maroc-cart --dbpath /var/lib/mongodb

# Initialize replica set
mongo --eval "rs.initiate()"
```

### 4. Deployment Script
```bash
#!/bin/bash
# deploy.sh

# Pull latest changes
git pull origin main

# Build and deploy
docker-compose down
docker-compose build
docker-compose up -d

# Health check
sleep 30
curl -f http://localhost:5000/api/health || exit 1

echo "Deployment completed successfully!"
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
mongo "mongodb://localhost:27017/maroc-cart"
```

#### Memory Issues
```bash
# Check memory usage
free -h
docker stats

# Restart services
docker-compose restart
```

#### Performance Issues
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/products

# Check database performance
mongo --eval "db.serverStatus()"
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
```

### Load Balancing
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] JWT tokens secured
- [ ] Database access restricted
- [ ] File upload restrictions
- [ ] CORS properly configured
- [ ] Security headers added

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review configuration files
5. Contact development team

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://docs.mongodb.com/atlas/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## 🎯 Next Steps
1. Set up monitoring (Sentry, New Relic)
2. Configure CDN (CloudFlare)
3. Set up CI/CD pipeline
4. Implement backup strategy
5. Configure alerts and notifications
