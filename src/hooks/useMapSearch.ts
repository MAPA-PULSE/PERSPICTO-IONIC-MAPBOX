/* useMapSearch.ts              ← Hook personalizado que contiene la lógica de búsqueda, manejo del mapa y API
       ↓ usa servicio 
       [ searchService.ts ]            */
import { useState } from 'react';
import axios from 'axios';
import type mapboxgl from 'mapbox-gl';
import { searchCountries } from '../api/searchService';

interface Props {
  map: mapboxgl.Map | null;
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>;
  searchEvent: (results: any[]) => void;
  scrollToSearchBar?: () => void;
}

function useMapSearch({ map, setMarker, searchEvent, scrollToSearchBar }: Props) {
  const [search, setSearch] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchChange = (value: string) => setSearch(value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleButtonSearch(search);
  };

  const handleButtonSearch = (query: string) => {
    searchCountries(query, map, setMarker, setSearchResults);

    axios.post(`http://localhost:8000/api/search?query=${query}`)
      .then(res => {
        if (res.data.message) {
          setSearchMessage(res.data.message);
          searchEvent([]);
        } else {
          setSearchMessage('');
          searchEvent(res.data);
        }
        scrollToSearchBar?.();
      })
      .catch(console.error);
  };

  const handleResultClick = (result: any) => {
    const [lng, lat] = result.center;
    map?.flyTo({ center: [lng, lat] });

    if (setMarker && map) {
      setMarker(marker => {
        if (marker) marker.remove();
        const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        return newMarker;
      });
    }

    setSearchResults([]);
  };

  const flyToContinent = (continent: string) => {
    const centers: { [key: string]: [number, number] } = {
      africa: [8.6753, 9.082],
      america: [-95.7129, 37.0902],
      asia: [100.6197, 34.0479],
      europa: [14.4378, 50.0755],
      oceania: [133.7751, -25.2744],
    };

    const center = centers[continent];
    if (center) map?.flyTo({ center, zoom: 2 });
  };

  return {
    search,
    searchMessage,
    searchResults,
    handleSearchChange,
    handleKeyDown,
    handleButtonSearch,
    handleResultClick,
    flyToContinent,
  };
}

export default useMapSearch;