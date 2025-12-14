// import { useSignUp } from "@clerk/clerk-expo";
// import { useRouter, Link } from "expo-router";
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
// } from "react-native";
// import React, { useState } from "react";
// import { Ionicons } from "@expo/vector-icons";

// export default function SignUpScreen() {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const router = useRouter();

//   const [step, setStep] = useState<"form" | "verification" | "role">("form");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [code, setCode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [selectedRole, setSelectedRole] = useState<
//     "TENANT" | "LANDLORD" | null
//   >(null);
//   const [errors, setErrors] = useState<any>({});

//   // Validation
//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!firstName.trim()) newErrors.firstName = "First name is required";
//     if (!lastName.trim()) newErrors.lastName = "Last name is required";

//     if (!emailAddress.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!password) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/[A-Z]/.test(password)) {
//       newErrors.password = "Password must contain uppercase letter";
//     } else if (!/[a-z]/.test(password)) {
//       newErrors.password = "Password must contain lowercase letter";
//     } else if (!/[0-9]/.test(password)) {
//       newErrors.password = "Password must contain number";
//     } else if (!/[!@#$%^&*]/.test(password)) {
//       newErrors.password = "Password must contain special character (!@#$%^&*)";
//     }

//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   // const validateForm = () => {
//   //   const newErrors: any = {};

//   //   if (!firstName.trim()) newErrors.firstName = "First name is required";
//   //   if (!lastName.trim()) newErrors.lastName = "Last name is required";

//   //   if (!emailAddress.trim()) {
//   //     newErrors.email = "Email is required";
//   //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
//   //     newErrors.email = "Invalid email format";
//   //   }

//   //   if (!password) {
//   //     newErrors.password = "Password is required";
//   //   } else if (password.length < 8) {
//   //     newErrors.password = "Password must be at least 8 characters";
//   //   }

//   //   if (password !== confirmPassword) {
//   //     newErrors.confirmPassword = "Passwords do not match";
//   //   }

//   //   setErrors(newErrors);
//   //   return Object.keys(newErrors).length === 0;
//   // };

//   // Step 1: Create account in Clerk
//   const onSignUpPress = async () => {
//     if (!isLoaded || !validateForm()) return;

//     setIsLoading(true);
//     try {
//       await signUp.create({
//         firstName,
//         lastName,
//         emailAddress,
//         password,
//         username: "Dharvo"
//       });

//       // Send verification email
//       // await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
//       // setStep('verification');
//       const prep = await signUp.prepareEmailAddressVerification({
//         strategy: "email_code",
//       });

//       // If this succeeds, email WAS sent
//       console.log("✅ Email preparation succeeded");
//       console.log("Status:", prep, prep?.status);

//       // If you get here without error, email was sent
//       setStep("verification");
//       // } catch (err: any) {
//       //   console.error(err);
//       //   // Email sending failed
//       //   console.error("❌ Email failed:", err);
//       //   Alert.alert(
//       //     "Sign Up Error",
//       //     err.errors?.[0]?.message || "Failed to create account"
//       //   );
//     } catch (err: any) {
//       console.error("Full error:", JSON.stringify(err, null, 2));
//       console.error("Error details:", err.errors);
//       Alert.alert(
//         "Sign Up Error",
//         err.errors?.[0]?.message || err.message || "Failed to create account"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Step 2: Verify email with OTP
//   const onVerifyPress = async () => {
//     if (!isLoaded) return;

//     setIsLoading(true);
//     try {
//       const signUpAttempt = await signUp.attemptEmailAddressVerification({
//         code,
//       });

