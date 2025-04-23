import { create } from 'zustand';

export type Location = {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type SearchType = 'origin' | 'destination';

interface LocationState {
  origin: Location | null;
  destination: Location | null;
  searchType: SearchType;
  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  setSearchType: (type: SearchType) => void;
  resetLocations: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  origin: null,
  destination: null,
  searchType: 'destination',
  setOrigin: (location) => set({ origin: location }),
  setDestination: (location) => set({ destination: location }),
  setSearchType: (type) => set({ searchType: type }),
  resetLocations: () => set({ origin: null, destination: null }),
}));
