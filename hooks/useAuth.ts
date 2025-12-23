// // import { useEffect, useState, useCallback } from "react";
// // import { useRouter } from "expo-router";
// // import { Alert } from "react-native";
// // import * as SecureStore from "expo-secure-store";
// // import * as WebBrowser from "expo-web-browser";
// // import { supabase } from "@/lib/supabase";
// // import { trpc } from "@/lib/trpc";

// // WebBrowser.maybeCompleteAuthSession();

// // type AuthMethod = "EMAIL" | "PHONE" | "GOOGLE";

// // interface AuthState {
// //   isLoading: boolean;
// //   isSignedIn: boolean;
// //   user: any | null;
// // }

// // export function useAuth() {
// //   const router = useRouter();
// //   const [authState, setAuthState] = useState<AuthState>({
// //     isLoading: true,
// //     isSignedIn: false,
// //     user: null,
// //   });

// //   // Use tRPC queries at the top level (hook level)
// //   // We'll query with undefined initially, then set enabled when we have supabaseId
// //   const [supabaseIdForQuery, setSupabaseIdForQuery] = useState<string | null>(
// //     null
// //   );

// //   const { data: statusData } = trpc.auth.checkOnboardingStatus.useQuery(
// //     { supabaseId: supabaseIdForQuery || "" },
// //     {
// //       enabled: !!supabaseIdForQuery, // Only run when we have an ID
// //     }
// //   );

// //   const { data: loginResponse } = trpc.auth.getUserBySupabaseId.useQuery(
// //     { supabaseId: supabaseIdForQuery || "" },
// //     {
// //       enabled: !!supabaseIdForQuery && statusData?.status === "COMPLETE",
// //     }
// //   );

// //   // Core function: determine where to route based on onboarding status
// //   const handleAuthenticatedUser = useCallback(
// //     async (supabaseId: string) => {
// //       try {
// //         // Set the ID to trigger queries
// //         setSupabaseIdForQuery(supabaseId);
// //       } catch (error) {
// //         console.error("Auth error:", error);
// //         setAuthState({
// //           isLoading: false,
// //           isSignedIn: false,
// //           user: null,
// //         });
// //         router.replace("/(auth)/login");
// //       }
// //     },
// //     [router]
// //   );

// //   // Handle signed out state
// //   const handleSignedOut = useCallback(async () => {
// //     await SecureStore.deleteItemAsync("jwt_token");
// //     setAuthState({
// //       isLoading: false,
// //       isSignedIn: false,
// //       user: null,
// //     });
// //   }, []);

// //   // Effect: when status data arrives, route accordingly
// //   useEffect(() => {
// //     if (!supabaseIdForQuery) return;

// //     if (statusData?.status === "COMPLETE" && loginResponse?.user) {
// //       // User is fully onboarded
// //       SecureStore.setItemAsync("jwt_token", loginResponse.token);

// //       setAuthState({
// //         isLoading: false,
// //         isSignedIn: true,
// //         user: loginResponse.user,
// //       });

// //       router.replace("/(app)/home");
// //     } else if (statusData?.status === "IN_PROGRESS") {
// //       // Resume onboarding
// //       setAuthState({
// //         isLoading: false,
// //         isSignedIn: false,
// //         user: null,
// //       });
// //       router.replace("/(auth)/basic-info");
// //     } else if (statusData?.status === "NOT_STARTED") {
// //       // Begin onboarding
// //       setAuthState({
// //         isLoading: false,
// //         isSignedIn: false,
// //         user: null,
// //       });
// //       router.replace("/(auth)/choose-role");
// //     }
// //   }, [statusData, loginResponse, supabaseIdForQuery, router]);

// //   // Main effect: initial check + auth listener
// //   useEffect(() => {
// //     const initAuth = async () => {
// //       try {
// //         const { data: sessionData } = await supabase.auth.getSession();

// //         if (sessionData.session?.user?.id) {
// //           // User is logged in with Supabase
// //           handleAuthenticatedUser(sessionData.session.user.id);
// //         } else {
// //           // User is not logged in
// //           await handleSignedOut();
// //           router.replace("/(auth)/login");
// //         }
// //       } catch (error) {
// //         console.error("Initial auth check failed:", error);
// //         await handleSignedOut();
// //         router.replace("/(auth)/login");
// //       }
// //     };

// //     initAuth();

// //     // Listen to auth changes
// //     const {
// //       data: { subscription },
// //     } = supabase.auth.onAuthStateChange(async (event, session) => {
// //       console.log("Auth event:", event);

