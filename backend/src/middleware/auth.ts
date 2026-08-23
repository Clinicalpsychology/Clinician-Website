import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userType?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendError(res, 'No token provided', 401, 'NO_TOKEN');
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    req.userType = decoded.userType;

    next();
  } catch (error) {
    sendError(res, 'Invalid token', 401, 'INVALID_TOKEN');
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userType || !roles.includes(req.userType)) {
      return sendError(res, 'Insufficient permissions', 403, 'FORBIDDEN');
    }
    next();
  };
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
  }
  next();
};
