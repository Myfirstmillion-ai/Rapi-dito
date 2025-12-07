import { useEffect, useRef, useState, useContext, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SocketDataContext } from "../../contexts/SocketContext";
import { cn } from "../../utils/cn";
import { calculateDistance, calculateETA, formatDistance, formatDuration } from "../../utils/rideTracking";

// Set Mapbox access token
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
if (!mapboxToken) {
  console.warn("⚠️ VITE_MAPBOX_TOKEN not found in environment variables");
}
mapboxgl.accessToken = mapboxToken || "";

// Premium CDN marker icons (high-quality 3D assets)
const PREMIUM_ICONS = {
  car: "https://cdn-icons-png.flaticon.com/512/3097/3097152.png", // Premium 3D car icon
  bike: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Premium 3D motorcycle icon
  carAlt: "https://img.icons8.com/3d-fluency/512/car--v1.png", // Alternative 3D car
  bikeAlt: "https://img.icons8.com/3d-fluency/512/motorbike.png", // Alternative 3D bike
};

// 🎯 Configuration constants for maintainability
const CONFIG = {
  INITIAL_ROUTE_UPDATE_INTERVAL: 30000, // 30 seconds for first 5 updates
  STANDARD_ROUTE_UPDATE_INTERVAL: 60000, // 60 seconds thereafter
  LOCATION_TIMEOUT_THRESHOLD: 30000, // 30 seconds before GPS timeout
  INTERPOLATION_DURATION: 2000, // 2 seconds for smooth marker movement
  MAP_FIT_BOUNDS_PADDING: 50, // 50px padding (enterprise requirement)
  MAP_FIT_BOUNDS_DURATION: 1500, // 1.5 seconds transition
  ROUTE_RECALC_THRESHOLD: 5, // Number of fast updates before slowing down
};

/**
 * ⭐ ELITE WORLD-CLASS REAL-TIME TRACKING MAP COMPONENT ⭐
 * 
 * Enterprise-Level ($100k+) Real-Time Tracking System
 * Implements UBER/Lyft-level premium tracking experience
 * 
 * 🎯 DUAL-PHASE TRACKING SYSTEM:
 * 
 * PHASE 1 - PRE-PICKUP (Driver Acceptance → OTP Validation):
 *   - Shows: Driver icon + User icon
 *   - Route: Driver current location → User pickup location
 *   - Updates: Real-time driver position with smooth interpolation
 *   - Trigger: When ride status is "accepted" or "pending"
 * 
 * PHASE 2 - IN-PROGRESS (Post-OTP → Destination):
 *   - Clears: Previous route immediately
 *   - Route: Current location → Final destination
 *   - Updates: Continuous tracking with auto-fit bounds
 *   - Trigger: When ride status changes to "ongoing"
 * 
 * 🚀 PREMIUM FEATURES:
 *   - Smooth linear interpolation (no marker "jumping")
 *   - Bearing-based rotation (vehicle points forward)
 *   - Premium 3D icons from CDN (high-quality assets)
 *   - Intelligent auto-fit bounds (50px padding)
 *   - Zero-bug error handling (null/undefined guards)
 *   - Optimized Socket.io (no unnecessary re-renders)
 * 
 * @param {Object} props.driverLocation - {lat, lng} Driver's current GPS position
 * @param {Object} props.pickupLocation - {lat, lng} User pickup coordinates
 * @param {Object} props.dropoffLocation - {lat, lng} Final destination coordinates
 * @param {string} props.rideId - Unique ride identifier
 * @param {string} props.rideStatus - "pending" | "accepted" | "ongoing" | "completed"
 * @param {string} props.userType - "user" | "captain" (determines camera behavior)
 * @param {string} props.vehicleType - "car" | "bike" (selects icon)
 * @param {Function} props.onETAUpdate - Callback for ETA updates: ({eta, distance}) => void
 * @param {string} props.className - Additional Tailwind classes
 */
