// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// export default function TenantLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#F4B33D',
//         tabBarInactiveTintColor: '#999',
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <Ionicons name="compass" color={color} size={24} />,
//         }}
//       />
//       <Tabs.Screen
//         name="homes"
//         options={{
//           title: 'Homes',
//           tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={24} />,
//         }}
//       />
//       <Tabs.Screen
//         name="preferences"
//         options={{
//           title: 'Preferences',
//           tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} size={24} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={24} />,
//         }}
//       />
//     </Tabs>
//   );
// }

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import ExploreScreen from './explore';
import HomesScreen from './homes';
import ProfileScreen from './profile';
import PreferencesScreen from './preferences';
import { COLORS } from '@/lib/constants';

const Tab = createBottomTabNavigator();

export default function TenantLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
        },
      }}
    >
      <Tab.Screen
        name="explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="homes"
        component={HomesScreen}
        options={{
          tabBarLabel: 'Homes',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="preferences"
        component={PreferencesScreen}
        options={{
          tabBarLabel: 'Preferences',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="filter" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
