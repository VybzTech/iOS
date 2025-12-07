import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ErrorScreen() {
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Something went wrong
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/')}
        style={{ backgroundColor: '#F4B33D', padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}