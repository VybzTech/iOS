import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';

export default function AppLayout() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.replace('/(auth)/login');
    }
  }, [isSignedIn]);

  if (isLoading) {
    return null; // Show loading
  }

  // Role-based navigation
  const userType = user?.roles?.[0];

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {userType === 'TENANT' && <Stack.Screen name="(tenant)" />}
      {userType === 'LANDLORD' && <Stack.Screen name="(landlord)" />}
      {userType === 'LANDLORD_AGENT' && <Stack.Screen name="(agent)" />}
      {userType?.includes('OFFICER') && <Stack.Screen name="(officer)" />}
      <Stack.Screen name="settings" />
    </Stack>
  );
}