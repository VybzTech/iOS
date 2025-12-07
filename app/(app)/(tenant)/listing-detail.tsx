import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Listing Detail {id} (Coming Soon)</Text>
    </View>
  );
}