// //       if (
// //         event === "SIGNED_IN" ||
// //         event === "TOKEN_REFRESHED" ||
// //         event === "USER_UPDATED"
// //       ) {
// //         if (session?.user?.id) {
// //           handleAuthenticatedUser(session.user.id);
// //         }
// //       } else if (event === "SIGNED_OUT") {
// //         await handleSignedOut();
// //         router.replace("/(auth)/login");
// //       }
// //     });

// //     return () => {
// //       subscription.unsubscribe();
// //     };
// //   }, [handleAuthenticatedUser, handleSignedOut, router]);

// //   // Sign up with email (creates incomplete user)
// //   const signUpWithEmail = async (
// //     email: string,
// //     password: string,
// //     firstName?: string,
// //     lastName?: string
// //   ) => {
// //     const { data, error } = await supabase.auth.signUp({
// //       email,
// //       password,
// //       options: {
// //         data: { firstName, lastName },
// //       },
// //     });

// //     if (error) throw error;
// //     if (!data.user?.id) throw new Error("Failed to create user");

// //     // Create incomplete record in your DB
// //     await trpc.auth.createIncompleteUser.mutate({
// //       supabaseId: data.user.id,
// //       email,
// //       authMethod: "EMAIL" as const,
// //     });

// //     return { supabaseId: data.user.id };
// //   };

// //   // Sign up / sign in with phone OTP
// //   const signUpWithPhone = async (phone: string) => {
// //     const { error } = await supabase.auth.signInWithOtp({ phone });
// //     if (error) throw error;
// //   };

// //   const verifyOTP = async (phone: string, token: string) => {
// //     const { data, error } = await supabase.auth.verifyOtp({
// //       phone,
// //       token,
// //       type: "sms",
// //     });

// //     if (error) throw error;
// //     if (!data.user?.id) throw new Error("OTP verification failed");

// //     await trpc.auth.createIncompleteUser.mutate({
// //       supabaseId: data.user.id,
// //       phone,
// //       authMethod: "PHONE" as const,
// //     });

// //     return { supabaseId: data.user.id };
// //   };

// //   // Sign in with email/password
// //   const signInWithEmail = async (email: string, password: string) => {
// //     const { data, error } = await supabase.auth.signInWithPassword({
// //       email,
// //       password,
// //     });

// //     if (error) throw error;
// //     if (!data.user?.id) throw new Error("Login failed");

// //     return data.user;
// //   };

// //   // Sign in with Google
// //   const signInWithGoogle = async () => {
// //     const { data, error } = await supabase.auth.signInWithOAuth({
// //       provider: "google",
// //       options: {
// //         redirectTo:
// //           "https://fhxxxqwfogihamybhtgi.supabase.co/auth/v1/callback",
// //       },
// //     });

// //     if (error) throw error;
// //     if (!data.url) throw new Error("No auth URL returned");

// //     const result = await WebBrowser.openAuthSessionAsync(
// //       data.url,
// //       "https://fhxxxqwfogihamybhtgi.supabase.co/auth/v1/callback"
// //     );

// //     if (result.type !== "success") {
// //       throw new Error("Google authentication cancelled or failed");
// //     }
// //   };

// //   // Complete onboarding (final step)
// //   const completeOnboarding = async ({
// //     firstName,
// //     lastName,
// //     roles,
// //     profileImage,
// //   }: {
// //     firstName: string;
// //     lastName: string;
// //     roles: string[];
// //     profileImage?: string;
// //   }) => {
// //     const { data: sessionData } = await supabase.auth.getSession();
// //     const supabaseId = sessionData.session?.user?.id;

// //     if (!supabaseId) throw new Error("Not authenticated");

// //     const response = await trpc.auth.completeOnboarding.mutate({
// //       supabaseId,
// //       firstName,
// //       lastName,
// //       roles,
// //       profileImage,
// //       email: sessionData.session?.user?.email || "",
// //     });

// //     await SecureStore.setItemAsync("jwt_token", response.token);

// //     setAuthState({
// //       isLoading: false,
// //       isSignedIn: true,
// //       user: response.user,
// //     });

// //     router.replace("/(app)/home");

// //     return response.user;
// //   };

// //   // Logout
// //   const logout = async () => {
// //     await supabase.auth.signOut();
// //     await SecureStore.deleteItemAsync("jwt_token");
// //     setAuthState({
// //       isLoading: false,
// //       isSignedIn: false,
// //       user: null,
// //     });
// //     router.replace("/(auth)/login");
// //   };

