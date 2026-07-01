import { Router, Request, Response } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

const router = Router();

// Get user analytics
router.get('/user', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      totalTokens: user.apiUsage.totalTokens,
      messagesCount: user.apiUsage.messagesCount,
      averageTokensPerMessage:
        user.apiUsage.messagesCount > 0
          ? Math.round(user.apiUsage.totalTokens / user.apiUsage.messagesCount)
          : 0,
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
