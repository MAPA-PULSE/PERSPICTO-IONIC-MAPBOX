/*
Buscar en YouTube
Transformar a un formato de "alerta" usable
Permitir cambios de filtros
Sin dependencias backend (por ahora), 100% cliente
*/

import { useEffect, useState, useCallback } from "react";
import { fetchYouTubeAlerts } from "../service/youtubeService"; 
import type { Alert } from "@/types";
import type { Filters } from "@/types/filters";

export function useSearchAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: "" });
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!filters.query) return;

    setLoading(true);
    const data = await fetchYouTubeAlerts(filters);
    setAlerts(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const onFilterChange = (newFilters: Filters) => setFilters(newFilters);

  return { alerts, loading, onFilterChange };
}
