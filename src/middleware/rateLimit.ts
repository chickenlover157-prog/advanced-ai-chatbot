import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import config from '../config';

export const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many requests, please try again later.',
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  keyGenerator: (req: Request) => req.userId || req.ip || 'unknown',
});
