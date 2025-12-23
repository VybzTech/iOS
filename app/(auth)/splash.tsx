// Splash screen (3 seconds)
// ==========================================

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/hooks/useAuth';

export default function SplashScreen() {
  const router = useRouter();
  // const { authState } = useAuth();

  // useEffect(() => {
  //   const checkState = async () => {
  //     // Check if user has seen onboarding before
  //     const hasSeenOnboarding = await SecureStore.getItemAsync(
  //       'hasSeenOnboarding'
  //     );

  //     await checkAuthStatus();

  //     // After 3 seconds, navigate
  //     setTimeout(() => {
  //       if (!hasSeenOnboarding) {
  //         router.replace('/(auth)/onboarding');
  //       } else {
  //         router.replace('/(auth)/login');
  //       }
  //     }, 3000);
  //   };

  //   checkState();
  // }, []);


  const { isLoading } = useAuth(); // We only need to know if auth is still loading

  useEffect(() => {
    const prepareApp = async () => {
      // Check if user has seen the welcome/onboarding slides before
      const hasSeenOnboarding = await SecureStore.getItemAsync("hasSeenOnboarding");

      // Small splash delay for better UX (logo animation, etc.)
      setTimeout(() => {
        if (!hasSeenOnboarding) {
          // First-time user → show welcome slides
          router.replace("/(auth)/onboarding");
        } else {
          // Returning user → go straight to login (or let useAuth redirect if already signed in)
          router.replace("/(auth)/login");
        }
      }, 3000); // Adjust duration as needed
    };

    prepareApp();
  }, []);

  // Optional: show a longer splash if auth is still initializing
  // But usually not needed since useAuth handles routing quickly
  if (isLoading) {
    // You can return a full-screen loader here if you want to wait
    // But in most cases, just show the splash normally
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('@/assets/images/ug-logo.png')}
        style={{ width: 70, height: 70 }}
      />
    </View>
  );
}