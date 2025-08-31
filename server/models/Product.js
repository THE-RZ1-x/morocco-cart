import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceMAD: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: false
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  reservedStock: {
    type: Number,
    required: true,
    default: 0
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Product = mongoose.model('Product', productSchema);

export default Product;
