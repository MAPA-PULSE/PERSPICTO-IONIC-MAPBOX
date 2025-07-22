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
import '../../../theme/globals.css';

import { SearchBox } from "@mapbox/search-js-react";

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

const MapboxMap: React.FC<MapboxMapProps> = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      zoom: MAPBOX_ZOOM,
      center: MAPBOX_CENTER,
    });

    mapInstanceRef.current.on('load', () => {
      mapInstanceRef.current.loadImage(markerIcon, (err: any, img: any) => {
        if (err || !img) {
          console.error('Error cargando ícono del marcador:', err);
          return;
        }
        mapInstanceRef.current.addImage('custom-marker', img);
        //loadMarkers(map);

      });
    });

    new mapboxgl.Marker()
      .setLngLat([0 ,0 ])
      .addTo(mapInstanceRef.current);


    return () => mapInstanceRef.current.remove();
  }, []);

  function setInputValue(d: any) {
    console.log(d);
  }

  return (
    <IonContent className="map-container" fullscreen>
      
      <SearchBox
        accessToken={mapboxgl.accessToken!}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={"Haz tu búsqueda . . ."}
        onChange={(d) => {
          setInputValue(d);
        }}
        marker
      />
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </IonContent>

  );
};

export default MapboxMap;
