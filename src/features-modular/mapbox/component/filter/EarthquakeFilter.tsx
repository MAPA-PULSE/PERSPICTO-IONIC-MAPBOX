import React from 'react';
import { fetchEarthquakes } from '../../services/quakeService';

const EarthquakeFilter: React.FC<{
  mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>;
}> = ({ mapInstanceRef }) => {
  const handlePresetRange = async (daysAgo: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysAgo);

    const formattedStart = start.toISOString().split('T')[0];
    const formattedEnd = end.toISOString().split('T')[0];

    const data = await fetchEarthquakes(formattedStart, formattedEnd);

    const geojson = {
      type: 'FeatureCollection',
      features: data.map((eq) => ({
        type: 'Feature',
        properties: {
          mag: eq.magnitude,
          title: eq.title,
          time: eq.time,
          depth: eq.depth,
          tsunami: eq.tsunami,
        },
        geometry: { type: 'Point', coordinates: eq.coordinates },
      })),
    };

    const source = map.getSource('earthquakes') as mapboxgl.GeoJSONSource;
    if (source) source.setData(geojson);
  };

  return (
    <select
      onChange={(e) => handlePresetRange(parseInt(e.target.value))}
      style={{ top: '6vh', left: '4vw', zIndex: 20 }}
    >
      <option value="">Selecciona rango</option>
      <option value="1">Hoy</option>
      <option value="3">Últimos 3 días</option>
      <option value="7">Última semana</option>
      <option value="30">Último mes</option>
    </select>
  );
};

export default EarthquakeFilter;
