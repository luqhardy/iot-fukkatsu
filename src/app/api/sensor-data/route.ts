import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function safeToFixed(value: number | null | undefined, decimals: number): string | null {
  return value != null ? Number(value).toFixed(decimals) : null;
}

export async function GET() {
  try {
    const { data: latestEntry, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const formattedData = {
      temperature: safeToFixed(latestEntry.bmp_temperature, 1),
      humidity: safeToFixed(latestEntry.humidity, 1),
      pressure: safeToFixed(latestEntry.pressure, 1),
      altitude: safeToFixed(latestEntry.altitude, 1),
      acceleration:
        latestEntry.accel_x !== null &&
        latestEntry.accel_y !== null &&
        latestEntry.accel_z !== null
          ? {
              x: safeToFixed(latestEntry.accel_x, 2),
              y: safeToFixed(latestEntry.accel_y, 2),
              z: safeToFixed(latestEntry.accel_z, 2),
            }
          : null,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensor data from Supabase.' },
      { status: 500 }
    );
  }
}
