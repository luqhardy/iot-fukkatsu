"use client";

import React, { useState, useEffect } from "react";
import MapBackground from "./MapBackground";
import ThreeDObjectClient from "./ThreeDObjectClient";
import Image from "next/image";
import WelcomeModal from "./WelcomeModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MapBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <Image src="/logo.png" alt="Logo" width={300} height={300} className="mb-4" />
        <div className="scale-100 hover:scale-120 transition duration-500 ease-in-out ">
        <ThreeDObjectClient />
        </div>
        <div className="text-center text-white/70 mt-4 font-mono text-sm">
          <p>Live sensor data from an IoT device. Updates every 5 minutes</p>
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
