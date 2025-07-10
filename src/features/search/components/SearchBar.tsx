// SearchBar.tsx
/* [ SearchBar.tsx ]                  ← Componente contenedor (UI principal + lógica conectada)
        ↓ usa hook [ useMapSearch ]  
        
 * Además, SearchBar.tsx compone los siguientes componentes UI:
 * ↳ [ SearchInput.tsx ]              ← Input de búsqueda y botón (UI desacoplada)
 * ↳ [ SearchResults.tsx ]            ← Lista interactiva de resultados
 * ↳ [ ViewOptions.tsx ]              ← Botones para vista por continente
 */
import React from 'react';
import { IonImg } from '@ionic/react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import ViewOptions from './ViewOptions';
import useMapSearch from '../hooks/useMapSearch';
import Search from '../../assets/Search.svg';
import './css/SearchBar.css';

import type mapboxgl from 'mapbox-gl';

interface SearchBarProps {
  searchEvent: (results: any[]) => void;
  map: mapboxgl.Map | null;
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>;
  scrollToSearchBar?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ map, setMarker, searchEvent, scrollToSearchBar }) => {
  const {
    search,
    searchMessage,
    searchResults,
    handleSearchChange,
    handleKeyDown,
    handleButtonSearch,
    handleResultClick,
    flyToContinent,
  } = useMapSearch({ map, setMarker, searchEvent, scrollToSearchBar });

  return (
    <>
      <div className="container-search-map">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          onSearch={handleButtonSearch}
          onKeyDown={handleKeyDown}
          icon={<IonImg src={Search} alt="Buscar" />}
        />
      </div>

      <div>
        {searchMessage && <div className="message error-text fw-bold text-center">{searchMessage}</div>}
        <SearchResults results={searchResults} onSelect={handleResultClick} />
      </div>

      <ViewOptions onViewOptionChange={flyToContinent} />
    </>
  );
};

export default SearchBar;

// SearchInput.tsx
import React from 'react';
import { IonInput, IonButton } from '@ionic/react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  icon: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch, onKeyDown, icon }) => {
  return (
    <>
      <IonInput
        className="search-map"
        placeholder="Buscar por país o receta..."
        value={value}
        onIonChange={e => onChange(e.detail.value!)}
        onKeyDown={onKeyDown}
        clearInput
        debounce={250}
      />
      <IonButton className="btn-search" onClick={() => onSearch(value)}>
        {icon}
      </IonButton>
    </>
  );
};

export default SearchInput;