#!/bin/bash

# Docker deployment verification
# Checks Docker setup and runs health checks

echo "📈 Running Docker Deployment Verification..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Docker
echo "${YELLOW}Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
  echo "${RED}✗ Docker not found${NC}"
  echo "Please install Docker: https://www.docker.com/products/docker-desktop"
  exit 1
fi
echo "${GREEN}✓ Docker $(docker --version)${NC}"

# Check Docker Compose
echo ""
echo "${YELLOW}Checking Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
  echo "${RED}✗ Docker Compose not found${NC}"
  exit 1
fi
echo "${GREEN}✓ Docker Compose $(docker-compose --version)${NC}"

# Check Docker daemon
echo ""
echo "${YELLOW}Checking Docker daemon...${NC}"
if ! docker ps &> /dev/null; then
  echo "${RED}✗ Docker daemon not running${NC}"
  echo "Please start Docker Desktop or Docker daemon"
  exit 1
fi
echo "${GREEN}✓ Docker daemon running${NC}"

# Check .env file
echo ""
echo "${YELLOW}Checking configuration...${NC}"
if [ ! -f .env ]; then
  echo "${RED}✗ .env file not found${NC}"
  exit 1
fi
echo "${GREEN}✓ .env file found${NC}"

# Build images
echo ""
echo "${YELLOW}Building Docker images...${NC}"
if ! docker-compose build &> /dev/null; then
  echo "${RED}✗ Docker build failed${NC}"
  docker-compose build
  exit 1
fi
echo "${GREEN}✓ Docker images built successfully${NC}"

# Summary
echo ""
echo "${GREEN}===================================${NC}"
echo "${GREEN}✅ Docker setup verified!${NC}"
echo "${GREEN}===================================${NC}"
echo ""
echo "${YELLOW}To deploy:${NC}"
echo "  docker-compose up -d"
echo ""
echo "${YELLOW}To check status:${NC}"
echo "  docker-compose ps"
echo ""
echo "${YELLOW}To view logs:${NC}"
echo "  docker-compose logs -f app"
echo ""
echo "${YELLOW}To stop:${NC}"
echo "  docker-compose down"
