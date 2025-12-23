// // app/(app)/(tenant)/explore.tsx
// import { View, FlatList, Pressable, Text, StyleSheet } from 'react-native';
// import { trpc } from '@/lib/trpc';
// import PropertyCard from '@/components/(tenant)/PropertyCard';

// export default function ExploreScreen() {
//   const { data, isLoading, hasNextPage, fetchNextPage } = 
//     trpc.properties.getFeed.useInfiniteQuery(
//       { limit: 10 },
//       { getNextPageParam: (lastPage) => lastPage.nextCursor }
//     );

//   if (isLoading) {
//     return <View style={styles.loader}><Text>Loading...</Text></View>;
//   }

//   const properties = data?.pages.flatMap(p => p.properties) ?? [];

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={properties}
//         renderItem={({ item }) => <PropertyCard property={item} />}
//         keyExtractor={item => item.id}
//         onEndReached={() => hasNextPage && fetchNextPage()}
//         onEndReachedThreshold={0.8}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });


import { View, FlatList, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
// import { trpc } from '@/lib/trpc';
import PropertyCard from '@/components/(tenant)/PropertyCard';
// import Loader from '@/components/(ui)/Loader';
// import EmptyState from '@/components/(common)/EmptyState';

export default function ExploreScreen() {
  const router = useRouter();
  // const { data, isLoading, hasNextPage, fetchNextPage } = trpc.properties.getFeed.useInfiniteQuery(
  //   { limit: 10 },
  //   { getNextPageParam: (lastPage) => lastPage.nextCursor }
  // );

  // if (isLoading) return <Loader />;

  const properties = [];
  // const properties = data?.pages.flatMap((page) => page.properties) ?? [];

  return (
    <View style={{ flex: 1 }}>
      {properties.length === 0 ? (
        <Text>
          No listings available, Check back soon!
        </Text>
        // <EmptyState title="No listings available" message="Check back soon!" />
      ) : (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => router.push(`/(app)/(tenant)/listing-detail?id=${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={() => console.log("onEndReached")}
          // onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.8}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}





/**
 * 
 * // app/(app)/(tenant)/explore.tsx
import { View, FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { trpc } from '@/lib/trpc';
import PropertyCard from '@/components/(tenant)/PropertyCard';

export default function ExploreScreen() {
  const { data, isLoading, hasNextPage, fetchNextPage } = 
    trpc.properties.getFeed.useInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  if (isLoading) {
    return <View style={styles.loader}><Text>Loading...</Text></View>;
  }

  const properties = data?.pages.flatMap(p => p.properties) ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={({ item }) => <PropertyCard property={item} />}
        keyExtractor={item => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
 * 
 * 
 * 
 */