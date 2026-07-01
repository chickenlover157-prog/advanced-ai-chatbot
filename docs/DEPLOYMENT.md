# Deployment Guide

## Production Deployment

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (if deploying without Docker)
- MongoDB (managed or self-hosted)
- Redis (managed or self-hosted)
- OpenAI API key

## Option 1: Docker Compose (Recommended)

### 1. Build & Deploy

```bash
# Build the image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 2. Environment Configuration

Create a production `.env` file:

```bash
cp .env.example .env

# Edit .env with production values
NODE_ENV=production
OPENAI_API_KEY=your_key
JWT_SECRET=secure_random_string
MONGODB_URI=mongodb://user:pass@host:27017/chatbot
REDIS_URL=redis://user:pass@host:6379
PORT=5000
```

### 3. Verify Deployment

```bash
# Check health
curl http://localhost:5000/health

# Expected response
{"status": "ok", "timestamp": "2024-01-01T00:00:00Z"}
```

## Option 2: Manual Deployment (VPS/Cloud)

### 1. Setup Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB & Redis
sudo apt-get install -y mongodb redis-server
```

### 2. Deploy Application

```bash
# Clone repository
git clone <repo-url> chatbot
cd chatbot

# Install dependencies
npm install

# Build
npm run build

# Create production env
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run with PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'chatbot',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
EOF

# Start
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Option 3: Cloud Platforms

### Heroku

```bash
# Login
heroku login

# Create app
heroku create your-chatbot-app

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### AWS (with Docker)

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Build & push image
docker build -t chatbot:latest .
docker tag chatbot:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/chatbot:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/chatbot:latest

# Deploy with ECS or Fargate
```

### Vercel (Frontend Only)

```bash
cd frontend
vercel deploy
```

## Monitoring & Logs

### View Logs

```bash
# Docker
docker-compose logs -f app

# PM2
pm2 logs chatbot

# System logs
tail -f logs/combined.log
```

### Health Checks

```bash
# Setup monitoring
curl -X GET http://your-domain/health
```

## Database Backups

### MongoDB

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/chatbot" --out=./backup

# Restore
mongorestore --uri="mongodb://localhost:27017/chatbot" ./backup
```

### Redis

```bash
# Backup
redis-cli BGSAVE

# Restore
redis-cli BGREWRITEAOF
```

## SSL/TLS Setup

### Using Let's Encrypt & Nginx

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/chatbot
```

Nginx config:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Performance Optimization

### Database Indexes

```javascript
// Add to MongoDB
db.conversations.createIndex({ userId: 1, createdAt: -1 });
db.users.createIndex({ email: 1 }, { unique: true });
```

### Redis Caching

Configured in `.env`:

```
REDIS_URL=redis://localhost:6379
```

### CDN for Frontend

Deploy frontend to CloudFront or Netlify for global distribution.

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app

# Check port availability
lsof -i :5000

# Check environment variables
docker-compose exec app env | grep -i open
```

### Database Connection Issues

```bash
# Test MongoDB
mongosh --uri="$MONGODB_URI"

# Test Redis
redis-cli -u "$REDIS_URL" ping
```

### High Memory Usage

```bash
# Monitor
docker stats

# Optimize
# - Reduce max_connections in Redis
# - Add database indexes
# - Implement pagination
```

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Setup Redis authentication
- [ ] Configure CORS properly
- [ ] Use HTTPS/TLS
- [ ] Setup firewall rules
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
