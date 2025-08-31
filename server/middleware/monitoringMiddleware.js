import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'maroc-cart-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Daily rotate file for errors
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    
    // Daily rotate file for all logs
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };
    
    if (res.statusCode >= 400) {
      logger.error('Request failed', logData);
    } else if (duration > 1000) {
      logger.warn('Slow request', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

// Error tracking middleware
const errorTracker = (error, req, res, next) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user ? req.user._id : null
  };
  
  logger.error('Unhandled error', errorData);
  
  // Send error to monitoring service (e.g., Sentry)
  if (process.env.SENTRY_DSN) {
    // Sentry.captureException(error, { extra: errorData });
  }
  
  next(error);
};

// Health check endpoint
const healthCheck = (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected', // This would check actual DB connection
    redis: 'connected' // This would check actual Redis connection
  };
  
  res.json(healthData);
};

// Metrics endpoint
const getMetrics = (req, res) => {
  const metrics = {
    totalRequests: global.totalRequests || 0,
    totalErrors: global.totalErrors || 0,
    averageResponseTime: global.averageResponseTime || 0,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  
  res.json(metrics);
};

// Request counter middleware
const requestCounter = (req, res, next) => {
  global.totalRequests = (global.totalRequests || 0) + 1;
  next();
};

// Error counter middleware
const errorCounter = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      global.totalErrors = (global.totalErrors || 0) + 1;
    }
  });
  next();
};

export {
  logger,
  performanceMonitor,
  errorTracker,
  healthCheck,
  getMetrics,
  requestCounter,
  errorCounter
};
