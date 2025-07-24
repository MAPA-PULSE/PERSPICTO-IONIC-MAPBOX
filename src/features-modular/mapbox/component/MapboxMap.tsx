// PERSPICTO-IONIC-MAPBOX\src\features-modular\mapbox\component\MapboxMap.tsx
import React, { useRef, useEffect } from 'react';
import { IonContent } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../../theme/globals.css';
import { SearchBox } from '@mapbox/search-js-react';
import { fetchEarthquakes } from '../services/quakeService';
import { fetchWeatherData } from '../services/weatherService';
import { fetchAirQuality } from '../services/airService';
import { useDeviceType } from '../hooks/useDeviceType'; // responsive

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const { isLandscape, deviceType } = useDeviceType(); // ✅ CORREGIDO: hook funcionando correctamente

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE || 'mapbox://styles/perspictouser/cmdh6c1pa002301s8cv4ohs3a/draft',
      center: MAPBOX_CENTER || [0, 20],
      zoom: deviceType === 'mobile' ? 2.5 : MAPBOX_ZOOM || 3.5, // ✅ ZOOM RESPONSIVO SEGÚN EL TIPO DE DISPOSITIVO
      projection: 'globe',
      dragPan: true,
      scrollZoom: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      boxZoom: true,
    });

    mapInstanceRef.current = map;

    map.on('load', async () => {
      map.scrollZoom.enable();

      // === Capa de viento ===
      map.addSource('wind', {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`
        ],
        tileSize: 256,
        attribution: 'Map data © OpenWeatherMap',
      });

      map.addLayer({
        id: 'wind-layer',
        type: 'raster',
        source: 'wind',
        paint: { 'raster-opacity': 0.7 },
      });

      // === Capa de nubes animada ===
      map.addSource('clouds', {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`
        ],
        tileSize: 256,
        attribution: 'Map data © OpenWeatherMap',
      });

      map.addLayer({
        id: 'clouds-layer',
        type: 'raster',
        source: 'clouds',
        paint: { 'raster-opacity': 0.6 },
      });

      // ✅ ANIMACIÓN OPACIDAD CAPA DE NUBES CON LIMPIEZA SEGURA
      let opacity = 0.6;
      let increasing = true;
      const interval = setInterval(() => {
        if (map.getLayer('clouds-layer')) {
          map.setPaintProperty('clouds-layer', 'raster-opacity', opacity);
          opacity += increasing ? 0.005 : -0.005;
          if (opacity >= 0.8) increasing = false;
          if (opacity <= 0.4) increasing = true;
        }
      }, 100);

      // === Capa de sismos ===
      const earthquakeData = await fetchEarthquakes();
      map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: earthquakeData.map(eq => ({
            type: 'Feature',
            properties: {
              mag: eq.magnitude,
              title: eq.title,
              time: eq.time,
            },
            geometry: {
              type: 'Point',
              coordinates: eq.coordinates,
            }
          }))
        }
      });

      map.addLayer({
        id: 'earthquake-heat',
        type: 'heatmap',
        source: 'earthquakes',
        maxzoom: 9,
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
          'heatmap-intensity': 1.2,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
          'heatmap-opacity': 0.7,
        }
      });

      // === Evento clic para clima y calidad del aire ===
      map.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        const [weather, air] = await Promise.all([
          fetchWeatherData(lat, lng),
          fetchAirQuality(lat, lng)
        ]);

        const w = weather?.[0];
        const aqi = air?.list?.[0]?.main?.aqi;

        const html = `
          <strong>Ubicación:</strong> ${lat.toFixed(2)}, ${lng.toFixed(2)}<br/>
          <strong>Clima:</strong> ${w?.description || 'N/A'} (${w?.temperature} °C)<br/>
          <strong>Aire (AQI):</strong> ${aqi || 'N/A'}
        `;

        new mapboxgl.Popup()
          .setLngLat([lng, lat])
          .setHTML(html)
          .addTo(map);
      });

      // ✅ LIMPIEZA DE INTERVAL Y EVENTOS EN UNLOAD
      return () => {
        clearInterval(interval);
        map.off('click', () => {}); // 🔁 recomendado si quieres evitar duplicados
      };
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null; // ✅ ayuda a evitar memoria retenida
      }
    };
  }, [deviceType]); // ✅ Mantener deviceType en dependencias si quieres re-crear el mapa en resize

  return (
    <IonContent fullscreen>
      {/* ✅ MEJORA ACCESIBILIDAD: CONTENEDOR DEL MAPA CON ROLE Y ARIA */}
      <div
        style={{ position: 'absolute', top: '2vh', left: '4vw', right: '4vw', zIndex: 20 }}
        aria-label="Buscador de lugares"
        role="search"
      >
        <SearchBox
          accessToken={mapboxgl.accessToken!}
          mapboxgl={mapboxgl}
          map={mapInstanceRef.current!}
          value="Buscar lugar"
          onChange={() => {}}
          marker={false}
        />
      </div>

      <div
        ref={mapContainer}
        role="application" // Accesibilidad
        aria-label="Mapa interactivo con capas climáticas, de viento y sismos" // // Accesibilidad descriptiva
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
