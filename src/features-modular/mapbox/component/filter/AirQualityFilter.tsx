import React from 'react';
import { fetchAirQuality } from '../../services/airService';

const AirQualityFilter: React.FC<{
  mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>;
}> = ({ mapInstanceRef }) => {
  const handlePresetRange = async (daysAgo: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const coordinatesList = [
      { lat: 19.4326, lon: -99.1332 }, // Ciudad de México
      { lat: 34.0522, lon: -118.2437 }, // Los Ángeles
    ];

    const dataPromises = coordinatesList.map(({ lat, lon }) =>
      fetchAirQuality(lat, lon)
    );
    const results = await Promise.all(dataPromises);

    const features = results
      .filter((res) => res !== null)
      .map((res, i) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coordinatesList[i].lon, coordinatesList[i].lat],
        },
        properties: {
          aqi: res.list[0].main.aqi,
          components: res.list[0].components,
        },
      }));

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    const source = map.getSource('airQuality') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    } else {
      map.addSource('airQuality', { type: 'geojson', data: geojson });

      map.addLayer({
        id: 'airQualityPoints',
        type: 'circle',
        source: 'airQuality',
        paint: {
          'circle-radius': 10,
          'circle-color': [
            'match',
            ['get', 'aqi'],
            1, '#009966',
            2, '#ffde33',
            3, '#ff9933',
            4, '#cc0033',
            5, '#660099',
            '#000000',
          ],
          'circle-opacity': 0.8,
        },
      });
    }
  };

  return (
    <select
      onChange={(e) => handlePresetRange(parseInt(e.target.value))}
      style={{ position: 'absolute', top: '18vh', left: '4vw', zIndex: 20 }}
    >
      <option value="">Selecciona rango</option>
      <option value="1">Hoy</option>
      <option value="3">Últimos 3 días</option>
      <option value="7">Última semana</option>
      <option value="30">Último mes</option>
    </select>
  );
};

export default AirQualityFilter;
