"use client";

import React, { useState, useEffect } from "react";
import MapBackground from "./MapBackground";
import ThreeDObjectClient from "./ThreeDObjectClient";
import Image from "next/image";
import WelcomeModal from "./WelcomeModal";
import { useSensorData } from "./useSensorData";


const formatTimestamp = (timestamp: string | undefined) => {
  if (!timestamp) return "Loading...";
  try {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch  {
    return "Invalid date";
  }
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: sensorData } = useSensorData();

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MapBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <Image src="/logo.png" alt="Logo" width={300} height={300} className="mb-4" />
        <div className="scale-100 hover:scale-120 transition duration-500 ease-in-out ">
        <ThreeDObjectClient />
        </div>
        <div className="text-center text-white/70 mt-4 font-mono text-sm">
          <p>
            Live sensor data from an IoT device. <br />
            Updates every 5 minutes
            <span className="text-white/50 text-xs ml-2">&bull; Last updated: {formatTimestamp(sensorData?.created_at)}</span>
          </p>
          <a
            href="https://luqmanhadi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline mt-2 inline-block"
          >
            Return to luqmanhadi.com
          </a>
        </div>
      </main>
    </>
  );
}
