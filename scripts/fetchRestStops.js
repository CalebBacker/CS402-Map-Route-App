// scripts/fetchRestStops.js

/**
 * Stub: returns mock rest‑stop data after a short delay.
 */
export async function fetchRestStops(start, end, maxDetour) {
    const MOCK = [
      { id: '1', name: 'Big Oak Area',    latitude: 43.6150, longitude: -116.2019 },
      { id: '2', name: 'River View Stop', latitude: 43.5000, longitude: -116.2500 },
      { id: '3', name: 'Mountain Pass',   latitude: 43.7000, longitude: -116.3000 },
    ];
    await new Promise(r => setTimeout(r, 500));
    return MOCK;
  }
  
  