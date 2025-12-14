// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@/hooks/useAuth';
// import { useUser } from '@/hooks/useUser';

// export default function AppLayout() {
//   const router = useRouter();
//   const { isSignedIn } = useAuth();
//   const { user, isLoading } = useUser();

//   useEffect(() => {
//     if (!isSignedIn) {
//       router.replace('/(auth)/login');
//     }
//   }, [isSignedIn]);

//   if (isLoading) {
//     return null; // Show loading
//   }

//   // Role-based navigation
//   const userType = user?.roles?.[0];

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {userType === 'TENANT' && <Stack.Screen name="(tenant)" />}
//       {userType === 'LANDLORD' && <Stack.Screen name="(landlord)" />}
//       {userType === 'LANDLORD_AGENT' && <Stack.Screen name="(agent)" />}
//       {userType?.includes('OFFICER') && <Stack.Screen name="(officer)" />}
//       <Stack.Screen name="settings" />
//     </Stack>
//   );
// }

// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@clerk/clerk-expo';

// export default function AppLayout() {
//   const { isSignedIn, isLoaded } = useAuth();
//   const router = useRouter();
//   console.log('🔍 Clerk isLoaded:', isLoaded);
//   console.log('🔑 Clerk Key:', process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);

//   useEffect(() => {
//     if (isLoaded && !isSignedIn) {
//       router.replace('/(auth)/login');
//     }
//   }, [isLoaded, isSignedIn]);

//   if (!isLoaded) {
//     return null;
//   }

//   if (!isSignedIn) {
//     return null;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tenant)" />
//       <Stack.Screen name="settings" />
//     </Stack>
//   );
// }

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./home";
import SecuritySettingsScreen from "../settings/security";

const Stack = createNativeStackNavigator();

export default function AppLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="settings"
        component={SecuritySettingsScreen}
        options={{ title: "settings" }}
      />
    </Stack.Navigator>
  );
}


