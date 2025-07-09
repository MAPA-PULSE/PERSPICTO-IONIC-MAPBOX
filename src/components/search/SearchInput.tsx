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

// SearchResults.tsx
import React from 'react';

interface SearchResultsProps {
  results: any[];
  onSelect: (result: any) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect }) => {
  return (
    <ul className="country-list">
      {results.map((result, index) => (
        <li key={index} onClick={() => onSelect(result)} className="country-list-item">
          {result.place_name}
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;