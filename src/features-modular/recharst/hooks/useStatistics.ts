// import { useEffect, useState } from "react";
// import axios from "axios";
// import API_BASE_URL from "../api/api";

// export interface Stat {
//   date: string;
//   total_searches: number;
//   alerts_triggered: number;
// }

// export const useSearchStats = () => {
//   const [data, setData] = useState<Stat[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axios.get<Stat[]>(`${API_BASE_URL}/estadisticas/search`)
//       .then((response) => {
//         setData(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Error al cargar estadísticas.");
//         setLoading(false);
//       });
//   }, []);

//   return { data, loading, error };
// };
// src/common/hooks/useStatistics.ts

import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../../common/api/api";

export interface Stat {
  date: string;
  total_searches: number;
  alerts_triggered: number;
}

export const useSearchStats = () => {
  const [data, setData] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<Stat[]>(`${API_BASE_URL}/estadisticas/search`);
      setData(response.data);
    } catch (err) {
      setError("Error al cargar estadísticas");
    } finally { 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
