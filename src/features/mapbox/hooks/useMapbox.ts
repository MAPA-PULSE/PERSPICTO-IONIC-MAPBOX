// ⚠️ HOOK DE PRUEBA: useMapbox
// Este hook inicializa un mapa de Mapbox y devuelve la instancia para usarla externamente.

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// 🔑 Reemplaza con tu token real
mapboxgl.accessToken = 'TU_MAPBOX_TOKEN_AQUI';

interface UseMapboxOptions {
  center?: [number, number];
  zoom?: number;
  style?: string;
}

export const useMapbox = (
  containerId: string,
  options: UseMapboxOptions = {}
): { mapRef: React.MutableRefObject<mapboxgl.Map | null> } => {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // evitar inicializar varias veces

    const { center = [-74.006, 40.7128], zoom = 10, style = 'mapbox://styles/mapbox/streets-v11' } = options;

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container with ID "${containerId}" not found`);
      return;
    }

    mapRef.current = new mapboxgl.Map({
      container,
      style,
      center,
      zoom,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [containerId]);

  return { mapRef };
};
