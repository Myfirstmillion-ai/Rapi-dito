# PHASE 3: BACKEND DEEP DIVE
## Comprehensive Backend Architecture & Security Analysis

**Audit Date:** December 9, 2025  
**Project:** Rapi-dito (Ride-hailing Application)  
**Framework:** Node.js + Express 4.21.2  
**Database:** MongoDB + Mongoose 8.8.4  
**Real-time:** Socket.io 4.8.1

---

## 📊 EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| **Total Routes** | 35 endpoints |
| **Route Files** | 8 |
| **Controllers** | 8 |
| **Models** | 6 |
| **Services** | 8 |
| **Middleware** | 3 (authUser, authCaptain, authAdmin) |
| **WebSocket Events** | 15 |
| **Security Vulnerabilities** | 10 (2 Critical, 4 High) |
| **Health Score** | 75/100 |

---

## 3.1 API ROUTE INVENTORY

### Authentication Routes (`/user`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 1 | POST | `/user/register` | `userController.registerUser` | None | ✅ express-validator | ✅ |
| 2 | POST | `/user/verify-email` | `userController.verifyEmail` | None | ⚠️ Basic | ✅ |
| 3 | POST | `/user/login` | `userController.loginUser` | None | ✅ Email validation | ✅ |
| 4 | POST | `/user/update` | `userController.updateUserProfile` | authUser | ✅ Full validation | ✅ |
| 5 | GET | `/user/profile` | `userController.userProfile` | authUser | None needed | ✅ |
| 6 | GET | `/user/logout` | `userController.logoutUser` | authUser | None needed | ✅ |
| 7 | POST | `/user/reset-password` | `userController.resetPassword` | None | ✅ Token + password | ✅ |

### Captain Routes (`/captain`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 8 | POST | `/captain/register` | `captainController.registerCaptain` | None | ✅ Full validation | ✅ |
| 9 | POST | `/captain/verify-email` | `captainController.verifyEmail` | None | ⚠️ Basic | ✅ |
| 10 | POST | `/captain/login` | `captainController.loginCaptain` | None | ✅ Email validation | ✅ |
| 11 | POST | `/captain/update` | `captainController.updateCaptainProfile` | authCaptain | ✅ Partial | ✅ |
| 12 | GET | `/captain/profile` | `captainController.captainProfile` | authCaptain | None needed | ✅ |
| 13 | GET | `/captain/logout` | `captainController.logoutCaptain` | authCaptain | None needed | ✅ |
| 14 | POST | `/captain/reset-password` | `captainController.resetPassword` | None | ✅ Token + password | ✅ |

### Ride Routes (`/ride`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 15 | GET | `/ride/chat-details/:id` | `rideController.chatDetails` | **⚠️ NONE** | ❌ Missing | 🔴 CRITICAL |
| 16 | POST | `/ride/create` | `rideController.createRide` | authUser | ✅ Full | ✅ |
| 17 | GET | `/ride/get-fare` | `rideController.getFare` | authUser | ✅ Query params | ✅ |
| 18 | POST | `/ride/confirm` | `rideController.confirmRide` | authCaptain | ✅ MongoId | ✅ |
| 19 | GET | `/ride/cancel` | `rideController.cancelRide` | **⚠️ NONE** | ✅ MongoId | 🔴 CRITICAL |
| 20 | GET | `/ride/start-ride` | `rideController.startRide` | authCaptain | ✅ OTP + rideId | ✅ |
| 21 | POST | `/ride/end-ride` | `rideController.endRide` | authCaptain | ✅ MongoId | ✅ |

### Rating Routes (`/ratings`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 22 | POST | `/ratings/submit` | `ratingController.submitRating` | authUserOrCaptain | ✅ Full | ✅ |
| 23 | GET | `/ratings/:rideId/status` | `ratingController.getRatingStatus` | authUserOrCaptain | ✅ Param | ✅ |

