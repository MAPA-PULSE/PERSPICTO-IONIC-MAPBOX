// PERSPICTO-IONIC-MAPBOX\src\features-modular\mapbox\component\MapboxMap.tsx
import React, { useRef, useEffect, useState } from 'react';
import { IonContent, IonPage, IonSegment } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from '@mapbox/search-js-react';
import useMapInitialization from '../hooks/useMapInitialization';
import useLayerToggle from '../hooks/useLayerToggle';
import handleMapClick from '../utils/handleMapClick';
import EarthquakeFilter from './filter/EarthquakeFilter';
import AirQualityFilter from './filter/AirQualityFilter';
import WeatherFilter from './filter/WeatherFilter';
import LayerControls from './LayerControls';
import ModalInfo from './ModalInfo';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../../theme/globals.css';

// import { fetchEarthquakes } from '../services/quakeService';
// import { fetchWeatherData } from '../services/weatherService';
// import { fetchAirQuality } from '../services/airService';
import { useDeviceType } from '../hooks/useDeviceType'; // responsive
import "../../../screens-private/home/Home.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [layerVisibility, setLayerVisibility] = useState({
    wind: true,
    clouds: true,
    earthquake: true,
  });

  useMapInitialization(mapContainer, mapInstanceRef, setModalContent, setShowModal);
  useLayerToggle(mapInstanceRef, layerVisibility);

  const { isLandscape, deviceType } = useDeviceType(); // ✅ CORREGIDO: hook funcionando correctamente

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    return handleMapClick(map, setModalContent, setShowModal);
  }, []);

return (
  <IonPage>
    <IonContent>

      {/* 🔍 SearchBox fijo arriba */}
      <div
        style={{
          position: 'absolute',
          top: '2vh',
          left: '4vw',
          right: '4vw',
          zIndex: 9999, // 🧠 que esté por encima del mapa
        }}
      >
        <SearchBox
          accessToken={mapboxgl.accessToken!}
          mapboxgl={mapboxgl}
          map={mapInstanceRef.current!}
          value="Buscar ciudad, país o región"
          onChange={() => {}}
          marker={false}
          types={['place', 'region', 'country']}
        />
      </div>

      {/* 🎛️ Filtros visibles y posicionados */}
      <div
        style={{
          position: 'absolute',
          top: '12vh',
          left: '4vw',
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '1rem',
          borderRadius: '8px',
          display: 'grid',
          gridTemplateRows: 'auto auto auto',
          rowGap: '1rem',
          width: 'fit-content',
        }}
      >
        <EarthquakeFilter mapInstanceRef={mapInstanceRef} />
        <AirQualityFilter mapInstanceRef={mapInstanceRef} />
        <WeatherFilter mapInstanceRef={mapInstanceRef} />
      </div>

      <LayerControls
        layerVisibility={layerVisibility}
        setLayerVisibility={setLayerVisibility}
      />

      <ModalInfo
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        content={modalContent}
      />

      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
    </IonContent>
  </IonPage>
);

};

export default MapboxMap;

