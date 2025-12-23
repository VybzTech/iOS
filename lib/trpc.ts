// import type { AppRouter } from "../../server/src/database/routers/index";
// import { createTRPCReact } from "@trpc/react-query";
// import { httpBatchLink } from "@trpc/client";
// import { QueryClient } from "@tanstack/react-query";
// import { secureStorage } from "./storage";

// export const trpc = createTRPCReact<AppRouter>();

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       staleTime: 1000 * 60 * 5,
//       gcTime: 1000 * 60 * 10,
//     },
//   },
// });

// export const trpcClient = trpc.createClient({
//   links: [
//     httpBatchLink({
//       url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`,
//       async headers() {
//         try {
//           const token = await secureStorage.getToken();
//           return {
//             authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "application/json",
//           };
//         } catch (err) {
//           console.error("Error getting token:", err);
//           return {};
//         }
//       },
//     }),
//   ],
// });


import type { AppRouter } from "../../server/src/database/routers/index";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { secureStorage } from "./storage";

export const trpc = createTRPCReact<AppRouter>();

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
            authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          };
        } catch (err) {
          console.error("Error getting token:", err);
          return {};
        }
      },
    }),
  ],
});
