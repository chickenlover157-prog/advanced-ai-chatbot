# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Docker)
- Redis (local or Docker)
- OpenAI API key

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd advanced-ai-chatbot
bash scripts/setup.sh
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Random secret for JWT signing
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string

### 3. Start Services

**Option A: Using Docker**

```bash
docker-compose up
```

This starts:
- MongoDB on port 27017
- Redis on port 6379
- App on port 5000

**Option B: Local Development**

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 4. Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Development

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Test
npm test
npm run test:watch
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
.
├── src/
│   ├── config/           # Configuration management
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utilities
│   ├── __tests__/        # Tests
│   └── server.ts         # Main server
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── scripts/              # Setup & utility scripts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

See `.env.example` for all available options.

**Critical Variables:**
- `OPENAI_API_KEY` - Required for AI features
- `JWT_SECRET` - Required for authentication
- `MONGODB_URI` - Required for data persistence
- `TESTING_MODE_ENABLED` - Set to `true` to enable testing tab
- `UNRESTRICTED_TESTING` - Set to `true` for unrestricted queries

## Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
mongosh --version

# Or use Docker
docker run -d -p 27017:27017 mongo:7.0
```

### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

### OpenAI API Error
- Check API key is correct in `.env`
- Verify your OpenAI account has credits
- Check your rate limits

## Support

For issues and questions, check the documentation:
- API Reference: `docs/API.md`
- Deployment: `docs/DEPLOYMENT.md`
- Features: `docs/FEATURES.md`
