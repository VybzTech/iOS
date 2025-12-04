// import { useEffect } from "react";
import { Stack } from "expo-router";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { trpc, queryClient, trpcLink } from "@/lib/trpc";
import { AuthProvider } from "@/context/AuthContext";
// import * as SecureStore from "expo-secure-store";

// // Get Clerk token
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
//         saveToken: (token) => SecureStore.setItemAsync('clerk_session', token),
//         clearToken: () => SecureStore.deleteItemAsync('clerk_session'),
//       }}
//     >
//     <trpc.Provider
//       client={trpc.createClient({ links: [trpcLink] })}
//       queryClient={queryClient}
//       >
//       <AuthProvider>
//         <Stack screenOptions={{ headerShown: false }} />
//       </AuthProvider>
//     </trpc.Provider>
//       </ClerkProvider>
//   );
// }

import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc, trpcLink } from "@/lib/trpc";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [trpcLink],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </trpc.Provider>
  );
}
