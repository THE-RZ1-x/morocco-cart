import dotenv from 'dotenv';
// Load environment variables from .env file in server directory
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes will be defined after error handlers

// Test Route
app.get('/', (req, res) => {
  res.send('Maroc-Cart Server is running!');
});

// Import error handlers
import { globalErrorHandler, notFound } from './middleware/errorMiddleware.js';

// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import seoRoutes from './routes/seoRoutes.js';

// Apply routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seo', seoRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Start Server Function
const startServer = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Market Database Connected...');

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB and start server');
    console.error(err);
    process.exit(1); // Exit the process with an error code
  }
};

// Call the function to start the server
startServer();
