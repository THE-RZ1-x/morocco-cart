import Product from '../models/Product.js';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Check stock availability
// @route   POST /api/stock/check
// @access  Public
const checkStock = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    throw new AppError('Items array is required', 400);
  }

  const stockCheck = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        return {
          productId: item.productId,
          available: false,
          message: 'Product not found',
        };
      }

      const availableStock = product.countInStock;
      const requestedQuantity = item.quantity;
      const isAvailable = availableStock >= requestedQuantity;

      return {
        productId: item.productId,
        name: product.name,
        available: isAvailable,
        requestedQuantity,
        availableStock,
        message: isAvailable
          ? 'In stock'
          : `Only ${availableStock} items available`,
      };
    })
  );

  const allAvailable = stockCheck.every(item => item.available);

  res.json({
    allAvailable,
    stockCheck,
  });
});

// @desc    Reserve stock for order
// @route   POST /api/stock/reserve
// @access  Private
const reserveStock = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if stock is available
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      throw new AppError(
        `Insufficient stock for ${product?.name || 'product'}`,
        400
      );
    }
  }

  // Reserve stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { countInStock: -item.qty, reservedStock: item.qty } },
      { new: true }
    );
  }

  res.json({
    success: true,
    message: 'Stock reserved successfully',
  });
});

// @desc    Release reserved stock
// @route   POST /api/stock/release
// @access  Private
const releaseStock = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Release reserved stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { countInStock: item.qty, reservedStock: -item.qty } },
      { new: true }
    );
  }

  res.json({
    success: true,
    message: 'Stock released successfully',
  });
});

// @desc    Update stock after order completion
// @route   POST /api/stock/complete
// @access  Private
const completeStock = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Reduce reserved stock permanently
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { reservedStock: -item.qty } },
      { new: true }
    );
  }

  res.json({
    success: true,
    message: 'Stock updated successfully',
  });
});

// @desc    Get low stock alerts
// @route   GET /api/stock/alerts
// @access  Private/Admin
const getStockAlerts = asyncHandler(async (req, res) => {
  const lowStockThreshold = 5;
  
  const lowStockProducts = await Product.find({
    countInStock: { $lte: lowStockThreshold },
    isActive: true,
  })
    .select('name countInStock priceMAD category')
    .sort({ countInStock: 1 });

  const outOfStockProducts = await Product.find({
    countInStock: 0,
    isActive: true,
  })
    .select('name priceMAD category')
    .sort({ createdAt: -1 });

  res.json({
    lowStock: lowStockProducts,
    outOfStock: outOfStockProducts,
    totalLowStock: lowStockProducts.length,
    totalOutOfStock: outOfStockProducts.length,
  });
});

// @desc    Update product stock
// @route   PUT /api/stock/:productId
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { countInStock, reservedStock = 0 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  product.countInStock = countInStock;
  product.reservedStock = reservedStock;
  await product.save();

  res.json({
    success: true,
    message: 'Stock updated successfully',
    product: {
      id: product._id,
      name: product.name,
      countInStock: product.countInStock,
      reservedStock: product.reservedStock,
    },
  });
});

export {
  checkStock,
  reserveStock,
  releaseStock,
  completeStock,
  getStockAlerts,
  updateStock,
};
