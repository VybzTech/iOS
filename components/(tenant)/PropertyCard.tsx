import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import { useSwipe } from '@/hooks/useSwipe';

interface PropertyCardProps {
  property: any;
  onPress?: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const { mutate: swipe } = useSwipe();

  const handleSwipe = (direction: 'LEFT' | 'RIGHT') => {
    swipe({ propertyId: property.id, direction });
  };

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: property.images[0] }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>${property.priceMonthly / 100}/mo</Text>
        <Text style={styles.address}>{property.address}</Text>
        
        <View style={styles.details}>
          <Text>🛏️ {property.beds}</Text>
          <Text>🚿 {property.baths}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.dislike} onPress={() => handleSwipe('LEFT')}>
          <Text>👎</Text>
        </Pressable>
        <Pressable style={styles.like} onPress={() => handleSwipe('RIGHT')}>
          <Text>❤️</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#F4B33D',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    justifyContent: 'center',
  },
  dislike: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F4B33D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


