import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';
import mongoose from 'mongoose';

import config from './config';
import logger from './utils/logger';

// Routes
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import testingRoutes from './routes/testing';
import knowledgeBaseRoutes from './routes/knowledgeBase';
import analyticsRoutes from './routes/analytics';

// Middleware
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
app.use(rateLimitMiddleware);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/testing', authMiddleware, testingRoutes);
app.use('/api/knowledge-base', authMiddleware, knowledgeBaseRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation-${conversationId}`);
    logger.info(`Client ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('leave-conversation', (conversationId: string) => {
    socket.leave(`conversation-${conversationId}`);
    logger.info(`Client ${socket.id} left conversation ${conversationId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Server startup
async function startServer() {
  try {
    await connectDB();
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Testing mode: ${config.testing.enabled}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app, server, io };
