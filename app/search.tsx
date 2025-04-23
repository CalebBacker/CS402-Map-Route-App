import { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, ArrowLeft, MapPin } from 'lucide-react-native';
import { useLocationStore } from '../stores/locationStore.ts';

// We'll use this as a fallback when actual geocoding isn't available
const searchLocations = (query: string) => {
  // Mock implementation - in a real app, this would call a geocoding API
  const defaultSuggestions = [
    { id: '1', place: 'San Francisco, CA', coordinates: { latitude: 37.7749, longitude: -122.4194 } },
    { id: '2', place: 'Los Angeles, CA', coordinates: { latitude: 34.0522, longitude: -118.2437 } },
    { id: '3', place: 'San Diego, CA', coordinates: { latitude: 32.7157, longitude: -117.1611 } },
    { id: '4', place: 'Sacramento, CA', coordinates: { latitude: 38.5816, longitude: -121.4944 } },
    { id: '5', place: 'San Jose, CA', coordinates: { latitude: 37.3382, longitude: -121.8863 } },
  ];

  if (!query) return defaultSuggestions;
  
  return defaultSuggestions.filter(item => 
    item.place.toLowerCase().includes(query.toLowerCase())
  );
};

type LocationItem = {
  id: string;
  place: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LocationItem[]>([]);
  const router = useRouter();
  const { setDestination, setOrigin, searchType } = useLocationStore();

  // Handle search input changes
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const searchResults = searchLocations(text);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationItem) => {
    if (searchType === 'origin') {
      setOrigin({
        name: location.place,
        coordinates: location.coordinates
      });
    } else {
      setDestination({
        name: location.place,
        coordinates: location.coordinates
      });
    }
    router.back();
  };

  const renderSuggestion = ({ item }: { item: LocationItem }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSelect(item)}>
      <MapPin size={20} color="#666" />
      <Text style={styles.suggestionText}>{item.place}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={searchType === 'origin' ? "From where?" : "Where to?"}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>
      
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <FlatList
          data={results.length > 0 ? results : searchLocations('')}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.id}
          style={styles.suggestionsList}
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
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
