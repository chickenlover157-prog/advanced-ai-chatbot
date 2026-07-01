export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: {
    input: number;
    output: number;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  metadata?: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  apiUsage: {
    totalTokens: number;
    messagesCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBase {
  id: string;
  userId: string;
  name: string;
  description: string;
  documents: Array<{
    id: string;
    filename: string;
    content: string;
    embedding: number[];
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestingSession {
  id: string;
  userId: string;
  mode: 'restricted' | 'unrestricted';
  queries: Array<{
    id: string;
    query: string;
    response: string;
    timestamp: Date;
  }>;
  startedAt: Date;
  endedAt?: Date;
}

export interface AIResponse {
  id: string;
  content: string;
  functionCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result: any;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface RAGContext {
  documents: Array<{
    content: string;
    score: number;
    source: string;
  }>;
  relevanceScore: number;
}
