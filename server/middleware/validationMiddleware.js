import { body, validationResult } from 'express-validator';

// Validation rules for user registration
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  // Optional referral code
  body('referralCode')
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage('Referral code must be between 6 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Referral code can only contain letters and numbers')
];

// Validation rules for product creation
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('priceMAD')
    .isFloat({ min: 0 })
    .withMessage('Price in MAD must be a positive number'),
  
  body('category')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Category is required'),
  
  body('countInStock')
    .isInt({ min: 0 })
    .withMessage('Stock count must be a non-negative integer')
];

// Validation rules for order creation
export const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('shippingAddress.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('shippingAddress.phone')
    .matches(/^[0-9\s\-\+\(\)]+$/)
    .isLength({ min: 8, max: 15 })
    .withMessage('Please provide a valid phone number'),
  
  body('paymentMethod')
    .isIn(['cod', 'card', 'paypal', 'cashplus', 'bank_transfer', 'wafa_cash'])
    .withMessage('Invalid payment method')
];

// Validation rules for reviews
export const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Comment must be between 5 and 500 characters')
];

// Error handling middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Rate limiting middleware
export const rateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      const userRequests = requests.get(key);
      
      if (now > userRequests.resetTime) {
        userRequests.count = 1;
        userRequests.resetTime = now + windowMs;
      } else {
        userRequests.count++;
      }
      
      if (userRequests.count > max) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later'
        });
      }
    }
    
    next();
  };
};
