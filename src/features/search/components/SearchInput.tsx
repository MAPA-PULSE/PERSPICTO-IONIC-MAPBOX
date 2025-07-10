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
        placeholder="Escribe sobre un tema para generar una alerta en el mapa"
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