### Map Routes (`/map`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 24 | GET | `/map/get-coordinates` | `mapController.getCoordinates` | **⚠️ NONE** | ✅ Query | ⚠️ |
| 25 | GET | `/map/get-distance-time` | `mapController.getDistanceTime` | authUser | ✅ Query | ✅ |
| 26 | GET | `/map/get-suggestions` | `mapController.getAutoCompleteSuggestions` | authUser | ✅ Query | ✅ |
| 27 | GET | `/map/get-address` | `mapController.getAddressFromCoordinates` | authUser | ✅ Query | ✅ |

### Mail Routes (`/mail`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 28 | GET | `/mail/verify-user-email` | `mailController.sendVerificationEmail` | authUser | None needed | ✅ |
| 29 | GET | `/mail/verify-captain-email` | `mailController.sendVerificationEmail` | authCaptain | None needed | ✅ |
| 30 | POST | `/mail/:userType/reset-password` | `mailController.forgotPassword` | None | ⚠️ Email only | ✅ |

### Upload Routes (`/upload`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 31 | POST | `/upload/user/profile-image` | `uploadController.uploadUserProfileImage` | authUser | File filter | ✅ |
| 32 | POST | `/upload/captain/profile-image` | `uploadController.uploadCaptainProfileImage` | authCaptain | File filter | ✅ |
| 33 | DELETE | `/upload/profile-image` | `uploadController.deleteProfileImage` | authUser/Captain | ✅ | ✅ |

### Admin Routes (`/admin`)

| # | Method | Path | Handler | Auth | Validation | Status |
|---|--------|------|---------|------|------------|--------|
| 34 | GET | `/admin/captains` | `adminController.getAllCaptains` | authAdmin | None needed | ✅ |
| 35 | PATCH | `/admin/captain/:id/status` | `adminController.toggleCaptainStatus` | authAdmin | ⚠️ No body validation | ⚠️ |

---

## 3.2 SECURITY ANALYSIS

### 🔴 CRITICAL ISSUES

#### 1. Unprotected Ride Endpoints
```javascript
// routes/ride.routes.js:7
router.get('/chat-details/:id', rideController.chatDetails)  // NO AUTH!

// routes/ride.routes.js:31
router.get('/cancel', query('rideId').isMongoId()..., rideController.cancelRide)  // NO AUTH!
```
**Risk:** Anyone can access ride chat details or cancel rides without authentication.

**Fix:**
```javascript
router.get('/chat-details/:id', authUserOrCaptain, rideController.chatDetails)
router.get('/cancel', authMiddleware.authUser, query('rideId')..., rideController.cancelRide)
```

#### 2. Unprotected Map Coordinates Endpoint
```javascript
// routes/maps.routes.js:7
router.get('/get-coordinates', query('address')..., mapController.getCoordinates)
```
**Risk:** API abuse, rate limiting bypass potential.

**Fix:** Add `authUser` middleware.

### 🟠 HIGH PRIORITY ISSUES

#### 3. JWT Secret Strength
```javascript
// .env.example
JWT_SECRET=tu_jwt_secret_aqui  // Weak example
```
**Risk:** If developers use weak secrets, tokens can be brute-forced.

**Fix:** Document minimum 256-bit random secret requirement.

#### 4. No Rate Limiting
**Risk:** DoS attacks, brute force attempts on login endpoints.

**Fix:** Add express-rate-limit:
```javascript
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});
app.use('/user/login', authLimiter);
app.use('/captain/login', authLimiter);
```

#### 5. Password Not Hashed in Update
```javascript
// user.controller.js:115 - updateUserProfile
// Password update not allowed in this endpoint (good!)
// But no explicit check to prevent password in body
```

#### 6. Token Blacklist Not Indexed
```javascript
// blacklistToken.model.js - needs TTL index for cleanup
// No automatic expiration of blacklisted tokens
```
**Fix:** Add TTL index:
```javascript
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
```

### 🟡 MEDIUM PRIORITY ISSUES

#### 7. Missing CORS Whitelist in Production
```javascript
// server.js:39-44
origin: process.env.ENVIRONMENT === "production"
  ? (process.env.CLIENT_URL || (() => { process.exit(1); })())
  : "*"
```
**Analysis:** Good - exits if CLIENT_URL not set. ✅

