#!/bin/bash

# Setup script for Advanced AI Chatbot

echo "🚀 Setting up Advanced AI Chatbot..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create env file if not exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "⚠️  Please update .env with your configuration"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your OpenAI API key and other configs"
echo "2. Start MongoDB and Redis (or use Docker Compose: docker-compose up)"
echo "3. Run: npm run dev (for development)"
echo "4. In another terminal: cd frontend && npm run dev"
echo ""
