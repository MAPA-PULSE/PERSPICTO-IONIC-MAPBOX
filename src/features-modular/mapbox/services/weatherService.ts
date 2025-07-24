// src/services/weatherService.ts

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

export async function getWeather(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error('Weather API failed');
  return res.json();
}

// Llamada externa compatible con MapboxMap
export async function fetchWeatherData(lat: number, lon: number) {
  try {
    const weatherData = await getWeather(lat, lon);
    return [{
      coordinates: [weatherData.coord.lon, weatherData.coord.lat],
      description: weatherData.weather[0].description,
      temperature: weatherData.main.temp,
      temp_min: weatherData.main.temp_min, 
      temp_max: weatherData.main.temp_max,
      humidity: weatherData.main.humidity,
      wind_speed: weatherData.wind.speed,
      icon: weatherData.weather[0].icon,
    }];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
}
