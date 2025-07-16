export const fetchEmbedData = async (filters: string[]) => {
  const response = await fetch('/api/powerbi/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters }),
  });

  if (!response.ok) throw new Error('Error al obtener datos de Power BI');

  return response.json(); 
};

export const fetchAlertOptions = async (): Promise<string[]> => {
  const response = await fetch('/api/alertas');
  if (!response.ok) throw new Error('Error al cargar alertas');
  return response.json(); 
};

export const fetchSearchOptions = async (): Promise<string[]> => {
  const response = await fetch('/api/busquedas');
  if (!response.ok) throw new Error('Error al cargar búsquedas');
  return response.json(); 
};
