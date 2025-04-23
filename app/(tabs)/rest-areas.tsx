// app/(tabs)/rest-areas.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Slider from '@react-native-community/slider';
import MapViewComponent from '../../components/MapView';
import useRestStops from '../../hooks/useRestStops';
import { useLocationStore } from '../../stores/locationStore';
import { MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RestAreasScreen() {
  const [maxDetour, setMaxDetour] = useState(10);
  const { stops, loading, error, fetchStops } = useRestStops();
  const { origin, destination, setSearchType } = useLocationStore();
  const router = useRouter();

  // Open search for start location
  const handleStartSearch = () => {
    setSearchType('origin');
    router.push('/search');
  };

  // Open search for end location
  const handleEndSearch = () => {
    setSearchType('destination');
    router.push('/search');
  };

  // Generate rest stops based on origin, destination and max detour
  const generateRestStops = () => {
    if (!origin || !destination) {
      // Show alert or message that both locations are needed
      return;
    }

    // Here we'll call the fetchStops with proper params
    fetchStops(
      origin.name,
      destination.name,
      maxDetour
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locationInput}
        onPress={handleStartSearch}
      >
        <MapPin size={20} color="#0066cc" />
        <Text style={styles.locationText}>
          {origin ? origin.name : 'Select starting point'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.locationInput}
        onPress={handleEndSearch}
      >
        <MapPin size={20} color="#e74c3c" />
        <Text style={styles.locationText}>
          {destination ? destination.name : 'Select destination'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Maximum detour distance: {maxDetour} {maxDetour === 1 ? 'mile' : 'miles'}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={50}
        step={1}
        value={maxDetour}
        onValueChange={setMaxDetour}
        minimumTrackTintColor="#0066cc"
        maximumTrackTintColor="#dddddd"
        thumbTintColor="#0066cc"
      />

      <Button
        title="Show Rest Stops"
        onPress={generateRestStops}
        disabled={!origin || !destination}
        color="#0066cc"
      />

      {loading && <Text style={styles.status}>Loading rest stops along your route...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}

      {stops.length > 0 ? (
        <MapViewComponent
          restStops={stops}
          style={styles.map}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Rest Stops Selected</Text>
          <Text style={styles.emptyStateText}>
            Enter your start and end points, then press "Show Rest Stops" to find places to take a break along your route.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  label: {
    marginBottom: 4,
    color: '#333',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  status: {
    marginVertical: 16,
    textAlign: 'center',
    color: '#0066cc',
  },
  error: {
    color: '#e74c3c',
    marginVertical: 16,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
