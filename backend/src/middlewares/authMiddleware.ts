import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-rent-cars-houses-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ (Unauthorized)' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Session หมดอายุ หรือ Token ไม่ถูกต้อง (Forbidden)' });
      return;
    }
    req.user = decoded as { id: number; username: string };
    next();
  });
};
