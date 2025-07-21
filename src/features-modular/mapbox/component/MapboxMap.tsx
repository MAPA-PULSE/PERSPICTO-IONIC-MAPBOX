// src/features-modular/mapbox/components/MapboxMap.tsx
//Componente principal que inicializa el mapa
// src/features-modular/mapbox/components/MapboxMap.tsx
import React, { useRef, useEffect } from 'react';
import { IonContent } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import useMapbox from '../hooks/useMapbox';
import { loadMarkers } from '../services/mapService';
import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';
import markerIcon from '../styles/marker-icon.png';
import 'mapbox-gl/dist/mapbox-gl.css';

// 🔐  el token de acceso de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

//v No se ha definido el token de acceso de Mapbox. Asegúrate de tener VITE_MAPBOX_TOKEN en tu archivo .env
if (!mapboxgl.accessToken) {
  console.error(" No tienes acceso a Mapbox");
}

interface MapboxMapProps {
  onMapLoad: (map: mapboxgl.Map) => void;
}

// ✅ Configura el token de acceso (mejor fuera del componente)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxMap: React.FC<MapboxMapProps> = ({ onMapLoad }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { center, zoom, updateView } = useMapbox(MAPBOX_CENTER, MAPBOX_ZOOM);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center,
      zoom,
    });

    map.on('load', () => {
      onMapLoad(map);
      map.loadImage(markerIcon, (err, img) => {
        if (err || !img) {
          console.error('Error cargando ícono del marcador:', err);
          return;
        }
        map.addImage('custom-marker', img);
        loadMarkers(map);
      });
    });

    map.on('move', () => {
      updateView(
        [map.getCenter().lng, map.getCenter().lat],
        map.getZoom()
      );
    });

    return () => map.remove();
  }, [center, zoom, onMapLoad, updateView]);

  return (
    <IonContent className="map-container">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </IonContent>
  );
};

export default MapboxMap;
