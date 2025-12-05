import { useEffect, useRef, useState, useContext } from "react";
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

/**
 * Elite World-Class Real-Time Tracking Map Component
 * Implements UBER-level tracking with smooth animations, route visualization, and real-time updates
 * 
 * Features:
 * - Phase 1: Driver → Pickup tracking (pre-pickup)
 * - Phase 2: Pickup → Destination tracking (in-progress)
 * - Real-time ETA and distance updates every 10 seconds
 * - Smooth marker animations with rotation
 * - Route visualization with Mapbox Directions API
 * - Professional info overlays
 * 
 * @param {Object} props
 * @param {Object} props.driverLocation - {lat, lng} Driver's current location
 * @param {Object} props.pickupLocation - {lat, lng} Pickup location
 * @param {Object} props.dropoffLocation - {lat, lng} Dropoff location
 * @param {string} props.rideId - Current ride ID
 * @param {string} props.rideStatus - "pending", "accepted", "ongoing", "completed"
 * @param {string} props.userType - "user" or "captain"
 * @param {string} props.vehicleType - "car" or "bike"
 * @param {Function} props.onETAUpdate - Callback when ETA is updated
 * @param {string} props.className - Additional CSS classes
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

  // Determine vehicle emoji
  const vehicleEmoji = vehicleType === "bike" ? "🛵" : "🚗";
  
  // Determine tracking phase
  const isPrePickup = rideStatus === "pending" || rideStatus === "accepted";
  const isInProgress = rideStatus === "ongoing";

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const initialCenter = driverLocation 
      ? [driverLocation.lng, driverLocation.lat]
      : pickupLocation 
      ? [pickupLocation.lng, pickupLocation.lat]
      : [-72.4430, 7.8146]; // Default: San Antonio del Táchira

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: 14,
      pitch: 0,
      bearing: 0,
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

      // Add route layer with UBER blue color
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4A90E2',
          'line-width': 5,
          'line-opacity': 0.7
        }
      });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      map.current?.remove();
    };
  }, []);

  // Create driver marker with vehicle emoji
  useEffect(() => {
    if (!map.current || !isMapLoaded || !driverLocation) return;

    if (driverMarker.current) {
      driverMarker.current.remove();
    }

    // Create driver marker element
    const el = document.createElement('div');
    el.className = 'driver-marker-elite';
    el.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #000000;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      cursor: pointer;
    `;
    
    const emoji = document.createElement('span');
    emoji.textContent = vehicleEmoji;
    emoji.style.cssText = `
      color: white;
      font-size: 24px;
      user-select: none;
    `;
    el.appendChild(emoji);

    // Pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-elite {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .driver-marker-elite:hover {
        animation: pulse-elite 1s infinite;
      }
    `;
    document.head.appendChild(style);

    driverMarker.current = new mapboxgl.Marker(el, {
      anchor: 'center',
    })
      .setLngLat([driverLocation.lng, driverLocation.lat])
      .addTo(map.current);

    lastDriverLocation.current = driverLocation;

    return () => {
      if (driverMarker.current) {
        driverMarker.current.remove();
      }
    };
  }, [isMapLoaded, vehicleEmoji]);

  // Update driver location with smooth animation and rotation
  useEffect(() => {
    if (!driverMarker.current || !driverLocation || !lastDriverLocation.current) return;

    const newLngLat = [driverLocation.lng, driverLocation.lat];
    const oldLocation = lastDriverLocation.current;

    // Calculate bearing for rotation
    const bearing = calculateBearing(
      oldLocation.lat,
      oldLocation.lng,
      driverLocation.lat,
      driverLocation.lng
    );

    // Smooth transition
    const el = driverMarker.current.getElement();
    if (el && bearing !== null) {
      el.style.transform = `rotate(${bearing}deg)`;
    }

    // Animate marker to new position
    driverMarker.current.setLngLat(newLngLat);

    // Center map smoothly on driver (only for passengers)
    if (map.current && userType === "user") {
      map.current.easeTo({
        center: newLngLat,
        duration: 2000,
        essential: true,
      });
    }

    lastDriverLocation.current = driverLocation;
  }, [driverLocation, userType]);

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

    const pingStyle = document.createElement('style');
    pingStyle.textContent = `
      @keyframes ping-elite {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(pingStyle);

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

  // Update route visualization based on ride phase
  useEffect(() => {
    if (!map.current || !isMapLoaded || !driverLocation) return;

    const updateRoute = async () => {
      let start, end;

      if (isPrePickup && pickupLocation) {
        // Phase 1: Driver → Pickup
        start = driverLocation;
        end = pickupLocation;
      } else if (isInProgress && dropoffLocation) {
        // Phase 2: Pickup → Destination
        start = driverLocation;
        end = dropoffLocation;
      } else {
        return;
      }

      const routeData = await fetchRoute(start, end);

      if (routeData) {
        setRouteGeometry(routeData.geometry);
        setDistance(routeData.distance);
        setEta(routeData.duration);

        // Update route layer
        if (map.current.getSource('route')) {
          map.current.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: routeData.geometry
          });
        }

        // Notify parent component
        if (onETAUpdate) {
          onETAUpdate({
            eta: routeData.duration,
            distance: routeData.distance,
          });
        }
      }
    };

    updateRoute();

    // Update route every 10 seconds for real-time accuracy
    updateInterval.current = setInterval(updateRoute, 10000);

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [driverLocation, pickupLocation, dropoffLocation, isPrePickup, isInProgress, isMapLoaded, onETAUpdate]);

  // Fit map bounds to show all relevant markers
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const locations = [];
    
    if (driverLocation) locations.push([driverLocation.lng, driverLocation.lat]);
    
    if (isPrePickup && pickupLocation) {
      locations.push([pickupLocation.lng, pickupLocation.lat]);
    } else if (isInProgress && dropoffLocation) {
      locations.push([dropoffLocation.lng, dropoffLocation.lat]);
    }

    if (locations.length > 1) {
      const bounds = locations.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(locations[0], locations[0]));

      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 16,
        duration: 1500,
      });
    }
  }, [driverLocation, pickupLocation, dropoffLocation, isPrePickup, isInProgress, isMapLoaded]);

  // Listen for real-time location updates via socket
  useEffect(() => {
    if (!socket || !rideId) return;

    const handleLocationUpdate = (data) => {
      if (data.rideId === rideId && data.location) {
        // Location update will be handled by parent component
        // which will update driverLocation prop
      }
    };

    socket.on('driver:locationUpdated', handleLocationUpdate);

    return () => {
      socket.off('driver:locationUpdated', handleLocationUpdate);
    };
  }, [socket, rideId]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
      />
      
      {/* ETA and Distance Info Overlay */}
      {eta && distance && userType === "user" && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black text-white px-6 py-3 rounded-full shadow-uber-xl flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{vehicleEmoji}</span>
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
    </div>
  );
}

// Helper function to calculate bearing between two points
function calculateBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

export default EliteTrackingMap;
