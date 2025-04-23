// app/(tabs)/rest-areas.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  FlatList,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import MapViewComponent from '../../components/MapView';
import useRestStops from '../../hooks/useRestStops';
import { useLocationStore } from '../../stores/locationStore';
import { MapPin, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RestAreasScreen() {
  const [maxDetour, setMaxDetour] = useState(10);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
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
      Alert.alert('Missing Information', 'Please select both starting point and destination.');
      return;
    }

    // Call the fetchStops with proper params
    fetchStops(
      origin.name,
      destination.name,
      maxDetour
    );
  };

  // Toggle a rest stop selection
  const toggleStopSelection = (stopId: string) => {
    setSelectedStops(prev => 
      prev.includes(stopId)
        ? prev.filter(id => id !== stopId)
        : [...prev, stopId]
    );
  };

  // Save the route with selected stops
  const saveRouteWithStops = () => {
    if (selectedStops.length === 0) {
      Alert.alert('No Stops Selected', 'Please select at least one rest stop to add to your route.');
      return;
    }

    // Here you would implement the logic to save the route
    // For now, just show an alert
    Alert.alert(
      'Route Saved',
      `Route from ${origin?.name} to ${destination?.name} with ${selectedStops.length} stops has been saved.`,
      [{ text: 'OK' }]
    );
  };

  // Filter stops based on selection
  const getFilteredStops = () => {
    if (selectedStops.length === 0) return stops;
    return stops.filter(stop => selectedStops.includes(stop.id));
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
        disabled={!origin || !destination || loading}
        color="#0066cc"
      />

      {loading && <Text style={styles.status}>Loading rest stops along your route...</Text>}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#e74c3c" />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {stops.length > 0 ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultsTitle}>
            Found {stops.length} rest stops along your route
          </Text>
          
          <View style={styles.mapContainer}>
            <MapViewComponent
              restStops={getFilteredStops()}
              style={styles.map}
            />
          </View>
          
          <FlatList
            data={stops}
            keyExtractor={(item) => item.id}
            style={styles.stopsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.stopItem,
                  selectedStops.includes(item.id) && styles.selectedStopItem
                ]}
                onPress={() => toggleStopSelection(item.id)}
              >
                <View style={styles.stopItemContent}>
                  <Text style={styles.stopName}>{item.name}</Text>
                  {item.vicinity && (
                    <Text style={styles.stopVicinity}>{item.vicinity}</Text>
                  )}
                  {item.types && (
                    <Text style={styles.stopTypes}>
                      {item.types.slice(0, 3).join(' • ')}
                    </Text>
                  )}
                </View>
                <View style={styles.stopItemRating}>
                  <Text style={styles.ratingText}>
                    {item.rating ? item.rating.toFixed(1) : 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.noStopsText}>No rest stops found along this route</Text>
            )}
          />
          
          {stops.length > 0 && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveRouteWithStops}
              disabled={selectedStops.length === 0}
            >
              <Text style={styles.saveButtonText}>
                Save Route with Selected Stops ({selectedStops.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  error: {
    color: '#e74c3c',
    marginLeft: 8,
  },
  resultContainer: {
    flex: 1,
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  stopsList: {
    flex: 1,
  },
  stopItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedStopItem: {
    backgroundColor: '#e6f2ff',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  stopItemContent: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  stopVicinity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stopTypes: {
    fontSize: 12,
    color: '#888',
  },
  stopItemRating: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  noStopsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
