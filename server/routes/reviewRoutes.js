import express from 'express';
import {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getUserReviews,
  getHelpfulReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateReview } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/products/:id/reviews', getProductReviews);
router.get('/products/:id/reviews/helpful', getHelpfulReviews);
router.get('/reviews/user/:userId', getUserReviews);

// Protected routes
router.post('/products/:id/reviews', protect, validateReview, createProductReview);
router.put('/products/:id/reviews/:reviewId', protect, validateReview, updateProductReview);
router.delete('/products/:id/reviews/:reviewId', protect, deleteProductReview);

export default router;
