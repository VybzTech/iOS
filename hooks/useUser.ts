// import { trpc } from '@/lib/trpc';
// import { useAuth } from './useAuth';

// export function useUser() {
//   const { isSignedIn } = useAuth();
//   const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
//     enabled: isSignedIn,
//   });

//   return {
//     user,
//     isLoading,
//     error,
//   };
// }