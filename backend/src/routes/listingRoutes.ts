import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  updateListingStatus,
  deleteListing,
  uploadListingImages,
} from '../controllers/listingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Public routes (หน้าแสดงรายการ & รายละเอียด ไม่ต้องล็อคอิน)
router.get('/', getAllListings);
router.get('/:id', getListingById);

// Protected routes (Admin Only)
router.post('/', authenticateToken as any, createListing);
router.put('/:id', authenticateToken as any, updateListing);
router.patch('/:id/status', authenticateToken as any, updateListingStatus);
router.delete('/:id', authenticateToken as any, deleteListing);
router.post(
  '/upload',
  authenticateToken as any,
  upload.array('images', 8),
  uploadListingImages
);

export default router;
