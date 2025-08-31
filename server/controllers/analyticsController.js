import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, period = '7d' } = req.query;

  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  } else {
    // Default to last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    dateFilter = { createdAt: { $gte: sevenDaysAgo } };
  }

  const salesData = await Order.aggregate([
    { $match: { ...dateFilter, isPaid: true } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { ...dateFilter, isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalQuantity: { $sum: '$orderItems.qty' },
        totalRevenue: { $sum: '$orderItems.price' },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        name: '$product.name',
        image: '$product.image',
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    salesData,
    topProducts,
    summary: {
      totalSales: salesData.reduce((sum, day) => sum + day.totalSales, 0),
      totalOrders: salesData.reduce((sum, day) => sum + day.totalOrders, 0),
      averageOrderValue: salesData.length > 0 
        ? salesData.reduce((sum, day) => sum + day.totalSales, 0) / salesData.length 
        : 0,
    },
  });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const newUsersLastWeek = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });

  const userGrowth = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const customerRetention = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        totalOrders: { $sum: 1 },
        lastOrder: { $max: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$totalOrders',
        customers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalUsers,
    newUsersLastWeek,
    userGrowth,
    customerRetention,
  });
});

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
const getProductAnalytics = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 10 } });
  const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });

  const categoryAnalytics = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$priceMAD' },
        totalValue: { $sum: { $multiply: ['$priceMAD', '$countInStock'] } },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const brandAnalytics = await Product.aggregate([
    {
      $group: {
        _id: '$brand',
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    categoryAnalytics,
    brandAnalytics,
  });
});

// @desc    Get conversion analytics
// @route   GET /api/analytics/conversion
// @access  Private/Admin
const getConversionAnalytics = asyncHandler(async (req, res) => {
  const totalVisitors = 1000; // This would come from analytics service
  const totalOrders = await Order.countDocuments({ isPaid: true });
  const conversionRate = (totalOrders / totalVisitors) * 100;

  const funnelData = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        paidOrders: {
          $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] },
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$isDelivered', true] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  res.json({
    totalVisitors,
    totalOrders,
    conversionRate,
    funnelData,
  });
});

// @desc    Get real-time dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardData = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalRevenue,
    totalOrders,
    totalUsers,
    todayRevenue,
    todayOrders,
    pendingOrders,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments({ isPaid: true }),
    User.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments({ isPaid: true, createdAt: { $gte: today } }),
    Order.countDocuments({ isPaid: true, isDelivered: false }),
    Order.find({ isPaid: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name'),
    Product.find()
      .sort({ rating: -1 })
      .limit(5)
      .select('name image rating priceMAD'),
  ]);

  res.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    totalOrders,
    totalUsers,
    todayRevenue: todayRevenue[0]?.total || 0,
    todayOrders,
    pendingOrders,
    recentOrders,
    topProducts,
  });
});

export {
  getSalesAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  getConversionAnalytics,
  getDashboardData,
};
