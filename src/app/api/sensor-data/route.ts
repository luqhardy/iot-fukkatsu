import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a single, reusable Supabase client for the API route
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Fetch the latest entry from the 'sensor_data' table
    // Assumes you have a 'created_at' column for ordering
    const { data: latestEntry, error } = await supabase
      .from('sensor_data') // <-- IMPORTANT: Make sure this matches your table name
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single(); // .single() returns one object instead of an array

    if (error) {
      // If there's an error (e.g., table not found, no rows), throw it
      throw error;
    }

    // Format the data to match the structure your frontend expects.
    // You might need to adjust the property names (e.g., latestEntry.temp)
    // to match your Supabase table columns.
    const formattedData = {
      temperature: latestEntry.temperature.toFixed(1),
      humidity: latestEntry.humidity.toFixed(1),
      pressure: latestEntry.pressure.toFixed(1),
      altitude: latestEntry.altitude !== null ? latestEntry.altitude.toFixed(1) : null,
      acceleration: latestEntry.accel_x !== null && latestEntry.accel_y !== null && latestEntry.accel_z !== null ? {
        x: latestEntry.accel_x.toFixed(2),
        y: latestEntry.accel_y.toFixed(2),
        z: latestEntry.accel_z.toFixed(2),
      } : null,
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