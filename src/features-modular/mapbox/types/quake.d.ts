export interface Earthquake {
  id: string;
  title: string;
  time: number;
  magnitude: number;
  depth: number;
  tsunami: boolean;
  coordinates: [number, number];
}
