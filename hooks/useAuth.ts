import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { apiClient } from "@/lib/api";

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  supabaseUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  onboardingCompleted: boolean;
  tenantProfile?: any;
  landlordProfile?: any;
  agentProfile?: any;
  officerProfile?: any;
}

interface AuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  user: User | null;
  token: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isSignedIn: false,
    user: null,
    token: null,
  });

  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // ==========================================
  // INITIALIZATION
  // ==========================================

  // Step 1: Check Supabase session on app launch
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("[Auth] Initializing...");

        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session?.user?.id) {
          console.log("[Auth] ✅ Supabase session found");
          setSupabaseId(sessionData.session.user.id);
        } else {
          console.log("[Auth] No Supabase session");
          setAuthState({
            isLoading: false,
            isSignedIn: false,
            user: null,
            token: null,
          });
        }

        setHasInitialized(true);
      } catch (error) {
        console.error("[Auth] Init error:", error);
        setAuthState({
          isLoading: false,
          isSignedIn: false,
          user: null,
          token: null,
        });
        setHasInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Step 2: When Supabase ID is available, login with backend
  useEffect(() => {
    if (!supabaseId || !hasInitialized) return;

    const loginWithBackend = async () => {
      try {
        console.log("[Auth] Logging in with backend:", supabaseId);

        const response = await apiClient.post("/api/auth/login", {
          supabaseId,
        });

        const { data } = response.data;

        // Save token
        await SecureStore.setItemAsync("auth_token", data.token);

        setAuthState({
          isLoading: false,
          isSignedIn: true,
          user: data.user,
          token: data.token,
        });

        console.log("[Auth] ✅ Logged in successfully");
        router.replace("/(app)/(tenant)/explore");
      } catch (error: any) {
        console.log(
          "[Auth] User not found in database, checking onboarding status"
        );

        // User not in database yet, check onboarding status
        checkOnboardingStatus(supabaseId);
      }
    };

    loginWithBackend();
  }, [supabaseId, hasInitialized]);

  // ==========================================
  // ONBOARDING FLOW
  // ==========================================

  const checkOnboardingStatus = useCallback(
    async (supabaseId: string) => {
      try {
        console.log("[Auth] Checking onboarding status");

        // Check if incomplete user exists
        const incompleteRes = await apiClient.post("/api/auth/signup", {
          supabaseId,
          email: (await supabase.auth.getSession()).data.session?.user?.email,
          authMethod: "GOOGLE", // Will update based on actual method
        });

        console.log("[Auth] Incomplete user created/found");

        setAuthState({
          isLoading: false,
          isSignedIn: false,
          user: null,
          token: null,
        });

        router.replace("/(auth)/choose-role");
      } catch (error) {
        console.error("[Auth] Error checking onboarding:", error);
      }
    },
    [router]
  );

  // ==========================================
  // SIGN UP FUNCTIONS
  // ==========================================

  const signUpWithEmail = useCallback(
    async (email: string, password: string, firstName?: string) => {
      try {
        console.log("[Auth] Signing up with email");

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName },
          },
        });

        if (error) throw error;
        if (!data.user?.id) throw new Error("Failed to create user");

        // Create incomplete user in backend
        await apiClient.post("/api/auth/signup", {
          supabaseId: data.user.id,
          email,
          authMethod: "EMAIL",
        });

        console.log("[Auth] ✅ Email signup successful");
        setSupabaseId(data.user.id);

        return { success: true, supabaseId: data.user.id };
      } catch (error) {
        console.error("[Auth] Email signup error:", error);
        throw error;
      }
    },
    []
  );

  const signUpWithPhone = useCallback(async (phone: string) => {
    try {
      console.log("[Auth] Sending OTP to phone");

      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;

      console.log("[Auth] ✅ OTP sent");
      return { success: true };
    } catch (error) {
      console.error("[Auth] Phone signup error:", error);
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (phone: string, token: string) => {
    try {
      console.log("[Auth] Verifying OTP");

      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (error) throw error;
      if (!data.user?.id) throw new Error("OTP verification failed");

      // Create incomplete user in backend
      await apiClient.post("/api/auth/signup", {
        supabaseId: data.user.id,
        phone,
        authMethod: "PHONE",
      });

      console.log("[Auth] ✅ OTP verified");
      setSupabaseId(data.user.id);

      return { success: true, supabaseId: data.user.id };
    } catch (error) {
      console.error("[Auth] OTP verification error:", error);
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      console.log("[Auth] Starting Google sign in");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.EXPO_PUBLIC_DEEP_LINK_URL}/auth-callback`,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error("No auth URL returned");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        `${process.env.EXPO_PUBLIC_DEEP_LINK_URL}/auth-callback`
      );

      if (result.type !== "success") {
        throw new Error("Google authentication cancelled");
      }

      console.log("[Auth] ✅ Google sign in successful");
      return { success: true };
    } catch (error) {
      console.error("[Auth] Google sign in error:", error);
      throw error;
    }
  }, []);

  // ==========================================
  // SELECT ROLE
  // ==========================================

  const selectRole = useCallback(
    async (roles: string[]) => {
      if (!supabaseId) throw new Error("Not authenticated");

      try {
        console.log("[Auth] Selecting roles:", roles);

        await apiClient.post("/api/auth/select-role", {
          supabaseId,
          roles,
        });

        console.log("[Auth] ✅ Roles selected");
        router.push("/(auth)/basic-info");
      } catch (error) {
        console.error("[Auth] Role selection error:", error);
        throw error;
      }
    },
    [supabaseId, router]
  );

  // ==========================================
  // COMPLETE ONBOARDING
  // ==========================================

  const completeOnboarding = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      roles: string[];
      profileImage?: string;
    }) => {
      if (!supabaseId) throw new Error("Not authenticated");

      try {
        console.log("[Auth] Completing onboarding");

        const sessionData = await supabase.auth.getSession();
        const email = sessionData.data.session?.user?.email;

        if (!email) throw new Error("Email not found");

        const response = await apiClient.post("/api/auth/complete-onboarding", {
          supabaseId,
          email,
          firstName: data.firstName,
          lastName: data.lastName,
          roles: data.roles,
          profileImage: data.profileImage,
        });

        const { token, user } = response.data.data;

        // Save token
        await SecureStore.setItemAsync("auth_token", token);

        setAuthState({
          isLoading: false,
          isSignedIn: true,
          user,
          token,
        });

        console.log("[Auth] ✅ Onboarding completed");

        // Route based on role
        const role = user.roles[0];
        if (role === "TENANT") {
          router.replace("/(app)/(tenant)/explore");
        } else if (role === "LANDLORD" || role === "LANDLORD_AGENT") {
          router.replace("/(app)/(landlord)/explore");
        } else if (role.includes("OFFICER")) {
          router.replace("/(app)/(officer)/dashboard");
        }

        return { success: true, user };
      } catch (error) {
        console.error("[Auth] Onboarding completion error:", error);
        throw error;
      }
    },
    [supabaseId, router]
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const signOut = useCallback(async () => {
    try {
      console.log("[Auth] Logging out");

      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync("auth_token");

      setAuthState({
        isLoading: false,
        isSignedIn: false,
        user: null,
        token: null,
      });

      setSupabaseId(null);

      console.log("[Auth] ✅ Logged out");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("[Auth] Logout error:", error);
    }
  }, [router]);

  return {
    ...authState,
    signUpWithEmail,
    signUpWithPhone,
    verifyOTP,
    signInWithGoogle,
    selectRole,
    completeOnboarding,
    signOut,
  };
}

// OLD AUTH WITH TRPC
// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import * as WebBrowser from "expo-web-browser";
// import { supabase } from "@/lib/supabase";
// import { trpc } from "@/lib/trpc";

// WebBrowser.maybeCompleteAuthSession();

// interface AuthState {
//   isLoading: boolean;
//   isSignedIn: boolean;
//   user: any | null;
//   shouldShowOnboarding?: boolean;
// }

// export function useAuth() {
//   const router = useRouter();
//   const [authState, setAuthState] = useState<AuthState>({
//     isLoading: true,
//     isSignedIn: false,
//     user: null,
//   });

//   const [supabaseId, setSupabaseId] = useState<string | null>(null);
//   const [hasInitialized, setHasInitialized] = useState(false);

//   // These queries only run when supabaseId is set and provider is initialized
//   const statusQuery = trpc.auth.checkOnboardingStatus.useQuery(
//     { supabaseId: supabaseId || "" },
//     { enabled: !!supabaseId }
//   );

//   const loginQuery = trpc.auth.getUserBySupabaseId.useQuery(
//     { supabaseId: supabaseId || "" },
//     { enabled: !!supabaseId && statusQuery.data?.status === "COMPLETE" }
//   );

//   // Handle routing when queries complete
//   useEffect(() => {
//     if (!supabaseId || !hasInitialized) return;

//     console.log("Status query:", statusQuery.data);
//     console.log("Login query:", loginQuery.data);

//     const statusData = statusQuery.data;

//     if (statusData?.status === "COMPLETE" && loginQuery.data?.user) {
//       console.log("✅ User fully onboarded");
//       SecureStore.setItemAsync("jwt_token", loginQuery.data.token);
//       SecureStore.setItemAsync("hasSeenOnboarding", "true");

//       setAuthState({
//         isLoading: false,
//         isSignedIn: true,
//         user: loginQuery.data.user,
//       });
//     } else if (statusData?.status === "IN_PROGRESS") {
//       console.log("🟡 User onboarding in progress");
//       setAuthState({
//         isLoading: false,
//         isSignedIn: false,
//         user: null,
//       });
//     } else if (statusData?.status === "NOT_STARTED") {
//       console.log("❌ User onboarding not started");
//       setAuthState({
//         isLoading: false,
//         isSignedIn: false,
//         user: null,
//       });
//     }
//   }, [statusQuery.data, loginQuery.data, supabaseId, hasInitialized]);

//   // Show onboarding screen if user hasn't seen it yet
//   useEffect(() => {
//     (async () => {
//       if (!hasInitialized || supabaseId) return; // Skip if still loading or user is logged in

//       const hasSeenOnboarding = await SecureStore.getItemAsync(
//         "hasSeenOnboarding"
//       );
//       // COME BACK & REMOVE EXCESS ONBOARDING
// setAuthState((prev) => ({
//           ...prev,
//           shouldShowOnboarding: true,
//         }));
//       if (!hasSeenOnboarding && authState.isLoading === false) {
//         // First time user - show onboarding, not login
//         console.log("📱 First time user - showing onboarding");
//         setAuthState((prev) => ({
//           ...prev,
//           shouldShowOnboarding: true,
//         }));
//       }
//     })();
//   }, [hasInitialized, supabaseId]);

//   // Initialize auth once on app launch
//   useEffect(() => {
//     let mounted = true;

//     const initAuth = async () => {
//       try {
//         console.log("🚀 Initializing auth...");
//         const { data: sessionData } = await supabase.auth.getSession();

//         if (!mounted) return;

//         if (sessionData.session?.user?.id) {
//           console.log("✅ Session found:", sessionData.session.user.id);
//           setSupabaseId(sessionData.session.user.id);
//         } else {
//           console.log("❌ No session found");
//           await SecureStore.deleteItemAsync("jwt_token");
//           setAuthState({
//             isLoading: false,
//             isSignedIn: false,
//             user: null,
//           });
//         }

//         setHasInitialized(true);
//       } catch (error) {
//         console.error("❌ Auth init error:", error);
//         if (!mounted) return;
//         setAuthState({
//           isLoading: false,
//           isSignedIn: false,
//           user: null,
//         });
//         setHasInitialized(true);
//       }
//     };

//     initAuth();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Set up auth listener AFTER initialization
//   useEffect(() => {
//     if (!hasInitialized) return;

//     let mounted = true;

//     const setupListener = async () => {
//       const {
//         data: { subscription },
//       } = supabase.auth.onAuthStateChange(async (event, session) => {
//         if (!mounted) return;

//         console.log("Auth event:", event);

//         // Skip INITIAL_SESSION
//         if (event === "INITIAL_SESSION") return;

//         if (event === "SIGNED_IN" && session?.user?.id) {
//           console.log("User signed in");
//           setSupabaseId(session.user.id);
//         } else if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
//           if (session?.user?.id) {
//             setSupabaseId(session.user.id);
//           }
//         } else if (event === "SIGNED_OUT") {
//           console.log("User signed out");
//           await SecureStore.deleteItemAsync("jwt_token");
//           setAuthState({
//             isLoading: false,
//             isSignedIn: false,
//             user: null,
//           });
//           setSupabaseId(null);
//         }
//       });

//       return subscription.unsubscribe;
//     };

//     setupListener();
//   }, [hasInitialized]);

//   // Sign up with email
//   const signUpWithEmail = async (
//     email: string,
//     password: string,
//     firstName?: string,
//     lastName?: string
//   ) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { firstName, lastName },
//       },
//     });

//     if (error) throw error;
//     if (!data.user?.id) throw new Error("Failed to create user");

//     // Create incomplete user record
//     await trpc.auth.createIncompleteUser.mutate({
//       supabaseId: data.user.id,
//       email,
//       authMethod: "EMAIL",
//     });

//     return { supabaseId: data.user.id };
//   };

//   // Request phone OTP
//   const signUpWithPhone = async (phone: string) => {
//     const { error } = await supabase.auth.signInWithOtp({ phone });
//     if (error) throw error;
//   };

//   // Verify OTP
//   const verifyOTP = async (phone: string, token: string) => {
//     const { data, error } = await supabase.auth.verifyOtp({
//       phone,
//       token,
//       type: "sms",
//     });

//     if (error) throw error;
//     if (!data.user?.id) throw new Error("OTP verification failed");

//     await trpc.auth.createIncompleteUser.mutate({
//       supabaseId: data.user.id,
//       phone,
//       authMethod: "PHONE",
//     });

//     return { supabaseId: data.user.id };
//   };

//   // Sign in with email/password
//   const signInWithEmail = async (email: string, password: string) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) throw error;
//     if (!data.user?.id) throw new Error("Login failed");

//     return data.user;
//   };

//   // Sign in with Google
//   const signInWithGoogle = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo:
//           "https://fhxxxqwfogihamybhtgi.supabase.co/auth/v1/callback",
//       },
//     });

//     if (error) throw error;
//     if (!data.url) throw new Error("No auth URL returned");

//     const result = await WebBrowser.openAuthSessionAsync(
//       data.url,
//       "https://fhxxxqwfogihamybhtgi.supabase.co/auth/v1/callback"
//     );

//     if (result.type !== "success") {
//       throw new Error("Google authentication cancelled");
//     }
//   };

//   // Complete onboarding
//   const completeOnboarding = async ({
//     firstName,
//     lastName,
//     roles,
//     profileImage,
//   }: {
//     firstName: string;
//     lastName: string;
//     roles: string[];
//     profileImage?: string;
//   }) => {
//     const { data: sessionData } = await supabase.auth.getSession();
//     const supabaseUserId = sessionData.session?.user?.id;

//     if (!supabaseUserId) throw new Error("Not authenticated");

//     const response = await .auth.completeOnboarding.mutate({
//       supabaseId: supabaseUserId,
//       firstName,
//       lastName,
//       roles,
//       profileImage,
//       email: sessionData.session?.user?.email || "",
//     });

//     await SecureStore.setItemAsync("jwt_token", response.token);

//     setAuthState({
//       isLoading: false,
//       isSignedIn: true,
//       user: response.user,
//     });

//     router.replace("/(app)/home");

//     return response.user;
//   };

//   // Logout
//   const logout = async () => {
//     await supabase.auth.signOut();
//     await SecureStore.deleteItemAsync("jwt_token");
//     setAuthState({
//       isLoading: false,
//       isSignedIn: false,
//       user: null,
//     });
//     setSupabaseId(null);
//     router.replace("/(auth)/login");
//   };

//   return {
//     ...authState,
//     signUpWithEmail,
//     signUpWithPhone,
//     verifyOTP,
//     signInWithEmail,
//     signInWithGoogle,
//     completeOnboarding,
//     logout,
//   };
// }
