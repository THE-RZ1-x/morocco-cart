import express from 'express';
import {
  getProductSEO,
  getCategorySEO,
  getSitemap,
  getRobotsTxt,
  getMetaTags,
} from '../controllers/seoController.js';

const router = express.Router();

// SEO routes
router.get('/product/:id', getProductSEO);
router.get('/category/:category', getCategorySEO);
router.get('/sitemap', getSitemap);
router.get('/robots', getRobotsTxt);
router.post('/meta', getMetaTags);

export default router;
