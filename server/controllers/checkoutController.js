import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Enhanced checkout process
// @route   POST /api/checkout/process
// @access  Private
const processCheckout = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice = 0,
    taxPrice = 0,
    couponCode,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new AppError('No order items provided', 400);
  }

  // Validate shipping address
  const requiredAddressFields = ['address', 'city', 'postalCode', 'country', 'phone'];
  const missingFields = requiredAddressFields.filter(field => !shippingAddress[field]);
  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }

  // Calculate prices and check stock
  let itemsPrice = 0;
  const processedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new AppError(`Product ${item.product} not found`, 404);
    }

    if (product.countInStock < item.qty) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.countInStock}`,
        400
      );
    }

    itemsPrice += product.priceMAD * item.qty;
    processedItems.push({
      name: product.name,
      qty: item.qty,
      image: product.image,
      price: product.priceMAD,
      product: product._id,
    });
  }

  // Apply coupon if provided
  let discountAmount = 0;
  if (couponCode) {
    // Simple coupon validation (implement real coupon system)
    if (couponCode === 'MAROC10' && itemsPrice >= 200) {
      discountAmount = itemsPrice * 0.1;
    } else if (couponCode === 'MAROC20' && itemsPrice >= 500) {
      discountAmount = itemsPrice * 0.2;
    }
  }

  // Calculate final prices
  const subtotal = itemsPrice - discountAmount;
  const totalPrice = subtotal + shippingPrice + taxPrice;

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems: processedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null,
  });

  // Reserve stock
  for (const item of processedItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { countInStock: -item.qty, reservedStock: item.qty } }
    );
  }

  const createdOrder = await order.save();

  // Populate user info
  await createdOrder.populate('user', 'name email');

  res.status(201).json(createdOrder);
});

// @desc    Validate checkout data
// @route   POST /api/checkout/validate
// @access  Private
const validateCheckout = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  // Validate items
  if (!orderItems || orderItems.length === 0) {
    throw new AppError('No order items provided', 400);
  }

  const validationResults = [];
  let totalPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      validationResults.push({
        productId: item.product,
        valid: false,
        error: 'Product not found',
      });
      continue;
    }

    const issues = [];
    if (product.countInStock < item.qty) {
      issues.push(`Only ${product.countInStock} items available`);
    }

    if (item.qty <= 0) {
      issues.push('Quantity must be greater than 0');
    }

    validationResults.push({
      productId: item.product,
      name: product.name,
      price: product.priceMAD,
      available: product.countInStock,
      requested: item.qty,
      valid: issues.length === 0,
      issues,
    });

    if (issues.length === 0) {
      totalPrice += product.priceMAD * item.qty;
    }
  }

  // Validate shipping address
  const addressValidation = {
    valid: true,
    issues: [],
  };

  if (!shippingAddress) {
    addressValidation.valid = false;
    addressValidation.issues.push('Shipping address is required');
  } else {
    const requiredFields = ['address', 'city', 'postalCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    if (missingFields.length > 0) {
      addressValidation.valid = false;
      addressValidation.issues.push(`Missing: ${missingFields.join(', ')}`);
    }
  }

  const allValid = validationResults.every(item => item.valid) && addressValidation.valid;

  res.json({
    valid: allValid,
    items: validationResults,
    shippingAddress: addressValidation,
    estimatedTotal: totalPrice,
  });
});

// @desc    Get shipping options
// @route   GET /api/checkout/shipping-options
// @access  Private
const getShippingOptions = asyncHandler(async (req, res) => {
  const { city, postalCode } = req.query;

  // Moroccan shipping options
  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '3-5 business days',
      price: 30,
      estimatedDays: 4,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '1-2 business days',
      price: 60,
      estimatedDays: 1,
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Free pickup from store',
      price: 0,
      estimatedDays: 1,
    },
  ];

  // Adjust prices based on location
  if (city && city.toLowerCase().includes('casablanca')) {
    shippingOptions[0].price = 20; // Cheaper for Casablanca
  }

  res.json({
    shippingOptions,
  });
});

// @desc    Calculate tax
// @route   GET /api/checkout/tax
// @access  Private
const calculateTax = asyncHandler(async (req, res) => {
  const { subtotal, shippingAddress } = req.query;

  // Moroccan tax calculation (20% VAT)
  const taxRate = 0.2;
  const taxAmount = parseFloat(subtotal) * taxRate;

  res.json({
    taxRate: taxRate * 100,
    taxAmount: taxAmount.toFixed(2),
    totalWithTax: (parseFloat(subtotal) + taxAmount).toFixed(2),
  });
});

export {
  processCheckout,
  validateCheckout,
  getShippingOptions,
  calculateTax,
};
