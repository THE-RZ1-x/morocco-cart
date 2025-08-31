# 🛒 Maroc Cart - Moroccan E-commerce Platform

A modern e-commerce platform showcasing authentic Moroccan products with bilingual support (Arabic/French).

## 🌐 Live Demo

- **Frontend**: [GitHub Pages](https://the-rz1-x.github.io/morocco-cart)
- **API**: [Your backend deployment URL will be here]

> **Note**: The frontend is deployed on GitHub Pages. You'll need to deploy the backend separately to Railway/Render for full functionality.

## 🏗️ Architecture

```
maroc-cart/
├── client/          # React frontend
├── server/          # Node.js/Express backend
└── deployment files
```

## ✨ Features

- 🌐 **Bilingual Support** (Arabic RTL & French)
- 🛍️ **Product Catalog** with advanced filtering
- 🛒 **Shopping Cart** with persistent storage
- ❤️ **Wishlist/Favorites** functionality
- 👤 **User Authentication** (Register/Login)
- 📱 **Responsive Design** (Mobile-first)
- 🎨 **Material-UI** with custom Moroccan theming
- 🔍 **Advanced Search** with real-time results
- 📊 **Redux Toolkit** for state management
- 🔐 **JWT Authentication**
- 📝 **Product Reviews** system
- 📧 **WhatsApp Integration**

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks & Context
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for components
- **React Router v6** for navigation
- **React i18next** for internationalization
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer & Sharp** for image handling
- **Winston** for logging
- **Express Rate Limit** for security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- Git

### 1. Clone Repository
```bash
git clone https://github.com/THE-RZ1-x/morocco-cart.git
cd morocco-cart
```

### 2. Install Dependencies
```bash
# Install root dependencies (if any)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies  
cd ../server
npm install
```

### 3. Environment Setup

#### Server Environment (.env in server folder)
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:
```env
# Database
MONGO_URI=mongodb://localhost:27017/maroc-cart

# Server
PORT=5001
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=30d

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:3002,https://your-netlify-site.netlify.app

# Optional: Payment/Email configurations
STRIPE_SECRET_KEY=sk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Client Environment (.env in client folder)
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001

# App Configuration
REACT_APP_SITE_NAME=Maroc Cart
REACT_APP_WHATSAPP_NUMBER=+212600000000

# Optional: Analytics/Payment
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_GA_TRACKING_ID=GA-XXXXXXXXX
```

### 4. Start Development

```bash
# Terminal 1: Start Backend (from server folder)
cd server
npm run dev

# Terminal 2: Start Frontend (from client folder)
cd client
npm start
```

Visit: http://localhost:3002

## 🌐 Deployment Guide

### Option 1: GitHub + Netlify (Recommended)

#### Step 1: Prepare Repository
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Maroc Cart e-commerce platform"

# Add your GitHub remote
git remote add origin https://github.com/THE-RZ1-x/morocco-cart.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy Backend (Choose one)

**Option A: Railway**
1. Visit [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select `server` folder as root
4. Add environment variables in Railway dashboard
5. Deploy and get your API URL

**Option B: Render**
1. Visit [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `server`
5. Add environment variables
6. Deploy and get your API URL

**Option C: Heroku**
```bash
# Install Heroku CLI and login
heroku login
heroku create your-app-name-api

# Set environment variables
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set NODE_ENV="production"

# Deploy
git subtree push --prefix server heroku main
```

#### Step 3: Deploy Frontend (Netlify)

1. **Connect Repository**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select `main` branch

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `client/build`
   - Base directory: `client`

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.com
     REACT_APP_SITE_NAME=Maroc Cart
     REACT_APP_WHATSAPP_NUMBER=+212600000000
     ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will auto-deploy on every GitHub push

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individually
docker build -t maroc-cart-client ./client
docker build -t maroc-cart-server ./server
```

## 🔧 Environment Variables Reference

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/maroc-cart` |
| `PORT` | Server port | `5001` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key` |
| `NODE_ENV` | Environment | `development` or `production` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `http://localhost:3002,https://site.netlify.app` |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5001` |
| `REACT_APP_SITE_NAME` | Site name | `Maroc Cart` |
| `REACT_APP_WHATSAPP_NUMBER` | WhatsApp contact | `+212600000000` |

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests (if available)
cd server
npm test

# Build production version locally
cd client
npm run build
npm run preview
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/search` - Search products

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `ALLOWED_ORIGINS` includes your frontend URL
   - Check `REACT_APP_API_URL` points to correct backend

2. **Build Failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 18+)

3. **Database Connection**
   - Verify `MONGO_URI` is correct
   - Ensure MongoDB is running
   - Check firewall/network settings

4. **Environment Variables Not Loading**
   - Verify `.env` files are in correct locations
   - Restart development servers after changes
   - Check Netlify environment variables dashboard

### Contact Support

- **Issues**: [GitHub Issues](https://github.com/THE-RZ1-x/morocco-cart/issues)
- **Email**: [Your email]
- **WhatsApp**: +212600000000

---

**Built with ❤️ for Moroccan e-commerce**