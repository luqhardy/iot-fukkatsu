"use client";
import useSWR from "swr";

interface SensorData {
  created_at: string;
  temperature: string;
  humidity: string;
  pressure: string;
  altitude: string | null;
  acceleration?: { x: string; y: string; z: string } | null;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function useSensorData() {
  const { data, error, isLoading } = useSWR<SensorData>("/api/sensor-data", fetcher, {
    refreshInterval: 2000,
  });
  return { data, error, isLoading };
}
