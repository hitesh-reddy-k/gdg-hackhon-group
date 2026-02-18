# Frontend URL Configuration Guide

## Overview

The frontend now uses **automatic environment detection** to switch between localhost (development) and production URLs.

## ✅ Updated Files

All frontend files have been updated to use the centralized `config.js`:

### Authentication Pages
- ✅ `login-register/log.html` - Login page
- ✅ `login-register/register.html` - Registration page
- ✅ `login-register/verify.html` - OTP verification page
- ✅ `login-register/landingpage.html` - Landing page

### Application Pages
- ✅ `home/user-info.html` - Diet/workout plan generation
- ✅ `home/order-food.html` - Vegetable order list

### Static Link Pages (Manual Update Required)
- ⚠️ `index.html` - Update href links manually if needed
- ⚠️ `home/home.html` - Update href links manually if needed
- ⚠️ `home/order.html` - Update href links manually if needed

## 🔧 How It Works

### Automatic Detection

The `config.js` file automatically detects the environment:

```javascript
// Running on localhost:7777 → Uses http://localhost:7777
// Running on vercel.app → Uses https://gdg-hackhon-group.vercel.app
```

### Configuration File

Location: `forentend/config.js`

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:7777',  // or production URL
    endpoints: {
        login: '/user/login',
        register: '/user/register',
        verifyOtp: '/user/verify-otp',
        home: '/user/home',
        generateDiet: '/dite/generate',
        getPlan: (userId) => `/dite/get-plan/${userId}`,
        confirmPlan: '/dite/confirm-plan',
        // ... more endpoints
    }
};
```

## 🚀 Testing Locally

### 1. Start Backend (Development)
```bash
npm run dev
```
This uses `localhost` MongoDB

### 2. Open Frontend
Open any HTML file in your browser:
```
file:///C:/Users/hites/Desktop/gdg-hackhon-group/hackthon-gdg/forentend/login-register/landingpage.html
```

### 3. Test Features
- Registration → Uses `http://localhost:7777/user/sign-up`
- Login → Uses `http://localhost:7777/user/login`
- All API calls → Automatically point to localhost

## 🌐 Production Deployment

### When Deployed to Vercel

1. **Frontend on Vercel** → Automatically uses `https://gdg-hackhon-group.vercel.app`
2. **Backend on Vercel** → No code changes needed
3. **Database** → Uses MongoDB Atlas

The `config.js` detects it's not on localhost and switches to production URLs automatically.

## 📝 Usage in Frontend Code

### Fetch API Calls
```javascript
// Before (hardcoded)
fetch('https://gdg-hackhon-group.vercel.app/user/login', {...})

// After (dynamic)
fetch(API_CONFIG.endpoints.login, {...})
```

### Redirects
```javascript
// Before (hardcoded)
window.location.href = 'https://gdg-hackhon-group.vercel.app/user/home';

// After (dynamic)
window.location.href = API_CONFIG.endpoints.home;
```

### Dynamic Endpoints with Parameters
```javascript
// Before
fetch(`https://gdg-hackhon-group.vercel.app/dite/get-plan/${userId}`)

// After
fetch(API_CONFIG.endpoints.getPlan(userId))
```

## 🐛 Debugging

### Check Current Environment

Open browser console (F12) and look for:
```
🌍 Environment: Development (Localhost)
🔗 API URL: http://localhost:7777
```

or

```
🌍 Environment: Production
🔗 API URL: https://gdg-hackhon-group.vercel.app
```

### Common Issues

**Issue:** API calls fail on localhost  
**Solution:** Make sure backend is running on port 7777
```bash
cd hackthon-gdg
npm run dev
```

**Issue:** CORS errors  
**Solution:** Backend has CORS enabled. Check:
- Backend is running
- URLs match exactly (no trailing slashes)

**Issue:** Still using old URLs  
**Solution:** Hard refresh browser (Ctrl + F5) to clear cache

## 🔄 Development Workflow

### Working on Localhost

1. **Start Backend**
   ```bash
   npm run dev   # Uses localhost MongoDB
   ```

2. **Open Frontend**
   - Double-click any HTML file
   - Or use VS Code Live Server
   
3. **All API calls automatically use `http://localhost:7777`**

### Testing Production Build Locally

1. **Start Backend in Production Mode**
   ```bash
   npm start   # Uses MongoDB Atlas
   ```

2. **Open Frontend**
   - Still uses localhost detection
   - But backend connects to Atlas

### Deploy to Production

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```

2. **Vercel Auto-Deploys**
   - Frontend and backend both use production URLs
   - Everything switched automatically

## 📋 Quick Reference

| Environment | Frontend Opened From | Backend Running | API Base URL |
|-------------|---------------------|-----------------|--------------|
| Development | Local file | `npm run dev` | `http://localhost:7777` |
| Development | Local file | `npm start` | `http://localhost:7777` |
| Production | vercel.app | Vercel | `https://gdg-hackhon-group.vercel.app` |

## 🎯 Benefits

✅ **No Manual URL Changes** - Automatic environment detection  
✅ **Safe Testing** - Test locally without affecting production  
✅ **Easy Deployment** - Push to production without code changes  
✅ **Single Source of Truth** - All URLs defined in one place  
✅ **Better Debugging** - Console logs show which environment is active  

## 🔐 Security Note

The `config.js` file only contains **public information** (URLs). Sensitive data like API keys and database credentials remain in the backend `.env` files and are never exposed to the frontend.
