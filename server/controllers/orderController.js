import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  const createdOrder = await Order.create({
    orderItems: orderItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item._id, // Map the cart item's _id to the product field
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json(createdOrder);
});

export { addOrderItems, getMyOrders };
