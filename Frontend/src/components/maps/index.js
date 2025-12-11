/**
 * Maps Components
 * 
 * Exports all map-related components
 */

import EliteTrackingMap from './EliteTrackingMap';
import LiveTrackingMap from './LiveTrackingMap';
import RealTimeTrackingMap from './RealTimeTrackingMap';
import MapView from './MapView';
import MapboxStaticMap from './MapboxStaticMap';
import DriverMarker from './DriverMarker';

// LuxuryMap is an alias for EliteTrackingMap (most advanced map)
export const LuxuryMap = EliteTrackingMap;

export {
  EliteTrackingMap,
  LiveTrackingMap,
  RealTimeTrackingMap,
  MapView,
  MapboxStaticMap,
  DriverMarker,
};

export default {
  LuxuryMap,
  EliteTrackingMap,
  LiveTrackingMap,
  RealTimeTrackingMap,
  MapView,
  MapboxStaticMap,
  DriverMarker,
};
