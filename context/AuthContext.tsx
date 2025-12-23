// // import { createContext, useContext, ReactNode } from 'react';
// // import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
// // import { useUser } from '@/hooks/useUser';

// // interface AuthContextType {
// //   user: any;
// //   isSignedIn: boolean;
// //   isLoading: boolean;
// //   signOut: () => Promise<void>;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export function AuthProvider({ children }: { children: ReactNode }) {
// //   const { isSignedIn, signOut } = useClerkAuth();
// //   const { user, isLoading } = useUser();

// //   return (
// //     <AuthContext.Provider value={{ user, isSignedIn: !!isSignedIn, isLoading, signOut }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuthContext() {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuthContext must be used within AuthProvider');
// //   }
// //   return context;
// // }

// import React, { createContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
// import { secureStorage } from "../lib/storage";
// import { Session } from "@supabase/supabase-js";

// export interface AuthContextType {
//   session: Session | null;
//   user: any | null;
//   isLoading: boolean;
//   isSignedIn: boolean; // ✅ Add this for convenience
//   signUpWithEmail: (
//     email: string,
//     password: string,
//     name?: string
//   ) => Promise<void>;
//   signInWithEmail: (email: string, password: string) => Promise<void>;
//   signInWithGoogle: () => Promise<void>;
//   requestPhoneOTP: (phone: string) => Promise<void>;
//   verifyPhoneOTP: (phone: string, otp: string) => Promise<void>; // ✅ Fix: just the type signature
//   signOut: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(true);


// useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const { data, error } = await supabase.auth.getSession();
//         if (data.session) {
//           setSession(data.session);
//           await secureStorage.setToken(data.session.access_token);
//           if (data.session.refresh_token) {
//             await secureStorage.setRefreshToken(data.session.refresh_token);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to initialize auth:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     // const initializeAuth = async () => {
//     //   try {
//     //     const { data, error } = await supabase.auth.getSession();
//     //     if (data.session) {
//     //       setSession(data.session);
//     //       setUser(data.session.user); // ✅ Set user here
//     //       await secureStorage.setToken(data.session.access_token);
//     //       if (data.session.refresh_token) {
//     //         await secureStorage.setRefreshToken(data.session.refresh_token);
//     //       }
//     //     }
//     //   } catch (error) {
//     //     console.error("Failed to initialize auth:", error);
//     //   } finally {
//     //     setIsLoading(false);
//     //   }
//     // };





//     initializeAuth();

//     // Listen for auth changes
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setSession(session);
//         if (session) {
//           setUser(session.user); // ✅ Set user when session changes
//           await secureStorage.setToken(session.access_token);
//           if (session.refresh_token) {
//             await secureStorage.setRefreshToken(session.refresh_token);
//           }
//         } else {
//           setUser(null); // ✅ Clear user on logout
//           await secureStorage.clear();
//         }
//       }
//     );

//     return () => {
//       authListener?.subscription.unsubscribe();
//     };
//   }, []);

//   const signUpWithEmail = async (
//     email: string,
//     password: string,
//     name?: string
//   ) => {
//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: { name },
//         },
//       });
//       if (error) throw error;
//       // Success - user will be auto-logged in
//       console.log("Signup successful");
//     } catch (error) {
//       console.error("Sign up error:", error);
//       throw error;
//     }
//   };

//   const signInWithEmail = async (email: string, password: string) => {
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) throw error;
//     } catch (error) {
//       console.error("Sign in error:", error);
//       throw error;
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: "exp://localhost:19000/--/deep-link", // Update with your Expo URL
//         },
//       });
//       if (error) throw error;
//     } catch (error) {
//       console.error("Google sign in error:", error);
//       throw error;
//     }
//   };

//   const requestPhoneOTP = async (phone: string) => {
//     try {
//       const { error } = await supabase.auth.signInWithOtp({ phone });
//       if (error) throw error;
//     } catch (error) {
//       console.error("OTP request error:", error);
//       throw error;
//     }
//   };

//   const verifyPhoneOTP = async (phone: string, otp: string) => {
//     try {
//       const { error } = await supabase.auth.verifyOtp({
//         phone,
//         token: otp,
//         type: "sms",
//       });
//       if (error) throw error;
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       throw error;
//     }
//   };

//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       await secureStorage.clear();
//       setSession(null);
//       setUser(null);
//     } catch (error) {
//       console.error("Sign out error:", error);
//       throw error;
//     }
//   };

//   // ✅ Compute isSignedIn from session
//   const isSignedIn = !!session;

//   return (
//     <AuthContext.Provider
//       value={{
//         session,
//         user,
//         isLoading,
//         isSignedIn, // ✅ Provide this
//         signUpWithEmail,
//         signInWithEmail,
//         signInWithGoogle,
//         requestPhoneOTP,
//         verifyPhoneOTP,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
