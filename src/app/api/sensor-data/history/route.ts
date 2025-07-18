import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a single, reusable Supabase client for this API route.
// Ensure your environment variables are set correctly in your project.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Define the structure of a historical data point for type safety.
interface HistoricalDataPoint {
  timestamp: string;
  temperature: number;
}

export async function GET() {
  try {
    // Calculate the timestamp for 24 hours ago from the current time.
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Fetch all entries from the 'sensor_readings' table created in the last 24 hours.
    // We select only the 'created_at' and 'bmp_temperature' columns needed for the graph.
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('created_at, bmp_temperature')
      .gte('created_at', twentyFourHoursAgo.toISOString()) // 'gte' means "greater than or equal to"
      .order('created_at', { ascending: true }); // Order by time to ensure the graph is drawn correctly.

    // If Supabase returns an error, throw it to be caught by the catch block.
    if (error) {
      throw error;
    }

    // Map the fetched data to the format expected by the frontend graph component.
    // We ensure that we only include valid data points.
    const formattedData: HistoricalDataPoint[] = data
      .filter(entry => entry.created_at && typeof entry.bmp_temperature === 'number')
      .map(entry => ({
        timestamp: entry.created_at,
        temperature: entry.bmp_temperature,
      }));

    // Return the formatted historical data as a JSON response.
    return NextResponse.json(formattedData);

  } catch (error) {
    // Log the error for debugging purposes on the server.
    console.error('Supabase historical fetch error:', error);
    
    // Return a generic error response to the client.
    return NextResponse.json(
      { error: 'Failed to fetch historical sensor data from Supabase.' },
      { status: 500 }
    );
  }
}
