import mapboxgl from 'mapbox-gl';
import { fetchWeatherData } from '../services/weatherService';
import { fetchAirQuality } from '../services/airService';

const handleMapClick = (
  map: mapboxgl.Map,
  setModalContent: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onClick = async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['earthquake-points', 'earthquake-heat'],
    });

    if (features.length > 0) {
      const f = features[0];
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

    const { lng, lat } = e.lngLat;
    const [weather, air] = await Promise.all([fetchWeatherData(lat, lng), fetchAirQuality(lat, lng)]);
    const w = weather?.[0];
    const aqi = air?.list?.[0]?.main?.aqi;
    const aqiData = air?.list?.[0];

    const getAqiLabel = (val: string) => ['Bueno', 'Aceptable', 'Moderado', 'Malo', 'Muy malo'][val - 1] || 'N/A';

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