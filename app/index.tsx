// import { useEffect } from "react";
// import { View, Image } from "react-native";
// import { useRouter } from "expo-router";
// import { useAuth } from "@/hooks/useAuth";

// export default function SplashScreen() {
//   const router = useRouter();
//   const { isSignedIn, isLoading } = useAuth();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (isSignedIn) {
//         router.replace("/(app)");
//       } else {
//         router.replace("/(auth)/login");
//       }
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [isSignedIn]);

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#F5F5F5",
//       }}
//     >
//       <Image
//         source={require("@/assets/images/ug-logo.png")}
//         style={{ width: 100, height: 100 }}
//       />
//     </View>
//   );
// }

import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';


export default function SplashScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    const timer = setTimeout(() => {
      if (isSignedIn) {
        router.replace('/(app)/(tenant)/explore');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Image
        source={require('@/assets/images/ug-logo.png')}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
}