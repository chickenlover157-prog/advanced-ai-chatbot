# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response: 201
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt_token",
  "user": { ... }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>

Response: 200
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "apiUsage": {
    "totalTokens": 5000,
    "messagesCount": 10
  }
}
```

### Chat

#### Create Conversation

```http
POST /chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Conversation"
}

Response: 201
{
  "_id": "conv_id",
  "userId": "user_id",
  "title": "My Conversation",
  "messages": [],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Get All Conversations

```http
GET /chat/conversations
Authorization: Bearer <token>

Response: 200
[
  { ... conversation objects ... }
]
```

#### Get Specific Conversation

```http
GET /chat/conversations/:id
Authorization: Bearer <token>

Response: 200
{ ... conversation object ... }
```

#### Send Message

```http
POST /chat/conversations/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello AI",
  "useRAG": false,
  "ragLimit": 5
}

Response: 200
{
  "message": "AI response text",
  "usage": {
    "promptTokens": 50,
    "completionTokens": 100,
    "totalTokens": 150
  },
  "conversationId": "conv_id"
}
```

#### Stream Message

```http
POST /chat/conversations/:id/stream
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello AI"
}

Response: 200 (Server-Sent Events)
data: {"chunk": "text chunk"}
data: {"chunk": "more text"}
data: {"done": true}
```

#### Delete Conversation

```http
DELETE /chat/conversations/:id
Authorization: Bearer <token>

Response: 200
{
  "message": "Conversation deleted"
}
```

### Testing (Unrestricted Mode)

#### Check Testing Status

```http
GET /testing/status
Authorization: Bearer <token>

Response: 200
{
  "enabled": true,
  "unrestricted": true
}
```

#### Create Testing Session

```http
POST /testing/sessions
Authorization: Bearer <token>

Response: 201
{
  "sessionId": "session_uuid",
  "message": "Testing session created",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Execute Unrestricted Query

```http
POST /testing/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session_uuid",
  "query": "Your unrestricted query",
  "systemPrompt": "Optional custom prompt",
  "temperature": 1.0,
  "maxTokens": 4000
}

Response: 200
{
  "response": "AI response",
  "queryId": "query_uuid"
}
```

#### Get Session Queries

```http
GET /testing/sessions/:sessionId
Authorization: Bearer <token>

Response: 200
{
  "sessionId": "session_uuid",
  "queries": [ ... query objects ... ],
  "count": 5
}
```

#### Clear Session

```http
DELETE /testing/sessions/:sessionId
Authorization: Bearer <token>

Response: 200
{
  "message": "Testing session cleared"
}
```

### Knowledge Base

#### Create Knowledge Base

```http
POST /knowledge-base
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My KB"
}

Response: 201
{
  "id": "kb_id",
  "userId": "user_id",
  "documents": [],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Upload Document

```http
POST /knowledge-base/:kbId/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary file content>

Response: 200
{
  "documentId": "doc_id",
  "filename": "document.pdf"
}
```

#### Get Knowledge Base

```http
GET /knowledge-base/:kbId
Authorization: Bearer <token>

Response: 200
{ ... knowledge base object ... }
```

### Analytics

#### Get User Analytics

```http
GET /analytics/user
Authorization: Bearer <token>

Response: 200
{
  "totalTokens": 5000,
  "messagesCount": 10,
  "averageTokensPerMessage": 500
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API requests are rate-limited:
- Default: 100 requests per 15 minutes
- Per user: 1000 requests per hour

Headers returned:
- `RateLimit-Limit`: Maximum requests
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Unix timestamp when limit resets
