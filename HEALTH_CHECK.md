# Health Check & Testing Guide

## 🏥 Health Checks

### API Health

```bash
# Check backend health
curl http://localhost:5000/health

# Expected response
{"status": "ok", "timestamp": "2024-01-01T00:00:00Z"}
```

### Database Connections

**MongoDB**
```bash
mongosh --uri="$MONGODB_URI"
# Should connect and show database
```

**Redis**
```bash
redis-cli -u "$REDIS_URL" ping
# Should respond: PONG
```

### Service Status

```bash
# Check if backend is running
lsof -i :5000

# Check if frontend is running
lsof -i :3000

# Check if MongoDB is running
lsof -i :27017

# Check if Redis is running
lsof -i :6379
```

## 🧪 Running Tests

### Backend Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.ts

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

### Manual API Testing

#### 1. Test Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/auth/me
```

#### 2. Test Chat

```bash
# Create conversation
curl -X POST http://localhost:5000/api/chat/conversations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Chat"}'

# Get conversations
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/chat/conversations

# Send message (replace CONV_ID)
curl -X POST http://localhost:5000/api/chat/conversations/CONV_ID/messages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello AI", "useRAG": false}'
```

#### 3. Test Testing Mode

```bash
# Check testing status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/testing/status

# Execute query
curl -X POST http://localhost:5000/api/testing/query \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "query": "Tell me a joke",
    "temperature": 1.0,
    "maxTokens": 500
  }'
```

## 🎯 Frontend Testing

### Manual Checks

1. **Login Page**
   - [ ] Page loads
   - [ ] Form validation works
   - [ ] Login button functional
   - [ ] Register toggle works
   - [ ] Error messages display

2. **Dashboard**
   - [ ] Sidebar displays
   - [ ] Conversations list shows
   - [ ] New chat button works
   - [ ] Tab switching works
   - [ ] Analytics modal opens

3. **Chat Interface**
   - [ ] Messages display
   - [ ] Send button works
   - [ ] Message input focused
   - [ ] Markdown renders
   - [ ] Code highlighting works
   - [ ] Copy button works

4. **Testing Tab**
   - [ ] Tab loads
   - [ ] Temperature slider works
   - [ ] Token input works
   - [ ] Query sends
   - [ ] Response displays
   - [ ] History shows

5. **Mobile**
   - [ ] Responsive on iPhone
   - [ ] Sidebar works on mobile
   - [ ] Touch buttons work
   - [ ] No horizontal scroll
   - [ ] Add to home screen works

6. **Accessibility**
   - [ ] Tab navigation works
   - [ ] Focus visible
   - [ ] Screen reader compatible
   - [ ] Keyboard-only navigation
   - [ ] Color contrast good

## 📊 Performance Testing

### Load Testing

```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 http://localhost:5000/health

# Using hey
go install github.com/rakyll/hey@latest
hey -n 1000 -c 50 http://localhost:5000/health
```

### Response Time

```bash
# Measure response time
time curl http://localhost:3000
```

### Memory Usage

```bash
# Check Node.js memory
ps aux | grep "node\|npm"

# Docker
docker stats
```

## 🔍 Logging & Debugging

### View Logs

```bash
# Backend logs
tail -f logs/combined.log

# Docker logs
docker-compose logs -f app

# Specific service
docker-compose logs -f mongodb
```

### Enable Debug Mode

```bash
# Set log level
export LOG_LEVEL=debug
npm run dev

# In .env
LOG_LEVEL=debug
```

### Browser Console

1. Open DevTools (F12 or Cmd+Option+I)
2. Check Console tab
3. Look for errors
4. Check Network tab for API calls

## ✅ Pre-Deployment Checklist

```bash
# Run verification
bash scripts/verify.sh

# All checks should show ✓
```

### Critical Checks

- [ ] Node.js version correct
- [ ] All dependencies installed
- [ ] .env file configured
- [ ] OPENAI_API_KEY set
- [ ] JWT_SECRET configured
- [ ] MongoDB accessible
- [ ] Redis accessible
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] No console errors
- [ ] API responds to health check
- [ ] Frontend loads
- [ ] Login works
- [ ] Chat works
- [ ] Testing tab works
- [ ] Mobile responsive
- [ ] Accessibility verified

## 🚀 Ready to Deploy!

Once all checks pass, you're ready for production. See `DEPLOYMENT_CHECKLIST.md`
