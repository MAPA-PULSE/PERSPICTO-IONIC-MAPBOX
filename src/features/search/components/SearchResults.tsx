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