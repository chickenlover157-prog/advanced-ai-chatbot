import { Router, Request, Response } from 'express';
import Conversation from '../models/Conversation';
import User from '../models/User';
import OpenAIService from '../services/OpenAIService';
import RAGService from '../services/RAGService';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Create new conversation
router.post('/conversations', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const conversation = new (Conversation as any)({
      userId: req.userId,
      title: title || 'New Conversation',
      messages: [],
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    logger.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get all conversations for user
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await (Conversation as any).find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get specific conversation
router.get('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversation = await (Conversation as any).findById(req.params.id);
    if (!conversation || conversation.userId !== req.userId) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Send message and get AI response
router.post('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { content, useRAG = false, ragLimit = 5 } = req.body;
    const conversationId = req.params.id;

    const conversation = await (Conversation as any).findById(conversationId);
    if (!conversation || conversation.userId !== req.userId) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content,
      timestamp: new Date(),
    });

    // Prepare messages for OpenAI
    let messages: any[] = conversation.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add RAG context if requested
    if (useRAG) {
      const ragContext = await RAGService.searchSimilarDocuments(content, ragLimit);
      if (ragContext.documents.length > 0) {
        const ragPrompt = `\n\nRelevant context from knowledge base:\n${ragContext.documents
          .map((doc) => `- ${doc.source}: ${doc.content}`)
          .join('\n')}`;
        messages[messages.length - 1].content += ragPrompt;
      }
    }

    // Get AI response
    const response = await OpenAIService.generateResponse(messages);

    // Add assistant message
    conversation.messages.push({
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      tokens: {
        input: response.usage.promptTokens,
        output: response.usage.completionTokens,
      },
    });

    // Update user token usage
    const user = await User.findById(req.userId);
    if (user) {
      user.apiUsage.totalTokens += response.usage.totalTokens;
      user.apiUsage.messagesCount += 1;
      await user.save();
    }

    await conversation.save();

    res.json({
      message: response.content,
      usage: response.usage,
      conversationId,
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Stream message response
router.post('/conversations/:id/stream', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.id;

    const conversation = await (Conversation as any).findById(conversationId);
    if (!conversation || conversation.userId !== req.userId) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content,
      timestamp: new Date(),
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = conversation.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    let fullResponse = '';
    await OpenAIService.streamResponse(messages, (chunk: string) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    conversation.messages.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
    });

    await conversation.save();

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    logger.error('Stream error:', error);
    res.status(500).json({ error: 'Failed to stream message' });
  }
});

// Delete conversation
router.delete('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversation = await (Conversation as any).findByIdAndDelete(req.params.id);
    if (!conversation || conversation.userId !== req.userId) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    logger.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;
