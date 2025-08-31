# 🚀 GitHub Pages Deployment Guide

## 📋 Overview

This guide helps you deploy your Morocco Cart frontend to GitHub Pages while maintaining your backend separately.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Pages  │    │   Railway/Render │    │  MongoDB Atlas  │
│   (Frontend)    │───▶│   (Backend API)  │───▶│   (Database)    │
│   React App     │    │   Node.js/Express│    │   Cloud DB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend First (Required)

Since GitHub Pages only hosts static files, deploy your backend to:

**Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `server`
4. Add environment variables:
   ```
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   ALLOWED_ORIGINS=https://the-rz1-x.github.io
   ```
5. Deploy and copy your Railway URL

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Similar environment setup

### Step 2: Update API Configuration

1. Go to your GitHub repository settings
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Add repository secret:
   ```
   Name: REACT_APP_API_URL
   Value: https://your-railway-app.railway.app
   ```

### Step 3: Enable GitHub Pages

1. Go to your repository: `https://github.com/THE-RZ1-x/morocco-cart`
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Source: **Deploy from a branch**
5. Branch: **gh-pages** 
6. Folder: **/ (root)**
7. Click **Save**

### Step 4: Deploy

**Automatic Deployment (Recommended):**
- Push any changes to `main` branch
- GitHub Actions will automatically build and deploy
- Visit: `https://the-rz1-x.github.io/morocco-cart`

**Manual Deployment:**
```bash
cd client
npm run deploy
```

## 🔧 Configuration Files

### Package.json Updates
- ✅ Added `homepage` field
- ✅ Added `gh-pages` dependency
- ✅ Added deployment scripts

### GitHub Actions
- ✅ Automatic build on push
- ✅ Environment variables support
- ✅ Deployment to gh-pages branch

### API Configuration
- ✅ Environment-based URL switching
- ✅ Production/development separation
- ✅ Centralized configuration

## 🌐 URLs

After deployment:
- **Frontend**: `https://the-rz1-x.github.io/morocco-cart`
- **Backend**: `https://your-backend-url.railway.app`
- **GitHub Repo**: `https://github.com/THE-RZ1-x/morocco-cart`

## 🔐 Environment Variables

### Development (.env files)
```env
# client/.env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_SITE_NAME=Maroc Cart
```

### Production (GitHub Secrets)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## 🐛 Troubleshooting

### Common Issues

1. **Blank Page**: Check browser console for errors
2. **API Errors**: Verify backend URL in GitHub secrets
3. **Routing Issues**: 404.html handles SPA routing
4. **Build Failures**: Check GitHub Actions logs

### Checking Logs
1. Go to **Actions** tab in your repository
2. Click on latest workflow run
3. Check build/deploy logs

## 📱 Features Supported

✅ **Static Content**: All UI components  
✅ **Client Routing**: React Router works  
✅ **Environment Variables**: Properly configured  
⚠️ **API Calls**: Requires separate backend deployment  
⚠️ **Database**: Requires MongoDB Atlas or similar  

## 🔄 Development Workflow

1. **Local Development**: `npm start` (uses localhost:5001)
2. **Test Build**: `npm run build` 
3. **Deploy**: Push to main branch (auto-deploys)
4. **Monitor**: Check GitHub Actions for deployment status

## 🎯 Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Set up MongoDB Atlas
3. ✅ Configure GitHub secrets
4. ✅ Push to trigger deployment
5. ✅ Visit your live site!

## 🆘 Support

- **GitHub Issues**: [Repository Issues](https://github.com/THE-RZ1-x/morocco-cart/issues)
- **Railway Support**: [Railway Discord](https://discord.gg/railway)
- **MongoDB Atlas**: [Atlas Support](https://www.mongodb.com/cloud/atlas)

---

**🎉 Your Morocco Cart site will be live at: `https://the-rz1-x.github.io/morocco-cart`**