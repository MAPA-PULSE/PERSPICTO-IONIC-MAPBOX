import mapboxgl from 'mapbox-gl';
import { fetchWeatherData } from '../services/weatherService';
import { fetchAirQuality } from '../services/airService';

const handleMapClick = (
  map: mapboxgl.Map,
  setModalContent: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onClick = async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    // Consultar features solo en capas que están en el mapa con datos sísmicos
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['earthquake-points', 'earthquake-heat'],
    });

    if (features.length > 0) {
      const f = features[0];
      // Las propiedades deben existir si la fuente y capa están bien cargadas
      const { mag, title, time, depth, tsunami } = f.properties;
      const coords = f.geometry.coordinates;
      const date = new Date(time);

      const html = `
        <strong>${title}</strong><br/>
        Magnitud: ${mag}<br/>
        Profundidad: ${depth} km<br/>
        Tsunami: ${tsunami ? 'Sí' : 'No'}<br/>
        Fecha: ${date.toLocaleString()}<br/>
        Coordenadas: ${coords[1].toFixed(2)}, ${coords[0].toFixed(2)}<br/>

      `;

      new mapboxgl.Popup().setLngLat(coords).setHTML(html).addTo(map);
      setModalContent(html);
      setTimeout(() => setShowModal(true), 0);
      return;
    }

    // Si no es un feature sísmico, mostrar clima y calidad del aire en el punto clickado
    const { lng, lat } = e.lngLat;
    const [weather, air] = await Promise.all([fetchWeatherData(lat, lng), fetchAirQuality(lat, lng)]);
    const w = weather?.[0];
    const aqi = air?.list?.[0]?.main?.aqi;
    const aqiData = air?.list?.[0];

    const getAqiLabel = (val: number) => ['Bueno', 'Aceptable', 'Moderado', 'Malo', 'Muy malo'][val - 1] || 'N/A';

    const aqiContent =
      aqi !== undefined ? `${aqi} (${getAqiLabel(aqi)})` : 'Datos no disponibles';

    const html = `
      <strong>Ubicación:</strong> ${lat.toFixed(2)}, ${lng.toFixed(2)}<br/>
      <strong>Clima:</strong> ${w?.description || 'N/A'} <img src="https://openweathermap.org/img/wn/${w?.icon}@2x.png" style="width: 40px;"/><br/>
      <strong>Temperatura:</strong> ${w?.temperature} °C (sensación: ${w?.feels_like ?? 'N/A'} °C)<br/>
      <strong>Calidad del aire (AQI):</strong> ${aqiContent}<br/>
    `;

    new mapboxgl.Popup().setLngLat([lng, lat]).setHTML(html).addTo(map);
    setModalContent(html);
    setTimeout(() => setShowModal(true), 0);
  };

  map.on('click', onClick);

  return () => map.off('click', onClick);
};

export default handleMapClick;


// import { useEffect } from 'react';
// import mapboxgl from 'mapbox-gl';
// import { fetchEarthquakes } from '../services/quakeService';
// import { MAPBOX_STYLE, MAPBOX_CENTER, MAPBOX_ZOOM } from '../MapboxConfig';

// const useMapInitialization = (
//   mapContainer: React.RefObject<HTMLDivElement>,
//   mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>,
//   setModalContent: React.Dispatch<React.SetStateAction<string | null>>,
//   setShowModal: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   useEffect(() => {
//     if (!mapContainer.current) return;

//     const map = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: MAPBOX_STYLE || `mapbox://styles/perspictouser/cmdh6c1pa002301s8cv4ohs3a?fresh=${Date.now()}`,
//       center: MAPBOX_CENTER || [0, 20],
//       zoom: MAPBOX_ZOOM || 3.5,
//       projection: 'globe',
//     });

//     mapInstanceRef.current = map;

//     map.on('load', async () => {
//       map.scrollZoom.enable();

//       // 🌀 Capa de viento
//       map.addSource('wind', {
//         type: 'raster',
//         tiles: ['https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=' + import.meta.env.VITE_OPENWEATHER_KEY],
//         tileSize: 256,
//       });

//       map.addLayer({
//         id: 'wind-layer',
//         type: 'raster',
//         source: 'wind',
//         layout: { visibility: 'visible' },
//       });

//       // ☁️ Capa de nubes
//       map.addSource('clouds', {
//         type: 'raster',
//         tiles: ['https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=' + import.meta.env.VITE_OPENWEATHER_KEY],
//         tileSize: 256,
//       });

//       map.addLayer({
//         id: 'clouds-layer',
//         type: 'raster',
//         source: 'clouds',
//         layout: { visibility: 'visible' },
//       });

//       // 🌍 Capa de sismos (heatmap y puntos)
//       const today = new Date();
//       const weekAgo = new Date();
//       weekAgo.setDate(today.getDate() - 7);

//       const start = weekAgo.toISOString().split('T')[0];
//       const end = today.toISOString().split('T')[0];

//       const earthquakes = await fetchEarthquakes(start, end);

//       const geojson = {
//         type: 'FeatureCollection',
//         features: earthquakes.map((eq) => ({
//           type: 'Feature',
//           properties: {
//             mag: eq.magnitude,
//             title: eq.title,
//             time: eq.time,
//             depth: eq.depth,
//             tsunami: eq.tsunami,
//           },
//           geometry: {
//             type: 'Point',
//             coordinates: eq.coordinates,
//           },
//         })),
//       };

//       map.addSource('earthquakes', {
//         type: 'geojson',
//         data: geojson,
//       });

//       map.addLayer({
//         id: 'earthquake-heat',
//         type: 'heatmap',
//         source: 'earthquakes',
//         maxzoom: 9,
//         paint: {
//           'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
//           'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
//           'heatmap-color': [
//             'interpolate',
//             ['linear'],
//             ['heatmap-density'],
//             0, 'rgba(33,102,172,0)',
//             0.2, 'rgb(103,169,207)',
//             0.4, 'rgb(209,229,240)',
//             0.6, 'rgb(253,219,199)',
//             0.8, 'rgb(239,138,98)',
//             1, 'rgb(178,24,43)',
//           ],
//           'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
//           'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
//         },
//       });

//       map.addLayer({
//         id: 'earthquake-points',
//         type: 'circle',
//         source: 'earthquakes',
//         minzoom: 7,
//         paint: {
//           'circle-radius': ['interpolate', ['linear'], ['get', 'mag'], 1, 4, 6, 20],
//           'circle-color': ['interpolate', ['linear'], ['get', 'mag'], 1, '#2DC4B2', 6, '#F7455D'],
//           'circle-stroke-color': 'white',
//           'circle-stroke-width': 1,
//           'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
//         },
//       });
//     });

//     return () => map.remove();
//   }, []);
// };

// export default useMapInitialization;
