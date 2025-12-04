import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen (Coming Soon)</Text>
      <Button title="Sign Up" onPress={() => router.push('/(auth)/signup')} />
    </View>
  );
}

// // app/(auth)/login.tsx
// import { useState } from 'react';
// import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useSignIn } from '@clerk/clerk-expo';

// export default function LoginScreen() {
//   const router = useRouter();
//   const { signIn, isLoaded, setActive } = useSignIn();
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [method, setMethod] = useState<'phone' | 'email' | 'google'>('phone');
//   const [isLoading, setIsLoading] = useState(false);

//   const handlePhoneSignIn = async () => {
//     if (!isLoaded) return;
//     setIsLoading(true);

//     try {
//       const response = await signIn?.create({
//         strategy: 'phone_code',
//         phoneNumber,
//       });

//       if (response?.verificationCode) {
//         router.push({
//           pathname: '/(auth)/verify-otp',
//           params: {
//             phoneNumber,
//             verificationId: response.verification?.id,
//           },
//         });
//       }
//     } catch (err) {
//       alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     // Implement Google OAuth
//     // This is handled by Clerk
//     try {
//       const response = await signIn?.authenticateWithRedirect({
//         strategy: 'oauth_google',
//         redirectUrl: 'exp://callback',
//         additionalScopes: ['profile', 'email'],
//       });

//       if (response?.createdSessionId) {
//         await setActive?.({ session: response.createdSessionId });
//         router.replace('/(app)');
//       }
//     } catch (err) {
//       alert('Google sign in error: ' + (err instanceof Error ? err.message : 'Unknown'));
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Sign in to continue</Text>

//       {method === 'phone' && (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="phone-pad"
//           />
//           <Pressable
//             style={styles.button}
//             onPress={handlePhoneSignIn}
//             disabled={isLoading}
//           >
//             <Text style={styles.buttonText}>Send OTP</Text>
//           </Pressable>
//         </>
//       )}

//       {method === 'email' && (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Email Address"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//           />
//           <Pressable style={styles.button}>
//             <Text style={styles.buttonText}>Send Link</Text>
//           </Pressable>
//         </>
//       )}

//       <Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
//         <Text>🔤 Sign in with Google</Text>
//       </Pressable>

//       <View style={styles.tabs}>
//         <Pressable
//           style={[styles.tab, method === 'phone' && styles.tabActive]}
//           onPress={() => setMethod('phone')}
//         >
//           <Text>Phone</Text>
//         </Pressable>
//         <Pressable
//           style={[styles.tab, method === 'email' && styles.tabActive]}
//           onPress={() => setMethod('email')}
//         >
//           <Text>Email</Text>
//         </Pressable>
//       </View>

//       <Pressable onPress={() => router.push('/(auth)/signup')}>
//         <Text style={styles.link}>Don't have an account? Sign up</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 24,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#F4B33D',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   googleButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   tabs: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 24,
//   },
//   tab: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     alignItems: 'center',
//   },
//   tabActive: {
//     backgroundColor: '#F4B33D',
//     borderColor: '#F4B33D',
//   },
//   link: {
//     color: '#F4B33D',
//     textAlign: 'center',
//     fontSize: 14,
//   },
// });