function EliteTrackingMap({
  driverLocation,
  pickupLocation,
  dropoffLocation,
  rideId,
  rideStatus = "accepted",
  userType = "user",
  vehicleType = "car",
  onETAUpdate,
  className,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const driverMarker = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const routeLayer = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const { socket } = useContext(SocketDataContext);
  const lastDriverLocation = useRef(null);
  const updateInterval = useRef(null);
  
  // 🎯 Enhanced tracking states for enterprise-level reliability
  const [trackingError, setTrackingError] = useState(null);
  const [locationTimeout, setLocationTimeout] = useState(false);
  const [lastLocationUpdate, setLastLocationUpdate] = useState(Date.now());
  const locationTimeoutRef = useRef(null);
  const routeRecalculationCount = useRef(0);
  const previousPhaseRef = useRef(null); // Track phase changes for route clearing
  const animationFrameRef = useRef(null); // For smooth interpolation
  const targetLocationRef = useRef(null); // Target position for interpolation

  // Determine vehicle icon (premium 3D assets)
  const vehicleIcon = vehicleType === "bike" ? PREMIUM_ICONS.bike : PREMIUM_ICONS.car;
  
  // Determine tracking phase (critical for dual-phase logic)
  const isPrePickup = rideStatus === "pending" || rideStatus === "accepted";
  const isInProgress = rideStatus === "ongoing";
  const currentPhase = isPrePickup ? "PRE_PICKUP" : isInProgress ? "IN_PROGRESS" : "IDLE";

  /**
   * 🎯 Calculate bearing between two points for vehicle rotation
   * Returns angle in degrees (0-360) for CSS transform rotation
   */
  const calculateBearing = useCallback((lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return 0;
    
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  }, []);

  /**
   * 🎯 Smooth linear interpolation for marker movement
   * Prevents "jumping" by animating between GPS updates
   */
  const interpolatePosition = useCallback((start, end, progress) => {
    if (!start || !end) return end;
    return {
      lat: start.lat + (end.lat - start.lat) * progress,
      lng: start.lng + (end.lng - start.lng) * progress,
    };
  }, []);

  /**
   * 🎯 Validate coordinates to prevent crashes
   * Returns true if coordinates are valid GPS values
   */
  const validateCoordinates = useCallback((coords) => {
    if (!coords) return false;
    const { lat, lng } = coords;
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  }, []);

  // Initialize map with enhanced error handling
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    // 🛡️ Validate initial coordinates to prevent white screen
    let initialCenter = [-72.4430, 7.8146]; // Default: San Antonio del Táchira
    
    if (validateCoordinates(driverLocation)) {
      initialCenter = [driverLocation.lng, driverLocation.lat];
    } else if (validateCoordinates(pickupLocation)) {
      initialCenter = [pickupLocation.lng, pickupLocation.lat];
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: initialCenter,
        zoom: 14,
        pitch: 0,
        bearing: 0,
        preserveDrawingBuffer: true,
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);
        
        // Add route source (empty initially)
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        // Add route layer with premium styling
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4A90E2', // UBER blue
            'line-width': 5,
            'line-opacity': 0.7
          }
        });
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e.error);
        setTrackingError('MAP_ERROR');
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    } catch (error) {
      console.error('Failed to initialize Mapbox map:', error);
      setTrackingError('MAP_INIT_ERROR');
    }

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.current?.remove();
    };
  }, [validateCoordinates]);

  // 🎨 Create premium driver marker with high-quality 3D icon
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    if (!validateCoordinates(driverLocation)) return;

    if (driverMarker.current) {
      driverMarker.current.remove();
    }

    // Create premium marker element with CDN icon
    const el = document.createElement('div');
    el.className = 'driver-marker-elite-premium';
    el.style.cssText = `
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    `;
    
    // Premium icon container with shadow
    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(145deg, #ffffff, #f0f0f0);
      border: 3px solid white;
      box-shadow: 0 8px 16px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;
    
    // High-quality CDN icon
    const icon = document.createElement('img');
    icon.src = vehicleIcon;
    icon.alt = vehicleType === 'bike' ? 'Moto' : 'Carro';
    icon.style.cssText = `
      width: 36px;
      height: 36px;
      object-fit: contain;
      user-select: none;
      pointer-events: none;
    `;
    
    // Fallback in case CDN icon fails to load
    icon.onerror = () => {
      icon.style.display = 'none';
      const fallbackEmoji = document.createElement('span');
      fallbackEmoji.textContent = vehicleType === 'bike' ? '🛵' : '🚗';
      fallbackEmoji.style.cssText = 'font-size: 28px;';
      iconContainer.appendChild(fallbackEmoji);
    };
    
    iconContainer.appendChild(icon);
    el.appendChild(iconContainer);

    // Premium pulse animation on hover
    const style = document.createElement('style');
    if (!document.getElementById('elite-marker-styles')) {
      style.id = 'elite-marker-styles';
      style.textContent = `
        @keyframes pulse-elite-premium {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 16px rgba(0,0,0,0.25); }
          50% { transform: scale(1.08); box-shadow: 0 12px 24px rgba(0,0,0,0.35); }
        }
        .driver-marker-elite-premium:hover > div {
          animation: pulse-elite-premium 1.5s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    driverMarker.current = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
      rotationAlignment: 'map', // Allow rotation
      pitchAlignment: 'map',
    })
      .setLngLat([driverLocation.lng, driverLocation.lat])
      .addTo(map.current);

    lastDriverLocation.current = driverLocation;

    return () => {
      if (driverMarker.current) {
        driverMarker.current.remove();
      }
    };
  }, [isMapLoaded, vehicleIcon, vehicleType, validateCoordinates]);

  // 🚀 Update driver location with SMOOTH INTERPOLATION and BEARING ROTATION
  useEffect(() => {
    if (!driverMarker.current) return;
    if (!validateCoordinates(driverLocation)) return;
    if (!lastDriverLocation.current) {
      lastDriverLocation.current = driverLocation;
      return;
    }

    const oldLocation = lastDriverLocation.current;
    const newLocation = driverLocation;

    // Skip update if location hasn't changed
    if (oldLocation.lat === newLocation.lat && oldLocation.lng === newLocation.lng) {
      return;
    }

    // 🎯 Calculate bearing for vehicle rotation (nose points forward)
    const bearing = calculateBearing(
      oldLocation.lat,
      oldLocation.lng,
      newLocation.lat,
      newLocation.lng
    );

    // 🎯 Smooth interpolation animation (60 FPS, configurable duration)
    const duration = CONFIG.INTERPOLATION_DURATION;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out curve for natural deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate position
      const interpolated = interpolatePosition(oldLocation, newLocation, easeProgress);
      
      if (driverMarker.current && validateCoordinates(interpolated)) {
        // Update marker position
        driverMarker.current.setLngLat([interpolated.lng, interpolated.lat]);
        
        // Apply rotation to marker element
        const el = driverMarker.current.getElement();
        if (el) {
          // Smooth rotation transition
          el.style.transform = `rotate(${bearing}deg)`;
          el.style.transition = 'transform 0.3s ease-out';
        }
        
        // Center map smoothly on driver (only for passengers)
        if (map.current && userType === "user" && progress < 1) {
          map.current.easeTo({
            center: [interpolated.lng, interpolated.lat],
            duration: 100,
            essential: true,
          });
        }
      }
      
      // Continue animation until complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        lastDriverLocation.current = newLocation;
      }
    };
    
    // Cancel previous animation if running
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Start animation
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [driverLocation, userType, calculateBearing, interpolatePosition, validateCoordinates]);

  // Create pickup marker (blue)
  useEffect(() => {
    if (!map.current || !isMapLoaded || !pickupLocation) return;

    if (pickupMarker.current) {
      pickupMarker.current.remove();
    }

    const el = document.createElement('div');
    el.style.cssText = `
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #276EF1;
      border: 4px solid white;
      box-shadow: 0 4px 8px rgba(39, 110, 241, 0.5);
      position: relative;
    `;

    // Add pulse ring
    const ring = document.createElement('div');
    ring.style.cssText = `
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border-radius: 50%;
      border: 2px solid #276EF1;
      opacity: 0;
      animation: ping-elite 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    `;
    el.appendChild(ring);

    // Add ping animation styles (with check to prevent duplicates)
    if (!document.getElementById('elite-ping-styles')) {
      const pingStyle = document.createElement('style');
      pingStyle.id = 'elite-ping-styles';
      pingStyle.textContent = `
        @keyframes ping-elite {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(pingStyle);
    }

    pickupMarker.current = new mapboxgl.Marker(el)
      .setLngLat([pickupLocation.lng, pickupLocation.lat])
      .addTo(map.current);

    return () => {
      if (pickupMarker.current) {
        pickupMarker.current.remove();
      }
    };
  }, [pickupLocation, isMapLoaded]);

  // Create dropoff marker (green)
  useEffect(() => {
    if (!map.current || !isMapLoaded || !dropoffLocation) return;

    if (dropoffMarker.current) {
      dropoffMarker.current.remove();
    }

    const el = document.createElement('div');
    el.style.cssText = `
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #05A357;
      border: 4px solid white;
      box-shadow: 0 4px 8px rgba(5, 163, 87, 0.5);
    `;

    dropoffMarker.current = new mapboxgl.Marker(el)
      .setLngLat([dropoffLocation.lng, dropoffLocation.lat])
      .addTo(map.current);

    return () => {
      if (dropoffMarker.current) {
        dropoffMarker.current.remove();
      }
    };
  }, [dropoffLocation, isMapLoaded]);

  // Fetch route from Mapbox Directions API
  const fetchRoute = async (start, end) => {
    if (!start || !end || !mapboxToken) return null;

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          geometry: route.geometry,
          duration: route.duration, // in seconds
          distance: route.distance, // in meters
        };
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }

    return null;
  };

  // 🎯 DUAL-PHASE ROUTE VISUALIZATION with explicit phase transition
  // PHASE 1: Driver → Pickup (Pre-OTP)
  // PHASE 2: Pickup → Destination (Post-OTP with route clearing)
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    if (!validateCoordinates(driverLocation)) return;

    const updateRoute = async () => {
      let start, end;

      // 🔄 PHASE TRANSITION DETECTION: Clear route when phase changes
      if (previousPhaseRef.current && previousPhaseRef.current !== currentPhase) {
        // Phase transition detected - clear old route
        if (map.current.getSource('route')) {
          map.current.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          });
        }
        
        // Reset ETA and distance on phase change
        setEta(null);
        setDistance(null);
      }
      
      previousPhaseRef.current = currentPhase;

      // 🎯 PHASE 1: PRE-PICKUP (Driver → User Pickup Location)
      if (isPrePickup && validateCoordinates(pickupLocation)) {
        start = driverLocation;
        end = pickupLocation;
      } 
      // 🎯 PHASE 2: IN-PROGRESS (Current Location → Final Destination)
      else if (isInProgress && validateCoordinates(dropoffLocation)) {
        start = driverLocation;
        end = dropoffLocation;
      } 
      else {
        return; // No valid phase
      }

      const routeData = await fetchRoute(start, end);

      if (routeData && routeData.geometry) {
        setRouteGeometry(routeData.geometry);
        setDistance(routeData.distance);
        setEta(routeData.duration);

        // Update route layer with new geometry
        if (map.current.getSource('route')) {
          map.current.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: routeData.geometry
          });
        }

        // Notify parent component of ETA update
        if (onETAUpdate) {
          onETAUpdate({
            eta: routeData.duration,
            distance: routeData.distance,
            phase: currentPhase,
          });
        }
      }
    };

    updateRoute();

    // Adaptive route recalculation using constants
    const getRecalculationInterval = () => {
      return routeRecalculationCount.current < CONFIG.ROUTE_RECALC_THRESHOLD 
        ? CONFIG.INITIAL_ROUTE_UPDATE_INTERVAL 
        : CONFIG.STANDARD_ROUTE_UPDATE_INTERVAL;
    };

    updateInterval.current = setInterval(() => {
      routeRecalculationCount.current++;
      updateRoute();
    }, getRecalculationInterval());

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [
    driverLocation, 
    pickupLocation, 
    dropoffLocation, 
    isPrePickup, 
    isInProgress, 
    isMapLoaded, 
    onETAUpdate,
    currentPhase,
    validateCoordinates
  ]);

  // 🎯 INTELLIGENT AUTO-FIT BOUNDS with 50px padding
  // Dynamically adjusts zoom to keep driver and target always visible
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    if (!validateCoordinates(driverLocation)) return;

    const locations = [];
    
    // Always include driver location
    locations.push([driverLocation.lng, driverLocation.lat]);
    
    // Include target based on phase
    if (isPrePickup && validateCoordinates(pickupLocation)) {
      locations.push([pickupLocation.lng, pickupLocation.lat]);
    } else if (isInProgress && validateCoordinates(dropoffLocation)) {
      locations.push([dropoffLocation.lng, dropoffLocation.lat]);
    }

    if (locations.length > 1) {
      // Calculate bounds to fit all markers
      const bounds = locations.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(locations[0], locations[0]));

      // Calculate distance between points for smart zoom adjustment
      const distance = map.current 
        ? calculateDistance(
            [locations[0][0], locations[0][1]], 
            [locations[1][0], locations[1][1]]
          )
        : 0;

      // 🎯 Smart zoom based on distance
      let maxZoom = 16;
      if (distance < 500) maxZoom = 17; // Very close - zoom in more
      else if (distance < 1000) maxZoom = 16; // Close
      else if (distance < 5000) maxZoom = 15; // Medium distance
      else if (distance < 10000) maxZoom = 14; // Far
      else maxZoom = 13; // Very far

      // Smooth camera transition with configurable padding
      map.current.fitBounds(bounds, {
        padding: CONFIG.MAP_FIT_BOUNDS_PADDING,
        maxZoom: maxZoom,
        duration: CONFIG.MAP_FIT_BOUNDS_DURATION,
        essential: true,
      });
    }
  }, [
    driverLocation, 
    pickupLocation, 
    dropoffLocation, 
    isPrePickup, 
    isInProgress, 
    isMapLoaded,
    validateCoordinates
  ]);

  // Enhanced location timeout detection (30 seconds threshold)
  useEffect(() => {
    if (!driverLocation) return;

    // Reset timeout when location updates
    setLastLocationUpdate(Date.now());
    setLocationTimeout(false);
    setTrackingError(null);

    // Clear existing timeout
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }

    // Set new timeout using configuration constant
    locationTimeoutRef.current = setTimeout(() => {
      setLocationTimeout(true);
      setTrackingError('GPS_TIMEOUT');
    }, CONFIG.LOCATION_TIMEOUT_THRESHOLD);

    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, [driverLocation]);

  // Listen for real-time location updates via socket with error handling
  useEffect(() => {
    if (!socket || !rideId) return;

    const handleLocationUpdate = (data) => {
      if (data.rideId === rideId && data.location) {
        // Location update will be handled by parent component
        // which will update driverLocation prop
        setTrackingError(null);
        setLocationTimeout(false);
      }
    };

    const handleLocationError = (error) => {
      console.error('Location update error:', error);
      setTrackingError('GPS_ERROR');
    };

    socket.on('driver:locationUpdated', handleLocationUpdate);
    socket.on('driver:locationError', handleLocationError);

    return () => {
      socket.off('driver:locationUpdated', handleLocationUpdate);
      socket.off('driver:locationError', handleLocationError);
    };
  }, [socket, rideId]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* 🎨 PREMIUM ETA and Distance Info Overlay */}
      {eta && distance && userType === "user" && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black text-white px-6 py-3 rounded-full shadow-uber-xl flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Premium vehicle icon */}
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={vehicleIcon} 
                  alt={vehicleType === 'bike' ? 'Moto' : 'Carro'}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback to emoji if CDN fails (XSS-safe using textContent)
                    const target = e.target;
                    target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.textContent = vehicleType === 'bike' ? '🛵' : '🚗';
                    fallback.style.fontSize = '24px';
                    target.parentElement.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <div className="text-xs text-gray-300">
                  {isPrePickup ? "El conductor llega en" : "Llegada en"}
                </div>
                <div className="text-lg font-bold">
                  {formatDuration(eta)}
                </div>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-600" />
            
            <div>
              <div className="text-xs text-gray-300">Distancia</div>
              <div className="text-lg font-bold">
                {formatDistance(distance)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Phase Indicator */}
      {userType === "user" && (
        <div className="absolute bottom-24 left-4 z-10">
          <div className="bg-white px-4 py-2 rounded-lg shadow-uber-md">
            <div className="text-xs text-gray-500">Estado del viaje</div>
            <div className="text-sm font-semibold text-black">
              {isPrePickup ? "Conductor en camino" : "En viaje"}
            </div>
          </div>
        </div>
      )}

      {/* Error States */}
      {locationTimeout && userType === "user" && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Esperando ubicación del conductor...</span>
          </div>
        </div>
      )}

      {trackingError === 'GPS_ERROR' && userType === "user" && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Error de GPS. Reconectando...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EliteTrackingMap;
