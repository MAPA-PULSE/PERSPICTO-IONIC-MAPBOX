export interface WeatherData {
  coordinates: [number, number];
  description: string;
  temperature: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  icon: string;
}
