// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "./home";
// import SecuritySettingsScreen from "../settings/security";
// import ProfileScreen from "./profile";

// const Stack = createNativeStackNavigator();
 
// export default function AppLayout() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="home"
//         component={HomeScreen}
//         options={{ title: "Home" }}
//       />
//       <Stack.Screen
//         name="settings"
//         component={SecuritySettingsScreen}
//         options={{ title: "settings" }}
//       />

//       {/* 
//       //   return (
// //     <Stack screenOptions={{ headerShown: false }}>
// //       {userType === 'TENANT' && <Stack.Screen name="(tenant)" />}
// //       {userType === 'LANDLORD' && <Stack.Screen name="(landlord)" />}
// //       {userType === 'LANDLORD_AGENT' && <Stack.Screen name="(agent)" />}
// //       {userType?.includes('OFFICER') && <Stack.Screen name="(officer)" />}
// //       <Stack.Screen name="settings" />
// //     </Stack>
//       */}
//     </Stack.Navigator>
//   );
// }


// App layout with role-based navigation
// ==========================================

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.replace('/(auth)/login');
    }
  }, [isSignedIn]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const primaryRole = user?.roles?.[0];

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {primaryRole === 'TENANT' && (
        <Stack.Screen name="(tenant)" options={{ headerShown: false }} />
      )}
      {primaryRole === 'LANDLORD' && (
        <Stack.Screen name="(landlord)" options={{ headerShown: false }} />
      )}
      {primaryRole === 'LANDLORD_AGENT' && (
        <Stack.Screen name="(agent)" options={{ headerShown: false }} />
      )}
      {primaryRole?.includes('OFFICER') && (
        <Stack.Screen name="(officer)" options={{ headerShown: false }} />
      )}

      {/* Shared settings */}
      <Stack.Screen name="settings" />
    </Stack>
  );
}



