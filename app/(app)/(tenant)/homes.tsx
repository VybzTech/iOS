// import { View, Text } from 'react-native';

// export default function HomesScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Homes/Matches Screen (Coming Soon)</Text>
//     </View>
//   );
// }
// import { trpc } from '@/lib/trpc';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';

export default function HomeScreen() {
  // This calls: http://localhost:5000/api/trpc/properties.getFeed
  const data={}
  var isLoading=false;

  // const { data, isLoading, hasNextPage, fetchNextPage } = 
  //   trpc.properties.getFeed.useInfiniteQuery(
  //     { limit: 10 },
  //     { getNextPageParam: (lastPage) => lastPage.nextCursor }
  //   );

  if (isLoading) return <ActivityIndicator />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data?.pages.flatMap(p => p.properties) ?? []}
        renderItem={({ item }) => (
          <Text key={item.id}>{item.title} - ${item.priceMonthly / 100}/mo</Text>
        )}
        onEndReached={() => console.log("first")}
        // onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}