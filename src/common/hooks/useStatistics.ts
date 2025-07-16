import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api/api";

export interface Stat {
  date: string;
  total_searches: number;
  alerts_triggered: number;
}

export const useSearchStats = () => {
  const [data, setData] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Stat[]>(`${API_BASE_URL}/estadisticas/search`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar estadísticas.");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};