//       if (signUpAttempt.status === "complete") {
//         await setActive({ session: signUpAttempt.createdSessionId });
//         // Go to role selection
//         setStep("role");
//       } else {
//         Alert.alert("Verification Failed", "Please try again");
//       }
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert("Verification Error", "Invalid or expired code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Step 3: Save role to backend and redirect
//   const onRoleSelect = async () => {
//     if (!selectedRole) {
//       Alert.alert("Role Required", "Please select your role to continue");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Call backend to create user with role
//       // This connects Clerk user with your database
//       const response = await fetch(
//         `${process.env.EXPO_PUBLIC_API_URL}/api/auth/create-user`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             clerkId: signUp.createdUserId,
//             email: emailAddress,
//             firstName,
//             lastName,
//             roles: [selectedRole],
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to create user in database");
//       }

//       // Redirect to appropriate dashboard
//       router.replace("/(app)/(tenant)/explore");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to complete sign up");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ===== FORM STEP =====
//   if (step === "form") {
//     return (
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         <Image
//           source={require("@/assets/images/ug-logo.png")}
//           style={styles.logo}
//         />

//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Join Urban Gravity today</Text>

//         {/* First Name */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>First Name</Text>
//           <View
//             style={[styles.inputWrapper, errors.firstName && styles.inputError]}
//           >
//             <Ionicons
//               name="person-outline"
//               size={20}
//               color="#999"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="John"
//               placeholderTextColor="#999"
//               value={firstName}
//               onChangeText={setFirstName}
//               editable={!isLoading}
//             />
//           </View>
//           {errors.firstName && (
//             <Text style={styles.errorText}>{errors.firstName}</Text>
//           )}
//         </View>

//         {/* Last Name */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Last Name</Text>
//           <View
//             style={[styles.inputWrapper, errors.lastName && styles.inputError]}
//           >
//             <Ionicons
//               name="person-outline"
//               size={20}
//               color="#999"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Doe"
//               placeholderTextColor="#999"
//               value={lastName}
//               onChangeText={setLastName}
//               editable={!isLoading}
//             />
//           </View>
//           {errors.lastName && (
//             <Text style={styles.errorText}>{errors.lastName}</Text>
//           )}
//         </View>

//         {/* Email */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Email Address</Text>
//           <View
//             style={[styles.inputWrapper, errors.email && styles.inputError]}
//           >
//             <Ionicons
//               name="mail-outline"
//               size={20}
//               color="#999"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               autoCapitalize="none"
//               placeholder="you@example.com"
//               placeholderTextColor="#999"
//               value={emailAddress}
//               onChangeText={setEmailAddress}
//               editable={!isLoading}
//               keyboardType="email-address"
//             />
//           </View>
//           {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//         </View>

//         {/* Password */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Password</Text>
//           <View
//             style={[styles.inputWrapper, errors.password && styles.inputError]}
//           >
//             <Ionicons
//               name="lock-closed-outline"
//               size={20}
//               color="#999"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="••••••••"
//               placeholderTextColor="#999"
//               secureTextEntry={!showPassword}
//               value={password}
//               onChangeText={setPassword}
//               editable={!isLoading}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.eyeIcon}
//             >
//               <Ionicons
//                 name={showPassword ? "eye-outline" : "eye-off-outline"}
//                 size={20}
//                 color="#999"
//               />
//             </TouchableOpacity>
//           </View>
//           {errors.password && (
//             <Text style={styles.errorText}>{errors.password}</Text>
//           )}
//         </View>

//         {/* Confirm Password */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Confirm Password</Text>
//           <View
//             style={[
//               styles.inputWrapper,
//               errors.confirmPassword && styles.inputError,
//             ]}
//           >
//             <Ionicons
//               name="lock-closed-outline"
//               size={20}
//               color="#999"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="••••••••"
//               placeholderTextColor="#999"
//               secureTextEntry={!showConfirm}
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               editable={!isLoading}
//             />
//             <TouchableOpacity
//               onPress={() => setShowConfirm(!showConfirm)}
//               style={styles.eyeIcon}
//             >
//               <Ionicons
//                 name={showConfirm ? "eye-outline" : "eye-off-outline"}
//                 size={20}
//                 color="#999"
//               />
//             </TouchableOpacity>
//           </View>
//           {errors.confirmPassword && (
//             <Text style={styles.errorText}>{errors.confirmPassword}</Text>
//           )}
//         </View>

//         {/* Sign Up Button */}
//         <TouchableOpacity
//           style={[styles.button, isLoading && styles.buttonDisabled]}
//           onPress={onSignUpPress}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Continue</Text>
//           )}
//         </TouchableOpacity>

//         {/* Sign In Link */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Already have an account? </Text>
//           <Link href="/(auth)/login">
//             <Text style={styles.footerLink}>Sign in</Text>
//           </Link>
//         </View>
//       </ScrollView>
//     );
//   }

//   // ===== VERIFICATION STEP =====
//   if (step === "verification") {
//     return (
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         <Image
//           source={require("@/assets/images/ug-logo.png")}
//           style={styles.logo}
//         />

//         <Text style={styles.title}>Verify Email</Text>
//         <Text style={styles.subtitle}>
//           We've sent a verification code to {emailAddress}
//         </Text>

//         <View style={styles.codeContainer}>
//           <Text style={styles.codeLabel}>Enter 6-digit code</Text>
//           <TextInput
//             style={styles.codeInput}
//             placeholder="000000"
//             placeholderTextColor="#CCC"
//             maxLength={6}
//             keyboardType="number-pad"
//             value={code}
//             onChangeText={setCode}
//             editable={!isLoading}
//           />
//           <Text style={styles.codeHint}>Check your email for the code</Text>
//         </View>

//         <TouchableOpacity
//           style={[styles.button, isLoading && styles.buttonDisabled]}
//           onPress={onVerifyPress}
//           disabled={isLoading || code.length !== 6}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Verify Email</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => setStep("form")}
//           style={styles.backButton}
//         >
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   }

