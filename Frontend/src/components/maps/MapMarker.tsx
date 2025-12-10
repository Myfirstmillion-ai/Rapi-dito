import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { MARKER_ICONS } from './mapStyles';
import { COLORS } from '../../design-system';
import type { MapMarkerProps } from './types';

export function MapMarker({
  map,
  coordinates,
  type,
  icon,
  customIcon,
  bearing = 0,
  onClick
}: MapMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const elementRef = useRef<HTMLDivElement>(document.createElement('div'));

  // Initialize marker
  useEffect(() => {
    if (!map) return;

    // Render the React component into the DOM element
    const root = createRoot(elementRef.current);
    root.render(
      <MarkerContent 
        type={type} 
        icon={icon} 
        customIcon={customIcon} 
        bearing={bearing} 
      />
    );

    // Create Mapbox marker
    markerRef.current = new mapboxgl.Marker({
      element: elementRef.current,
      rotationAlignment: type === 'driver' ? 'map' : 'auto',
      pitchAlignment: type === 'driver' ? 'map' : 'auto',
    })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);

    if (onClick) {
      elementRef.current.addEventListener('click', onClick);
    }

    return () => {
      markerRef.current?.remove();
      if (onClick) {
        elementRef.current.removeEventListener('click', onClick);
      }
      setTimeout(() => root.unmount(), 0);
    };
  }, [map]);

  // Update position
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
      if (type === 'driver') {
        markerRef.current.setRotation(bearing);
      }
    }
  }, [coordinates.lng, coordinates.lat, bearing, type]);

  return null;
}

function MarkerContent({ type, icon, customIcon, bearing }: any) {
  if (type === 'driver') {
    return (
      <div className="relative w-14 h-14 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 bg-white rounded-full shadow-lg border-2 border-white overflow-hidden"
          animate={{ rotate: bearing }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={customIcon || MARKER_ICONS[icon as keyof typeof MARKER_ICONS] || MARKER_ICONS.car} 
            alt="Driver" 
            className="w-full h-full object-cover p-1"
          />
        </motion.div>
      </div>
    );
  }
  
  // Other marker types (simplified for brevity, expand as needed)
  return (
    <div className="w-4 h-4 rounded-full bg-luxury-accent border-2 border-white shadow-md" />
  );
}