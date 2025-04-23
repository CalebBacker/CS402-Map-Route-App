// stores/routeStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RestStop } from '../hooks/useRestStops';
import { Location } from './locationStore';

export interface SavedRoute {
  id: string;
  name: string;
  origin: Location;
  destination: Location;
  stops: RestStop[];
  createdAt: number;
  lastAccessed?: number;
}

interface RouteState {
  savedRoutes: SavedRoute[];
  addRoute: (route: Omit<SavedRoute, 'id' | 'createdAt'>) => void;
  removeRoute: (id: string) => void;
  updateRouteAccess: (id: string) => void;
  clearRoutes: () => void;
}

export const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      savedRoutes: [],
      
      addRoute: (route) => set((state) => ({
        savedRoutes: [
          ...state.savedRoutes,
          {
            ...route,
            id: `route_${Date.now()}`,
            createdAt: Date.now(),
          },
        ],
      })),
      
      removeRoute: (id) => set((state) => ({
        savedRoutes: state.savedRoutes.filter((route) => route.id !== id),
      })),
      
      updateRouteAccess: (id) => set((state) => ({
        savedRoutes: state.savedRoutes.map((route) => 
          route.id === id 
            ? { ...route, lastAccessed: Date.now() }
            : route
        ),
      })),
      
      clearRoutes: () => set({ savedRoutes: [] }),
    }),
    {
      name: 'routes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
