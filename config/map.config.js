// config/map.config.js
import { Platform } from 'react-native';

// Using standard environment variables 
const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
  android: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
  default: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
});

// Cache for storing recently fetched directions
const directionsCache = new Map();
const restAreasCache = new Map();

// Preserve existing config
export default {
  // Google Maps Configuration
  googleMaps: {
    apiKey: GOOGLE_MAPS_API_KEY,
    defaultZoom: 14,
    regionPadding: 0.5,
  },

  // Default Coordinates (Boston College)
  initialRegion: {
    latitude: 42.3301,
    longitude: -71.1668,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },

  // Map Markers
  markers: {
    user: {
      color: '#2E86C1',
      size: 24,
    },
    destination: {
      color: '#E74C3C',
      size: 32,
    }
  }
};

// API functions - export separately
export const getDirections = async (origin, destination, waypoints = []) => {
  // Create a cache key based on parameters
  const cacheKey = `${origin.latitude},${origin.longitude}-${destination.latitude},${destination.longitude}-${waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|')}`;
  
  // Check cache first
  if (directionsCache.has(cacheKey)) {
    return directionsCache.get(cacheKey);
  }
  
  // Convert waypoints to the format Google expects
  const waypointsParam = waypoints.length > 0 
    ? `&waypoints=${waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|')}`
    : '';
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}${waypointsParam}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const result = await response.json();
    
    // Store in cache
    directionsCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
};

export const getNearbyRestAreas = async (location, radius = 5000) => {
  const cacheKey = `${location.latitude},${location.longitude}-${radius}`;
  
  // Check cache first
  if (restAreasCache.has(cacheKey)) {
    return restAreasCache.get(cacheKey);
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=gas_station|restaurant|cafe&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const result = await response.json();
    
    // Store in cache
    restAreasCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error fetching nearby rest areas:', error);
    throw error;
  }
};

// Helper function to decode Google's polyline format
export const decodePolyline = (encoded) => {
  if (!encoded) return [];
  const poly = [];
  let index = 0, lat = 0, lng = 0;
  
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    });
  }
  
  return poly;
};

// Get rest areas along a route
export const getRestAreasAlongRoute = async (origin, destination, detourDistance = 5000) => {
  try {
    // First get the route
    const directionsResult = await getDirections(origin, destination);
    
    if (!directionsResult.routes || directionsResult.routes.length === 0) {
      return { route: [], restAreas: [] };
    }
    
    // Decode the polyline
    const route = decodePolyline(directionsResult.routes[0].overview_polyline.points);
    
    // Sample points along the route to search for rest areas
    const samplePoints = [];
    const sampleInterval = Math.max(1, Math.floor(route.length / 5)); // Sample at most 5 points
    
    for (let i = 0; i < route.length; i += sampleInterval) {
      if (i < route.length) {
        samplePoints.push(route[i]);
      }
    }
    
    // Add the destination if it's not already included
    if (samplePoints.length > 0 && samplePoints[samplePoints.length - 1] !== route[route.length - 1]) {
      samplePoints.push(route[route.length - 1]);
    }
    
    // Search for rest areas near each sample point
    const restAreaPromises = samplePoints.map(point => getNearbyRestAreas(point, detourDistance));
    const restAreaResults = await Promise.all(restAreaPromises);
    
    // Combine and deduplicate rest areas
    const seenPlaceIds = new Set();
    const combinedRestAreas = [];
    
    restAreaResults.forEach(result => {
      if (result && result.results) {
        result.results.forEach(place => {
          if (!seenPlaceIds.has(place.place_id)) {
            seenPlaceIds.add(place.place_id);
            combinedRestAreas.push(mapGooglePlaceToRestArea(place));
          }
        });
      }
    });
    
    return {
      route,
      restAreas: combinedRestAreas
    };
  } catch (error) {
    console.error('Error finding rest areas along route:', error);
    throw error;
  }
};

// Convert Google Place to RestArea format
export const mapGooglePlaceToRestArea = (place) => {
  return {
    id: place.place_id,
    name: place.name,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    rating: place.rating || 0,
    types: place.types || [],
    vicinity: place.vicinity || ''
  };
};
