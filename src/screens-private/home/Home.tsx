// src/screens-private/home/Home.tsx
import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import MapboxMap from '../../features-modular/mapbox/component/MapboxMap';
import SearchBar from '../../features-modular/search/components/SearchBar';
import type mapboxgl from 'mapbox-gl';
import './Home.css';

const Home: React.FC = () => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  const handleMapLoad = (map: mapboxgl.Map) => setMapInstance(map);
  const handleSearchResult = (results: any[]) => {};

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="home-container">
          <SearchBar
            map={mapInstance}
            setMarker={setMarker}
            searchEvent={handleSearchResult}
          />
          <MapboxMap onMapLoad={handleMapLoad} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
