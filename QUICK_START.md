# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Docker)
- Redis (local or Docker)
- OpenAI API key

### Step 1: Clone & Setup

```bash
# Clone repository
git clone <your-repo-url>
cd advanced-ai-chatbot

# Run setup
bash scripts/setup.sh
```

### Step 2: Configure

```bash
# Create .env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Essential Variables:**
```env
OPENAI_API_KEY=sk-xxx...  # Your OpenAI API key
JWT_SECRET=random_secret_key_here  # Generate a random string
MONGODB_URI=mongodb://localhost:27017/chatbot
REDIS_URL=redis://localhost:6379
```

### Step 3: Start Services

**Option A: Docker (Easiest)**

```bash
# Start everything
docker-compose up

# App runs on http://localhost:3000
```

**Option B: Manual**

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Redis
redis-server

# Terminal 3: Backend
npm run dev

# Terminal 4: Frontend
cd frontend
npm run dev
```

### Step 4: Access the App

- Open http://localhost:3000
- Sign up or login
- Start chatting! 🎉

## 📱 Use on iPhone

1. Get your computer's IP: `ifconfig | grep "inet "`
2. On iPhone, open Safari
3. Visit: `http://YOUR_IP:3000`
4. Tap Share → Add to Home Screen
5. Launch from home screen!

## 🧪 Verify Installation

```bash
# Run verification
bash scripts/verify.sh

# For Docker
bash scripts/verify-docker.sh

# Run tests
npm test
```

## 📚 Documentation

- **Setup**: See `SETUP.md`
- **API**: See `docs/API.md`
- **Deployment**: See `docs/DEPLOYMENT.md`
- **Features**: See `docs/FEATURES.md`

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
```bash
# Make sure MongoDB is running
mongosh

# Or use Docker
docker run -d -p 27017:27017 mongo:7.0
```

**"Port 3000 already in use"**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**"OPENAI_API_KEY not found"**
- Check .env file exists
- Verify OPENAI_API_KEY is set
- Restart the app

**"Frontend not loading"**
```bash
# Rebuild frontend
cd frontend
npm run build
npm run dev
```

## 📞 Support

For issues:
1. Check the documentation
2. Review error logs
3. Check GitHub issues
4. Create a new issue with error details

## ✅ Next Steps

- [ ] Deploy to production
- [ ] Setup SSL/HTTPS
- [ ] Configure backups
- [ ] Setup monitoring
- [ ] Add custom domain

---

**Ready to deploy?** See `DEPLOYMENT_CHECKLIST.md`
