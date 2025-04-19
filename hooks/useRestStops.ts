// hooks/useRestStops.ts
import { useState } from 'react';
import { fetchRestStops } from '../scripts/fetchRestStops';

export interface RestStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export default function useRestStops() {
  const [stops, setStops]     = useState<RestStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchStops = async (start: string, end: string, maxDetour: number) => {
    setLoading(true);
    try {
      const data = await fetchRestStops(start, end, maxDetour);
      setStops(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { stops, loading, error, fetchStops };
}
