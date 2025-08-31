import express from 'express';
import {
  checkStock,
  reserveStock,
  releaseStock,
  completeStock,
  getStockAlerts,
  updateStock,
} from '../controllers/stockController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/check', checkStock);

// Protected routes (admin only)
router.post('/reserve', protect, admin, reserveStock);
router.post('/release', protect, admin, releaseStock);
router.post('/complete', protect, admin, completeStock);
router.get('/alerts', protect, admin, getStockAlerts);
router.put('/:productId', protect, admin, updateStock);

export default router;
