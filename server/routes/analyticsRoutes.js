import express from 'express';
import {
  getSalesAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  getConversionAnalytics,
  getDashboardData,
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin access
router.get('/sales', protect, admin, getSalesAnalytics);
router.get('/users', protect, admin, getUserAnalytics);
router.get('/products', protect, admin, getProductAnalytics);
router.get('/conversion', protect, admin, getConversionAnalytics);
router.get('/dashboard', protect, admin, getDashboardData);

export default router;
