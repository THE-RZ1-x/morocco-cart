import NodeCache from 'node-cache';

// Create cache instance
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default

// Cache middleware factory
const createCacheMiddleware = (keyPrefix, ttl = 300) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    // Store original send function
    const originalSend = res.json;

    // Override json method to cache response
    res.json = function(data) {
      cache.set(key, data, ttl);
      originalSend.call(this, data);
    };

    next();
  };
};

// Clear cache by prefix
const clearCacheByPrefix = (prefix) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      cache.del(key);
    }
  });
};

// Clear specific cache
const clearCache = (key) => {
  cache.del(key);
};

// Get cache stats
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize,
  };
};

// Cache keys
const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  SEARCH: 'search',
  REVIEWS: 'reviews',
  ANALYTICS: 'analytics',
};

export {
  cache,
  createCacheMiddleware,
  clearCacheByPrefix,
  clearCache,
  getCacheStats,
  CACHE_KEYS,
};
