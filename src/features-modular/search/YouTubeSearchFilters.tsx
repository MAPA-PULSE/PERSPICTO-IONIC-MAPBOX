/*
 Aquí debería ir el formulario React con inputs para query, duration, fecha, etc.
 Este componente expone los filtros seleccionados al componente padre 
 (que contiene el mapa y la lógica de búsqueda).

            Controlar filtros: query, categoría, fechas
            Extiende HTMLAttributes para máximo reuso

*/
import React, { useState } from "react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { Filters } from "@/types/filters";

type Props = {
  onChange: (filters: Filters) => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const YouTubeSearchFilters: React.FC<Props> = ({ onChange, ...rest }) => {
  // Estado inicial simple solo query, puedes expandirlo para duración, fecha, etc.
  const [filters, setFilters] = useState<Filters>({ query: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(filters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, query: e.target.value }));
  };

  return (
    <div {...rest}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Haz una búsqueda..."
          value={filters.query}
          onChange={handleInputChange}
        />
        {/* Aquí podrías agregar selects para category, duration, dateRange */}
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
};
