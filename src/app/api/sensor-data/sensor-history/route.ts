import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const now = new Date();
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('created_at, bmp_temperature, humidity, pressure, altitude')
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No data in last 24 hours' }, { status: 200 });
    }

    const timestamps: string[] = [];
    const temperature: number[] = [];
    const humidity: number[] = [];
    const pressure: number[] = [];
    const altitude: number[] = [];

    data.forEach((entry) => {
      const timeLabel = new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timestamps.push(timeLabel);
      temperature.push(entry.bmp_temperature ?? 0);
      humidity.push(entry.humidity ?? 0);
      pressure.push(entry.pressure ?? 0);
      altitude.push(entry.altitude ?? 0);
    });

    return NextResponse.json({ timestamps, temperature, humidity, pressure, altitude });
  } catch (error) {
    console.error('Supabase fetch error (history):', error);
    return NextResponse.json(
      { error: 'Failed to fetch 24h history from Supabase.' },
      { status: 500 }
    );
  }
}
