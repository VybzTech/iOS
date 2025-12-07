// import { Redirect, Stack } from "expo-router";
// import { useAuth } from "@clerk/clerk-expo";

// export default function AuthLayout() {
//   // export default function AuthRoutesLayout() {
//   const { isSignedIn } = useAuth();

//   if (isSignedIn) {
//     return <Redirect href={"/"} />;
//   }

//   //   return <Stack />
//   // }
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         animationEnabled: true,
//       }}
//     >
//       <Stack.Screen name="login" />
//       <Stack.Screen name="signup" />
//       <Stack.Screen name="verify-otp" />
//       <Stack.Screen name="choose-role" />
//     </Stack>
//   );
// }

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen 
        name="signup" 
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen 
        name="verify-otp" 
        options={{ title: 'Verify Email' }}
      />
      <Stack.Screen 
        name="choose-role" 
        options={{ title: 'Choose Role' }}
      />
    </Stack>
  );
}