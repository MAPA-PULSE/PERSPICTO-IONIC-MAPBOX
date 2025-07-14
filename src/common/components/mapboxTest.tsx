// ⚠️ COMPONENTE DE PRUEBA: MapboxTest
// Este componente carga un mapa de Mapbox centrado en una ubicación de ejemplo.

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { IonCard, IonCardHeader, IonCardTitle, IonContent } from '@ionic/react';

// 🔑 TU TOKEN DE MAPBOX (usa el tuyo real aquí)
mapboxgl.accessToken = 'TU_MAPBOX_TOKEN_AQUI';

const MapboxTest: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.006, 40.7128], // Nueva York como ejemplo
      zoom: 10,
    });

    // ⚠️ Puedes agregar más lógica aquí si quieres markers, controles, etc.

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <IonContent className="ion-padding">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Mapa de prueba (Mapbox)</IonCardTitle>
        </IonCardHeader>
        <div
          ref={mapContainer}
          style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}
        />
      </IonCard>
    </IonContent>
  );
};

export default MapboxTest;
