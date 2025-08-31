import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getReferralInfo
} from '../controllers/userController.js';
import { validateUserRegistration, handleValidationErrors } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  validateUserRegistration,
  handleValidationErrors,
  registerUser
);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

router.get('/referral', protect, getReferralInfo);

export default router;
