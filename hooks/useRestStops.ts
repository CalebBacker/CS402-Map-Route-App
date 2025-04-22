// hooks/useRestStops.ts
import { useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { getNearbyRestAreas, getRestAreasAlongRoute } from '../config/map.config';
import { fetchRestStops } from '../scripts/fetchRestStops';

export interface RestStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  // Adding additional fields but keeping compatibility with existing interface
  rating?: number;
  types?: string[];
  vicinity?: string;
}

export default function useRestStops() {
  const [stops, setStops] = useState<RestStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Original function - preserve for backward compatibility
  const fetchStops = async (start: string, end: string, maxDetour: number) => {
    setLoading(true);
    try {
      // This assumes fetchRestStops still exists and works.
      // If you want to replace it with the new implementation, modify this.
      const data = await fetchRestStops(start, end, maxDetour);
      setStops(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch nearby rest areas
  const fetchNearbyRestAreas = useCallback(async (location: { latitude: number, longitude: number }, radius = 5000) => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getNearbyRestAreas(location, radius);
      if (result && result.results) {
        // Transform Google Places results into our RestStop format
        const areas = result.results.map(place => ({
          id: place.place_id,
          name: place.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          rating: place.rating || 0,
          types: place.types || [],
          vicinity: place.vicinity || ''
        }));
        
        setStops(areas);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rest areas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced version to prevent excessive API calls
  const debouncedFetchNearby = useCallback(
    debounce((location, radius) => fetchNearbyRestAreas(location, radius), 500),
    []
  );

  // New function to fetch rest areas along a route
  const fetchRestAreasAlongRoute = useCallback(async (
    origin: { latitude: number, longitude: number },
    destination: { latitude: number, longitude: number },
    detourDistance = 5000
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getRestAreasAlongRoute(origin, destination, detourDistance);
      // Convert to the format expected by the component
      const restStops = result.restAreas.map(area => ({
        id: area.id,
        name: area.name,
        latitude: area.latitude,
        longitude: area.longitude,
        rating: area.rating,
        types: area.types,
        vicinity: area.vicinity
      }));
      setStops(restStops);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rest areas along route');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    stops, 
    loading, 
    error, 
    fetchStops,  // Keep original method
    fetchNearbyRestAreas: debouncedFetchNearby,  // Add new methods
    fetchRestAreasAlongRoute
  };
}