#### 8. Socket.io Events Not Authenticated
```javascript
// socket.js - Most events trust userId without verification
socket.on("join", async (data) => {
  const { userId, userType } = data;  // Not verified!
  ...
});
```
**Risk:** User impersonation via socket.

#### 9. Console Statements in Production
```javascript
// 47 console.log/error statements across backend
```
**Fix:** Use proper logging service (already exists but underutilized).

#### 10. Error Stack Traces Exposed
```javascript
// rating.controller.js:155
details: process.env.NODE_ENV === 'development' ? err.stack : undefined
```
**Good:** Conditional exposure. ✅ (Only in dev)

---

## 3.3 DATABASE ANALYSIS

### Models

| Model | Collections | Indexes | Issues |
|-------|-------------|---------|--------|
| User | users | email (unique), socketId | ✅ Good |
| Captain | captains | email, location (2dsphere), vehicle.type+location, socketId, status | ✅ Good |
| Ride | rides | user+status, captain+status, status+createdAt, _id+status | ✅ Good |
| BlacklistToken | blacklisttokens | **⚠️ None - needs TTL** | ⚠️ |
| BackendLog | backendlogs | **⚠️ Unknown** | ⚠️ |
| FrontendLog | frontendlogs | **⚠️ Unknown** | ⚠️ |

### Query Performance

**Good Practices:**
- Geospatial index on `Captain.location` for `getCaptainsInTheRadius` ✅
- Compound indexes on Ride model for user/captain lookups ✅
- Atomic updates used for ride confirmation (race condition prevention) ✅

**Issues:**
- No pagination on `/admin/captains` - potential memory issue with large datasets
- No pagination on ride history endpoints
- Blacklist token collection will grow indefinitely

### Recommended Index Additions

```javascript
// blacklistToken.model.js
blacklistTokenSchema.index({ token: 1 });
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // TTL: 24h
```

---

## 3.4 WEBSOCKET ANALYSIS

### Socket Events Inventory

| Event | Direction | Auth | Handler | Purpose |
|-------|-----------|------|---------|---------|
| `connection` | In | None | socket.js:47 | Initial connection |
| `join` | In | ⚠️ None | socket.js:61 | Register user/captain |
| `log` | In | None | socket.js:51 | Frontend logging (prod) |
| `driver:toggleOnline` | In | ⚠️ None | socket.js:88 | Toggle driver status |
| `update-location-captain` | In | ⚠️ None | socket.js:151 | Update driver location |
| `driver:locationUpdate` | In | ⚠️ None | socket.js:177 | Enhanced location update |
| `join-room` | In | None | socket.js:223 | Join chat room |
| `typing` | In | None | socket.js:229 | Typing indicator |
| `stop-typing` | In | None | socket.js:233 | Stop typing |
| `message` | In | None | socket.js:237 | Send chat message |
| `disconnect` | In | N/A | socket.js:257 | Client disconnect |
| `new-ride` | Out | N/A | ride.controller.js | Broadcast new ride |
| `ride-confirmed` | Out | N/A | ride.controller.js | Notify user |
| `ride-taken` | Out | N/A | ride.controller.js | Notify other drivers |
| `rating:request` | Out | N/A | ride.controller.js | Request rating |

### WebSocket Security Issues

1. **No Socket Authentication** - Events like `join`, `driver:toggleOnline` don't verify identity
2. **No Message Validation** - Chat messages not sanitized
3. **Driver Tracking Vulnerable** - Any client can claim to be any driver

**Recommended Fix:**
```javascript
// Add JWT verification on socket connection
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  
  try {
    // Check blacklist
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) return next(new Error('Token blacklisted'));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userType = decoded.userType;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});
```

---

## 3.5 ERROR HANDLING ASSESSMENT

### Error Handling Patterns

| Pattern | Usage | Quality |
|---------|-------|---------|
| `express-async-handler` | Controllers | ✅ Good |
| `try-catch` blocks | Manual in some places | ✅ Good |
| `validationResult` | Route validation | ✅ Good |
| Custom error messages | Spanish/English mixed | ⚠️ Inconsistent |
| HTTP status codes | Mostly correct | ✅ Good |

