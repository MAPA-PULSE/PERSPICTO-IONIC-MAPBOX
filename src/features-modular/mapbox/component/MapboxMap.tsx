import React, { useRef, useEffect, useState } from 'react';
import { IonContent, IonModal, IonButton, IonPage } from '@ionic/react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../../theme/globals.css';
import { SearchBox } from '@mapbox/search-js-react';
import { fetchEarthquakes } from '../services/quakeService';
import { fetchWeatherData } from '../services/weatherService';
import { fetchAirQuality } from '../services/airService';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [layerVisibility, setLayerVisibility] = useState({
    wind: true,
    clouds: true,
    earthquake: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const toggleLayer = (layerId: string, visible: boolean) => {
    const map = mapInstanceRef.current;
    if (map?.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        MAPBOX_STYLE ||
        `mapbox://styles/perspictouser/cmdh6c1pa002301s8cv4ohs3a?fresh=${Date.now()}`,
      center: MAPBOX_CENTER || [0, 20],
      zoom: MAPBOX_ZOOM || 3.5,
      projection: 'globe',
    });

    mapInstanceRef.current = map;

    map.on('load', async () => {
      map.scrollZoom.enable();

      // === Capa de Viento ===
      map.addSource('wind', {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`,
        ],
        tileSize: 256,
        attribution: 'Map data © OpenWeatherMap',
      });

      map.addLayer({
        id: 'wind-layer',
        type: 'raster',
        source: 'wind',
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': 0.7 },
      });

      // === Capa de Nubes ===
      map.addSource('clouds', {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`,
        ],
        tileSize: 256,
        attribution: 'Map data © OpenWeatherMap',
      });

      map.addLayer({
        id: 'clouds-layer',
        type: 'raster',
        source: 'clouds',
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': 0.6 },
      });

      // === Animación de Nubes ===
      let opacity = 0.6;
      let increasing = true;
      const cloudAnimation = setInterval(() => {
        if (map.getLayer('clouds-layer')) {
          map.setPaintProperty('clouds-layer', 'raster-opacity', opacity);
          opacity += increasing ? 0.005 : -0.005;
          if (opacity >= 0.8) increasing = false;
          if (opacity <= 0.4) increasing = true;
        }
      }, 100);

      // === Capa de Sismos ===
      const earthquakeData = await fetchEarthquakes();
      map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: earthquakeData.map((eq) => ({
            type: 'Feature',
            properties: {
              mag: eq.magnitude,
              title: eq.title,
              time: eq.time,
            },
            geometry: {
              type: 'Point',
              coordinates: eq.coordinates,
            },
          })),
        },
      });

      map.addLayer({
        id: 'earthquake-heat',
        type: 'heatmap',
        source: 'earthquakes',
        layout: { visibility: 'visible' },
        maxzoom: 9,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1,
          ],
          'heatmap-intensity': 1.2,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
          'heatmap-opacity': 0.7,
        },
      });

      map.addLayer({
        id: 'earthquake-points',
        type: 'circle',
        source: 'earthquakes',
        minzoom: 5,
        layout: { visibility: 'visible' },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1,
            4,
            6,
            12,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1,
            '#00bcd4',
            3,
            '#ffc107',
            5,
            '#f44336',
          ],
          'circle-opacity': 0.8,
        },
      });



