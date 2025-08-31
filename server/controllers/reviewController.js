import Product from '../models/Product.js';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name avatar')
    .select('reviews');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const reviews = product.reviews.sort((a, b) => b.createdAt - a.createdAt);

  res.json({
    reviews,
    totalReviews: reviews.length,
    averageRating: product.rating,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    },
  });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, title, images = [] } = req.body;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Please provide a rating between 1 and 5', 400);
  }

  // Check if user has purchased this product
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    isPaid: true,
  });

  if (!hasPurchased) {
    throw new AppError('You can only review products you have purchased', 403);
  }

  // Check if user already reviewed this product
  const product = await Product.findById(productId);
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    throw new AppError('You have already reviewed this product', 400);
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    title: title || '',
    images,
    user: req.user._id,
    createdAt: new Date(),
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review added successfully' });
});

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, title, images = [] } = req.body;
  const { id: productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  const review = product.reviews.find(
    (r) => r._id.toString() === reviewId && r.user.toString() === req.user._id.toString()
  );

  if (!review) {
    throw new AppError('Review not found or not authorized', 404);
  }

  if (rating) review.rating = Number(rating);
  if (comment) review.comment = comment;
  if (title) review.title = title;
  if (images.length > 0) review.images = images;
  review.updatedAt = new Date();

  // Recalculate average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.json({ message: 'Review updated successfully' });
});

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = asyncHandler(async (req, res) => {
  const { id: productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  const review = product.reviews.find(
    (r) => r._id.toString() === reviewId
  );

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Check if user is the reviewer or admin
  if (
    review.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    throw new AppError('Not authorized to delete this review', 403);
  }

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== reviewId
  );
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length
      : 0;

  await product.save();

  res.json({ message: 'Review removed successfully' });
});

// @desc    Get reviews by user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const products = await Product.find({
    'reviews.user': req.params.userId,
  })
    .select('name image reviews')
    .populate('reviews.user', 'name');

  const userReviews = products.map((product) => ({
    product: {
      id: product._id,
      name: product.name,
      image: product.image,
    },
    review: product.reviews.find(
      (r) => r.user.toString() === req.params.userId
    ),
  }));

  res.json(userReviews);
});

// @desc    Get helpful reviews
// @route   GET /api/products/:id/reviews/helpful
// @access  Public
const getHelpfulReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name avatar')
    .select('reviews');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const helpfulReviews = product.reviews
    .filter(review => review.rating >= 4)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  res.json(helpfulReviews);
});

export {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getUserReviews,
  getHelpfulReviews,
};
