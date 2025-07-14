import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import SearchBar from './components/SearchBar';

const Search: React.FC = () => {
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Puedes definir aquí la función searchEvent si la necesitas
  const searchEvent = (results: any[]) => {
    // lógica para manejar los resultados
  };

  return (
    <SearchBar
      map={mapRef.current}
      setMarker={setMarker}
      searchEvent={searchEvent}
    />
  );
};

export default Search;