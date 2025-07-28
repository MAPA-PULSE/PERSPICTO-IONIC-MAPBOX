import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchEarthquakes } from '../services/quakeService';
import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';
import { fetchWeatherData } from '../services/weatherService';
import { fetchAirQuality } from '../services/airService';

const useMapInitialization = (
  mapContainer: React.RefObject<HTMLDivElement>,
  mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>,
  setModalContent: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE || `mapbox://styles/perspictouser/cmdh6c1pa002301s8cv4ohs3a?fresh=${Date.now()}`,
      center: MAPBOX_CENTER || [0, 20],
      zoom: MAPBOX_ZOOM || 3.5,
      projection: 'globe',
    });

    mapInstanceRef.current = map;

    map.on('load', async () => {
      map.scrollZoom.enable();

      map.addSource('wind', {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`,
        ],
        tileSize: 256,
      });

      map.addLayer({
        id: 'wind-layer',
        type: 'raster',
        source: 'wind',
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': 0.7 },
      });

      map.addSource('clouds', {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`,
        ],
        tileSize: 256,
      });

      map.addLayer({
        id: 'clouds-layer',
        type: 'raster',
        source: 'clouds',
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': 0.6 },
      });

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
              depth: eq.depth,
              tsunami: eq.tsunami,
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
            'interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1,
          ],
          'heatmap-intensity': 1.2,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)',
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
            'interpolate', ['linear'], ['get', 'mag'], 1, 4, 6, 12,
          ],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'mag'],
            1, '#00bcd4', 3, '#ffc107', 5, '#f44336',
          ],
          'circle-opacity': 0.8,
        },
      });

     map.on('click', async (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['earthquake-points', 'earthquake-heat'],
  });

  if (features.length > 0) {
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

    setModalContent(htmlContent);
    setTimeout(() => setShowModal(true), 0);
    return;
  }

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
  <strong>Clima:</strong> ${w?.description ?? 'N/A'}
  ${w?.icon ? `<img src="https://openweathermap.org/img/wn/${w.icon}@2x.png" style="vertical-align: middle; width: 40px;"/>` : ''}<br/>
  <strong>Temperatura:</strong> ${w?.temperature ?? 'N/A'} °C (sensación: ${w?.feels_like ?? 'N/A'} °C)<br/>
  <strong>Temperatura Min/Max:</strong> ${w?.temp_min ?? 'N/A'} °C / ${w?.temp_max ?? 'N/A'} °C<br/>
  <strong>Humedad:</strong> ${w?.humidity ?? 'N/A'} %<br/>
  <strong>Viento:</strong> ${w?.wind_speed ?? 'N/A'} m/s<br/>
  <strong>Calidad del aire (AQI):</strong> ${aqi ? `${aqi} (${getAqiLabel(aqi)})` : 'N/A'}<br/>
  <strong>Contaminantes:</strong> CO: ${aqiData?.components?.co ?? 'N/A'} μg/m³, 
  PM2.5: ${aqiData?.components?.pm2_5 ?? 'N/A'} μg/m³, 
  PM10: ${aqiData?.components?.pm10 ?? 'N/A'} μg/m³, 
  SO2: ${aqiData?.components?.so2 ?? 'N/A'} μg/m³, 
  NO2: ${aqiData?.components?.no2 ?? 'N/A'} μg/m³, 
  O3: ${aqiData?.components?.o3 ?? 'N/A'} μg/m³,
  NH3: ${aqiData?.components?.nh3 ?? 'N/A'} μg/m³<br/>
  <strong>Visibilidad:</strong> ${w?.visibility ? (w.visibility / 1000).toFixed(2) + ' km' : 'N/A'}<br/>
  <strong>Presión:</strong> ${w?.pressure ?? 'N/A'} hPa<br/>
  PM10: ${aqiData?.components?.pm10 ?? 'N/A'} μg/m³<br/>
`;

  setModalContent(htmlContent);
  setTimeout(() => setShowModal(true), 0);
});


      map.on('mouseenter', 'earthquake-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'earthquake-points', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('remove', () => clearInterval(cloudAnimation));
    });

    return () => {
      map.remove();
    };
  }, []);
};

export default useMapInitialization;
