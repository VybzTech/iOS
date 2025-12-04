import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sign Up Screen (Coming Soon)</Text>
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}