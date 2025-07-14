import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import './MapboxHome.css'; 
import { IonContent, IonPage } from '@ionic/react';



mapboxgl.accessToken = 'pk.eyJ1IjoicGVyc3BpY3RvdXNlciIsImEiOiJjbWMzZHhwZjMwNGcwMmlxeHcyeDZvcHV5In0._UopzIHKIkmOWhUEkUMV_A';

const MapboxMapHome: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Solo crear el mapa si no está ya creado y existe el contenedor
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({  // No funciona la instancia bien de Mapbox GL JS
      container: mapContainer.current,
      style: 'mapbox://styles/perspictouser/cmc3eah7o00hm01qy1h5jgdvz', // URL mapbox diseñado
      center: [2.1734, 41.3851],// Coordenadas de la ciudad que quieras centrar al verse por 1a vez.
      zoom: 1,
      dragPan: true, // permitir que el usuario toque y gire el globo
      scrollZoom: true,
      doubleClickZoom: true, 
      touchZoomRotate: true, // permitir gestos táctiles para zoom y rotación
      boxZoom: true, // permitir zoom con caja de selección
      projection: 'globe', // Uso de proyección de globo para una experiencia 3D
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

   return (
   <IonPage>
    <IonContent fullscreen>
      <div className="map-root">
        <div ref={mapContainer} className="map-container" />
      </div>
    </IonContent>
    </IonPage>
  );
};

export default MapboxMapHome;
