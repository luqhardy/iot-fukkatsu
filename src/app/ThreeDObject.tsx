"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Line, Html } from "@react-three/drei";
import useSWR, { SWRConfiguration } from "swr";
import { SensorData, SensorHistory } from "@/types/sensor";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line as ChartLine } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error fetching data");
  return res.json();
};

function Model() {
  const { scene } = useGLTF("/model.glb");
  return <primitive object={scene} scale={1.5} />;
}
useGLTF.preload("/model.glb");

function DataPointWithChart({
  name,
  value,
  position,
  chartData,
}: {
  name: string;
  value: string;
  position: [number, number, number];
  chartData?: { labels: string[]; values: number[]; color: string };
}) {
  return (
    <group>
      <Line points={[[0, 0, 0], position]} color="white" lineWidth={0.5} dashed dashScale={15} />
      <Html position={position} center>
        <div className="text-white text-xs bg-black/70 p-1 rounded font-mono">
          <strong>{name}:</strong> {value}
        </div>
      </Html>
      {chartData && (
        <Html position={[position[0], position[1] - 1.2, position[2]]} center>
          <div style={{ width: "150px", height: "90px", background: "rgba(0,0,0,0.8)", borderRadius: "6px", padding: "4px" }}>
            <ChartLine
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.values, borderColor: chartData.color, borderWidth: 2, pointRadius: 0 }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                elements: { line: { tension: 0.3 } },
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                  x: { display: false },
                  y: { display: false },
                },
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ThreeDObject() {
  const swrOptions: SWRConfiguration = { refreshInterval: 2000, revalidateOnFocus: true };
  const { data, error, isLoading } = useSWR<SensorData>("/api/sensor-data", fetcher, swrOptions);
  const { data: history } = useSWR<SensorHistory>("/api/sensor-history", fetcher, { refreshInterval: 300000 });

  const accelMagnitude = history?.acceleration
    ? history.acceleration.x.map((_, i) =>
        Math.sqrt(
          Math.pow(history.acceleration!.x[i], 2) +
          Math.pow(history.acceleration!.y[i], 2) +
          Math.pow(history.acceleration!.z[i], 2)
        )
      )
    : [];

  return (
    <div className="w-[800px] h-[300px] max-w-5xl mx-auto">
      <Canvas camera={{ position: [0, 1, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <group>
          <Model />
          {error && (
            <Html center><div className="text-red-500 bg-black/70 p-2 rounded">Failed to load data</div></Html>
          )}
          {isLoading && (
            <Html center><div className="text-white animate-pulse">Loading...</div></Html>
          )}
          {data && history && (
            <>
              <DataPointWithChart
                name="Temp"
                value={`${data.temperature}°C`}
                position={[-5, 3, 0]}
                chartData={{ labels: history.timestamps, values: history.temperature, color: "rgb(255,99,132)" }}
              />
              <DataPointWithChart
                name="Humidity"
                value={`${data.humidity}%`}
                position={[5, 2.5, 0]}
                chartData={{ labels: history.timestamps, values: history.humidity, color: "rgb(54,162,235)" }}
              />
              <DataPointWithChart
                name="Pressure"
                value={`${data.pressure} hPa`}
                position={[-6, -2, 0]}
                chartData={{ labels: history.timestamps, values: history.pressure, color: "rgb(255,206,86)" }}
              />
              {data.altitude && history.altitude && (
                <DataPointWithChart
                  name="Altitude"
                  value={`${data.altitude} m`}
                  position={[0, -4, 0]}
                  chartData={{ labels: history.timestamps, values: history.altitude, color: "rgb(75,192,192)" }}
                />
              )}
              {data.acceleration && accelMagnitude.length > 0 && (
                <DataPointWithChart
                  name="Accel"
                  value={`X:${data.acceleration.x} Y:${data.acceleration.y} Z:${data.acceleration.z}`}
                  position={[6, -2.5, 0]}
                  chartData={{ labels: history.timestamps, values: accelMagnitude, color: "rgb(153,102,255)" }}
                />
              )}
            </>
          )}
        </group>
        <OrbitControls enableZoom autoRotate autoRotateSpeed={0.5} enableDamping />
      </Canvas>
    </div>
  );
}
