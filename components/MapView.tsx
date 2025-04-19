// components/MapView.tsx
import React, { ReactNode } from 'react';
import { View, Text, Platform, StyleSheet, ViewStyle } from 'react-native';
import type { Region } from 'react-native-maps';

const WebMap = ({ style }: { style?: ViewStyle }) => (
  <View style={[style, styles.webFallback]}>
    <Text style={styles.webText}>Map only works on iOS/Android</Text>
  </View>
);

const NativeMapView = Platform.select({
  ios:    () => require('react-native-maps').default,
  android:() => require('react-native-maps').default,
  default:() => WebMap,
})();

const NativeMarker = Platform.select({
  ios:    () => require('react-native-maps').Marker,
  android:() => require('react-native-maps').Marker,
  default:() => () => null,
})();

export interface RestStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  start?: string;
  end?: string;
  maxDetour?: number;
}

interface Props {
  restStops: RestStop[];
  style?: ViewStyle;
}

const MapViewComponent = React.forwardRef<typeof NativeMapView, Props>(
  ({ restStops, style }, ref) => {
    // center on first stop or a default
    const region: Region = {
      latitude: restStops[0]?.latitude  || 37.78,
      longitude: restStops[0]?.longitude || -122.43,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };

    return (
      <NativeMapView
        ref={ref}
        style={[styles.map, style]}
        initialRegion={region}
      >
        {restStops.map((stop) => (
          <NativeMarker
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={stop.name}
          />
        ))}
      </NativeMapView>
    );
  }
);

export default MapViewComponent;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webText: {
    color: '#666',
    fontSize: 16,
  },
});
