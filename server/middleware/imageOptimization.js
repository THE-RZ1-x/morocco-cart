import sharp from 'sharp';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Image optimization middleware
const optimizeImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const { buffer, originalname } = req.file;
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const uploadDir = 'uploads/products';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    // Optimize image with sharp
    await sharp(buffer)
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Create thumbnail
    const thumbnailPath = path.join(uploadDir, 'thumbnails', filename);
    if (!fs.existsSync(path.dirname(thumbnailPath))) {
      fs.mkdirSync(path.dirname(thumbnailPath), { recursive: true });
    }

    await sharp(buffer)
      .resize(300, 200, {
        fit: 'cover',
      })
      .webp({ quality: 70 })
      .toFile(thumbnailPath);

    req.file.filename = filename;
    req.file.path = filepath;
    
    next();
  } catch (error) {
    next(error);
  }
};

// Multiple images optimization
const optimizeImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    const uploadDir = 'uploads/products';
    const optimizedImages = [];

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of req.files) {
      const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
      const filepath = path.join(uploadDir, filename);

      // Optimize main image
      await sharp(file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Create thumbnail
      const thumbnailPath = path.join(uploadDir, 'thumbnails', filename);
      if (!fs.existsSync(path.dirname(thumbnailPath))) {
        fs.mkdirSync(path.dirname(thumbnailPath), { recursive: true });
      }

      await sharp(file.buffer)
        .resize(300, 200, {
          fit: 'cover',
        })
        .webp({ quality: 70 })
        .toFile(thumbnailPath);

      optimizedImages.push({
        filename,
        path: filepath,
        thumbnail: thumbnailPath,
      });
    }

    req.files = optimizedImages;
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, optimizeImage, optimizeImages };
