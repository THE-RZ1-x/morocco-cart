# Multi-stage Dockerfile for Maroc-Cart
FROM node:18-alpine AS base

# Install dependencies for Sharp (image processing)
RUN apk add --no-cache \
    libc6-compat \
    vips-dev

WORKDIR /app

# Copy package files
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    vips-dev

WORKDIR /app

# Copy server files
COPY --from=base /app/node_modules ./node_modules
COPY server/ ./

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
