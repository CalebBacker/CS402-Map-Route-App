// app/(tabs)/rest-areas.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet
} from 'react-native';
import Slider from '@react-native-community/slider';
import MapViewComponent from '../../components/MapView';
import useRestStops from '../../hooks/useRestStops';

export default function RestAreasScreen() {
  const [start, setStart]           = useState('');
  const [end, setEnd]               = useState('');
  const [maxDetour, setMaxDetour]   = useState(10);
  const { stops, loading, error, fetchStops } = useRestStops();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Start location"
        value={start}
        onChangeText={setStart}
      />

      <TextInput
        style={styles.input}
        placeholder="End location"
        value={end}
        onChangeText={setEnd}
      />

      <Text style={styles.label}>Max detour: {maxDetour} mi</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={50}
        step={1}
        value={maxDetour}
        onValueChange={setMaxDetour}
      />

      <Button
        title="Show Rest Stops"
        onPress={() => fetchStops(start, end, maxDetour)}
      />

      {loading && <Text style={styles.status}>Loading…</Text>}
      {error   && <Text style={styles.error}>Error: {error}</Text>}

      {!!stops.length && (
        <MapViewComponent
          restStops={stops}
          style={styles.map}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 4,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 12,
  },
  status: {
    marginVertical: 8,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginVertical: 8,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    marginTop: 12,
  },
});
