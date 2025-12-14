import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { trpc } from '../../lib/trpc';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const updateMutation = trpc.auth.updateProfile.useMutation();
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState<'TENANT' | 'LANDLORD'>(user?.role || 'TENANT');

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        name,
        role,
      });
      Alert.alert('Success', 'Profile updated');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <Text style={styles.staticText}>{user?.email}</Text>

      <Text style={styles.label}>Role</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'TENANT' && styles.roleButtonActive]}
          onPress={() => setRole('TENANT')}
        >
          <Text style={[styles.roleText, role === 'TENANT' && styles.roleTextActive]}>
            Tenant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'LANDLORD' && styles.roleButtonActive]}
          onPress={() => setRole('LANDLORD')}
        >
          <Text style={[styles.roleText, role === 'LANDLORD' && styles.roleTextActive]}>
            Landlord
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdate}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.updateButtonText}>Update Profile</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  staticText: {
    fontSize: 16,
    padding: 12,
    color: '#666',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});