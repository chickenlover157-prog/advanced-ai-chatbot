# Advanced AI Chatbot

A production-grade AI chatbot with ChatGPT integration, RAG, real-time streaming, and an unrestricted testing mode.

## Features

✅ **AI Integration**
- OpenAI GPT-4 Turbo integration
- Real-time streaming responses
- Multiple model support
- Advanced prompt engineering

✅ **Conversation Management**
- Persistent conversation history
- Multi-user support
- Conversation metadata
- Full CRUD operations

✅ **RAG (Retrieval-Augmented Generation)**
- Vector embeddings via OpenAI
- Semantic document search
- Custom knowledge base support
- Document indexing

✅ **Advanced Features**
- Function calling capabilities
- Real-time WebSocket updates via Socket.io
- Token usage tracking and analytics
- File upload support

✅ **Security & Performance**
- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Request compression

✅ **Testing Mode**
- Unrestricted query execution
- Custom temperature and token settings
- Session management
- Isolated testing environment

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key
3. Configure MongoDB and Redis connections
4. Set JWT secret

```bash
cp .env.example .env
```

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversations/:id` - Get specific conversation
- `POST /api/chat/conversations/:id/messages` - Send message
- `POST /api/chat/conversations/:id/stream` - Stream response
- `DELETE /api/chat/conversations/:id` - Delete conversation

### Testing (Unrestricted Mode)
- `GET /api/testing/status` - Check testing mode status
- `POST /api/testing/sessions` - Create testing session
- `POST /api/testing/query` - Execute unrestricted query
- `GET /api/testing/sessions/:sessionId` - Get session queries
- `DELETE /api/testing/sessions/:sessionId` - Clear session

### Knowledge Base
- `POST /api/knowledge-base` - Create knowledge base
- `POST /api/knowledge-base/:kbId/documents` - Upload document
- `GET /api/knowledge-base/:kbId` - Get knowledge base

### Analytics
- `GET /api/analytics/user` - Get user analytics

## Testing Mode

The testing tab provides an unrestricted environment for experimentation:

```bash
POST /api/testing/query
{
  "sessionId": "unique-session-id",
  "query": "Your unrestricted query here",
  "systemPrompt": "Optional custom system prompt"
}
```

## Testing

```bash
npm test
npm run test:watch
```

## Docker

```bash
docker-compose up
```

## Project Structure

```
src/
├── config/        # Configuration
├── middleware/    # Express middleware
├── models/        # MongoDB schemas
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript types
├── utils/         # Utilities
└── server.ts      # Main server file
```

## License

MIT
