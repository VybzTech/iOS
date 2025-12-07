 
// import { useEffect } from "react";
// import { Stack } from "expo-router";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { trpc, queryClient, trpcClient } from "@/lib/trpc";
// import { AuthProvider } from "@/context/AuthContext";
// import { QueryClientProvider } from "@tanstack/react-query";
// import * as SecureStore from "expo-secure-store";

// const getToken = async () => {
//   try {
//     const token = await SecureStore.getItemAsync("clerk_session");
//     return token;
//   } catch (err) {
//     return null;
//   }
// };

// export default function RootLayout() {
//   return (
//     <ClerkProvider
//       publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
//       tokenCache={{
//         getToken,
//         saveToken: (token) => SecureStore.setItemAsync("clerk_session", token),
//         clearToken: () => SecureStore.deleteItemAsync("clerk_session"),
//       }}
//     >
//       <QueryClientProvider client={queryClient}>
//         <trpc.Provider client={trpcClient} queryClient={queryClient}>
//           <AuthProvider>
//             <Stack screenOptions={{ headerShown: false }} />
//           </AuthProvider>
//         </trpc.Provider>
//       </QueryClientProvider>
//     </ClerkProvider>
//   );
// }


// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { ClerkProvider } from '@clerk/clerk-expo';
// import * as SecureStore from 'expo-secure-store';
// import * as SplashScreen from 'expo-splash-screen';
// import { useFonts } from '@/hooks/useFonts';
// import { trpc } from '@/lib/trpc';
// import { QueryClient } from '@tanstack/react-query';
// import { AuthProvider } from '@/context/AuthContext';

// // Keep splash visible while loading
// SplashScreen.preventAutoHideAsync();

// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return await SecureStore.getItemAsync(key);
//     } catch (err) {
//       console.error('SecureStore get error:', err);
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return await SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       console.error('SecureStore save error:', err);
//     }
//   },
//   async clearToken(key: string) {
//     try {
//       return await SecureStore.deleteItemAsync(key);
//     } catch (err) {
//       console.error('SecureStore clear error:', err);
//     }
//   },
// };

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const fontsLoaded = useFonts();

//   useEffect(() => {
//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded]);

//   if (!fontsLoaded) {
//     return null; // Keep splash showing
//   }

//   return (
//     <ClerkProvider
//       publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
//       tokenCache={tokenCache}
//     >
//       {/* <trpc.Provider client={trpcClient} queryClient={queryClient}> */}
//       <trpc.Provider client={trpc.createClient({})} queryClient={queryClient}>
//         <AuthProvider>
//           <Stack screenOptions={{ headerShown: false }} />
//           </AuthProvider>
//       </trpc.Provider>
//     </ClerkProvider>
//   );
// }



// File: mobile/app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from '@/hooks/useFonts';
import { QueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

// Keep splash visible while loading
SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      const token = await SecureStore.getItemAsync(key);
      return token;
    } catch (err) {
      console.error('🔴 SecureStore get error:', err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('🔴 SecureStore save error:', err);
    }
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error('🔴 SecureStore clear error:', err);
    }
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ Fonts loaded, hiding splash');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show splash screen while fonts load
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      '❌ Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env.local'
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <trpc.Provider
        client={trpc.createClient({
          links: [
            // Add your tRPC link here if needed
          ],
        })}
        queryClient={queryClient}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </trpc.Provider>
    </ClerkProvider>
  );
}