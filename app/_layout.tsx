// import { useEffect, useState } from "react";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { useAuth } from "@/hooks/useAuth";
// import { trpc } from "@/lib/trpc";
// import { trpcClient } from "../lib/trpc";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Stack } from "expo-router";

// // Keep splash screen visible until we're done loading
// SplashScreen.preventAutoHideAsync();

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const { isLoading, isSignedIn } = useAuth();
//   const [fontsLoaded] = useFonts({
//     "HubotSans-Medium": require("@/assets/fonts/HubotSans-Medium.ttf"),
//     "HubotSans-Regular": require("@/assets/fonts/HubotSans-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (fontsLoaded && !isLoading) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, isLoading]);

//   if (isLoading || !fontsLoaded) {
//     return null;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <trpc.Provider client={trpcClient} queryClient={queryClient}>
//         <QueryClientProvider client={queryClient}>
//           <Stack screenOptions={{ headerShown: false }}>
//             {isSignedIn ? (
//               // User is authenticated - show app
//               <Stack.Screen name="(app)" />
//             ) : (
//               // User is not authenticated - show auth screens
//               <Stack.Screen name="(auth)" />
//             )}
//           </Stack>
//         </QueryClientProvider>
//       </trpc.Provider>
//     </GestureHandlerRootView>
//   );
// }

import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { trpc, trpcClient } from "@/lib/trpc";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function RootLayoutNav() {
  const { isLoading, isSignedIn, shouldShowOnboarding } = useAuth();
  const [fontsLoaded] = useFonts({
    "HubotSans-Medium": require("@/assets/fonts/HubotSans-Medium.ttf"),
    "HubotSans-Regular": require("@/assets/fonts/HubotSans-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      setTimeout(() => SplashScreen.hideAsync(), 3000);
    }
  }, [fontsLoaded, isLoading]);

  // Show splash screen while loading
  if (isLoading || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Image
          source={require("@/assets/images/ug-logo.png")}
          style={{ width: 70, height: 70 }}
        />
      </View>
    );
  }

  // Render based on auth state
  if (isSignedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
      </Stack>
    );
  }

  // Not signed in - show auth screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {shouldShowOnboarding ? (
        <Stack.Screen
          name="(auth)"
          options={{
            initialRouteName: "onboarding",
          }}
        />
      ) : (
        <Stack.Screen
          name="(auth)"
          options={{
            initialRouteName: "login",
          }}
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );
}