map.on('click', async (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['earthquake-points', 'earthquake-heat'],
  });

 if (features.length > 0) {
    // Si clicas sobre un sismo, mostrar info del sismo
    const feature = features[0];
    const { mag, title, time, depth, tsunami } = feature.properties;
    const coords = feature.geometry.coordinates;
    const date = new Date(time);

    const htmlContent = `
      <strong>${title}</strong><br/>
      Magnitud: ${mag}<br/>
      Profundidad: ${depth} km<br/>
      Tsunami: ${tsunami ? 'Sí' : 'No'}<br/>
      Fecha: ${date.toLocaleString()}<br/>

      Coordenadas: ${coords[1].toFixed(2)}, ${coords[0].toFixed(2)}<br/>
       `;

    new mapboxgl.Popup()
      .setLngLat(coords)
      .setHTML(htmlContent)
      .addTo(map);

    setModalContent(htmlContent);
    setTimeout(() => setShowModal(true), 0);
    return;
  }

  // Si clicas fuera de sismos, mostrar info de clima y calidad de aire
  const { lng, lat } = e.lngLat;
  const [weather, air] = await Promise.all([
    fetchWeatherData(lat, lng),
    fetchAirQuality(lat, lng),
  ]);

  const w = weather?.[0];
  const aqiData = air?.list?.[0];
  const aqi = aqiData?.main?.aqi;

  const getAqiLabel = (value: number) => {
    switch (value) {
      case 1: return 'Bueno';
      case 2: return 'Aceptable';
      case 3: return 'Moderado';
      case 4: return 'Malo';
      case 5: return 'Muy malo';
      default: return 'N/A';
    }
  };

  const htmlContent = `
    <strong>Ubicación:</strong> ${lat.toFixed(2)}, ${lng.toFixed(2)}<br/>
    <strong>Clima:</strong> ${w?.description || 'N/A'} <img src="https://openweathermap.org/img/wn/${w?.icon}@2x.png" style="vertical-align: middle; width: 40px;"/><br/>
    <strong>Temperatura:</strong> ${w?.temperature} °C (sensación: ${w?.feels_like} °C)<br/>
    <strong>Temperatura Min/Max:</strong> ${w?.temp_min} °C / ${w?.temp_max} °C<br/>
    <strong>Humedad:</strong> ${w?.humidity} %<br/>
    <strong>Viento:</strong> ${w?.wind_speed} m/s<br/>
    <strong>Calidad del aire (AQI):</strong> ${aqi ? `${aqi} (${getAqiLabel(aqi)})` : 'N/A'}<br/>
    <strong>Contaminantes:</strong> CO: ${aqiData?.components?.co ?? 'N/A'} μg/m³, PM2.5: ${aqiData?.components?.pm2_5 ?? 'N/A'} μg/m³, PM10: ${aqiData?.components?.pm10 ?? 'N/A'} μg/m³<br/>
  `;

  new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setHTML(htmlContent)
    .addTo(map);

  setModalContent(htmlContent);
  setTimeout(() => setShowModal(true), 0);
});


      map.on('mouseenter', 'earthquake-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'earthquake-points', () => {
        map.getCanvas().style.cursor = '';
      });

      // Cleanup
      return () => {
        clearInterval(cloudAnimation);
        map.remove();
      };
    });
  }, []);

  useEffect(() => {
    toggleLayer('wind-layer', layerVisibility.wind);
    toggleLayer('clouds-layer', layerVisibility.clouds);
    toggleLayer('earthquake-heat', layerVisibility.earthquake);
    toggleLayer('earthquake-points', layerVisibility.earthquake);
  }, [layerVisibility]);

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

        <IonModal 
          isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="custom-modal"
        >
          <div style={{ padding: '1rem' }}>
            <h2>Detalles</h2>
            <div dangerouslySetInnerHTML={{ __html: modalContent || '' }} />
            <IonButton expand="full" onClick={() => setShowModal(false)}>Cerrar</IonButton>
          </div>
        </IonModal>

        <div style={{ position: 'absolute', top: '12vh', left: '4vw', zIndex: 30, backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
          <label>
            <input
              type="checkbox"
              checked={layerVisibility.wind}
              onChange={(e) =>
                setLayerVisibility((prev) => ({ ...prev, wind: e.target.checked }))
              }
            />{' '}
            Viento
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={layerVisibility.clouds}
              onChange={(e) =>
                setLayerVisibility((prev) => ({ ...prev, clouds: e.target.checked }))
              }
            />{' '}
            Corriente de aire
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={layerVisibility.earthquake}
              onChange={(e) =>
                setLayerVisibility((prev) => ({ ...prev, earthquake: e.target.checked }))
              }
            />{' '}
            Sismos
          </label>
        </div>

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
