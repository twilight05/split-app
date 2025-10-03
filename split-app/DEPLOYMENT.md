# 🚀 Split App Deployment Guide

## Overview

This guide will help you deploy your Split App to production using Vercel for both frontend and backend, with a PostgreSQL database.

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - PostgreSQL database (Supabase, Railway, or Neon recommended)
4. **Domain** (Optional) - Custom domain for your app

## 🏗️ Architecture

```
Frontend (Vercel) ← → Backend (Vercel) ← → PostgreSQL Database
```

## 📂 Project Structure

```
split-app/
├── frontend/           # React + TypeScript + Vite
├── backend/           # Express + TypeScript + Prisma
├── .github/workflows/ # GitHub Actions for CI/CD
└── README.md
```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Project Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the DATABASE_URL from Variables tab

### Option 3: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy the connection string

## 🚀 Deployment Steps

### Step 1: Prepare Your Code

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Environment Files:**

   ```bash
   # Frontend (.env)
   VITE_API_URL=https://your-backend-domain.vercel.app/api

   # Backend (.env)
   DATABASE_URL="your-postgresql-database-url"
   JWT_SECRET="your-super-secure-jwt-secret"
   CLIENT_URL="https://your-frontend-domain.vercel.app"
   NODE_ENV="production"
   ```

### Step 2: Deploy Backend to Vercel

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   ```
3. **Set Environment Variables in Vercel:**

   - Go to your project dashboard on Vercel
   - Settings → Environment Variables
   - Add:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: A secure random string
     - `CLIENT_URL`: Your frontend domain (will get after frontend deployment)
     - `NODE_ENV`: production

4. **Run Database Migrations:**
   ```bash
   # In your local backend directory
   npx prisma migrate deploy
   ```

### Step 3: Deploy Frontend to Vercel

1. **Deploy Frontend:**

   ```bash
   cd ../frontend
   vercel
   ```

2. **Set Environment Variables:**

   - Go to your frontend project on Vercel
   - Settings → Environment Variables
   - Add:
     - `VITE_API_URL`: Your backend Vercel URL + `/api`

3. **Update Backend CORS:**
   - Go back to backend project on Vercel
   - Update `CLIENT_URL` environment variable with your frontend domain
   - Redeploy backend

### Step 4: Configure Custom Domains (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## 🔧 Configuration Files Created

### Frontend (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

## 🔄 Automatic Deployments (GitHub Actions)

The included GitHub Actions workflow will:

- Automatically deploy when you push to `main` branch
- Build and test both frontend and backend
- Deploy to Vercel

**Setup:**

1. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Get from Vercel account settings
   - `DATABASE_URL`: Your database connection string
   - `VITE_API_URL`: Your backend API URL

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**

   - Ensure `CLIENT_URL` in backend matches your frontend domain
   - Check that backend is properly deployed

2. **Database Connection:**

   - Verify DATABASE_URL is correct
   - Ensure database allows connections from Vercel IPs

3. **Environment Variables:**

   - Double-check all environment variables are set
   - Redeploy after changing environment variables

4. **Build Errors:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

### Helpful Commands:

```bash
# Check build locally
cd frontend && npm run build
cd backend && npm run build

# Test production build locally
cd frontend && npm run preview

# View Vercel logs
vercel logs [deployment-url]
```

## 📱 Mobile App Considerations

Your app is already mobile-responsive! For native mobile apps:

1. **PWA (Progressive Web App):**

   - Add PWA manifest
   - Enable service workers
   - Users can "Add to Home Screen"

2. **Capacitor (Recommended):**

   - Wrap your web app as native iOS/Android
   - Access to native device features

3. **React Native:**
   - Rewrite frontend for native mobile
   - Reuse your backend API

## 🔐 Security Checklist

- ✅ Environment variables properly set
- ✅ JWT secrets are secure random strings
- ✅ Database credentials are secure
- ✅ CORS is properly configured
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ Input validation is implemented
- ✅ Rate limiting (consider adding)

## 📈 Post-Deployment

1. **Monitor:**

   - Set up Vercel analytics
   - Monitor error rates
   - Check performance metrics

2. **Backup:**

   - Set up database backups
   - Export important data regularly

3. **Updates:**
   - Test updates in staging first
   - Use GitHub workflow for automatic deployments

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify all environment variables
3. Test API endpoints manually
4. Check browser console for frontend errors

---

**Your app will be available at:**

- Frontend: `https://your-app-name.vercel.app`
- Backend API: `https://your-api-name.vercel.app/api`

Happy deploying! 🎉
