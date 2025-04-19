// src/components/MapView.tsx
import React, { ReactNode } from 'react';
import { View, Text, Platform, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type { Region, Marker as RNMarker } from 'react-native-maps';

// Web fallback
const WebMap = ({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[style, styles.webMapFallback]}>
    <Text style={styles.webMapText}>Map is only available on mobile</Text>
  </View>
);

// Native MapView and Marker
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
}

interface Props {
  restStops: RestStop[];
  start?: string;
  end?: string;
  maxDetour?: number;
  style?: StyleProp<ViewStyle>;
}

const MapViewComponent = React.forwardRef<typeof NativeMapView, Props>(
  ({ restStops, style }, ref) => {
    // Default region if no location provided
    const region: Region = {
      latitude: restStops[0]?.latitude || 37.78825,
      longitude: restStops[0]?.longitude || -122.4324,
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
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
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
  webMapFallback: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMapText: {
    fontSize: 16,
    color: '#666',
  },
});
