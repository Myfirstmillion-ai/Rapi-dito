# Technical Documentation - UBER-Level Premium Features

## Overview

This document provides technical details about the UBER-level premium features and critical bug fixes implemented in Rapi-dito (formerly QuickRide).

---

## 🐛 Critical Bug Fixes

### 1. Race Condition in Ride Acceptance

**Problem:** Multiple drivers could accept the same ride simultaneously because the ride acceptance process wasn't atomic.

**Solution:** Implemented atomic MongoDB update using `findOneAndUpdate` with status condition.

**File:** `Backend/services/ride.service.js`

```javascript
// Before: Two separate operations (race condition possible)
await rideModel.findOneAndUpdate({ _id: rideId }, { status: "accepted" });

// After: Atomic operation with condition
const ride = await rideModel.findOneAndUpdate(
  { 
    _id: rideId, 
    status: "pending" // Only accept if still pending
  },
  { 
    status: "accepted",
    captain: captainId 
  },
  { new: true }
);

if (!ride) {
  throw new Error("Este viaje ya fue aceptado por otro conductor");
}
```

**Impact:** 
- Prevents double-booking
- Returns 409 Conflict status when ride is already accepted
- Guarantees only one driver can accept a ride

---

### 2. Enhanced Socket.io System

**Problem:** Basic socket implementation without rooms, confirmations, or proper reconnection handling.

**Solution:** Implemented robust socket system with:
- Driver/User rooms for targeted messaging
- Connection tracking with Map()
- Automatic reconnection support
- Driver registration confirmation
- Broadcast when rides become unavailable

**File:** `Backend/socket.js`

**Key Features:**

```javascript
// Driver rooms for targeted messaging
socket.join(`driver-${userId}`);

// Connection tracking
const connectedDrivers = new Map();
connectedDrivers.set(userId, {
  socketId: socket.id,
  connectedAt: new Date(),
  lastLocation: location,
});

// Registration confirmation
socket.emit("driver:registered", {
  driverId: userId,
  socketId: socket.id,
  timestamp: new Date(),
});

// Driver location updates with ride tracking
socket.on("driver:locationUpdate", async (data) => {
  const { driverId, location, rideId } = data;
  
  // Update database
  await captainModel.findByIdAndUpdate(driverId, {
    location: { type: "Point", coordinates: [location.lng, location.lat] }
  });
  
  // Notify passenger if active ride
  if (rideId) {
    io.to(`user-${ride.user._id}`).emit('driver:locationUpdated', {
      location, rideId, driverId, timestamp: new Date()
    });
  }
});
```

**Broadcast Ride Unavailability:**

**File:** `Backend/controllers/ride.controller.js`

```javascript
// After accepting a ride, notify other captains
Promise.resolve().then(async () => {
  const captainsInRadius = await mapService.getCaptainsInTheRadius(...);
  
  captainsInRadius.forEach((captain) => {
    if (captain._id.toString() !== req.captain._id.toString()) {
      sendMessageToSocketId(captain.socketId, {
        event: "ride-unavailable",
        data: { rideId: ride._id },
      });
    }
  });
});
```

---

## 🎨 UBER Design System

### Color Palette

Added comprehensive UBER colors to `Frontend/tailwind.config.js`:

```javascript
uber: {
  black: '#000000',
  white: '#FFFFFF',
  blue: '#276EF1',
  green: '#05A357',
  red: '#CD0A29',
  gray: {
    50: '#F6F6F6',
    100: '#EEEEEE',
    200: '#E2E2E2',
    300: '#CBCBCB',
    400: '#A8A8A8',
    500: '#8B8B8B',
    600: '#545454',
    700: '#333333',
  }
}
```

### Component Standards

All components follow UBER standards:
- Minimum 48px height for buttons
- 44x44px minimum touch targets
- 16px padding for inputs
- `active:scale-[0.98]` interaction feedback
- 200ms transitions
- Consistent border radius (uber-sm: 8px, uber-md: 12px, uber-lg: 16px, uber-xl: 24px)

---

## 🗺️ Live Tracking Map

### LiveTrackingMap Component

**File:** `Frontend/src/components/maps/LiveTrackingMap.jsx`

**Features:**
1. **Animated Driver Marker** - Pulse animation with custom SVG icon
2. **Pickup/Dropoff Markers** - Color-coded (blue/green)
3. **Route Visualization** - Black route line with Mapbox Directions
4. **Smooth Updates** - `easeTo()` animation for location changes
5. **ETA Overlay** - Real-time estimated arrival display
6. **Auto Fit Bounds** - Shows entire route automatically

**Usage:**

```jsx
<LiveTrackingMap
  driverLocation={[-72.4430, 7.8146]}
  pickupLocation={[-72.4500, 7.8200]}
  dropoffLocation={[-72.4600, 7.8300]}
  route={routeGeometry}
  eta={15}
  driverName="Juan Pérez"
  onMapLoad={(map) => console.log('Map loaded')}
/>
```

**Security Notes:**
- All DOM elements created using `createElement` (not `innerHTML`)
- Prevents XSS attacks through template injection

---

## 🔔 Enhanced Notifications

### Ride Request Toast

**File:** `Frontend/src/components/notifications/RideRequestToast.jsx`

