import express from 'express';
import { upload, optimizeImage, optimizeImages } from '../middleware/imageOptimization.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { AppError } from '../middleware/errorMiddleware.js';

const router = express.Router();

// @desc    Upload single product image
// @route   POST /api/upload/image
// @access  Private/Admin
router.post(
  '/image',
  protect,
  admin,
  upload.single('image'),
  optimizeImage,
  (req, res, next) => {
    if (!req.file) {
      return next(new AppError('No image provided', 400));
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/products/${req.file.filename}`,
        thumbnail: `/uploads/products/thumbnails/${req.file.filename}`,
      },
    });
  }
);

// @desc    Upload multiple product images
// @route   POST /api/upload/images
// @access  Private/Admin
router.post(
  '/images',
  protect,
  admin,
  upload.array('images', 5),
  optimizeImages,
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images provided', 400));
    }

    const images = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      url: `/uploads/products/${file.filename}`,
      thumbnail: `/uploads/products/thumbnails/${file.filename}`,
    }));

    res.json({
      success: true,
      data: images,
    });
  }
);

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
router.delete('/:filename', protect, admin, (req, res, next) => {
  const { filename } = req.params;
  const uploadDir = 'uploads/products';
  const filepath = `${uploadDir}/${filename}`;
  const thumbnailPath = `${uploadDir}/thumbnails/${filename}`;

  try {
    // Delete main image
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Delete thumbnail
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(new AppError('Error deleting image', 500));
  }
});

export default router;
