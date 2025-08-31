import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Get SEO metadata for product
// @route   GET /api/seo/product/:id
// @access  Public
const getProductSEO = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const seoData = {
    title: `${product.name} - Maroc-Cart`,
    description: product.description.substring(0, 160),
    keywords: [
      product.name,
      product.category,
      product.brand,
      'منتجات مغربية',
      'زيوت طبيعية',
      'منتجات عضوية',
    ].filter(Boolean),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 200),
      image: product.image,
      url: `https://maroc-cart.com/products/${product._id}`,
      type: 'product',
      price: product.priceMAD,
      currency: 'MAD',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.substring(0, 200),
      image: product.image,
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: product.priceMAD,
        priceCurrency: 'MAD',
        availability: product.countInStock > 0 ? 'InStock' : 'OutOfStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.numReviews,
      },
    },
  };

  res.json(seoData);
});

// @desc    Get SEO metadata for category
// @route   GET /api/seo/category/:category
// @access  Public
const getCategorySEO = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });

  const seoData = {
    title: `${category} - Maroc-Cart`,
    description: `اكتشف أفضل ${category} المغربية عالية الجودة. مجموعة واسعة من المنتجات الطبيعية والعضوية بأفضل الأسعار.`,
    keywords: [
      category,
      `${category} مغربية`,
      `منتجات ${category}`,
      'منتجات طبيعية',
      'منتجات عضوية',
      'Maroc-Cart',
    ],
    openGraph: {
      title: `${category} - Maroc-Cart`,
      description: `اكتشف أفضل ${category} المغربية عالية الجودة`,
      type: 'website',
      url: `https://maroc-cart.com/category/${category}`,
    },
    twitter: {
      card: 'summary',
      title: `${category} - Maroc-Cart`,
      description: `اكتشف أفضل ${category} المغربية عالية الجودة`,
    },
  };

  res.json(seoData);
});

// @desc    Get sitemap data
// @route   GET /api/seo/sitemap
// @access  Public
const getSitemap = asyncHandler(async (req, res) => {
  const products = await Product.find({}).select('_id updatedAt');
  
  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');

  const sitemap = {
    products: products.map(product => ({
      url: `/products/${product._id}`,
      lastModified: product.updatedAt,
      priority: 0.8,
    })),
    categories: categories.map(category => ({
      url: `/category/${category}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
    brands: brands.map(brand => ({
      url: `/brand/${brand}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
    static: [
      { url: '/', lastModified: new Date(), priority: 1.0 },
      { url: '/about', lastModified: new Date(), priority: 0.5 },
      { url: '/contact', lastModified: new Date(), priority: 0.5 },
      { url: '/terms', lastModified: new Date(), priority: 0.3 },
      { url: '/privacy', lastModified: new Date(), priority: 0.3 },
    ],
  };

  res.json(sitemap);
});

// @desc    Get robots.txt content
// @route   GET /api/seo/robots
// @access  Public
const getRobotsTxt = asyncHandler(async (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /

# Allow all crawlers
User-agent: *
Allow: /products/
Allow: /category/
Allow: /brand/

# Disallow admin and sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /login/
Disallow: /register/
Disallow: /cart/
Disallow: /checkout/

# Sitemap
Sitemap: https://maroc-cart.com/api/seo/sitemap
`;

  res.type('text/plain').send(robotsTxt);
});

// @desc    Get meta tags for any page
// @route   POST /api/seo/meta
// @access  Public
const getMetaTags = asyncHandler(async (req, res) => {
  const { page, data } = req.body;

  const metaTags = {
    home: {
      title: 'Maroc-Cart - منتجات مغربية أصلية',
      description: 'اكتشف أفضل المنتجات المغربية الأصلية من زيوت طبيعية، أعشاب، ومنتجات عضوية عالية الجودة. توصيل سريع في جميع أنحاء المغرب.',
      keywords: 'منتجات مغربية, زيوت طبيعية, أعشاب مغربية, منتجات عضوية, Maroc-Cart',
    },
    about: {
      title: 'من نحن - Maroc-Cart',
      description: 'Maroc-Cart هو متجر إلكتروني مغربي متخصص في تقديم أفضل المنتجات المغربية الأصلية عالية الجودة.',
      keywords: 'Maroc-Cart, من نحن, منتجات مغربية, متجر مغربي',
    },
    contact: {
      title: 'اتصل بنا - Maroc-Cart',
      description: 'تواصل مع فريق Maroc-Cart للحصول على الدعم أو الاستفسارات حول منتجاتنا.',
      keywords: 'اتصل بنا, دعم Maroc-Cart, استفسارات',
    },
  };

  const tags = metaTags[page] || metaTags.home;
  res.json(tags);
});

export {
  getProductSEO,
  getCategorySEO,
  getSitemap,
  getRobotsTxt,
  getMetaTags,
};
