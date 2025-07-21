// src/features-modular/mapbox/services/mapService.ts
//mapService.ts    Carga GeoJSON y clustering
import type mapboxgl from 'mapbox-gl';

const GEOJSON_PATH = '/assets/data/lugares.geojson';

export function loadMarkers(map: mapboxgl.Map) {
  map.addSource('lugares', {
    type: 'geojson',
    data: GEOJSON_PATH,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'lugares',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#51bbd6',
      'circle-radius': 18,
    },
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'lugares',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 12,
    },
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'symbol',
    source: 'lugares',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': 'custom-marker',
      'icon-size': 1,
      'icon-allow-overlap': true,
    },
  });
}
