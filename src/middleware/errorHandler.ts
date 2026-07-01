import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface APIError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error(`Error [${statusCode}]: ${message}`, err);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
