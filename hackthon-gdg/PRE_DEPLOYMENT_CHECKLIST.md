# 🚀 Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is ready.

## ✅ Code Readiness

### Backend Configuration
- [x] `backend/index.js` exports app module for Vercel
- [x] `backend/index.js` uses `process.env.PORT || 7777`
- [x] `backend/index.js` has conditional app.listen() for local development
- [x] CORS configured with `origin: '*'` for production
- [x] All routes properly defined (/user/*, /dite/*)
- [x] Static file serving from forentend/ folder
- [x] OTP verification system removed

### Frontend Configuration
- [x] `forentend/config.js` created with environment detection
- [x] All HTML files use `API_CONFIG` from config.js
- [x] Login page at `/login-register/landingpage.html`
- [x] Registration flows to login (no OTP page)
- [x] All links use dynamic URLs from config

### Database
- [x] MongoDB Atlas cluster created
- [x] Database name: `food-application`
- [x] Connection string updated in env files
- [x] User models defined (User, UserInfo)
- [x] Diet plan models created

### Environment Files
- [x] `env/.env.development` exists with localhost MongoDB
- [x] `env/.env.production` exists with MongoDB Atlas URL
- [x] All required variables present:
  - URL
  - JWT_SECRET
  - JWT_EXPIRE
  - EMAIL_SERVICE
  - EMAIL_USER
  - EMAIL_PASS
  - GEMINI_API_KEY
  - PORT
  - NODE_ENV

### Security
- [x] `.gitignore` created
- [x] Environment files excluded from git
- [x] No hardcoded secrets in code
- [x] JWT secret is strong and unique
- [x] Passwords hashed with bcryptjs
- [x] npm vulnerabilities fixed (0 vulnerabilities)

## 📋 Before You Deploy

### Step 1: Verify Local Functionality
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Test these features:
# - Registration
# - Login
# - Diet plan generation
# - Profile updates
```

### Step 2: Prepare Git Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready for Vercel deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/gdg-hackhon-group.git
git branch -M main
git push -u origin main
```

### Step 3: Double-Check Required Files

Ensure these files exist:
- [x] `vercel.json` (root directory)
- [x] `.vercelignore` (root directory)
- [x] `.gitignore` (root directory)
- [x] `backend/index.js` (with module.exports)
- [x] `forentend/config.js` (environment detection)
- [x] `package.json` (with correct scripts)

### Step 4: Prepare Environment Variables for Vercel

Copy these variables to set in Vercel dashboard:

```env
URL=mongodb+srv://hello:hitesh@cluster0.13abzoa.mongodb.net/food-application
JWT_SECRET=nilowehfioushbfurdhgbierudgh
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=aithings74@gmail.com
EMAIL_PASS=ccud ggmg bvni ajua
GEMINI_API_KEY=AIzaSyAVqNtR0IUf5uokoWFIe7yf1or2X4tEDwo
PORT=7777
NODE_ENV=production
```

⚠️ **IMPORTANT:** These values contain actual credentials. Do NOT commit this checklist with real values to public repositories. Replace with your own before committing.

### Step 5: MongoDB Atlas Configuration

Before deployment, configure MongoDB Atlas:

1. **Database Access**
   - Go to Database Access
   - Your user: `hello` (already created)
   - Ensure password is correct: `hitesh`

2. **Network Access**
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges

3. **Database**
   - Cluster: `cluster0.13abzoa.mongodb.net`
   - Database name: `food-application`
   - Collections will be auto-created

## 🚀 Deployment Steps

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2. Import Project
1. Click "New Project"
2. Import your GitHub repository
3. Select `gdg-hackhon-group/hackthon-gdg` as root directory

### 3. Configure Build Settings
```
Framework Preset: Other
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
Root Directory: hackthon-gdg
```

### 4. Add Environment Variables
Go to Settings → Environment Variables and add all variables from Step 4 above.

**Environment:** Production

### 5. Deploy
- Click "Deploy"
- Wait for deployment to complete
- Test your application

## 🧪 Post-Deployment Testing

### Test Checklist

1. **Landing Page**
   - [ ] Visit `https://your-app.vercel.app/login-register/landingpage.html`
   - [ ] Page loads correctly
   - [ ] Images load
   - [ ] Buttons work

2. **Registration**
   - [ ] Click "Sign Up"
   - [ ] Fill form
   - [ ] Submit
   - [ ] Redirects to login page
   - [ ] No OTP screen appears

3. **Login**
   - [ ] Enter credentials
   - [ ] Click login
   - [ ] JWT token stored
   - [ ] Redirects to home

4. **Home Dashboard**
   - [ ] All navigation links work
   - [ ] User info displays
   - [ ] Can navigate to diet planning

5. **Diet Plan Generation**
   - [ ] Fill personal info form
   - [ ] Submit
   - [ ] AI generates plan
   - [ ] Plan displays correctly
   - [ ] Shopping list available

6. **API Endpoints**
   Test these URLs:
   - [ ] `https://your-app.vercel.app/` (returns "server running")
   - [ ] `https://your-app.vercel.app/user/login` (POST request works)
   - [ ] `https://your-app.vercel.app/dite/generate` (POST request works)

## 🐛 Common Issues & Solutions

### Issue 1: "Application Error"
**Solution:** Check Vercel function logs for errors. Usually environment variables are missing.

### Issue 2: MongoDB Connection Timeout
**Solution:** 
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check connection string is correct
- Ensure database user has read/write permissions

### Issue 3: Static Files Not Loading
**Solution:**
- Check `vercel.json` routes configuration
- Ensure files are in `forentend/` directory
- Clear browser cache

### Issue 4: CORS Errors
**Solution:**
- Verify CORS is configured in `backend/index.js`
- Check origin is set to '*' or specific domain
- Ensure credentials: true is set

### Issue 5: API 404 Errors
**Solution:**
- Check route paths match between frontend and backend
- Verify `API_CONFIG` in frontend uses correct URLs
- Check vercel.json routes include your endpoints

## 📊 Monitoring

After deployment:

1. **Vercel Dashboard**
   - Monitor function calls
   - Check error logs
   - View analytics

2. **MongoDB Atlas**
   - Monitor database operations
   - Check connection count
   - Review slow queries

3. **Email Service**
   - Verify emails are sending
   - Check Gmail app password is valid
   - Monitor email quota

## 🎉 Ready to Deploy!

Once you've completed all checkboxes above:

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Click Deploy
5. Test thoroughly
6. Share your app!

## 📚 Additional Resources

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed deployment guide
- [COMPLETE_SETUP_SUMMARY.md](./COMPLETE_SETUP_SUMMARY.md) - Full setup documentation
- [README.md](./README.md) - Project overview

---

**Good luck with your deployment! 🚀**

Need help? Review the troubleshooting sections in VERCEL_DEPLOYMENT.md
