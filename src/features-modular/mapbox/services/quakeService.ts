// src/services/quakeService.ts
import type { Earthquake } from '../types/quake.d';

export async function fetchEarthquakes(startDate?: string, endDate?: string): Promise<Earthquake[]> {
  const baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startDate ?? '',
    endtime: endDate ?? '',
    minmagnitude: '1',
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`);
  const data = await response.json();

  return data.features.map((f: any) => ({
    id: f.id,
    magnitude: f.properties.mag,
    title: f.properties.title,
    time: f.properties.time,
    depth: f.geometry.coordinates[2],
    tsunami: f.properties.tsunami === 1,
    coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]],
  }));
}
