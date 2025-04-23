// app/search.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, MapPin } from 'lucide-react-native';
import { useLocationStore } from '../stores/locationStore';

// Mock location search results
// In a real app, you'd use the Google Places API for this
const MOCK_LOCATIONS = [
  { 
    name: 'Boston, MA', 
    coordinates: { latitude: 42.3601, longitude: -71.0589 } 
  },
  { 
    name: 'New York, NY', 
    coordinates: { latitude: 40.7128, longitude: -74.0060 } 
  },
  { 
    name: 'Los Angeles, CA', 
    coordinates: { latitude: 34.0522, longitude: -118.2437 } 
  },
  { 
    name: 'Chicago, IL', 
    coordinates: { latitude: 41.8781, longitude: -87.6298 } 
  },
  { 
    name: 'Houston, TX', 
    coordinates: { latitude: 29.7604, longitude: -95.3698 } 
  },
  { 
    name: 'Phoenix, AZ', 
    coordinates: { latitude: 33.4484, longitude: -112.0740 } 
  },
  { 
    name: 'Philadelphia, PA', 
    coordinates: { latitude: 39.9526, longitude: -75.1652 } 
  },
  { 
    name: 'San Antonio, TX', 
    coordinates: { latitude: 29.4241, longitude: -98.4936 } 
  },
  { 
    name: 'San Diego, CA', 
    coordinates: { latitude: 32.7157, longitude: -117.1611 } 
  },
  { 
    name: 'Dallas, TX', 
    coordinates: { latitude: 32.7767, longitude: -96.7970 } 
  }
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(MOCK_LOCATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { searchType, setOrigin, setDestination } = useLocationStore();

  // Search functionality
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults(MOCK_LOCATIONS);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with a timeout
    const timer = setTimeout(() => {
      const filtered = MOCK_LOCATIONS.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLocation = (location) => {
    if (searchType === 'origin') {
      setOrigin(location);
    } else {
      setDestination(location);
    }
    
    // Navigate back to previous screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.title}>
          Search {searchType === 'origin' ? 'Starting Point' : 'Destination'}
        </Text>
      </View>
      
      <View style={styles.searchBar}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={`Search for a ${searchType === 'origin' ? 'starting point' : 'destination'}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          clearButtonMode="while-editing"
        />
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectLocation(item)}
            >
              <MapPin size={20} color="#0066cc" />
              <Text style={styles.resultText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No locations found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  resultText: {
    marginLeft: 12,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
