import React from 'react';
import { fetchWeatherData } from '../../services/weatherService';

const WeatherFilter: React.FC<{
  mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>;
}> = ({ mapInstanceRef }) => {
  const handleWeatherRange = async (daysAgo: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const center = map.getCenter();
    const lat = center.lat;
    const lon = center.lng;

    const data = await fetchWeatherData(lat, lon);

    if (!data.length) return;

    const popup = new mapboxgl.Popup({ className: 'weather-popup' })
      .setLngLat(data[0].coordinates as [number, number])
      .setHTML(`
        <div>
          <h3>Clima actual</h3>
          <p><strong>${data[0].description}</strong></p>
          <p>Temp: ${data[0].temperature}°C</p>
          <p>Humedad: ${data[0].humidity}%</p>
          <p>Viento: ${data[0].wind_speed} m/s</p>
        </div>
      `)
      .addTo(map);
  };

  return (
    <select
      onChange={(e) => handleWeatherRange(parseInt(e.target.value))}
      style={{ position: 'absolute', top: '9vh', left: '4vw', zIndex: 20 }}
    >
      <option value="">Clima actual</option>
      <option value="1">Hoy</option>
      <option value="3">Últimos 3 días</option>
      <option value="7">Última semana</option>
    </select>
  );
};

export default WeatherFilter;
