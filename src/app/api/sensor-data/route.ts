import { NextResponse } from 'next/server';

export async function GET() {
  // This function simulates fetching data from a Raspberry Pi.
  // The values are randomized to make it look like they are live.
  const data = {
    temperature: (24 + Math.random() * 2).toFixed(1),
    humidity: (55 + Math.random() * 10).toFixed(1),
    pressure: (1010 + Math.random() * 5).toFixed(1),
    acceleration: {
      x: (Math.random() * 0.5 - 0.25).toFixed(2),
      y: (Math.random() * 0.5 - 0.25).toFixed(2),
      z: (9.8 + Math.random() * 0.2 - 0.1).toFixed(2),
    },
  };

  return NextResponse.json(data);
}