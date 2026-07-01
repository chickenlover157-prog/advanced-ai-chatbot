import { Router, Request, Response } from 'express';
import TestingService from '../services/TestingService';
import config from '../config';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Check if testing mode is enabled
router.get('/status', (req: Request, res: Response) => {
  res.json({
    enabled: config.testing.enabled,
    unrestricted: config.testing.unrestricted,
  });
});

// Create testing session
router.post('/sessions', async (req: Request, res: Response) => {
  if (!TestingService.isTestingModeEnabled()) {
    return res.status(403).json({ error: 'Testing mode is not enabled' });
  }

  try {
    const sessionId = uuidv4();
    res.json({
      sessionId,
      message: 'Testing session created',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create testing session error:', error);
    res.status(500).json({ error: 'Failed to create testing session' });
  }
});

// Execute unrestricted query
router.post('/query', async (req: Request, res: Response) => {
  if (!TestingService.isTestingModeEnabled()) {
    return res.status(403).json({ error: 'Testing mode is not enabled' });
  }

  try {
    const { sessionId, query, systemPrompt } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await TestingService.executeTestQuery(sessionId || uuidv4(), query, systemPrompt);

    logger.info(`[TESTING] Query executed by user ${req.userId}`);

    res.json(result);
  } catch (error) {
    logger.error('Testing query error:', error);
    res.status(500).json({ error: 'Failed to execute testing query' });
  }
});

// Get testing session queries
router.get('/sessions/:sessionId', async (req: Request, res: Response) => {
  if (!TestingService.isTestingModeEnabled()) {
    return res.status(403).json({ error: 'Testing mode is not enabled' });
  }

  try {
    const queries = TestingService.getSessionQueries(req.params.sessionId);
    res.json({
      sessionId: req.params.sessionId,
      queries,
      count: queries.length,
    });
  } catch (error) {
    logger.error('Get testing session error:', error);
    res.status(500).json({ error: 'Failed to get testing session' });
  }
});

// Clear testing session
router.delete('/sessions/:sessionId', async (req: Request, res: Response) => {
  if (!TestingService.isTestingModeEnabled()) {
    return res.status(403).json({ error: 'Testing mode is not enabled' });
  }

  try {
    TestingService.clearSession(req.params.sessionId);
    res.json({ message: 'Testing session cleared' });
  } catch (error) {
    logger.error('Clear testing session error:', error);
    res.status(500).json({ error: 'Failed to clear testing session' });
  }
});

export default router;
