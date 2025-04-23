import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Search, Navigation, MapPin } from 'lucide-react-native';
import { useLocationStore } from '../../stores/locationStore.ts';

// Web fallback map component
const WebMap = ({ children, style }: any) => (
  <View style={[style, styles.webMapFallback]}>
    <Text style={styles.webMapText}>Map view is only available on mobile devices</Text>
    <Text style={styles.webMapSubText}>Please use the mobile app to access the full map features</Text>
  </View>
);

// Conditionally import MapView only on native platforms
const MapView = Platform.select({
  ios: () => require('react-native-maps').default,
  android: () => require('react-native-maps').default,
  default: () => WebMap,
})();

const Marker = Platform.select({
  ios: () => require('react-native-maps').Marker,
  android: () => require('react-native-maps').Marker,
  default: () => ({ children }: any) => children,
})();

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const router = useRouter();
  const { origin, destination, setOrigin, setSearchType } = useLocationStore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Set current location as origin if not set yet
      if (!origin) {
        // Get location name via reverse geocoding (simplified here)
        setOrigin({
          name: 'Current Location',
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
      }
    })();
  }, []);

  // Open search for destination
  const handleDestinationSearch = () => {
    setSearchType('destination');
    router.push('/search');
  };

  // Open search for origin
  const handleOriginSearch = () => {
    setSearchType('origin');
    router.push('/search');
  };

  // Center map on current location
  const centerOnCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.coords.latitude || 37.78825,
          longitude: currentLocation?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {currentLocation && Platform.OS !== 'web' && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Your current location"
          />
        )}
        
        {origin && origin.name !== 'Current Location' && Platform.OS !== 'web' && (
          <Marker
            coordinate={origin.coordinates}
            title={origin.name}
            pinColor="green"
          />
        )}
        
        {destination && Platform.OS !== 'web' && (
          <Marker
            coordinate={destination.coordinates}
            title={destination.name}
            pinColor="red"
          />
        )}
      </MapView>
      
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchOption}
          onPress={handleOriginSearch}>
          <MapPin size={20} color="#0066cc" />
          <Text style={styles.searchText}>
            {origin ? origin.name : 'Starting point'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity
          style={styles.searchOption}
          onPress={handleDestinationSearch}>
          <Search size={20} color="#333" />
          <Text style={styles.searchText}>
            {destination ? destination.name : 'Where to?'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {currentLocation && Platform.OS !== 'web' && (
        <TouchableOpacity
          style={styles.locationButton}
          onPress={centerOnCurrentLocation}>
          <Navigation size={24} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  webMapFallback: {
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  webMapSubText: {
    fontSize: 14,
    color: '#888',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 16,
  },
  searchText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
