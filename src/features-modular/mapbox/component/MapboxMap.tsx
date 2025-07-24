import React, { useRef, useEffect, useState } from 'react';
import { IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';
import markerIcon from '../styles/marker-icon.png';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../../theme/globals.css';
import { SearchBox } from "@mapbox/search-js-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

if (!mapboxgl.accessToken) {
  console.error("❌ No tienes acceso a Mapbox");
}

const MapboxMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const allMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      if (window.innerWidth < 768) {
        setDeviceType('mobile');
      } else if (window.innerWidth < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE || 'mapbox://styles/perspictouser/cmc3eah7o00hm01qy1h5jgdvz',
      center: MAPBOX_CENTER || [2.1734, 41.3851],
      zoom: MAPBOX_ZOOM || 1,
      dragPan: true,
      scrollZoom: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      boxZoom: true,
      projection: 'globe',
    });

    mapInstanceRef.current.on('load', () => {
      mapInstanceRef.current!.loadImage(markerIcon, (err, img) => {
        if (err || !img) {
          console.error('❌ Error cargando ícono del marcador:', err);
          return;
        }
        mapInstanceRef.current!.addImage('custom-marker', img);
      });
    });

    return () => mapInstanceRef.current?.remove();
  }, []);

  function setInputValue(d: any) {
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
  }

  const renderMarkersFromData = (data: any[]) => {
    clearMarkers();
    data.forEach(loc => {
      const marker = new mapboxgl.Marker()
        .setLngLat(loc.coordinates)
        .setPopup(new mapboxgl.Popup().setText(loc.name))
        .addTo(mapInstanceRef.current!);
      allMarkersRef.current.push(marker);
    });
  };

  const renderMarkersByType = (type: string) => {
    setSelectedType(type);
    const filtered = type === 'all' ? locations : locations.filter(loc => loc.type === type);
    renderMarkersFromData(filtered);
  };

  const clearMarkers = () => {
    allMarkersRef.current.forEach(marker => marker.remove());
    allMarkersRef.current = [];
  };

  const segmentButtonStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '0.5rem',
    padding: '0.25rem 0.75rem',
    boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.25)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontSize: deviceType === 'mobile' ? '0.75rem' : '1rem',
  };

  return (
    <IonContent fullscreen style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: deviceType === 'mobile' ? (isLandscape ? '1vh' : '2vh') : '2vh',
          left: '4vw',
          right: '4vw',
          zIndex: 20,
        }}
      >
        <SearchBox
          accessToken={mapboxgl.accessToken!}
          mapboxgl={mapboxgl}
          map={mapInstanceRef.current!}
          value="Busca una ubicación..."
          onChange={(d) => setInputValue(d)}
          marker={false}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: deviceType === 'mobile' ? (isLandscape ? '7vh' : '10vh') : '10vh',
          left: '4vw',
          right: '4vw',
          zIndex: 10,
          background: 'transparent',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          overflowX: 'auto',
          display: 'flex',
          gap: '0.5rem',
          flexDirection: 'row',
        }}
      >
        <IonSegment
          value={selectedType}
          onIonChange={(e) => renderMarkersByType(e.detail.value)}
          style={{
            width: '100%',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <IonSegmentButton value="all" className="segment-button-custom">
            <IonLabel className='labelbtn'>Todos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="country" className="segment-button-custom">
            <IonLabel className='labelbtn'>País</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="region" className="segment-button-custom">
            <IonLabel className='labelbtn'><p>Región</p></IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="place"className="segment-button-custom">
            <IonLabel className='labelbtn'>Ciudad</IonLabel>
          </IonSegmentButton>
          {deviceType !== 'mobile' && (
            <>
              <IonSegmentButton value="locality" className="segment-button-custom">
                <IonLabel className='labelbtn'>Localidad</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="neighborhood" className="segment-button-custom">
                <IonLabel className='labelbtn'>Vecindario</IonLabel>cd    
              </IonSegmentButton>
            </>
          )}
        </IonSegment>
      </div>

      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      />
    </IonContent>
  );
};

export default MapboxMap;