### Error Response Consistency

**Inconsistent:**
```javascript
// Some endpoints:
res.status(400).json({ message: "Error message" })

// Other endpoints:
res.status(400).json({ errors: errors.array() })

// Rating endpoint:
res.status(500).json({ message: "...", error: "...", details: "..." })
```

**Recommendation:** Standardize error response format:
```javascript
{
  success: false,
  message: "Human readable message",
  code: "ERROR_CODE",
  errors: [] // validation errors if applicable
}
```

---

## 3.6 SERVICE LAYER ANALYSIS

### Services Quality

| Service | Purpose | LOC | Quality |
|---------|---------|-----|---------|
| ride.service.js | Ride CRUD operations | 204 | ✅ Good - atomic updates |
| map.service.js | Mapbox API integration | 248 | ✅ Good - well documented |
| user.service.js | User creation | ~50 | ✅ Good |
| captain.service.js | Captain creation | ~80 | ✅ Good |
| mail.service.js | Email sending | 33 | ✅ Good |
| upload.service.js | Cloudinary integration | 67 | ✅ Good |
| logging.service.js | DB logging | 44 | ✅ Good |
| active.service.js | Keep-alive pings | ~20 | ✅ Good |

### Business Logic Highlights

**Race Condition Handling (ride.service.js):**
```javascript
// Excellent: Atomic update prevents double-booking
const ride = await rideModel.findOneAndUpdate(
  { _id: rideId, status: "pending" },  // Only if still pending
  { status: "accepted", captain: captain._id },
  { new: true }
);
if (!ride) throw new Error("Este viaje ya fue aceptado por otro conductor");
```

**Fare Calculation (ride.service.js):**
```javascript
// COP (Colombian Pesos) pricing
baseFare: { car: 5000, bike: 3000 }
perKmRate: { car: 1500, bike: 1000 }
perMinuteRate: { car: 200, bike: 150 }
```

---

## 3.7 AUTHENTICATION & AUTHORIZATION

### Middleware Analysis

| Middleware | File | Purpose | Security |
|------------|------|---------|----------|
| `authUser` | auth.middleware.js | User token verification | ✅ Good |
| `authCaptain` | auth.middleware.js | Captain token verification | ✅ Good |
| `authAdmin` | auth.middleware.js | Admin email-based access | ✅ Good |

### Token Flow

1. **Generation:** JWT with 24h expiry
2. **Storage:** Client-side (localStorage warned against in frontend audit)
3. **Verification:** Header `token` or `Authorization: Bearer ...` or cookie
4. **Blacklisting:** On logout, token added to blacklist collection

### Authorization Levels

| Level | Access | Implementation |
|-------|--------|----------------|
| Public | No auth | Direct route access |
| User | User token | `authUser` middleware |
| Captain | Captain token | `authCaptain` middleware |
| Admin | Email whitelist | `authAdmin` + SUPER_ADMIN_EMAIL env var |

### Issues

1. **Admin Check is Email-Based Only**
   ```javascript
   const SUPER_ADMIN_EMAILS = [process.env.SUPER_ADMIN_EMAIL || "admin@rapidito.com"]
   ```
   - No dedicated admin role/flag in model
   - Hardcoded fallback email is a security risk

---

## 3.8 MISSING ENDPOINTS (for NEW Features)

### For Saved Locations Feature

| Endpoint | Method | Path | Purpose |
|----------|--------|------|---------|
| Create | POST | `/user/locations` | Save home/work/favorite |
| List | GET | `/user/locations` | Get all saved locations |
| Update | PUT | `/user/locations/:id` | Update saved location |
| Delete | DELETE | `/user/locations/:id` | Remove saved location |

### For Search History

| Endpoint | Method | Path | Purpose |
|----------|--------|------|---------|
| Record | POST | `/user/search-history` | Save search |
| List | GET | `/user/search-history` | Get recent searches |
| Clear | DELETE | `/user/search-history` | Clear history |

### For Ride History Enhancement

