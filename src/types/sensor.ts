export interface SensorData {
  temperature: string;
  humidity: string;
  pressure: string;
  altitude: string | null;
  acceleration?: { x: string; y: string; z: string } | null;
}

export interface SensorHistory {
  timestamps: string[];
  temperature: number[];
  humidity: number[];
  pressure: number[];
  altitude?: number[];
  acceleration?: { x: number[]; y: number[]; z: number[] };
}
