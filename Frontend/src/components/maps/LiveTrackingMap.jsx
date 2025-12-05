import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "../../utils/cn";
import { Navigation, Clock } from "lucide-react";

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * LiveTrackingMap Component for Real-Time Ride Tracking
 * 
 * Features:
 * - Interactive Mapbox GL JS map
 * - Animated driver marker with pulse effect
 * - Pickup (blue) and dropoff (green) markers
 * - Route visualization with Mapbox Directions API
 * - Smooth driver location updates with easeTo()
 * - ETA overlay display
 * - Auto fitBounds for full route view
 * 
 * @param {Object} props
 * @param {Array} props.driverLocation - [lng, lat]
 * @param {Array} props.pickupLocation - [lng, lat]
 * @param {Array} props.dropoffLocation - [lng, lat]
 * @param {Object} props.route - Route geometry from Mapbox Directions
 * @param {number} props.eta - Estimated time of arrival in minutes
 * @param {string} props.driverName - Driver name for display
 * @param {Function} props.onMapLoad - Callback when map loads
 * @param {string} props.className - Additional CSS classes
 */
function LiveTrackingMap({ 
  driverLocation,
  pickupLocation,
  dropoffLocation,
  route = null,
  eta = null,
  driverName = "Conductor",
  onMapLoad,
  className,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const driverMarker = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Initialize map only once

    const initialCenter = driverLocation || pickupLocation || [-72.4430, 7.8146];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: 14,
      interactive: true,
    });

    map.current.on('load', () => {
      setIsMapLoaded(true);
      onMapLoad?.(map.current);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Create custom driver marker with pulse animation
  useEffect(() => {
    if (!map.current || !isMapLoaded || !driverLocation) return;

    // Remove existing driver marker
    if (driverMarker.current) {
      driverMarker.current.remove();
    }

    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'driver-marker';
    el.innerHTML = `
      <div class="relative">
        <!-- Pulse animation -->
        <div class="absolute inset-0 bg-uber-blue rounded-full animate-ping opacity-75"></div>
        <!-- Driver marker -->
        <div class="relative w-12 h-12 bg-uber-black rounded-full border-4 border-white shadow-uber-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    `;

    driverMarker.current = new mapboxgl.Marker(el)
      .setLngLat(driverLocation)
      .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<div class="text-center font-semibold">${driverName}</div>`)
      )
      .addTo(map.current);

    return () => {
      if (driverMarker.current) {
        driverMarker.current.remove();
      }
    };
  }, [driverLocation, isMapLoaded, driverName]);

  // Update driver location with smooth animation
  useEffect(() => {
    if (!driverMarker.current || !driverLocation) return;

    // Animate marker to new position
    driverMarker.current.setLngLat(driverLocation);

    // Smoothly pan map to follow driver
    if (map.current) {
      map.current.easeTo({
        center: driverLocation,
        duration: 1000,
        essential: true,
      });
    }
  }, [driverLocation]);

  // Add pickup marker (blue)
  useEffect(() => {
    if (!map.current || !isMapLoaded || !pickupLocation) return;

    if (pickupMarker.current) {
      pickupMarker.current.remove();
    }

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="relative">
        <div class="w-10 h-10 bg-uber-blue rounded-full border-4 border-white shadow-uber-md flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
      </div>
    `;

    pickupMarker.current = new mapboxgl.Marker(el)
      .setLngLat(pickupLocation)
      .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML('<div class="text-center font-semibold text-uber-blue">Recogida</div>')
      )
      .addTo(map.current);

    return () => {
      if (pickupMarker.current) {
        pickupMarker.current.remove();
      }
    };
  }, [pickupLocation, isMapLoaded]);

  // Add dropoff marker (green)
  useEffect(() => {
    if (!map.current || !isMapLoaded || !dropoffLocation) return;

    if (dropoffMarker.current) {
      dropoffMarker.current.remove();
    }

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="relative">
        <div class="w-10 h-10 bg-uber-green rounded-full border-4 border-white shadow-uber-md flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
    `;

    dropoffMarker.current = new mapboxgl.Marker(el)
      .setLngLat(dropoffLocation)
      .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML('<div class="text-center font-semibold text-uber-green">Destino</div>')
      )
      .addTo(map.current);

    return () => {
      if (dropoffMarker.current) {
        dropoffMarker.current.remove();
      }
    };
  }, [dropoffLocation, isMapLoaded]);

  // Draw route
  useEffect(() => {
    if (!map.current || !isMapLoaded || !route) return;

    // Remove existing route layer
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }

    // Add new route
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route.geometry || route,
      },
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#000000',
        'line-width': 6,
        'line-opacity': 0.8,
      },
    });

    // Fit bounds to show entire route
    if (route.geometry && route.geometry.coordinates) {
      const coordinates = route.geometry.coordinates;
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 15,
      });
    }
  }, [route, isMapLoaded]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-uber-lg overflow-hidden"
      />
      
      {/* ETA Overlay */}
      {eta !== null && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-uber-lg shadow-uber-lg px-6 py-3 flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-uber-green rounded-full flex items-center justify-center">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-uber-gray-600 font-medium">Tiempo estimado</p>
            <p className="text-xl font-bold text-uber-black">{eta} min</p>
          </div>
        </div>
      )}

      {/* Driver info overlay (optional) */}
      {driverName && driverLocation && (
        <div className="absolute bottom-4 left-4 bg-white rounded-uber-lg shadow-uber-lg px-4 py-3 flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-uber-black rounded-full flex items-center justify-center">
            <Navigation size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-uber-gray-600 font-medium">Conductor</p>
            <p className="text-sm font-bold text-uber-black">{driverName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveTrackingMap;
