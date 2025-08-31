import User from '../models/User.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Utility function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Calculate user tier based on total spent and total orders
const calculateUserTier = (totalSpent, totalOrders) => {
  if (totalOrders >= 30 || totalSpent >= 7000) {
    return 'platinum';
  } else if (totalOrders >= 15 || totalSpent >= 3000) {
    return 'gold';
  } else if (totalOrders >= 5 || totalSpent >= 1000) {
    return 'silver';
  } else {
    return 'bronze';
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, password, referralCode } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Check if referred by another user
  let referredByUser = null;
  if (referralCode) {
    referredByUser = await User.findOne({ referralCode });
    if (!referredByUser) {
      res.status(400);
      throw new Error('Invalid referral code');
    }
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    referredBy: referredByUser ? referredByUser._id : null
  });

  // Add referral bonus points to the referring user
  if (referredByUser) {
    referredByUser.points += 100;
    await referredByUser.save();
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      tier: user.tier,
      points: user.points,
      referralCode: user.referralCode,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      tier: user.tier,
      points: user.points,
      referralCode: user.referralCode,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      tier: user.tier,
      points: user.points,
      totalSpent: user.totalSpent,
      totalOrders: user.totalOrders,
      referralCode: user.referralCode,
      preferences: user.preferences,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.preferences) {
      user.preferences = {
        ...user.preferences,
        ...req.body.preferences
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      tier: updatedUser.tier,
      points: updatedUser.points,
      referralCode: updatedUser.referralCode,
      preferences: updatedUser.preferences,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if product is already in wishlist
  if (user.wishlist.includes(productId)) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  user.wishlist.push(productId);
  await user.save();

  res.json({ message: 'Product added to wishlist' });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.wishlist = user.wishlist.filter(
    (item) => item.toString() !== req.params.id
  );

  await user.save();

  res.json({ message: 'Product removed from wishlist' });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.wishlist);
});

// @desc    Get user referral info
// @route   GET /api/users/referral
// @access  Private
const getReferralInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get users referred by this user
  const referredUsers = await User.find({ referredBy: user._id });

  res.json({
    referralCode: user.referralCode,
    referredUsers: referredUsers.map(u => ({
      name: u.name,
      email: u.email,
      createdAt: u.createdAt
    }))
  });
});

export { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getReferralInfo,
  calculateUserTier
};
