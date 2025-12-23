//OLD WORKING METHOD WITH TRPC
// import { useEffect, useState } from "react";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { View, Image } from "react-native";
// import { useAuth } from "@/hooks/useAuth";
// import { trpc, trpcClient } from "@/lib/trpc";
// import { Stack } from "expo-router";

// SplashScreen.preventAutoHideAsync();

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       staleTime: 1000 * 60 * 5,
//       gcTime: 1000 * 60 * 10,
//     },
//   },
// });

// function RootLayoutNav() {
//   const { isLoading, isSignedIn, shouldShowOnboarding } = useAuth();
//   const [fontsLoaded] = useFonts({
//     "HubotSans-Medium": require("@/assets/fonts/HubotSans-Medium.ttf"),
//     "HubotSans-Regular": require("@/assets/fonts/HubotSans-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (fontsLoaded && !isLoading) {
//       setTimeout(() => SplashScreen.hideAsync(), 5000);
//     }
//   }, [fontsLoaded, isLoading]);

//   // Show splash screen while loading
//   if (isLoading || !fontsLoaded) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Image
//           source={require("@/assets/images/ug-logo.png")}
//           style={{ width: 70, height: 70 }}
//         />
//       </View>
//     );
//   }

//   // Render based on auth state
//   if (isSignedIn) {
//     return (
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(app)" />
//       </Stack>
//     );
//   }

//   // Not signed in - show auth screens
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {shouldShowOnboarding ? (
//         <Stack.Screen
//           name="(auth)"
//           options={{
//             initialRouteName: "onboarding",
//           }}
//         />
//       ) : (
//         <Stack.Screen
//           name="(auth)"
//           options={{
//             initialRouteName: "login",
//           }}
//         />
//       )}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <trpc.Provider client={trpcClient} queryClient={queryClient}>
//         <QueryClientProvider client={queryClient}>
//           <RootLayoutNav />
//         </QueryClientProvider>
//       </trpc.Provider>
//     </GestureHandlerRootView>
//   );
// }

import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

function RootLayoutNav() {
  const { isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      {isSignedIn ? (
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
