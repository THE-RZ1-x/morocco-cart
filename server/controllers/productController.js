import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 8;
  const page = Number(req.query.pageNumber) || 1;

  // Enhanced search - search in name, description, and tags
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { tags: { $in: [new RegExp(req.query.keyword, 'i')] } },
          { brand: { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  
  // Price range filter
  const priceFilter = {};
  if (req.query.minPrice) {
    priceFilter.priceMAD = { ...priceFilter.priceMAD, $gte: Number(req.query.minPrice) };
  }
  if (req.query.maxPrice) {
    priceFilter.priceMAD = { ...priceFilter.priceMAD, $lte: Number(req.query.maxPrice) };
  }

  // Rating filter
  const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

  // Stock filter
  const stockFilter = req.query.inStock === 'true' ? { countInStock: { $gt: 0 } } : {};

  // Active products only
  const activeFilter = { isActive: true };

  const filters = { ...keyword, ...category, ...priceFilter, ...ratingFilter, ...stockFilter, ...activeFilter };

  // Sorting
  let sortOption = {};
  switch (req.query.sortBy) {
    case 'price_asc':
      sortOption = { priceMAD: 1 };
      break;
    case 'price_desc':
      sortOption = { priceMAD: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'popular':
      sortOption = { numReviews: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('reviews.user', 'name');

  res.json({ 
    products, 
    page, 
    pages: Math.ceil(count / pageSize),
    total: count,
    hasMore: page < Math.ceil(count / pageSize)
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ rating: -1 })
    .limit(5);

  res.json(products);
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json(categories);
});

export { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductCategories
};