// //   return {
// //     ...authState,
// //     signUpWithEmail,
// //     signUpWithPhone,
// //     verifyOTP,
// //     signInWithEmail,
// //     signInWithGoogle,
// //     completeOnboarding,
// //     logout,
// //   };
// // }

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
// }

// export function useAuth() {
//   const router = useRouter();
//   const [authState, setAuthState] = useState<AuthState>({
//     isLoading: true,
//     isSignedIn: false,
//     user: null,
//   });

//   const [supabaseId, setSupabaseId] = useState<string | null>(null);

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
//     if (!supabaseId) return;

//     const statusData = statusQuery.data;

//     if (statusData?.status === "COMPLETE" && loginQuery.data?.user) {
//       // User is fully onboarded
//       SecureStore.setItemAsync("jwt_token", loginQuery.data.token);

//       setAuthState({
//         isLoading: false,
//         isSignedIn: true,
//         user: loginQuery.data.user,
//       });

//       router.replace("/(app)/home");
//     } else if (statusData?.status === "IN_PROGRESS") {
//       // Resume onboarding
//       setAuthState({
//         isLoading: false,
//         isSignedIn: false,
//         user: null,
//       });
//       router.replace("/(auth)/basic-info");
//     } else if (statusData?.status === "NOT_STARTED") {
//       // Begin onboarding
//       setAuthState({
//         isLoading: false,
//         isSignedIn: false,
//         user: null,
//       });
//       router.replace("/(auth)/choose-role");
//     }
//   }, [statusQuery.data, loginQuery.data, supabaseId, router]);

//   // Initialize auth on app launch
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const { data: sessionData } = await supabase.auth.getSession();

//         if (sessionData.session?.user?.id) {
//           // User is logged in, set ID to trigger queries
//           setSupabaseId(sessionData.session.user.id);
//         } else {
//           // User is not logged in
//           await SecureStore.deleteItemAsync("jwt_token");
//           setAuthState({
//             isLoading: false,
//             isSignedIn: false,
//             user: null,
//           });
//           router.replace("/(auth)/login");
//         }
//       } catch (error) {
//         console.error("Initial auth check failed:", error);
//         setAuthState({
//           isLoading: false,
//           isSignedIn: false,
//           user: null,
//         });
//         router.replace("/(auth)/login");
//       }
//     };

//     initAuth();

//     // Listen to auth state changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log("Auth event:", event);

//       if (
//         event === "SIGNED_IN" ||
//         event === "TOKEN_REFRESHED" ||
//         event === "USER_UPDATED"
//       ) {
//         if (session?.user?.id) {
//           setSupabaseId(session.user.id);
//         }
//       } else if (event === "SIGNED_OUT") {
//         await SecureStore.deleteItemAsync("jwt_token");
//         setAuthState({
//           isLoading: false,
//           isSignedIn: false,
//           user: null,
//         });
//         router.replace("/(auth)/login");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [router]);

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