**Features:**
1. **30-Second Countdown** - Visual timer with color change at 10s
2. **Sound Notification** - Preloaded audio for performance
3. **Vibration** - Haptic feedback on supported devices
4. **Rich Information** - Pickup, destination, fare, distance
5. **Auto-Reject** - Automatically rejects when timer expires

**Code Highlights:**

```javascript
// Preloaded audio (performance optimization)
let notificationAudio = new Audio('/notification.mp3');
notificationAudio.preload = 'auto';

// Countdown timer with auto-reject
useEffect(() => {
  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        onReject(); // Auto-reject when time runs out
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [onReject]);
```

---

## 📱 Mobile Navigation

### BottomNav Component

**File:** `Frontend/src/components/layout/BottomNav.jsx`

**Features:**
- Visible only on mobile (< 768px)
- 44x44px minimum touch targets
- Active state indicator
- Smooth transitions
- Fixed positioning with high z-index

**Usage:**

```jsx
<BottomNav userType="user" />
// or
<BottomNav userType="captain" />
```

---

## 🛠️ Utility Functions

### Ride Tracking Utilities

**File:** `Frontend/src/utils/rideTracking.js`

**Available Functions:**

```javascript
// Calculate distance between coordinates
calculateDistance([lng1, lat1], [lng2, lat2]) // Returns meters

// Calculate ETA
calculateETA(distanceMeters, averageSpeedKmh) // Returns minutes

// Format for display
formatDistance(meters) // "5.2 km" or "250 m"
formatDuration(seconds) // "15 min" or "1h 30min"
formatETATime(minutes) // "14:30"

// Geolocation
getCurrentPosition() // Promise<[lng, lat]>
watchPosition(callback, errorCallback) // Returns watchId
clearWatch(watchId) // Stop watching

// Validation
isValidLocation([lng, lat]) // Returns boolean
```

---

## 📊 API Changes

### New Socket Events

**Server → Client:**
- `driver:registered` - Confirmation when driver joins
- `driver:locationUpdated` - Real-time location updates for passengers
- `ride-unavailable` - Notify when ride is no longer available

**Client → Server:**
- `driver:locationUpdate` - Driver sends location with optional rideId

### Updated REST Endpoints

**POST /rides/confirm** (Backend/controllers/ride.controller.js)
- Now returns 409 Conflict if ride already accepted
- Broadcasts to other drivers asynchronously
- Error message: "Este viaje ya fue aceptado por otro conductor"

---

## 🔒 Security Improvements

### 1. DOM Security
- Replaced all `innerHTML` with `createElement` methods
- Prevents XSS attacks in map markers

### 2. Data Validation
- Fixed lat/lng typo consistency in socket handlers
- Proper coordinate validation before database updates

### 3. Race Condition Prevention
- Atomic database updates
- Status checks before modifications

---

## 🧪 Testing

### Build Status
```bash
✓ 2008 modules transformed
✓ Built in 4.05s
✓ No TypeScript errors
✓ All dependencies resolved
```

### Security Scan
```
CodeQL Analysis: 0 vulnerabilities found
```

### Code Review
All critical feedback addressed:
- ✅ Fixed innerHTML security issues
- ✅ Fixed lat/lng inconsistency
- ✅ Optimized audio loading
- ✅ Fixed CSS class issues

---

## 📈 Performance

### Bundle Size
- **Before:** 476.91 kB (gzipped: 155.46 kB)
- **After:** 477.28 kB (gzipped: 155.56 kB)
- **Increase:** +370 bytes (minimal)

### Optimizations
1. Preloaded notification audio
2. Efficient socket event handlers
3. Debounced location updates
4. Lazy map loading

---

## 🚀 Deployment Checklist

### Environment Variables

**Backend (.env):**
```env
PORT=3000
MONGODB_DEV_URL=mongodb://127.0.0.1:27017/quickRide
MONGODB_PROD_URL=<your-mongodb-atlas-url>
JWT_SECRET=<your-jwt-secret>
GOOGLE_MAPS_API=<your-google-maps-api-key>
```

**Frontend (.env):**
```env
VITE_SERVER_URL=http://localhost:3000
VITE_ENVIRONMENT=development
VITE_RIDE_TIMEOUT=90000
VITE_MAPBOX_TOKEN=<your-mapbox-token>
```

### Database Indexes

Ensure MongoDB has geospatial index on captain location:

```javascript
captainModel.index({ location: '2dsphere' });
```

---

## 🔄 Migration Guide

### For Existing Installations

1. **Update Database Schema** - No changes needed
2. **Update Environment Variables** - Add VITE_MAPBOX_TOKEN
3. **Clear Client Cache** - Force refresh for new components
4. **Test Socket Events** - Verify driver:registered event

### Breaking Changes
- None - Fully backward compatible

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Drivers not receiving notifications
- ✅ **Fixed** - Socket listeners properly placed
- Verify socket connection with browser console
- Check `driver:registered` event

**Issue:** Multiple drivers accepting same ride
- ✅ **Fixed** - Atomic MongoDB update
- Returns 409 status code
- Shows error toast to driver

**Issue:** Map not loading
- Check VITE_MAPBOX_TOKEN in .env
- Verify token has required scopes
- Check browser console for errors

---

## 👥 Contributors

This implementation includes:
- Critical bug fixes for production stability
- UBER-level design system
- Real-time tracking infrastructure
- Enhanced security measures
- Mobile-first responsive design

---

## 📄 License

MIT License - See LICENSE file for details
