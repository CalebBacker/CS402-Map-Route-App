import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Star, Fuel, Coffee, Utensils } from 'lucide-react-native';

const MOCK_REST_AREAS = [
  {
    id: '1',
    name: 'Golden Gate Rest Stop',
    distance: '5.2 mi',
    rating: 4.5,
    amenities: ['gas', 'food', 'coffee'],
    reviews: 128,
  },
  {
    id: '2',
    name: 'Bay Bridge Service Area',
    distance: '12.8 mi',
    rating: 4.2,
    amenities: ['gas', 'food'],
    reviews: 85,
  },
  {
    id: '3',
    name: 'Richmond Rest Area',
    distance: '18.5 mi',
    rating: 3.8,
    amenities: ['gas', 'coffee'],
    reviews: 64,
  },
];

export default function RestAreasScreen() {
  const [sortBy, setSortBy] = useState('distance');

// Define types for our data structure
interface RestArea {
    id: string;
    name: string;
    distance: string;
    rating: number;
    amenities: Amenity[];
    reviews: number;
}

type Amenity = 'gas' | 'food' | 'coffee';

const renderAmenities = (amenities: Amenity[]): React.ReactElement => {
    return (
        <View style={styles.amenitiesContainer}>
            {amenities.includes('gas') && <Fuel size={20} color="#666" />}
            {amenities.includes('food') && <Utensils size={20} color="#666" />}
            {amenities.includes('coffee') && <Coffee size={20} color="#666" />}
        </View>
    );
};

  const renderRestArea = ({ item }: { item: RestArea }) => (
    <TouchableOpacity style={styles.restAreaCard}>
      <View style={styles.restAreaHeader}>
        <Text style={styles.restAreaName}>{item.name}</Text>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Star size={16} color="#FFD700" fill="#FFD700" />
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.reviews}>({item.reviews} reviews)</Text>
      </View>
      {renderAmenities(item.amenities)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rest Areas</Text>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'distance' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('distance')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'distance' && styles.sortButtonTextActive,
              ]}>
              Distance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'rating' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('rating')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'rating' && styles.sortButtonTextActive,
              ]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={MOCK_REST_AREAS}
        renderItem={renderRestArea}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    marginRight: 10,
    color: '#666',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  sortButtonActive: {
    backgroundColor: '#0066cc',
  },
  sortButtonText: {
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  restAreaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restAreaName: {
    fontSize: 18,
    fontWeight: '600',
  },
  distance: {
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    marginLeft: 4,
    marginRight: 4,
    fontWeight: '600',
  },
  reviews: {
    color: '#666',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});