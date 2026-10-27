import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';
import { generateCaptcha, verifyCaptcha } from '../services/captchaService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-rent-cars-houses-2026';

// 1. รับ Captcha สำหรับหน้า Login
export const getCaptchaController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const captcha = generateCaptcha();
    res.json(captcha);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถสร้าง Captcha ได้' });
  }
};

// 2. เข้าสู่ระบบ (ตรวจสอบ Captcha + Username & Password)
export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, captchaAnswer, captchaToken } = req.body;

    if (!captchaAnswer || !captchaToken) {
      res.status(400).json({ message: 'กรุณากรอกรหัส Captcha' });
      return;
    }

    if (!verifyCaptcha(captchaAnswer, captchaToken)) {
      res.status(400).json({ message: 'รหัส Captcha ไม่ถูกต้องหรือหมดอายุ' });
      return;
    }

    if (!username || !password) {
      res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
};

// 3. ดูข้อมูลผู้ใช้ปัจจุบัน (Current Profile)
export const getMeController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'ไม่ได้เข้าสู่ระบบ' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, name: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ message: 'ไม่พบผู้ใช้ในระบบ' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์' });
  }
};

// 4. แก้ไขชื่อผู้ใช้และ/หรือรหัสผ่าน (Update Profile)
export const updateProfileController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'ไม่ได้เข้าสู่ระบบ' });
      return;
    }

    const { username, currentPassword, newPassword, name } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ message: 'ไม่พบผู้ใช้ในระบบ' });
      return;
    }

    // ต้องตรวจสอบรหัสผ่านเดิมก่อนเปลี่ยนเสมอเพื่อความปลอดภัย
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
        return;
      }
    } else {
      res.status(400).json({ message: 'กรุณากรอกรหัสผ่านปัจจุบันเพื่อยืนยันตัวตน' });
      return;
    }

    const updateData: { username?: string; password?: string; name?: string } = {};

    if (name) {
      updateData.name = name;
    }

    if (username && username !== user.username) {
      const existing = await prisma.user.findUnique({
        where: { username },
      });
      if (existing) {
        res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาเลือกชื่ออื่น' });
        return;
      }
      updateData.username = username;
    }

    if (newPassword && newPassword.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    } else if (newPassword && newPassword.trim().length < 6) {
      res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, username: true, name: true, updatedAt: true },
    });

    // สลับ token ใหม่หากมีการเปลี่ยน username
    const newToken = jwt.sign(
      { id: updatedUser.id, username: updatedUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'อัปเดตโปรไฟล์เรียบร้อยแล้ว',
      token: newToken,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' });
  }
};
