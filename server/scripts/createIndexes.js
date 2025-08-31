import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

dotenv.config({ path: './.env' });

const createIndexes = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI_MARKET;
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Product indexes
    await Product.collection.createIndex({ name: 'text', description: 'text', brand: 'text' });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ priceMAD: 1 });
    await Product.collection.createIndex({ rating: -1 });
    await Product.collection.createIndex({ createdAt: -1 });
    await Product.collection.createIndex({ isActive: 1, countInStock: 1 });
    await Product.collection.createIndex({ 'reviews.user': 1 });

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ createdAt: -1 });

    // Order indexes
    await Order.collection.createIndex({ user: 1, createdAt: -1 });
    await Order.collection.createIndex({ 'orderItems.product': 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ createdAt: -1 });
    await Order.collection.createIndex({ 'shippingAddress.phone': 1 });

    console.log('✅ All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
