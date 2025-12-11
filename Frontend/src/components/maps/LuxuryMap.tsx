import { 
  useEffect, 
  useRef, 
  useState, 
  useImperativeHandle,
  forwardRef 
} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_STYLES, MAP_DEFAULTS, applyStyleOverrides, MAP_ANIMATION } from './mapStyles';
import { MapControls } from './MapControls';
import { MapMarker } from './MapMarker';
import { RouteLayer } from './RouteLayer';
import type { LuxuryMapProps, LuxuryMapRef } from './types';

// IMPORTANT: Set your token in .env as VITE_MAPBOX_TOKEN
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const LuxuryMap = forwardRef<LuxuryMapRef, LuxuryMapProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!containerRef.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLES[props.mapStyle || 'luxury-dark'],
      center: props.center ? [props.center.lng, props.center.lat] : MAP_DEFAULTS.center,
      zoom: props.zoom || MAP_DEFAULTS.zoom,
      minZoom: props.minZoom || MAP_DEFAULTS.minZoom,
      maxZoom: props.maxZoom || MAP_DEFAULTS.maxZoom,
      attributionControl: false,
      logoPosition: 'bottom-left',
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      if (map.current) {
        applyStyleOverrides(map.current, props.mapStyle || 'luxury-dark');
        props.onMapLoad?.(map.current);
      }
    });

    map.current.on('rotate', () => {
      setBearing(map.current?.getBearing() || 0);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    flyTo: (coords, zoom) => map.current?.flyTo({ center: [coords.lng, coords.lat], zoom, duration: MAP_ANIMATION.flyTo }),
    fitBounds: (coords, padding) => {
      if (coords.length === 0) return;
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach(c => bounds.extend([c.lng, c.lat]));
      map.current?.fitBounds(bounds, { padding: padding || MAP_DEFAULTS.padding });
    },
    setZoom: (z) => map.current?.setZoom(z),
    getZoom: () => map.current?.getZoom() || 0,
    getBearing: () => map.current?.getBearing() || 0,
    getCenter: () => {
        const c = map.current?.getCenter();
        return { lat: c?.lat || 0, lng: c?.lng || 0 };
    },
    getMap: () => map.current,
  }));

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleRecenter = () => {
    if (props.driverLocation) {
      map.current?.flyTo({ center: [props.driverLocation.lng, props.driverLocation.lat], zoom: 16 });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoaded && map.current && (
        <>
          {props.showControls && (
            <MapControls 
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onRecenter={handleRecenter}
              bearing={bearing}
              position={props.controlsPosition}
            />
          )}

          {props.route && <RouteLayer map={map.current} route={props.route} />}
          
          {props.markers?.map(marker => (
            <MapMarker 
              key={marker.id}
              map={map.current}
              {...marker}
            />
          ))}
          
          {props.driverLocation && (
             <MapMarker 
                map={map.current} 
                coordinates={props.driverLocation} 
                type="driver" 
                bearing={0} // Calculate real bearing in parent or pass in
             />
          )}
        </>
      )}
    </div>
  );
});