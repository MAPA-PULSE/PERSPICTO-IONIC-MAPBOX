// src/services/airService.ts

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

export async function fetchAirQuality(lat: number, lon: number) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Air quality API failed');
    return await res.json();
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return null;
  }
}
