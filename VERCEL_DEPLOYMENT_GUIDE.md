# Vercel Deployment Guide for Rapi-dito

This guide provides instructions for deploying the Rapi-dito application to Vercel.

## Prerequisites

Before deploying, ensure you have:
1. A Vercel account
2. Backend deployed and accessible (e.g., on Render, Railway, or another hosting service)
3. MongoDB database setup
4. All required API keys (Mapbox, Cloudinary, etc.)

## Frontend Deployment (Vercel)

### Step 1: Prepare Environment Variables

In your Vercel project settings, add the following environment variables:

```bash
# Backend API URL - REQUIRED
VITE_SERVER_URL=https://your-backend-url.com

# Environment
VITE_ENVIRONMENT=production

# Mapbox Token (get from https://account.mapbox.com/)
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here

# Ride Timeout (optional, defaults to 90000ms)
VITE_RIDE_TIMEOUT=90000
```

**CRITICAL**: `VITE_SERVER_URL` must be set to your backend URL. Do NOT include a trailing slash.

### Step 2: Configure Vercel Settings

The `Frontend/vercel.json` file is already configured for SPA routing:

```json
{
    "rewrites":[
        {"source": "/(.*)", "destination": "/"}
    ]
}
```

### Step 3: Deploy

1. Connect your GitHub repository to Vercel
2. Set the root directory to `Frontend`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

## Backend Deployment

### Step 1: Environment Variables

Ensure your backend has these environment variables set:

```bash
# CRITICAL: Must match your Vercel frontend URL
CLIENT_URL=https://your-vercel-app.vercel.app

# Environment
ENVIRONMENT=production

# MongoDB Connection
MONGO_URI=mongodb+srv://...

# JWT Secret
JWT_SECRET=your_secure_jwt_secret

# Mapbox Token
MAPBOX_TOKEN=pk.your_mapbox_token

# Email Configuration (Gridsend or similar)
SMTP_HOST=smtp.gridsend.co
SMTP_PORT=587
SMTP_SECURE=false
MAIL_USER=your_email_user
MAIL_PASS=your_email_password
MAIL_FROM=noreply@yourdomain.com

# Frontend URL (for email links)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Configuration
SUPER_ADMIN_EMAIL=admin@yourdomain.com
```

**CRITICAL**: `CLIENT_URL` must be set to your Vercel frontend URL for CORS to work correctly.

## Common Issues and Solutions

### Issue: "Network Error" or "Status 0" during login

**Cause**: CORS misconfiguration or incorrect environment variables

**Solutions**:
1. Verify `VITE_SERVER_URL` is set correctly in Vercel
2. Verify `CLIENT_URL` is set correctly on the backend
3. Ensure both URLs use HTTPS (no mixed HTTP/HTTPS)
4. Check that URLs don't have trailing slashes

### Issue: Socket.io connection fails

**Cause**: WebSocket configuration or CORS issues

**Solutions**:
1. Ensure backend allows WebSocket connections
2. Verify `CLIENT_URL` matches your frontend domain
3. Check that your hosting provider supports WebSockets

### Issue: "VITE_SERVER_URL is not set" error

**Cause**: Environment variable not configured in Vercel

**Solutions**:
1. Go to Vercel Project Settings > Environment Variables
2. Add `VITE_SERVER_URL` with your backend URL
3. Redeploy the application

## Verification Steps

After deployment, verify:

1. ✅ Frontend loads without errors
2. ✅ Can navigate to login/signup pages
3. ✅ Network tab shows requests going to correct backend URL
4. ✅ CORS headers are present in responses
5. ✅ Login/signup works correctly
6. ✅ Socket.io connection establishes
7. ✅ Real-time features work (location updates, ride requests)

## Security Checklist

- [ ] All environment variables use HTTPS URLs
- [ ] JWT_SECRET is a strong, random string
- [ ] Database credentials are secure
- [ ] API keys are not committed to git
- [ ] CORS is restricted to your specific domain in production

## Support

If you encounter issues:
1. Check browser console for specific error messages
2. Check Vercel deployment logs
3. Check backend server logs
4. Verify all environment variables are set correctly
5. Test API endpoints directly using Postman or curl

## Notes

- The app uses `withCredentials: true` for all API requests to support CORS authentication
- Authentication uses JWT tokens stored in localStorage and passed via headers
- Socket.io is configured with automatic reconnection
- The backend uses environment-specific CORS configuration