| Endpoint | Method | Path | Purpose |
|----------|--------|------|---------|
| List | GET | `/user/rides?page=1&limit=10` | **⚠️ Missing pagination** |
| Stats | GET | `/user/rides/stats` | Ride statistics |

---

## 3.9 PERFORMANCE RECOMMENDATIONS

### Database Optimizations

1. **Add Pagination to List Endpoints**
```javascript
// admin.controller.js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const captains = await captainModel
  .find({})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean(); // Use lean() for read-only queries
```

2. **Add TTL Index to Blacklist Tokens**
3. **Consider Redis for Session/Token Storage**

### Caching Opportunities

1. **Map API Responses** - Cache geocoding results
2. **Captain Locations** - Cache active driver positions
3. **Fare Calculations** - Cache for same pickup/destination pairs

### Connection Pooling

MongoDB connection pooling is handled by Mongoose default settings - adequate for current scale.

---

## 3.10 LOGGING & MONITORING

### Current State

- **Morgan** middleware for HTTP logging (dev/prod modes)
- **Custom DB Logging** service for production
- **Console statements** throughout code (47 total)

### Recommendations

1. **Replace console with structured logger:**
```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

2. **Add Request ID Tracking**
3. **Implement Health Check Endpoint:**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

---

## 3.11 CRITICAL ISSUES SUMMARY

### 🔴 CRITICAL (Fix Immediately)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | Unprotected `/ride/chat-details/:id` | ride.routes.js:7 | Add `authUserOrCaptain` middleware |
| 2 | Unprotected `/ride/cancel` | ride.routes.js:31 | Add `authUser` middleware |

### 🟠 HIGH PRIORITY

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 3 | Unprotected `/map/get-coordinates` | maps.routes.js:7 | Add authentication |
| 4 | No rate limiting on auth endpoints | server.js | Add express-rate-limit |
| 5 | Socket events not authenticated | socket.js | Add JWT verification |
| 6 | No TTL on blacklist tokens | blacklistToken.model.js | Add TTL index |

### 🟡 MEDIUM PRIORITY

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 7 | No pagination on list endpoints | admin.controller.js | Add pagination |
| 8 | Inconsistent error response format | All controllers | Standardize format |
| 9 | Console statements in production | 47 occurrences | Use logging service |
| 10 | Mixed language error messages | Controllers | Standardize to Spanish |

---

## 3.12 ACTION ITEMS

### Immediate Actions (This Week)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 1 | Add `authUserOrCaptain` to `/ride/chat-details/:id` | ride.routes.js | 5 min |
| 2 | Add auth to `/ride/cancel` | ride.routes.js | 5 min |
| 3 | Add auth to `/map/get-coordinates` | maps.routes.js | 5 min |
| 4 | Add rate limiting to auth routes | server.js | 30 min |

### Short-term Actions (This Month)

| # | Task | Effort |
|---|------|--------|
| 5 | Add socket authentication | 2 hours |
| 6 | Add TTL index to blacklist tokens | 15 min |
| 7 | Standardize error response format | 2 hours |
| 8 | Add pagination to list endpoints | 1 hour |
| 9 | Replace console with logging | 2 hours |

### Long-term Actions (Next Quarter)

| # | Task | Effort |
|---|------|--------|
| 10 | Implement saved locations endpoints | 1 day |
| 11 | Add Redis caching | 2 days |
| 12 | Implement search history | 1 day |
| 13 | Add comprehensive API documentation | 2 days |
| 14 | Security penetration testing | 3 days |

---

## VALIDATION CHECKLIST

- [x] Complete route inventory documented
- [x] Security analysis performed
- [x] Database schema reviewed
- [x] WebSocket events catalogued
- [x] Error handling assessed
- [x] Service layer analyzed
- [x] Authentication/authorization reviewed
- [x] Missing endpoints identified
- [x] Performance recommendations made
- [x] Logging assessment completed
- [x] Critical issues prioritized
- [x] Action items documented

---

**Phase 3 Status:** ✅ COMPLETE  
**Next Phase:** Phase 4 - Integration Testing & Deployment Readiness

---

**Report Generated:** December 9, 2025
