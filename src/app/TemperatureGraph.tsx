"use client";

import { useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import * as THREE from 'three';
import { Line, Text } from '@react-three/drei';

interface HistoricalDataPoint {
  timestamp: string;
  temperature: number;
}

type HistoricalSensorData = HistoricalDataPoint[];

const historyFetcher = async (url: string): Promise<HistoricalSensorData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching historical data.') as Error & { info: any; status: number };
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const swrOptions: SWRConfiguration = {
  refreshInterval: 60000, // Refresh every minute
  revalidateOnFocus: true,
  errorRetryCount: 3,
};

function TemperatureGraph() {
  const { data, error } = useSWR<HistoricalSensorData>('/api/sensor-data/history', historyFetcher, swrOptions);

  const { points, minTemp, maxTemp, timeLabels, graphHeight, graphWidth } = useMemo(() => {
    if (!data || data.length < 2) {
      return { points: [], minTemp: 0, maxTemp: 0, timeLabels: [], graphHeight: 5, graphWidth: 10 };
    }

    const temperatures = data.map((p) => p.temperature);
    const min = Math.floor(Math.min(...temperatures));
    const max = Math.ceil(Math.max(...temperatures));

    const startTime = new Date(data[0].timestamp).getTime();
    const endTime = new Date(data[data.length - 1].timestamp).getTime();
    const duration = Math.max(1, endTime - startTime);

    const gWidth = 10;
    const gHeight = 5;

    const graphPoints = data.map(
      (p) =>
        new THREE.Vector3(
          ((new Date(p.timestamp).getTime() - startTime) / duration) * gWidth - gWidth / 2,
          ((p.temperature - min) / (max - min || 1)) * gHeight - gHeight / 2,
          0
        )
    );

    const numLabels = 4;
    const labels = Array.from({ length: numLabels + 1 }).map((_, i) => {
      const time = new Date(startTime + (i / numLabels) * duration);
      return {
        label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        position: new THREE.Vector3((i / numLabels) * gWidth - gWidth / 2, -gHeight / 2 - 0.5, 0),
      };
    });

    return { points: graphPoints, minTemp: min, maxTemp: max, timeLabels: labels, graphHeight: gHeight, graphWidth: gWidth };
  }, [data]);

  if (error || !data) return null;

  const halfWidth = graphWidth / 2;
  const halfHeight = graphHeight / 2;

  return (
    <group position={[0, 0, -3]}>
      <Text position={[0, halfHeight + 0.5, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        Temperature (24h)
      </Text>

      <Line points={points} color="#88ddff" lineWidth={3} />

      <Text position={[-halfWidth - 0.2, halfHeight, 0]} fontSize={0.25} color="white" anchorX="right" anchorY="middle">{maxTemp}°C</Text>
      <Text position={[-halfWidth - 0.2, -halfHeight, 0]} fontSize={0.25} color="white" anchorX="right" anchorY="middle">{minTemp}°C</Text>

      {timeLabels.map((item, index) => <Text key={index} {...item}>{item.label}</Text>)}
    </group>
  );
}

export default TemperatureGraph;
