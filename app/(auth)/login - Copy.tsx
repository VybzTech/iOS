// import { useSignIn } from '@clerk/clerk-expo';
// import { useRouter, Link } from 'expo-router';
// import {
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
// } from 'react-native';
// import React, { useState } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import { Ionicons } from '@expo/vector-icons';

// export default function SignInScreen() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

//   // Validation
//   const validate = () => {
//     const newErrors: typeof errors = {};

//     if (!emailAddress.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
//       newErrors.email = 'Invalid email format';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle email/password sign-in
//   const onSignInPress = async () => {
//     if (!isLoaded || !validate()) return;

//     setIsLoading(true);
//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       if (signInAttempt.status === 'complete') {
//         // Save session
//         await setActive({ session: signInAttempt.createdSessionId });

//         // Get JWT token from Clerk
//         const token = await signInAttempt.createdSessionId;
//         if (token) {
//           await SecureStore.setItemAsync('jwt_token', token);
//         }

//         // Redirect to app
//         router.replace('/(app)');
//       } else {
//         Alert.alert('Sign In Failed', 'Please complete all steps');
//       }
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert(
//         'Sign In Error',
//         err.errors?.[0]?.message || 'Invalid email or password'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Google OAuth
//   const onGooglePress = async () => {
//     if (!isLoaded) return;

//     setIsLoading(true);
//     try {
//       await signIn.authenticateWithRedirect({
//         strategy: 'oauth_google',
//         redirectUrl: 'exp://callback',
//         additionalScopes: ['profile', 'email'],
//       });
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Google Sign In Error', 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       style={styles.scrollView}
//       contentContainerStyle={styles.container}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Logo */}
//       <Image
//         source={require('@/assets/images/ug-logo.png')}
//         style={styles.logo}
//       />

//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Sign in to your account</Text>

//       {/* Email Input */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Email Address</Text>
//         <View
//           style={[
//             styles.inputWrapper,
//             errors.email && styles.inputError,
//           ]}
//         >
//           <Ionicons
//             name="mail-outline"
//             size={20}
//             color="#999"
//             style={styles.inputIcon}
//           />
//           <TextInput
//             style={styles.input}
//             autoCapitalize="none"
//             placeholder="you@example.com"
//             placeholderTextColor="#999"
//             value={emailAddress}
//             onChangeText={setEmailAddress}
//             editable={!isLoading}
//             keyboardType="email-address"
//           />
//         </View>
//         {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//       </View>

//       {/* Password Input */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Password</Text>
//         <View
//           style={[
//             styles.inputWrapper,
//             errors.password && styles.inputError,
//           ]}
//         >
//           <Ionicons
//             name="lock-closed-outline"
//             size={20}
//             color="#999"
//             style={styles.inputIcon}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="••••••••"
//             placeholderTextColor="#999"
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//             editable={!isLoading}
//           />
//           <TouchableOpacity
//             onPress={() => setShowPassword(!showPassword)}
//             style={styles.eyeIcon}
//           >
//             <Ionicons
//               name={showPassword ? 'eye-outline' : 'eye-off-outline'}
//               size={20}
//               color="#999"
//             />
//           </TouchableOpacity>
//         </View>
//         {errors.password && (
//           <Text style={styles.errorText}>{errors.password}</Text>
//         )}
//       </View>

//       {/* Forgot Password Link */}
//       <TouchableOpacity>
//         <Text style={styles.forgotLink}>Forgot password?</Text>
//       </TouchableOpacity>

//       {/* Sign In Button */}
//       <TouchableOpacity
//         style={[styles.button, isLoading && styles.buttonDisabled]}
//         onPress={onSignInPress}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Sign In</Text>
//         )}
//       </TouchableOpacity>

//       {/* Divider */}
//       <View style={styles.divider}>
//         <View style={styles.dividerLine} />
//         <Text style={styles.dividerText}>Or continue with</Text>
//         <View style={styles.dividerLine} />
//       </View>

//       {/* Google Button */}
//       <TouchableOpacity
//         style={styles.socialButton}
//         onPress={onGooglePress}
//         disabled={isLoading}
//       >
//         <Text style={styles.socialIcon}>🔤</Text>
//         <Text style={styles.socialText}>Google</Text>
//       </TouchableOpacity>

//       {/* Sign Up Link */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Don't have an account? </Text>
//         <Link href="/(auth)/signup">
//           <Text style={styles.footerLink}>Sign up</Text>
//         </Link>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: '#fff',
//   },
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     justifyContent: 'center',
//     minHeight: '100%',
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#f9f9f9',
//   },
//   inputError: {
//     borderColor: '#E74C3C',
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#000',
//   },
//   eyeIcon: {
//     padding: 8,
//     marginRight: -8,
//   },
//   errorText: {
//     fontSize: 12,
//     color: '#E74C3C',
//     marginTop: 4,
//   },
//   forgotLink: {
//     fontSize: 14,
//     color: '#F4B33D',
//     fontWeight: '600',
//     textAlign: 'right',
//     marginBottom: 24,
//   },
//   button: {
//     backgroundColor: '#F4B33D',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E0E0E0',
//   },
//   dividerText: {
//     marginHorizontal: 12,
//     fontSize: 14,
//     color: '#999',
//   },
//   socialButton: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   socialIcon: {
//     fontSize: 18,
//     marginRight: 8,
//   },
//   socialText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   footerLink: {
//     fontSize: 14,
//     color: '#F4B33D',
//     fontWeight: '700',
//   },

//   codeContainer: {
//     marginVertical: 32,
//   },
//   codeLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 12,
//   },
//   codeInput: {
//     fontSize: 32,
//     fontWeight: '700',
//     letterSpacing: 8,
//     textAlign: 'center',
//     borderWidth: 2,
//     borderColor: '#F4B33D',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     color: '#000',
//   },
//   codeHint: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//   },
//   backButton: {
//     alignItems: 'center',
//     padding: 12,
//   },
//   backText: {
//     fontSize: 14,
//     color: '#F4B33D',
//     fontWeight: '600',
//   },
//   roleCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: '#f9f9f9',
//   },
//   roleCardActive: {
//     borderColor: '#F4B33D',
//     backgroundColor: '#FFFBF0',
//   },
//   roleIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#F4B33D20',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   roleIconText: {
//     fontSize: 28,
//   },
//   roleContent: {
//     flex: 1,
//   },
//   roleTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 4,
//   },
//   roleDescription: {
//     fontSize: 13,
//     color: '#666',
//   },
//   roleCheckbox: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 12,
//   },
//   roleCheckboxActive: {
//     borderColor: '#F4B33D',
//     backgroundColor: '#F4B33D20',
//   },
// });








import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace('/(app)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // OAuth will handle navigation after callback
    } catch (error: any) {
      Alert.alert('Google Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.googleButton, loading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});