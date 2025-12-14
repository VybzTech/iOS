// import { createTRPCReact } from '@trpc/react-query';
// import { httpBatchLink } from '@trpc/client';
// import { QueryClient } from '@tanstack/react-query';
// import type { AppRouter } from '../../server/src/database/routers/index'; // ✅ Fix path to match your backend structure

// import { secureStorage } from './storage';

// export const trpc = createTRPCReact<AppRouter>();

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1, // Reduced retry for mobile
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
//     },
//   },
// });

// export const trpcClient = trpc.createClient({
//   links: [
//     httpBatchLink({
//       url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`, // ✅ Your backend route
//       async headers() {
//         try {
//           const token = await secureStorage.getToken();
//           return {
//             authorization: token ? `Bearer ${token}` : '',
//             'Content-Type': 'application/json',
//           };
//         } catch (err) {
//           console.error('❌ Error getting token:', err);
//           return {};
//         }
//       },
//     }),
//   ],
// });








import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import { secureStorage } from './storage';

// ✅ Temporarily use any type to test if error goes away
export const trpc = createTRPCReact<any>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`,
      async headers() {
        try {
          const token = await secureStorage.getToken();
          return {
            authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          };
        } catch (err) {
          console.error('❌ Error getting token:', err);
          return {};
        }
      },
    }),
  ],
});









// export const trpcClient = trpc.createClient({
//   links: [
//     httpLink({
//       url: process.env.EXPO_PUBLIC_API_URL!,
//       async headers() {
//         const token = await secureStorage.getToken();
//         return {
//           authorization: token ? `Bearer ${token}` : '',
//         };
//       },
//     }),
//   ],
// });

 
// export const trpcClient = trpc.createClient({
//   links: [
//     httpBatchLink({
//       url: `${process.env.EXPO_PUBLIC_API_URL}/api/trpc`,
//       async headers() {
//         try {
//           const token = await SecureStore.getItemAsync('jwt_token');
//           return {
//             authorization: token ? `Bearer ${token}` : '',
//           };
//         } catch (err) {
//           console.error('🔴 Error getting token:', err);
//           return {};
//         }
//       },
//     }),
//   ],
// });

/**
 * 
 * 
 * 
 * import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import * as SecureStore from 'expo-secure-store';
import type { AppRouter } from '../../Server/src/database/routers/index.js';

export const trpc = createTRPCReact<AppRouter>();

export const trpcLink = httpBatchLink({
  url: `${process.env.EXPO_PUBLIC_API_URL}/api/trpc`,
  async headers() {
    const token = await SecureStore.getItemAsync('jwt_token');
    return {
      authorization: token ? `Bearer ${token}` : '',
    };
  },
});
 * 
 */