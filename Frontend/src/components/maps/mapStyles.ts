import { COLORS } from '../../design-system';

export const MAP_STYLES = {
  'luxury-dark': 'mapbox://styles/mapbox/dark-v11',
  'luxury-light': 'mapbox://styles/mapbox/light-v11',
  'satellite': 'mapbox://styles/mapbox/satellite-streets-v12',
} as const;

export const STYLE_OVERRIDES = {
  'luxury-dark': {
    water: '#0a1628',
    land: '#0f1419',
    roadPrimary: '#1a2332',
    roadSecondary: '#151c28',
    roadTertiary: '#121820',
    buildings: '#0d1117',
    labelPrimary: COLORS.luxury.gray400,
    labelSecondary: COLORS.luxury.gray600,
    park: '#0a1a12',
  },
  'luxury-light': {
    water: '#d4e5f7',
    land: '#f8f9fa',
    roadPrimary: '#ffffff',
    roadSecondary: '#f0f2f5',
    roadTertiary: '#e8eaed',
    buildings: '#e0e3e8',
    labelPrimary: COLORS.luxury.surface2,
    labelSecondary: COLORS.luxury.gray400,
    park: '#e8f5e9',
  },
} as const;

export function applyStyleOverrides(map: mapboxgl.Map, variant: 'luxury-dark' | 'luxury-light'): void {
  const overrides = STYLE_OVERRIDES[variant];
  if (!overrides) return;

  if (!map.isStyleLoaded()) {
    map.once('style.load', () => applyStyleOverrides(map, variant));
    return;
  }

  try {
    if (map.getLayer('water')) map.setPaintProperty('water', 'fill-color', overrides.water);
    if (map.getLayer('land')) map.setPaintProperty('land', 'background-color', overrides.land);
    ['road-primary', 'road-secondary', 'road-street', 'road-minor'].forEach(layer => {
      if (map.getLayer(layer)) map.setPaintProperty(layer, 'line-color', overrides.roadPrimary);
    });
    if (map.getLayer('building')) map.setPaintProperty('building', 'fill-color', overrides.buildings);
  } catch (error) {
    console.warn('Failed to apply map style overrides:', error);
  }
}

export const ROUTE_STYLE = {
  color: COLORS.luxury.accent,
  width: 5,
  opacity: 0.85,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
  gradient: [COLORS.luxury.accent, '#06b6d4'],
} as const;

export const MARKER_ICONS = {
  car: 'https://cdn-icons-png.flaticon.com/512/3097/3097152.png',
  bike: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  pin: null,
  dot: null,
} as const;

export const MAP_ANIMATION = {
  flyTo: 1500,
  easeTo: 1000,
  fitBounds: 1200,
  markerMove: 2000,
} as const;

export const MAP_DEFAULTS = {
  center: [-72.4430, 7.8146] as [number, number],
  zoom: 14,
  minZoom: 10,
  maxZoom: 18,
  pitch: 0,
  padding: 50,
} as const;