import type { Map as MapboxMap } from 'mapbox-gl';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarkerData {
  id: string;
  coordinates: Coordinates;
  type: 'driver' | 'pickup' | 'dropoff' | 'user' | 'custom';
  icon?: 'car' | 'bike' | 'pin' | 'dot' | 'custom';
  customIcon?: string;
  label?: string;
  bearing?: number;
  animate?: boolean;
  pulse?: boolean;
  onClick?: () => void;
}

export interface RouteData {
  geometry: GeoJSON.LineString;
  distance?: number;
  duration?: number;
}

export type MapStyleVariant = 'luxury-dark' | 'luxury-light' | 'satellite';

export interface LuxuryMapProps {
  center?: Coordinates;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  interactive?: boolean;
  markers?: MapMarkerData[];
  driverLocation?: Coordinates;
  pickupLocation?: Coordinates;
  dropoffLocation?: Coordinates;
  userLocation?: Coordinates;
  route?: RouteData;
  showRoute?: boolean;
  routeColor?: string;
  enableTracking?: boolean;
  trackingMode?: 'driver' | 'user' | 'route';
  followDriver?: boolean;
  showControls?: boolean;
  controlsPosition?: 'left' | 'right';
  mapStyle?: MapStyleVariant;
  className?: string;
  onMapLoad?: (map: MapboxMap) => void;
  onMapClick?: (coordinates: Coordinates) => void;
  onMarkerClick?: (markerId: string) => void;
  onLocationUpdate?: (coordinates: Coordinates) => void;
  onRouteCalculated?: (route: RouteData) => void;
  onError?: (error: Error) => void;
}

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onCompassClick?: () => void;
  bearing?: number;
  isLocating?: boolean;
  isFollowing?: boolean;
  position?: 'left' | 'right';
  className?: string;
}

export interface MapMarkerProps extends Omit<MapMarkerData, 'id'> {
  map: MapboxMap | null;
  onClick?: () => void;
}

export interface RouteLayerProps {
  map: MapboxMap | null;
  route: RouteData;
  color?: string;
  width?: number;
  animated?: boolean;
}