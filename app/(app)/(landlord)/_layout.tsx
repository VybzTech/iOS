import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LandlordLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F4B33D', headerShown: false }}>
      <Tabs.Screen name="explore" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Ionicons name="speedometer" color={color} size={24} /> }} />
      <Tabs.Screen name="listings" options={{ title: 'Listings', tabBarIcon: ({ color }) => <Ionicons name="list" color={color} size={24} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={24} /> }} />
    </Tabs>
  );
}