"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Line, Html } from "@react-three/drei";
import useSWR, { SWRConfiguration } from 'swr';

// Define the shape of your data for type safety
interface SensorData {
  temperature: string;
  humidity: string;
  pressure: string;
  altitude: string | null;
  acceleration: {
    x: string;
    y: string;
    z: string;
  } | null;
}

// An improved fetcher function that handles HTTP errors
const fetcher = async (url: string): Promise<SensorData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

function Model() {
  // Make sure you have a model.glb file in your /public folder
  const { scene } = useGLTF("/model.glb");
  return <primitive object={scene} scale={1.5} />;
}

useGLTF.preload("/model.glb");

// A component to render a single data point with a line and a label
function DataPoint({ name, value, position }: { name: string, value: string, position: [number, number, number] }) {
  return (
    <group>
      {/* Line from the center of the object to the data label */}
      <Line
        points={[[0, 0, 0], position]}
        color="white"
        lineWidth={0.5}
        dashed
        dashScale={15}
      />
      {/* HTML component to display the text label */}
      <Html position={position} center>
        <div className="text-white text-s bg-black/60 p-1 rounded-sm whitespace-nowrap font-mono">
          <span className="font-bold">{name}:</span> {value}
        </div>
      </Html>
    </group>
  );
}

export default function ThreeDObject() {
  const swrOptions: SWRConfiguration = {
    refreshInterval: 2000,
    revalidateOnFocus: true,
    errorRetryCount: 2,
  };

  const { data, error, isLoading } = useSWR<SensorData>('/api/sensor-data', fetcher, swrOptions);

  return (
    <div className="w-full h-full max-w-[400px] aspect-square">
      <Canvas camera={{ position: [0, 1, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <group>
          <Model />
          {error ? (
            <Html center><div className="text-red-400 p-2 bg-black/70 rounded">Failed to load data</div></Html>
          ) : isLoading ? (
            <Html center><div className="text-white animate-pulse">Loading sensor data...</div></Html>
          ) : data ? (
            <>
              <DataPoint name="Temp" value={`${data.temperature}°C`} position={[-5, 3, 0]} />
              <DataPoint
                name="Humidity"
                value={`${data.humidity}%`}
                position={[5, 2.5, 0]}
              />
              <DataPoint name="Pressure" value={`${data.pressure} hPa`} position={[-6, -2, 0]} />
              {data.acceleration ? (
                <DataPoint
                  name="Accel"
                  value={`X:${data.acceleration.x} Y:${data.acceleration.y} Z:${data.acceleration.z}`}
                  position={[6, -2.5, 0]}
                />
              ) : null}
              {data.altitude && (
                <DataPoint
                  name="Altitude"
                  value={`${data.altitude} m`}
                  position={[0, -4, 0]}
                />
              )}
            </>
          ) : null}
        </group>
        <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.5} enableDamping={true} />
      </Canvas>
    </div>
  );
}