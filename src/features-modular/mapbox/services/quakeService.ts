// src/services/quakeService.ts

export async function getEarthquakes() {
  const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5';
  const res = await fetch(url);
  const data = await res.json();

  return data.features.map((f: any) => ({
    id: f.id,
    title: f.properties.title,
    coordinates: f.geometry.coordinates,
    magnitude: f.properties.mag,
    time: f.properties.time,
  }));
}

export async function fetchEarthquakes() {
  try {
    const earthquakes = await getEarthquakes();
    return earthquakes;
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
}
