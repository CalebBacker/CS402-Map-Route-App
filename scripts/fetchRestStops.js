// scripts/fetchRestStops.ts
import { getRestAreasAlongRoute } from '../config/map.config';

/**
 * Fetches rest stops along a route from start to end point
 * with a maximum detour distance
 * 
 * @param start - Starting location name or address
 * @param end - Ending location name or address
 * @param maxDetour - Maximum detour distance in miles
 * @returns Promise resolving to an array of rest stops
 */
export async function fetchRestStops(start: string, end: string, maxDetour: number) {
  console.log(`Fetching rest stops from ${start} to ${end} with max detour of ${maxDetour} miles`);

  try {
    // Convert miles to meters for the API
    const detourDistanceMeters = maxDetour * 1609.34;
    
    // For the function to work properly, we need coordinates
    // This implementation assumes we're getting addresses or place names
    // and would need geocoding them first in a real implementation
    
    // Mock coordinates based on the location names for demo purposes
    // In a real implementation, you would use the Geocoding API here
    const startCoords = mockGeocode(start);
    const endCoords = mockGeocode(end);
    
    // Call the map config function to get rest areas along the route
    const result = await getRestAreasAlongRoute(
      startCoords,
      endCoords,
      detourDistanceMeters
    );
    
    // Format the results to match our RestStop interface
    return result.restAreas.map(area => ({
      id: area.id,
      name: area.name,
      latitude: area.latitude,
      longitude: area.longitude,
      rating: area.rating,
      types: area.types,
      vicinity: area.vicinity
    }));
  } catch (error) {
    console.error('Error in fetchRestStops:', error);
    throw new Error('Failed to fetch rest stops along route');
  }
}

/**
 * Mock geocoding function for demonstration purposes
 * In a real implementation, this would call the Google Geocoding API
 */
function mockGeocode(location: string) {
  // Some mock coordinates based on common locations
  // This is just for demonstration - in a real app you'd use the Geocoding API
  const mockCoordinates: Record<string, {latitude: number, longitude: number}> = {
    'Boston': { latitude: 42.3601, longitude: -71.0589 },
    'New York': { latitude: 40.7128, longitude: -74.0060 },
    'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
    'Chicago': { latitude: 41.8781, longitude: -87.6298 },
    'Current Location': { latitude: 42.3601, longitude: -71.0589 }, // Default to Boston
  };
  
  // Try to find an exact match
  for (const [name, coords] of Object.entries(mockCoordinates)) {
    if (location.includes(name)) {
      return coords;
    }
  }
  
  // If no match, return some random coordinates as a fallback
  // In a real app, this should never happen as you'd use the Geocoding API
  console.warn(`No mock coordinates found for ${location}, using fallback`);
  return {
    latitude: 39.8283 + (Math.random() - 0.5) * 10,
    longitude: -98.5795 + (Math.random() - 0.5) * 10
  };
}
