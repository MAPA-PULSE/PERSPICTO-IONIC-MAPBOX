// ⚠️ HOOK DE PRUEBA: useFetchGlobal
// Este hook es un ejemplo de prueba para realizar peticiones GET de forma genérica.
// No se recomienda para producción sin validaciones y manejo de errores más completo.

import { useState, useEffect } from 'react';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetchGlobal<T = any>(url: string, options?: RequestInit): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
