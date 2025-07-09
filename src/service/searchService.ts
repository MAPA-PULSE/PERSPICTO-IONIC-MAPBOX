// searchService.ts
import mapboxgl from 'mapbox-gl';

export const searchCountries = async (
  query: string,
  map: mapboxgl.Map | null,
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>,
  setResults: (results: any[]) => void
) => {
  if (!map || !query) return;

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?language=es&access_token=${mapboxgl.accessToken}`
    );
    const data = await res.json();
    const features = data.features;

    const filtered = features.filter((f: any) => f.place_type.includes('country'));

    if (filtered.length === 1) {
      const [lng, lat] = filtered[0].center;
      map.flyTo({ center: [lng, lat] });

      setMarker(marker => {
        if (marker) marker.remove();
        const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        return newMarker;
      });

      setResults([]);
    } else {
      setResults(filtered);
    }
  } catch (error) {
    console.error('Error fetching Mapbox data', error);
  }
};