import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Advanced search with filters
// @route   GET /api/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    minRating,
    brand,
    inStock,
    sortBy,
    page = 1,
    limit = 12,
  } = req.query;

  // Build query
  const query = {};

  // Text search
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { tags: { $in: [new RegExp(keyword, 'i')] } },
    ];
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Brand filter
  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  // Price range
  if (minPrice || maxPrice) {
    query.priceMAD = {};
    if (minPrice) query.priceMAD.$gte = Number(minPrice);
    if (maxPrice) query.priceMAD.$lte = Number(maxPrice);
  }

  // Rating filter
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  // Stock filter
  if (inStock === 'true') {
    query.countInStock = { $gt: 0 };
  }

  // Only active products
  query.isActive = true;

  // Sorting
  let sortOption = {};
  switch (sortBy) {
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
    case 'bestseller':
      sortOption = { numReviews: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  // Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip)
      .populate('user', 'name'),
    Product.countDocuments(query),
  ]);

  // Get search suggestions
  const suggestions = keyword ? await getSearchSuggestions(keyword) : [];

  res.json({
    products,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    totalItems: total,
    suggestions,
  });
});

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json({ suggestions: [] });
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
    ],
    isActive: true,
  })
    .limit(5)
    .select('name brand');

  const suggestions = [
    ...new Set(products.map(p => p.name)),
    ...new Set(products.map(p => p.brand)),
  ].slice(0, 8);

  res.json({ suggestions });
});

// @desc    Get search filters data
// @route   GET /api/search/filters
// @access  Public
const getSearchFilters = asyncHandler(async (req, res) => {
  const [categories, brands, priceRange] = await Promise.all([
    Product.distinct('category', { isActive: true }),
    Product.distinct('brand', { isActive: true }),
    Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$priceMAD' },
          maxPrice: { $max: '$priceMAD' },
        },
      },
    ]),
  ]);

  res.json({
    categories: categories.filter(Boolean),
    brands: brands.filter(Boolean),
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
  });
});

export {
  searchProducts,
  getSearchSuggestions,
  getSearchFilters,
};
