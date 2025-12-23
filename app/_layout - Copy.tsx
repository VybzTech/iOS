// import { useEffect } from "react";
// import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "../context/AuthContext";
// import { useAuth } from "../hooks/useAuth";
import { trpcClient } from "../lib/trpc";
// import * as Linking from "expo-linking";

// const queryClient = new QueryClient();

// function RootLayoutNav() {
//   const { session, isLoading } = useAuth();

//   useEffect(() => {
//     // Handle deep links from Supabase OAuth
//     const handleDeepLink = ({ url }: { url: string }) => {
//       const route = url.replace(/.*?:\/\//g, "");
//       const routeName = route.split("/")[0];

//       if (routeName === "auth") {
//         // Extract token from URL if needed
//         console.log("Auth deep link received:", url);
//       }
//     };

//     const subscription = Linking.addEventListener("url", handleDeepLink);

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   if (isLoading) {
//     return <Stack />;
//   }

//   return (
//     <Stack>
//       {session ? (
//         <Stack.Screen name="(app)" options={{ headerShown: false }} />
//       ) : (
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//       )}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <trpc.Provider client={trpcClient} queryClient={queryClient}>
//           <RootLayoutNav />
//         </trpc.Provider>
//       </AuthProvider>
//     </QueryClientProvider>
//   );
// }

// Root layout with providers and auth
// ==========================================

import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { QueryClient } from '@tanstack/react-query';
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Stack } from "expo-router";

// Keep splash screen visible until we're done loading
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isLoading, isSignedIn } = useAuth();
  const [fontsLoaded] = useFonts({
    "HubotSans-Medium": require("@/assets/fonts/HubotSans-Medium.ttf"),
    "HubotSans-Regular": require("@/assets/fonts/HubotSans-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  // Still loading
  if (isLoading || !fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
              // User is authenticated - show app
              <Stack.Screen name="(app)" />
            ) : (
              // User is not authenticated - show auth screens
              <Stack.Screen name="(auth)" />
            )}
          </Stack>
        </trpc.Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
