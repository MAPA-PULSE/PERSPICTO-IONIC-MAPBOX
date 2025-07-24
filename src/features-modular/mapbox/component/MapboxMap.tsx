import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import debounce from 'lodash.debounce';
import { SearchBox } from '@mapbox/search-js-react';
import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';
import markerIcon from '../styles/marker-icon.png';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../../theme/globals.css';
import { useDeviceType } from '../hooks/useDeviceType';
import { useHistory } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // tu archivo de config de firebase

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

if (!mapboxgl.accessToken) {
  console.error("❌ No tienes acceso a Mapbox");
}

const MapboxMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const { deviceType, isLandscape } = useDeviceType();
  const history = useHistory();

  // Auth: redirección si no está logueada
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) history.push('/');
    });
    return unsub;
  }, [history]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: MAPBOX_CENTER,
      zoom: MAPBOX_ZOOM,
      projection: 'globe',
    });

    map.on('load', () => {
      map.loadImage(markerIcon, (err, img) => {
        if (err || !img) {
          console.error('❌ Error cargando ícono del marcador:', err);
          return;
        }
        map.addImage('custom-marker', img);
      });
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  const renderMarkersFromData = (data: any[]) => {
    clearMarkers();
    const newMarkers = data.map(loc => {
      const marker = new mapboxgl.Marker()
        .setLngLat(loc.coordinates)
        .setPopup(new mapboxgl.Popup().setText(loc.name))
        .addTo(mapRef.current!);
      return marker;
    });
    setMarkers(newMarkers);
  };

  const renderMarkersByType = (type: string) => {
    setSelectedType(type);
    const filtered = type === 'all' ? locations : locations.filter(loc => loc.type === type);
    renderMarkersFromData(filtered);
  };

  const debouncedSearch = useCallback(
    debounce((d: any) => {
      const features = d?.features;
      if (!features || features.length === 0) return;

      const newLocations = features.slice(0, 20).map((f: any, index: number) => ({
        id: index.toString(),
        name: f.place_name,
        coordinates: f.geometry.coordinates,
        type: f.properties?.feature_type || f.place_type?.[0] || 'unknown',
      }));

      setLocations(newLocations);
      renderMarkersFromData(newLocations);
      setSelectedType('all');
    }, 500),
    []
  );

  return (
    <IonContent fullscreen style={{ position: 'relative' }}>
      {/* SearchBox */}
      <div style={{
        position: 'absolute',
        top: deviceType === 'mobile' ? (isLandscape ? '1vh' : '2vh') : '2vh',
        left: '4vw',
        right: '4vw',
        zIndex: 20,
      }}>
        <SearchBox
          accessToken={mapboxgl.accessToken!}
          mapboxgl={mapboxgl}
          map={mapRef.current!}
          value="Busca una ubicación..."
          onChange={debouncedSearch}
          marker={false}
        />
      </div>

      {/* Segment Buttons */}
      <div style={{
        position: 'absolute',
        top: deviceType === 'mobile' ? (isLandscape ? '7vh' : '10vh') : '10vh',
        left: '4vw',
        right: '4vw',
        zIndex: 10,
        background: 'transparent',
        display: 'flex',
        gap: '0.5rem',
        flexDirection: 'row',
        overflowX: 'auto',
      }}>
        <IonSegment
          value={selectedType}
          onIonChange={(e) => renderMarkersByType(e.detail.value!)}
        >
          <IonSegmentButton value="all"><IonLabel>Todos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="country"><IonLabel>País</IonLabel></IonSegmentButton>
          <IonSegmentButton value="region"><IonLabel>Región</IonLabel></IonSegmentButton>
          <IonSegmentButton value="place"><IonLabel>Ciudad</IonLabel></IonSegmentButton>
          {deviceType !== 'mobile' && (
            <>
              <IonSegmentButton value="locality"><IonLabel>Localidad</IonLabel></IonSegmentButton>
              <IonSegmentButton value="neighborhood"><IonLabel>Vecindario</IonLabel></IonSegmentButton>
            </>
          )}
        </IonSegment>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      />
    </IonContent>
  );
};

export default MapboxMap;
