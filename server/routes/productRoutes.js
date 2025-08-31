import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductCategories,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateProduct, validateReview, handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, validateProduct, handleValidationErrors, createProduct);
router.route('/top').get(getTopProducts);
router.route('/categories').get(getProductCategories);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, validateProduct, handleValidationErrors, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, validateReview, handleValidationErrors, createProductReview);

export default router;
