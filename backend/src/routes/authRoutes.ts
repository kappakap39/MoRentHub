import { Router } from 'express';
import {
  getCaptchaController,
  loginController,
  getMeController,
  updateProfileController,
} from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/captcha', getCaptchaController);
router.post('/login', loginController);

// Protected routes (Admin)
router.get('/me', authenticateToken as any, getMeController as any);
router.put('/profile', authenticateToken as any, updateProfileController as any);

export default router;
