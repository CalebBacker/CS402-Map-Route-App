import { useEffect, useState, useRef, ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StyleProp, ViewStyle } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Search, Navigation } from 'lucide-react-native';

// Web fallback map component
const WebMap = ({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) => (
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
  default: () => ({ children }: { children?: ReactNode }) => children,
})();

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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
        style={styles.map}xw
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {location && Platform.OS !== 'web' && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          />
        )}
      </MapView>
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push('/search')}>
          <Search size={24} color="#333" />
          <Text style={styles.searchText}>Where to?</Text>
        </TouchableOpacity>
      </View>
      {location && Platform.OS !== 'web' && (
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            mapRef.current?.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}>
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
  searchBar: {
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
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchText: {
    fontSize: 16,
    color: '#666',
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