//   // ===== ROLE SELECTION STEP =====
//   return (
//     <ScrollView
//       style={styles.scrollView}
//       contentContainerStyle={styles.container}
//       showsVerticalScrollIndicator={false}
//     >
//       <Image
//         source={require("@/assets/images/ug-logo.png")}
//         style={styles.logo}
//       />

//       <Text style={styles.title}>Choose Your Role</Text>
//       <Text style={styles.subtitle}>
//         Select how you want to use Urban Gravity
//       </Text>

//       {/* Tenant Option */}
//       <TouchableOpacity
//         style={[
//           styles.roleCard,
//           selectedRole === "TENANT" && styles.roleCardActive,
//         ]}
//         onPress={() => setSelectedRole("TENANT")}
//       >
//         <View style={styles.roleIcon}>
//           <Text style={styles.roleIconText}>🏠</Text>
//         </View>
//         <View style={styles.roleContent}>
//           <Text style={styles.roleTitle}>I'm Looking for a Home</Text>
//           <Text style={styles.roleDescription}>
//             Browse and find your perfect apartment
//           </Text>
//         </View>
//         <View
//           style={[
//             styles.roleCheckbox,
//             selectedRole === "TENANT" && styles.roleCheckboxActive,
//           ]}
//         >
//           {selectedRole === "TENANT" && (
//             <Ionicons name="checkmark" size={20} color="#F4B33D" />
//           )}
//         </View>
//       </TouchableOpacity>

//       {/* Landlord Option */}
//       <TouchableOpacity
//         style={[
//           styles.roleCard,
//           selectedRole === "LANDLORD" && styles.roleCardActive,
//         ]}
//         onPress={() => setSelectedRole("LANDLORD")}
//       >
//         <View style={styles.roleIcon}>
//           <Text style={styles.roleIconText}>🏢</Text>
//         </View>
//         <View style={styles.roleContent}>
//           <Text style={styles.roleTitle}>I'm a Landlord/Agent</Text>
//           <Text style={styles.roleDescription}>
//             List and manage your properties
//           </Text>
//         </View>
//         <View
//           style={[
//             styles.roleCheckbox,
//             selectedRole === "LANDLORD" && styles.roleCheckboxActive,
//           ]}
//         >
//           {selectedRole === "LANDLORD" && (
//             <Ionicons name="checkmark" size={20} color="#F4B33D" />
//           )}
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.button, isLoading && styles.buttonDisabled]}
//         onPress={onRoleSelect}
//         disabled={isLoading || !selectedRole}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Continue</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: "#fff",
//   },
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     justifyContent: "center",
//     minHeight: "100%",
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     alignSelf: "center",
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#000",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 32,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#f9f9f9",
//   },
//   inputError: {
//     borderColor: "#E74C3C",
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: "#000",
//   },
//   eyeIcon: {
//     padding: 8,
//     marginRight: -8,
//   },
//   errorText: {
//     fontSize: 12,
//     color: "#E74C3C",
//     marginTop: 4,
//   },
//   button: {
//     backgroundColor: "#F4B33D",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 16,
//     marginTop: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   footerLink: {
//     fontSize: 14,
//     color: "#F4B33D",
//     fontWeight: "700",
//   },
//   codeContainer: {
//     marginVertical: 32,
//   },
//   codeLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 12,
//   },
//   codeInput: {
//     fontSize: 32,
//     fontWeight: "700",
//     letterSpacing: 8,
//     textAlign: "center",
//     borderWidth: 2,
//     borderColor: "#F4B33D",
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     color: "#000",
//   },
//   codeHint: {
//     fontSize: 12,
//     color: "#999",
//     textAlign: "center",
//   },
//   backButton: {
//     alignItems: "center",
//     padding: 12,
//   },
//   backText: {
//     fontSize: 14,
//     color: "#F4B33D",
//     fontWeight: "600",
//   },
//   roleCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#E0E0E0",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: "#f9f9f9",
//   },
//   roleCardActive: {
//     borderColor: "#F4B33D",
//     backgroundColor: "#FFFBF0",
//   },
//   roleIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#F4B33D20",
//     justifyContent: "center",
//     alignItems: "center",
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
//     fontWeight: "700",
//     color: "#000",
//     marginBottom: 4,
//   },
//   roleDescription: {
//     fontSize: 13,
//     color: "#666",
//   },
//   roleCheckbox: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     borderWidth: 2,
//     borderColor: "#E0E0E0",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 12,
//   },
//   roleCheckboxActive: {
//     borderColor: "#F4B33D",
//     backgroundColor: "#F4B33D20",
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

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      Alert.alert(
        'Success',
        'Account created! Please check your email to confirm.'
      );
      router.push('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

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
        placeholder="Password (min 8 characters)"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});