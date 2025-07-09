import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { IonInput, IonButton, IonImg } from '@ionic/react';
import axios from 'axios';
import './css/SearchBar.css';
import Search from '../../assets/Search.svg';
import ViewOptions from './ViewOptions';

interface SearchBarProps {
  searchEvent: (results: any[]) => void;
  map: mapboxgl.Map | null;
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>;
  scrollToSearchBar?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchEvent, map, setMarker, scrollToSearchBar }) => {
  const [searchMessage, setSearchMessage] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<mapboxgl.MapboxGeoJSONFeature[]>([]);

  const handleSearch = (query: string) => {
    if (map && query) {
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?language=es&access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          const features: mapboxgl.MapboxGeoJSONFeature[] = data.features;
          const filteredResults = features.filter(feature =>
            feature.place_type.includes('country')
          );

          if (filteredResults.length === 1) {
            handleResultClick(filteredResults[0]);
          } else {
            setSearchResults(filteredResults);
          }
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result: mapboxgl.MapboxGeoJSONFeature) => {
    const [lng, lat] = result.center as [number, number];

    map?.flyTo({ center: [lng, lat] });

    if (setMarker && map) {
      setMarker(marker => {
        if (marker) {
          marker.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);

        return newMarker;
      });
    }

    setSearchResults([]);
  };

  const flyToContinent = (continent: string) => {
    let center: [number, number];
    let zoomLevel = 2;

    switch (continent) {
      case 'africa':
        center = [8.6753, 9.0820];
        break;
      case 'america':
        center = [-95.7129, 37.0902];
        break;
      case 'asia':
        center = [100.6197, 34.0479];
        break;
      case 'europa':
        center = [14.4378, 50.0755];
        break;
      case 'oceania':
        center = [133.7751, -25.2744];
        break;
      default:
        return;
    }

    map?.flyTo({ center, zoom: zoomLevel });
  };

  const handleButtonSearch = (value: string) => {
    handleSearch(value);

    axios.post(`http://localhost:8000/api/search?query=${value}`)
      .then(res => {
        if (res.data.message) {
          setSearchMessage(res.data.message);
          searchEvent([]);
        } else {
          setSearchMessage('');
          searchEvent(res.data);
        }
        if (scrollToSearchBar) {
          scrollToSearchBar();
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleButtonSearch(search);
    }
  };

  return (
    <>
      <div className='container-search-map'>
        <IonInput
          className='search-map'
          placeholder="Buscar por país o receta..."
          value={search}
          onIonChange={e => setSearch(e.detail.value!)}
          onKeyDown={handleKeyDown}
          clearInput
          debounce={250}
        />
        <IonButton className='btn-search' onClick={() => handleButtonSearch(search)}>
          <IonImg src={Search} alt="Buscar" />
        </IonButton>
      </div>

      <div>
        {searchMessage && <div className="message error-text fw-bold text-center">{searchMessage}</div>}
        <ul className="country-list">
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => handleResultClick(result)}
              className="country-list-item"
            >
              {result.place_name}
            </li>
          ))}
        </ul>
      </div>

      <ViewOptions onViewOptionChange={flyToContinent} />
    </>
  );
};

export default SearchBar;
