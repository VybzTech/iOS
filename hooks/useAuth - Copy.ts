// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { trpc } from '@/lib/trpc';

type AuthMethod = 'EMAIL' | 'PHONE' | 'GOOGLE';

interface AuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  user: any | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isSignedIn: false,
    user: null,
  });

  // Check if user is already authenticated
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check Supabase session
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        // User is authenticated, get their data from local DB
        const dbResponse = await trpc.auth.getUserBySupabaseId.query({
          supabaseId: data.session.user.id,
        });

        if (dbResponse) {
          // Save JWT token
          await SecureStore.setItemAsync('jwt_token', dbResponse.token);
          setAuthState({
            isLoading: false,
            isSignedIn: true,
            user: dbResponse.user,
          });
        } else {
          // User in Supabase but not in our DB - needs to complete onboarding
          setAuthState({
            isLoading: false,
            isSignedIn: false,
            user: null,
          });
          router.replace('/(auth)/choose-role');
        }
      } else {
        setAuthState({
          isLoading: false,
          isSignedIn: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({
        isLoading: false,
        isSignedIn: false,
        user: null,
      });
    }
  };

  // Sign up with email
  const signUpWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      // Step 1: Create auth in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const supabaseId = data.user?.id;
      if (!supabaseId) throw new Error('Failed to create auth account');

      // Step 2: Create incomplete user in local DB
      await trpc.auth.createIncompleteUser.mutate({
        supabaseId,
        email,
        authMethod: 'EMAIL',
      });

      return { supabaseId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Sign up with phone (OTP)
  const signUpWithPhone = async (phone: string) => {
    try {
      // Step 1: Send OTP via Supabase
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      return {
        sessionId: data.session?.id,
        phone,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Verify OTP
  const verifyOTP = async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      const supabaseId = data.user?.id;
      if (!supabaseId) throw new Error('Failed to verify OTP');

      // Create incomplete user
      await trpc.auth.createIncompleteUser.mutate({
        supabaseId,
        phone,
        authMethod: 'PHONE',
      });

      return { supabaseId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Sign in with email
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const supabaseId = data.user?.id;
      if (!supabaseId) throw new Error('Login failed');

      // Get user from DB
      const dbResponse = await trpc.auth.getUserBySupabaseId.query({
        supabaseId,
      });

      if (!dbResponse) {
        throw new Error('User not found. Please complete registration.');
      }

      // Save JWT
      await SecureStore.setItemAsync('jwt_token', dbResponse.token);

      setAuthState({
        isLoading: false,
        isSignedIn: true,
        user: dbResponse.user,
      });

      return dbResponse.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      // After OAuth, user will be redirected
      // Handle the session in the app layout
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Complete onboarding
  const completeOnboarding = async (
    firstName: string,
    lastName: string,
    roles: string[],
    profileImage?: string
  ) => {
    try {
      const { data } = await supabase.auth.getSession();
      const supabaseId = data.session?.user?.id;

      if (!supabaseId) throw new Error('Not authenticated');

      // Complete in local DB
      const response = await trpc.auth.completeOnboarding.mutate({
        supabaseId,
        email: data.session.user.email || '',
        firstName,
        lastName,
        profileImage,
        roles,
      });

      // Save JWT
      await SecureStore.setItemAsync('jwt_token', response.token);

      setAuthState({
        isLoading: false,
        isSignedIn: true,
        user: response.user,
      });

      return response.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync('jwt_token');

      setAuthState({
        isLoading: false,
        isSignedIn: false,
        user: null,
      });

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    signUpWithEmail,
    signUpWithPhone,
    verifyOTP,
    signInWithEmail,
    signInWithGoogle,
    completeOnboarding,
    logout,
    checkAuthStatus,
  };
}

