#!/bin/bash

# Pre-Deployment Verification Script
# Checks that all dependencies are installed and app can start

echo "🔍 Running Pre-Deployment Verification..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo "${RED}✗ Node.js not found${NC}"
  exit 1
fi
echo "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
echo ""
echo "${YELLOW}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
  echo "${RED}✗ npm not found${NC}"
  exit 1
fi
echo "${GREEN}✓ npm $(npm --version)${NC}"

# Check .env file
echo ""
echo "${YELLOW}Checking configuration...${NC}"
if [ ! -f .env ]; then
  echo "${RED}✗ .env file not found${NC}"
  echo "${YELLOW}Please create .env from .env.example${NC}"
  echo "  cp .env.example .env"
  exit 1
fi
echo "${GREEN}✓ .env file found${NC}"

# Check OPENAI_API_KEY
if ! grep -q "OPENAI_API_KEY=" .env || grep "OPENAI_API_KEY=your_" .env &> /dev/null; then
  echo "${RED}✗ OPENAI_API_KEY not configured${NC}"
  exit 1
fi
echo "${GREEN}✓ OPENAI_API_KEY configured${NC}"

# Check JWT_SECRET
if ! grep -q "JWT_SECRET=" .env || grep "JWT_SECRET=your_" .env &> /dev/null; then
  echo "${RED}✗ JWT_SECRET not configured${NC}"
  exit 1
fi
echo "${GREEN}✓ JWT_SECRET configured${NC}"

# Check backend dependencies
echo ""
echo "${YELLOW}Checking backend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo "${YELLOW}Installing backend dependencies...${NC}"
  npm install
fi
echo "${GREEN}✓ Backend dependencies ready${NC}"

# Check frontend dependencies
echo ""
echo "${YELLOW}Checking frontend dependencies...${NC}"
if [ ! -d "frontend/node_modules" ]; then
  echo "${YELLOW}Installing frontend dependencies...${NC}"
  cd frontend
  npm install
  cd ..
fi
echo "${GREEN}✓ Frontend dependencies ready${NC}"

# Check TypeScript compilation
echo ""
echo "${YELLOW}Checking TypeScript compilation...${NC}"
if ! npm run build &> /dev/null; then
  echo "${RED}✗ TypeScript compilation failed${NC}"
  npm run build
  exit 1
fi
echo "${GREEN}✓ TypeScript compiles successfully${NC}"

# Summary
echo ""
echo "${GREEN}===================================${NC}"
echo "${GREEN}✅ All checks passed!${NC}"
echo "${GREEN}===================================${NC}"
echo ""
echo "${YELLOW}Next steps:${NC}"
echo "1. Start MongoDB: mongosh or docker run -d -p 27017:27017 mongo:7.0"
echo "2. Start Redis: redis-server or docker run -d -p 6379:6379 redis:7-alpine"
echo "3. Backend: npm run dev"
echo "4. Frontend: cd frontend && npm run dev"
echo ""
echo "${GREEN}Open http://localhost:3000 in your browser${NC}"