//     const response = await trpc.auth.completeOnboarding.mutate({
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
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  user: any | null;
  shouldShowOnboarding?: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isSignedIn: false,
    user: null,
  });

  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // These queries only run when supabaseId is set and provider is initialized
  const statusQuery = trpc.auth.checkOnboardingStatus.useQuery(
    { supabaseId: supabaseId || "" },
    { enabled: !!supabaseId }
  );

  const loginQuery = trpc.auth.getUserBySupabaseId.useQuery(
    { supabaseId: supabaseId || "" },
    { enabled: !!supabaseId && statusQuery.data?.status === "COMPLETE" }
  );

  // Handle routing when queries complete
  useEffect(() => {
    if (!supabaseId || !hasInitialized) return;

    console.log("Status query:", statusQuery.data);
    console.log("Login query:", loginQuery.data);

    const statusData = statusQuery.data;

    if (statusData?.status === "COMPLETE" && loginQuery.data?.user) {
      console.log("✅ User fully onboarded");
      SecureStore.setItemAsync("jwt_token", loginQuery.data.token);
      SecureStore.setItemAsync("hasSeenOnboarding", "true");

      setAuthState({
        isLoading: false,
        isSignedIn: true,
        user: loginQuery.data.user,
      });
    } else if (statusData?.status === "IN_PROGRESS") {
      console.log("🟡 User onboarding in progress");
      setAuthState({
        isLoading: false,
        isSignedIn: false,
        user: null,
      });
    } else if (statusData?.status === "NOT_STARTED") {
      console.log("❌ User onboarding not started");
      setAuthState({
        isLoading: false,
        isSignedIn: false,
        user: null,
      });
    }
  }, [statusQuery.data, loginQuery.data, supabaseId, hasInitialized]);

  // Show onboarding screen if user hasn't seen it yet
  useEffect(() => {
    (async () => {
      if (!hasInitialized || supabaseId) return; // Skip if still loading or user is logged in

      const hasSeenOnboarding = await SecureStore.getItemAsync(
        "hasSeenOnboarding"
      );
      // COME BACK & REMOVE EXCESS ONBOARDING
setAuthState((prev) => ({
          ...prev,
          shouldShowOnboarding: true,
        }));
      if (!hasSeenOnboarding && authState.isLoading === false) {
        // First time user - show onboarding, not login
        console.log("📱 First time user - showing onboarding");
        setAuthState((prev) => ({
          ...prev,
          shouldShowOnboarding: true,
        }));
      }
    })();
  }, [hasInitialized, supabaseId]);

  // Initialize auth once on app launch
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log("🚀 Initializing auth...");
        const { data: sessionData } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionData.session?.user?.id) {
          console.log("✅ Session found:", sessionData.session.user.id);
          setSupabaseId(sessionData.session.user.id);
        } else {
          console.log("❌ No session found");
          await SecureStore.deleteItemAsync("jwt_token");
          setAuthState({
            isLoading: false,
            isSignedIn: false,
            user: null,
          });
        }

        setHasInitialized(true);
      } catch (error) {
        console.error("❌ Auth init error:", error);
        if (!mounted) return;
        setAuthState({
          isLoading: false,
          isSignedIn: false,
          user: null,
        });
        setHasInitialized(true);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Set up auth listener AFTER initialization
  useEffect(() => {
    if (!hasInitialized) return;

    let mounted = true;

    const setupListener = async () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log("Auth event:", event);

        // Skip INITIAL_SESSION
        if (event === "INITIAL_SESSION") return;

        if (event === "SIGNED_IN" && session?.user?.id) {
          console.log("User signed in");
          setSupabaseId(session.user.id);
        } else if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          if (session?.user?.id) {
            setSupabaseId(session.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          await SecureStore.deleteItemAsync("jwt_token");
          setAuthState({
            isLoading: false,
            isSignedIn: false,
            user: null,
          });
          setSupabaseId(null);
        }
      });

      return subscription.unsubscribe;
    };

    setupListener();
  }, [hasInitialized]);

  // Sign up with email
  const signUpWithEmail = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName },
      },
    });

    if (error) throw error;
    if (!data.user?.id) throw new Error("Failed to create user");

    // Create incomplete user record
    await trpc.auth.createIncompleteUser.mutate({
      supabaseId: data.user.id,
      email,
      authMethod: "EMAIL",
    });

    return { supabaseId: data.user.id };
  };

  // Request phone OTP
  const signUpWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  };

  // Verify OTP
  const verifyOTP = async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) throw error;
    if (!data.user?.id) throw new Error("OTP verification failed");

    await trpc.auth.createIncompleteUser.mutate({
      supabaseId: data.user.id,
      phone,
      authMethod: "PHONE",
    });

    return { supabaseId: data.user.id };
  };

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user?.id) throw new Error("Login failed");

    return data.user;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://fhxxxqwfogihamybhtgi.supabase.co/auth/v1/callback",
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error("No auth URL returned");

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      "https://fhxxxqwfogihamybhtgi.supabase.co/auth/v1/callback"
    );

    if (result.type !== "success") {
      throw new Error("Google authentication cancelled");
    }
  };

  // Complete onboarding
  const completeOnboarding = async ({
    firstName,
    lastName,
    roles,
    profileImage,
  }: {
    firstName: string;
    lastName: string;
    roles: string[];
    profileImage?: string;
  }) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const supabaseUserId = sessionData.session?.user?.id;

    if (!supabaseUserId) throw new Error("Not authenticated");

    const response = await trpc.auth.completeOnboarding.mutate({
      supabaseId: supabaseUserId,
      firstName,
      lastName,
      roles,
      profileImage,
      email: sessionData.session?.user?.email || "",
    });

    await SecureStore.setItemAsync("jwt_token", response.token);

    setAuthState({
      isLoading: false,
      isSignedIn: true,
      user: response.user,
    });

    router.replace("/(app)/home");

    return response.user;
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync("jwt_token");
    setAuthState({
      isLoading: false,
      isSignedIn: false,
      user: null,
    });
    setSupabaseId(null);
    router.replace("/(auth)/login");
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
  };
}


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

//     const response = await trpc.auth.completeOnboarding.mutate({
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