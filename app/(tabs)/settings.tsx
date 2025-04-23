// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ChevronRight, MapPin, Trash2, LogOut } from 'lucide-react-native';
import { useRouteStore } from '../../stores/routeStore';
import { useLocationStore } from '../../stores/locationStore';

export default function SettingsScreen() {
  const [showGasStations, setShowGasStations] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showCoffeeShops, setShowCoffeeShops] = useState(true);
  const [useMetricSystem, setUseMetricSystem] = useState(false);
  
  const { clearRoutes } = useRouteStore();
  const { resetLocations } = useLocationStore();

  // Clear all saved routes after confirmation
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all saved routes and preferences? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            clearRoutes();
            resetLocations();
            // Reset preferences
            setShowGasStations(true);
            setShowRestaurants(true);
            setShowCoffeeShops(true);
            setUseMetricSystem(false);
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Show Gas Stations</Text>
          <Switch
            value={showGasStations}
            onValueChange={setShowGasStations}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={showGasStations ? '#0066cc' : '#f4f3f4'}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Show Restaurants</Text>
          <Switch
            value={showRestaurants}
            onValueChange={setShowRestaurants}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={showRestaurants ? '#0066cc' : '#f4f3f4'}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Show Coffee Shops</Text>
          <Switch
            value={showCoffeeShops}
            onValueChange={setShowCoffeeShops}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={showCoffeeShops ? '#0066cc' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Use Metric System</Text>
          <Switch
            value={useMetricSystem}
            onValueChange={setUseMetricSystem}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={useMetricSystem ? '#0066cc' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity 
          style={[styles.linkOption, styles.dangerOption]}
          onPress={handleClearAllData}
        >
          <View style={styles.optionWithIcon}>
            <Trash2 size={20} color="#e74c3c" />
            <Text style={[styles.optionText, styles.dangerText]}>Clear All Data</Text>
          </View>
          <ChevronRight size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.linkOption}>
          <Text style={styles.optionText}>Privacy Policy</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkOption}>
          <Text style={styles.optionText}>Terms of Service</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkOption}>
          <Text style={styles.optionText}>Version 1.0.0</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dangerOption: {
    borderColor: '#ffeeee',
    backgroundColor: '#fff5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  dangerText: {
    color: '#e74c3c',
  },
});
