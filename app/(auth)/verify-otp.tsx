// import { View, Text } from 'react-native';

// export default function VerifyOTPScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Verify OTP Screen (Coming Soon)</Text>
//     </View>
//   );
// }
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
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';

export default function OTPScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { phone } = route.params as { phone: string };
  const { verifyPhoneOTP } = useAuth();

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneOTP(phone, otp);
      router.replace('/(app)/home');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Phone</Text>
      <Text style={styles.subtitle}>
        We've sent an OTP to {phone}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        editable={!loading}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Didn't receive OTP? Resend</Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
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