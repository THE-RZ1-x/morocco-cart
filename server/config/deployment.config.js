// Deployment Configuration for Maroc-Cart
// Production-ready settings

const config = {
  production: {
    port: process.env.PORT || 5000,
    database: {
      uri: process.env.MONGO_URI_PRODUCTION,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    },
    cors: {
      origin: [
        'https://maroc-cart.com',
        'https://www.maroc-cart.com',
        'https://maroc-cart.netlify.app'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    security: {
      helmet: {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://api.maroc-cart.com"]
          }
        }
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
      }
    },
    cache: {
      stdTTL: 600, // 10 minutes
      checkperiod: 120 // 2 minutes
    },
    upload: {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5
      },
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    }
  },
  
  staging: {
    port: process.env.PORT || 5001,
    database: {
      uri: process.env.MONGO_URI_STAGING,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    cors: {
      origin: true,
      credentials: true
    }
  },
  
  development: {
    port: process.env.PORT || 5000,
    database: {
      uri: process.env.MONGO_URI_DEV || 'mongodb://localhost:27017/maroc-cart-dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    cors: {
      origin: true,
      credentials: true
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
