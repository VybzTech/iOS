import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import type { AppRouter } from '../../../Server/src/database/routers/index.js';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export const trpcLink = httpBatchLink({
  url: `${process.env.EXPO_PUBLIC_API_URL}/api/trpc`,
  async headers() {
    try {
      const token = await SecureStore.getItemAsync('jwt_token');
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    } catch (err) {
      return {};
    }
  },
});

export const trpcClient = trpc.createClient({
  links: [trpcLink],
});




/**
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