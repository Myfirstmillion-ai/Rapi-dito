# Quick Deployment Reference Card

## 🚀 Essential Environment Variables

### Frontend (Vercel)
```bash
VITE_SERVER_URL=https://your-backend-url.com
VITE_ENVIRONMENT=production
VITE_MAPBOX_TOKEN=pk.your_mapbox_token
```

### Backend (Render/Railway/etc.)
```bash
CLIENT_URL=https://your-vercel-app.vercel.app
ENVIRONMENT=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secure_secret
MAPBOX_TOKEN=pk.your_mapbox_token
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## ⚠️ Common Mistakes to Avoid

❌ **DON'T** include trailing slashes in URLs
```bash
# Wrong
VITE_SERVER_URL=https://api.example.com/

# Correct
VITE_SERVER_URL=https://api.example.com
```

❌ **DON'T** mix HTTP and HTTPS
```bash
# Wrong (mixed protocols)
VITE_SERVER_URL=http://api.example.com
CLIENT_URL=https://app.vercel.app

# Correct (both HTTPS)
VITE_SERVER_URL=https://api.example.com
CLIENT_URL=https://app.vercel.app
```

❌ **DON'T** forget to set CLIENT_URL on backend
```bash
# This will cause CORS errors in production
# Backend needs to know which origin to allow
```

## ✅ Pre-Deployment Checklist

### Backend
- [ ] Backend deployed and accessible via HTTPS
- [ ] `CLIENT_URL` set to exact Vercel domain
- [ ] `ENVIRONMENT` set to `production`
- [ ] MongoDB connection working
- [ ] All API keys configured (Mapbox, Cloudinary, Email)

### Frontend  
- [ ] `VITE_SERVER_URL` set to backend HTTPS URL
- [ ] `VITE_ENVIRONMENT` set to `production`
- [ ] `VITE_MAPBOX_TOKEN` configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] Root directory set to `Frontend` in Vercel

### After Deployment
- [ ] Frontend loads without console errors
- [ ] Can navigate to login/signup pages
- [ ] Login/signup works correctly
- [ ] Socket.io connection establishes (check DevTools)
- [ ] Real-time features work (location updates, ride requests)

## 🔍 Troubleshooting

### "Network Error" during login
**Solution:** Check `VITE_SERVER_URL` is set correctly in Vercel

### CORS errors in production
**Solution:** Verify `CLIENT_URL` on backend matches your Vercel domain exactly

### Socket.io connection fails
**Solution:** Ensure backend supports WebSockets and CLIENT_URL is set

### "VITE_SERVER_URL is not set" error
**Solution:** Add environment variable in Vercel project settings and redeploy

## 📞 Quick Debug Commands

```bash
# Check if backend is reachable
curl https://your-backend-url.com

# Check CORS headers
curl -I -H "Origin: https://your-vercel-app.vercel.app" https://your-backend-url.com

# Test local build
cd Frontend && npm run build && npm run preview
```

## 🔗 Useful Links
- Full Guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- Technical Details: `NETWORK_CONNECTIVITY_FIX_SUMMARY.md`
- Backend Setup: `Backend/.env.example`
- Frontend Setup: `Frontend/.env.example`
