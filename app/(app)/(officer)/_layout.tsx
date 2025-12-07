import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OfficerLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F4B33D', headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Ionicons name="speedometer" color={color} size={24} /> }} />
      <Tabs.Screen name="tenants" options={{ title: 'Tenants', tabBarIcon: ({ color }) => <Ionicons name="people" color={color} size={24} /> }} />
      <Tabs.Screen name="landlords" options={{ title: 'Landlords', tabBarIcon: ({ color }) => <Ionicons name="business" color={color} size={24} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={24} /> }} />
    </Tabs>
  );
}