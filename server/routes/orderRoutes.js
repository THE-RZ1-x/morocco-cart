import express from 'express';
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateOrder, handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.route('/').post(protect, validateOrder, handleValidationErrors, addOrderItems);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.route('/myorders').get(protect, getMyOrders);

export default router;
