import React, { useRef, useState, useEffect } from 'react';
import { IonContent, IonModal, IonButton, IonPage } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from '@mapbox/search-js-react';
import { MAPBOX_CENTER, MAPBOX_STYLE, MAPBOX_ZOOM } from '../MapboxConfig';
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

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    return handleMapClick(map, setModalContent, setShowModal);
  }, []);

  return (
   <IonPage>
  <IonContent fullscreen>
    <div style={{ position: 'absolute', top: '2vh', left: '4vw', right: '4vw', zIndex: 20 }}>
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

<div style={{ position: 'absolute', top: '12vh', left: '4vw', zIndex: 30, backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
  <EarthquakeFilter mapInstanceRef={mapInstanceRef} />
  <AirQualityFilter mapInstanceRef={mapInstanceRef} />
  <WeatherFilter mapInstanceRef={mapInstanceRef} />
</div>


    <LayerControls layerVisibility={layerVisibility} setLayerVisibility={setLayerVisibility} />

    <ModalInfo isOpen={showModal} onClose={() => setShowModal(false)} content={modalContent} />

    <div
      ref={mapContainer}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  </IonContent>
</IonPage>

  );
};

export default MapboxMap;

