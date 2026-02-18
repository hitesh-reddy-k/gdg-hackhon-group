# 🚀 Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hitesh-reddy-k/gdg-hackhon-group)

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account with a cluster set up

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `hitesh-reddy-k/gdg-hackhon-group`
4. Select the `hackthon-gdg` directory as the root directory

### 3. Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
# MongoDB Configuration
URL=mongodb+srv://hello:hitesh@cluster0.13abzoa.mongodb.net/food-application?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=nilowehfioushbfurdhgbierudgh
JWT_EXPIRE=90d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=aithings74@gmail.com
EMAIL_PASS=bywq rtiv xnkp xisg

# Gemini AI API
GEMINI_API_KEY=AIzaSyAVqNtR0IUf5uokoWFIe7yf1or2X4tEDwo

# Server Configuration
PORT=7777
NODE_ENV=production
```

**⚠️ IMPORTANT:** Make sure to add these for **Production** environment!

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## Project Structure for Vercel

```
hackthon-gdg/
├── backend/
│   ├── index.js          # Main entry point (exported for Vercel)
│   ├── controller/
│   ├── database/
│   ├── databasemodel/
│   └── router/
├── forentend/            # Static files served by Vercel
│   ├── config.js         # Auto-detects production URL
│   ├── login-register/
│   └── home/
├── vercel.json           # Vercel configuration
└── package.json
```

## How It Works

### Backend Routing

The `vercel.json` configuration routes requests:

- `/user/*` → Backend API
- `/dite/*` → Backend API
- `/*.html`, `/*.css`, `/*.js` → Static frontend files
- `/` → API status endpoint

### Environment Detection

The app automatically detects Vercel environment:

```javascript
// Local Development
if (!process.env.VERCEL) {
  app.listen(7777)  // Starts local server
}

// Vercel Production
module.exports = app  // Exports for serverless
```

### Frontend Configuration

The `forentend/config.js` automatically detects environment:

```javascript
// On localhost → http://localhost:7777
// On vercel.app → https://your-app.vercel.app
```

## Verification

After deployment, test these endpoints:

1. **API Status**
   - URL: `https://your-app.vercel.app/`
   - Response: `{ "status": "running", "environment": "production" }`

2. **Frontend**
   - URL: `https://your-app.vercel.app/login-register/landingpage.html`
   - Should load the landing page

3. **Registration**
   - Go to Sign Up page
   - Create an account
   - Should redirect to login (no OTP required)

4. **Login**
   - Use your credentials
   - Should redirect to home page

5. **Diet Generation**
   - Fill in your details
   - Should generate AI-powered diet plan

## Troubleshooting

### Issue: "Cannot GET /"

**Solution:** Check that `vercel.json` is in the root directory

### Issue: "MongoDB connection failed"

**Solutions:**
1. Verify MongoDB URL in Vercel environment variables
2. Whitelist Vercel IPs in MongoDB Atlas:
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all - for development)
   - Or add specific Vercel IPs

### Issue: "API calls failing"

**Solutions:**
1. Check browser console for CORS errors
2. Verify environment variables are set in Vercel
3. Check Vercel function logs for errors

### Issue: "Static files not loading"

**Solution:** Verify route patterns in `vercel.json` match your file structure

## Viewing Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on "Deployments"
4. Click on latest deployment
5. View "Functions" tab for API logs

## Monitoring

### Performance

- Vercel provides automatic performance monitoring
- View metrics in Dashboard → Analytics

### Errors

- Check function logs for backend errors
- Use browser DevTools for frontend errors

## Updating the Deployment

### Automatic Updates

Every push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Update feature"
git push
```

### Manual Redeploy

In Vercel Dashboard:
1. Go to Deployments
2. Click "..." on any deployment
3. Click "Redeploy"

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (~24 hours)

## Environment-Specific Deployments

### Preview Deployments

- Every pull request gets a preview URL
- Test features before merging

### Production Deployment

- `main` branch → Production URL
- Automatic HTTPS
- Global CDN

## Security Checklist

- ✅ Environment variables stored in Vercel (not in code)
- ✅ MongoDB Atlas network access configured
- ✅ CORS properly configured
- ✅ JWT secrets are strong
- ✅ API keys are not exposed in frontend

## Performance Optimization

### What Vercel Does Automatically:

- ✅ Global CDN for static files
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Asset optimization
- ✅ Automatic scaling

### What You Can Do:

1. **Enable Caching**
   - API responses can be cached
   - Configure in `vercel.json`

2. **Optimize Images**
   - Use WebP format
   - Compress images before upload

3. **Minimize Bundle Size**
   - Remove unused dependencies
   - Use dynamic imports

## Cost

### Free Tier Includes:

- Unlimited deployments
- 100 GB bandwidth
- 100 hours serverless function execution
- HTTPS & CDN
- Preview deployments

### Monitoring Usage:

- Check Dashboard → Usage
- Upgrade if needed

## Support

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Your App Issues:** Create GitHub issue

## Quick Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Open project in browser
vercel open
```

## Success Indicators

✅ Build completes without errors  
✅ All environment variables set  
✅ MongoDB connection successful  
✅ API endpoints responding  
✅ Frontend loading correctly  
✅ User registration working  
✅ Login functioning  
✅ Diet generation active  

---

## 🎉 Your App is Production Ready!

Your food application is now:
- ✅ Deployed globally on Vercel
- ✅ Using MongoDB Atlas (cloud database)
- ✅ Automatically scaling
- ✅ Secure with HTTPS
- ✅ Fast with CDN
- ✅ Monitored with logs

**Live URL:** `https://gdg-hackhon-group.vercel.app`

Enjoy your production application! 🚀
