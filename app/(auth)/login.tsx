import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace("/(app)/home");
    } catch (error: any) {
      Alert.alert(
        "Sign In Error",
        error.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Alert.alert(
      //   "Attempting Google Sign In")
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(
        "Google Sign In Error",
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return <ScrollView
    style={styles.scrollView}
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >
    {/* Logo */}
    <Image
      source={require("@/assets/images/ug-logo.png")}
      style={styles.logo}
    />
    <Text style={styles.title}>Welcome Back</Text>
    <Text style={styles.subtitle}>Sign in to your account</Text>
    {/* Email Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Email Address</Text>
      <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#999"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="you@example.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          editable={!loading}
          keyboardType="email-address"
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </View>
    {/* Password Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Password</Text>
      <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#999"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
    </View>
    {/* Forgot Password Link */}
    <TouchableOpacity>
      <Text style={styles.forgotLink}>Forgot password?</Text>
    </TouchableOpacity>
    {/* Sign In Button */}
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
    {/* Divider */}
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>Or continue with</Text>
      <View style={styles.dividerLine} />
    </View>
    {/* Google Button */}
    <TouchableOpacity
      style={styles.socialButton}
      onPress={handleGoogleLogin}
      disabled={loading}
    >
      <Ionicons name="logo-google" size={20} color="#000" />
      <Text style={styles.socialText}>Google</Text>
    </TouchableOpacity>
    {/* Sign Up Link */}
    <View style={styles.footer}>
      <Text style={styles.footerText}>Don't have an account? </Text>
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.footerLink}>Sign up</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    minHeight: "100%",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#E74C3C",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    fontSize: 12,
    color: "#E74C3C",
    marginTop: 4,
  },
  forgotLink: {
    fontSize: 14,
    color: "#F4B33D",
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#F4B33D",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#999",
  },
  socialButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  footerLink: {
    fontSize: 14,
    color: "#F4B33D",
    fontWeight: "700",
  },
});



/* import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signUpWithEmail(email, password);
      router.push('/(auth)/choose-role');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      <Text className="text-3xl font-bold mb-8 text-center">Welcome</Text>

      {error && (
        <View className="bg-red-100 p-3 rounded-lg mb-4">
          <Text className="text-red-800">{error}</Text>
        </View>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-lg p-3 mb-3"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded-lg p-3 mb-4"
        editable={!loading}
      />

      <TouchableOpacity
        onPress={handleEmailLogin}
        disabled={loading}
        className="bg-blue-600 p-3 rounded-lg mb-4"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">
            Sign In with Email
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        disabled={loading}
        className="bg-gray-200 p-3 rounded-lg"
      >
        <Text className="text-center font-bold">Sign In with Google</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



*/