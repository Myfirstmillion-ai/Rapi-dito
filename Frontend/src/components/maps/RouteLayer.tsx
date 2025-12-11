import { useEffect } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { ROUTE_STYLE } from './mapStyles';
import type { RouteLayerProps } from './types';

export function RouteLayer({ map, route }: RouteLayerProps) {
  useEffect(() => {
    if (!map || !route) return;

    const sourceId = 'route-source';
    const layerId = 'route-layer';

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: route.geometry as any,
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': ROUTE_STYLE.lineJoin,
          'line-cap': ROUTE_STYLE.lineCap,
        },
        paint: {
          'line-color': ROUTE_STYLE.color,
          'line-width': ROUTE_STYLE.width,
          'line-opacity': ROUTE_STYLE.opacity,
        },
      });
    } else {
      (map.getSource(sourceId) as any).setData(route.geometry);
    }

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, route]);

  return null;
}