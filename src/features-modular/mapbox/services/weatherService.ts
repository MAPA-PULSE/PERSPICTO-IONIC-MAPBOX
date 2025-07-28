// src/services/weatherService.ts
import type { WeatherData } from '../types/weather.d';

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

export async function getWeather(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API failed');
  return res.json();
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData[]> {
  try {
    const weather = await getWeather(lat, lon);
   return [{
  coordinates: [weather.coord.lon, weather.coord.lat],
  description: weather.weather[0].description,
  temperature: weather.main.temp,
  feels_like: weather.main.feels_like, 
  temp_min: weather.main.temp_min,
  temp_max: weather.main.temp_max,
  humidity: weather.main.humidity,
  wind_speed: weather.wind.speed,
  wind_deg: weather.wind.deg,
  pressure: weather.main.pressure,
  visibility: weather.visibility,
  clouds: weather.clouds.all,
  icon: weather.weather[0].icon,
}];

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
}
