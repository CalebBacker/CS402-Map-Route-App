import { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react-native';

const MOCK_SUGGESTIONS = [
  { id: '1', place: 'San Francisco, CA' },
  { id: '2', place: 'Los Angeles, CA' },
  { id: '3', place: 'San Diego, CA' },
  { id: '4', place: 'Sacramento, CA' },
  { id: '5', place: 'San Jose, CA' },
];

type SuggestionItem = {
  id: string;
  place: string;
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const renderSuggestion = ({ item }: { item: SuggestionItem }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        // Handle destination selection
        router.back();
      }}>
      <SearchIcon size={20} color="#666" />
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
            placeholder="Where to?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      </View>
      <FlatList
        data={MOCK_SUGGESTIONS}
        renderItem={renderSuggestion}
        keyExtractor={(item) => item.id}
        style={styles.suggestionsList}
      />
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
});