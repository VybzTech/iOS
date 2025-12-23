// import { trpc } from '@/lib/trpc';

// export function useSwipe() {
//   const utils = trpc.useUtils();

//   const createSwipeMutation = trpc.swipes.create.useMutation({
//     onSuccess: (data) => {
//       // Invalidate feed so new property shows
//       utils.properties.getFeed.invalidate();

//       if (data.isMatch) {
//         // Show match alert
//         alert(`🎉 ${data.message}`);
//         // Could navigate to matches
//       }
//     },
//   });

//   return {
//     mutate: createSwipeMutation.mutate,
//     isLoading: createSwipeMutation.isPending,
//     isMatch: createSwipeMutation.data?.isMatch,
//   };
// }