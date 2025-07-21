// src/features-modular/mapbox/hooks/useMapbox.ts
//Hook para manejar estado central y zoom, y exponer referencias
import { useState, useCallback } from 'react';
import type { LngLatLike } from 'mapbox-gl';

export default function useMapbox(initialCenter: LngLatLike, initialZoom: number) {
  const [center, setCenter] = useState<LngLatLike>(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);

  const updateView = useCallback((newCenter: LngLatLike, newZoom: number) => {
    setCenter(newCenter);
    setZoom(newZoom);
  }, []);

  return { center, zoom, updateView };
}
