# Deployment Checklist

## Pre-Deployment

### Local Setup
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] MongoDB running (local or Docker)
- [ ] Redis running (local or Docker)
- [ ] All dependencies installed (`npm install`)
- [ ] Frontend built (`npm run build` in `frontend/`)
- [ ] TypeScript compiles without errors
- [ ] Environment variables configured (`.env`)
- [ ] OPENAI_API_KEY set and valid
- [ ] JWT_SECRET configured

### Verification
```bash
# Run verification script
bash scripts/verify.sh

# For Docker deployment
bash scripts/verify-docker.sh
```

## Testing Before Deployment

### Backend Tests
```bash
npm test
npm run test:watch  # For continuous testing
```

### Manual Testing

#### 1. Start Services
```bash
# Terminal 1: Start MongoDB & Redis
docker run -d -p 27017:27017 mongo:7.0
docker run -d -p 6379:6379 redis:7-alpine

# Terminal 2: Start backend
npm run dev

# Terminal 3: Start frontend
cd frontend && npm run dev
```

#### 2. Test Authentication
- [ ] Navigate to http://localhost:3000
- [ ] Register a new account
- [ ] Verify email and password validation
- [ ] Login with credentials
- [ ] Logout works correctly
- [ ] Stored in local storage

#### 3. Test Chat Features
- [ ] Create new conversation
- [ ] Send message to AI
- [ ] Response received
- [ ] Markdown rendering works
- [ ] Code syntax highlighting works
- [ ] Copy message button works
- [ ] Multiple conversations work
- [ ] Delete conversation works

#### 4. Test Testing Tab
- [ ] Access testing tab
- [ ] Temperature slider works
- [ ] Max tokens input works
- [ ] Execute query works
- [ ] Query history displays
- [ ] Copy response button works

#### 5. Test Mobile
- [ ] Responsive design on mobile
- [ ] Sidebar collapses on narrow screens
- [ ] Touch buttons are 48px+
- [ ] Can scroll messages
- [ ] Input field works on mobile keyboard

#### 6. Test Accessibility
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces content
- [ ] Keyboard-only navigation possible
- [ ] Color contrast sufficient

#### 7. Test Analytics
- [ ] Analytics modal opens
- [ ] Shows token count
- [ ] Shows message count
- [ ] Shows average tokens/message

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify running
docker-compose ps

# View logs
docker-compose logs -f app

# Health check
curl http://localhost:5000/health
```

### Option 2: Traditional Server

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Build
npm run build
cd frontend && npm run build && cd ..

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 3: Cloud Platforms

#### Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### AWS/GCP/Azure
See `docs/DEPLOYMENT.md` for detailed instructions

## Post-Deployment

### Health Checks
```bash
# Check API health
curl https://your-domain.com/health

# Expected response:
# {"status": "ok", "timestamp": "2024-01-01T00:00:00Z"}
```

### Monitoring
- [ ] Monitor error logs
- [ ] Check database connections
- [ ] Monitor API response times
- [ ] Check error rates
- [ ] Monitor resource usage

### Backup
```bash
# Backup MongoDB
mongodump --uri="mongodb://user:pass@host:27017/chatbot" --out=./backup

# Backup Redis
redis-cli BGSAVE
```

### SSL/HTTPS Setup
- [ ] Generate SSL certificate (Let's Encrypt)
- [ ] Configure HTTPS
- [ ] Redirect HTTP to HTTPS
- [ ] Test certificate
- [ ] Set up auto-renewal

## Rollback Plan

If deployment fails:

```bash
# Docker
docker-compose down
docker-compose up -d  # Previous version

# Traditional
pm2 stop all
pm2 start ecosystem.config.js

# From backup
mongorestore --uri="mongodb://host/chatbot" ./backup
```

## Performance Optimization

- [ ] Enable gzip compression ✅
- [ ] Setup caching (Redis) ✅
- [ ] Implement CDN for frontend
- [ ] Database indexes created ✅
- [ ] Rate limiting configured ✅
- [ ] Load balancing (if needed)

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Setup Redis authentication
- [ ] Configure CORS properly ✅
- [ ] Use HTTPS/TLS ✅
- [ ] Setup firewall rules
- [ ] Enable rate limiting ✅
- [ ] Regular security updates
- [ ] Monitor logs for attacks

## Troubleshooting

### App Won't Start
```bash
# Check logs
npm run dev

# Check port in use
lsof -i :5000

# Check environment variables
echo $OPENAI_API_KEY
```

### Database Connection Error
```bash
# Test MongoDB
mongosh --uri="$MONGODB_URI"

# Test Redis
redis-cli -u "$REDIS_URL" ping
```

### Frontend Not Loading
```bash
# Check frontend build
cd frontend
npm run build

# Check API connection
curl http://localhost:5000/health
```

### High Memory Usage
```bash
# Check process memory
ps aux | grep node

# Check Docker stats
docker stats
```

## Final Sign-Off

- [ ] All tests passing
- [ ] App loads without errors
- [ ] Chat functionality works
- [ ] Testing tab accessible
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Database connected
- [ ] API health check OK
- [ ] Logs configured
- [ ] Backups setup
- [ ] Monitoring active
- [ ] SSL/HTTPS working
- [ ] Ready for production ✅

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Environment:** _______________
