"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Line, Html } from "@react-three/drei";
import useSWR from 'swr';


// A simple fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
        <div className="text-white text-xl bg-black/60 p-1 rounded-sm whitespace-nowrap font-mono">
          <span className="font-bold">{name}:</span> {value}
        </div>
      </Html>
    </group>
  );
}

export default function ThreeDObject() {
  // Fetch data every 2 seconds using SWR
  const { data } = useSWR('/api/sensor-data', fetcher, { refreshInterval: 2000 });

  return (
    <div className="w-full h-full max-w-[600px] max-h-[600px] aspect-square">
      <Canvas camera={{ position: [0, 1, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <group>
          <Model />
          {data ? (
            <>
              <DataPoint name="Temp" value={`${data.temperature}°C`} position={[-3, 2, 0]} />
              <DataPoint name="Humidity" value={`${data.humidity}%`} position={[3, 1.5, 0]} />
              <DataPoint name="Pressure" value={`${data.pressure} hPa`} position={[-3.5, -1, 0]} />
              <DataPoint name="Accel" value={`X:${data.acceleration.x} Y:${data.acceleration.y} Z:${data.acceleration.z}`} position={[3.5, -1.5, 0]} />
            </>
          ) : (
            <Html center><div className="text-white">Loading sensor data...</div></Html>
          )}
        </group>
        <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.5} enableDamping={true} />
      </Canvas>
    </div>
  );
}