import express from 'express';
import {
  processCheckout,
  validateCheckout,
  getShippingOptions,
  calculateTax,
} from '../controllers/checkoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/process', protect, processCheckout);
router.post('/validate', protect, validateCheckout);
router.get('/shipping-options', protect, getShippingOptions);
router.get('/tax', protect, calculateTax);

export default router;
