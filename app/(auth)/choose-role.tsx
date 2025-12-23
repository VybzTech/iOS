/***
 * 
 * 
 * 
 * import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuthContext } from '@/context/AuthContext';

const ROLES = [
  { id: 'TENANT', label: 'Looking for a place', icon: '🏠' },
  { id: 'LANDLORD', label: 'Renting out property', icon: '🏢' },
];

export default function ChooseRoleScreen() {
  const { selectRole } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectRole = async () => {
    if (!selectedRole) return;

    try {
      setLoading(true);
      setError('');
      await selectRole([selectedRole]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      <Text className="text-2xl font-bold mb-2">Who are you?</Text>
      <Text className="text-gray-600 mb-6">
        Tell us your role so we can customize your experience
      </Text>

      {error && (
        <View className="bg-red-100 p-3 rounded-lg mb-4">
          <Text className="text-red-800">{error}</Text>
        </View>
      )}

      <View className="gap-4 mb-8">
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role.id}
            onPress={() => setSelectedRole(role.id)}
            className={`p-4 rounded-lg border-2 ${
              selectedRole === role.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <Text className="text-3xl mb-2">{role.icon}</Text>
            <Text className="text-lg font-bold">{role.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSelectRole}
        disabled={!selectedRole || loading}
        className={`p-4 rounded-lg ${
          selectedRole ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold text-lg">
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
 */


// User selects their primary role
// ==========================================

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, SPACING, RADIUS } from '@/lib/constants';

type UserRole = 'TENANT' | 'LANDLORD' | 'AGENT';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'TENANT',
    title: 'I\'m Looking for a Home',
    description: 'Find and rent amazing properties',
    icon: '🏠',
    benefits: [
      'Browse verified properties',
      'Chat with landlords',
      'Secure rental agreements',
    ],
  },
  {
    id: 'LANDLORD',
    title: 'I\'m a Landlord',
    description: 'List and manage properties',
    icon: '🏢',
    benefits: [
      'List multiple properties',
      'Find qualified tenants',
      'Manage applications',
    ],
  },
  {
    id: 'AGENT',
    title: 'I\'m a Real Estate Agent',
    description: 'Represent landlords and properties',
    icon: '🤝',
    benefits: [
      'Manage client listings',
      'Commission tracking',
      'Advanced analytics',
    ],
  },
];

export default function ChooseRoleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRoleToggle = (roleId: UserRole) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleId)) {
        // Remove role
        return prev.filter((r) => r !== roleId);
      } else {
        // Add role (can select multiple, but primary is first)
        return [...prev, roleId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedRoles.length === 0) {
      Alert.alert('Error', 'Please select at least one role');
      return;
    }

    setLoading(true);
    try {
      // Store roles for next step
      // (Next step will be role-specific setup or basic-info)
      if (selectedRoles.includes('TENANT') && selectedRoles.length === 1) {
        // Go to tenant-specific setup
        router.push({
          pathname: '/(auth)/basic-info',
          params: { roles: JSON.stringify(selectedRoles) },
        });
      } else if (selectedRoles.includes('LANDLORD')) {
        // Go to landlord-specific setup (can add later)
        router.push({
          pathname: '/(auth)/basic-info',
          params: { roles: JSON.stringify(selectedRoles) },
        });
      } else {
        // Go to basic info
        router.push({
          pathname: '/(auth)/basic-info',
          params: { roles: JSON.stringify(selectedRoles) },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}
        >
          What brings you here?
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            marginBottom: SPACING.lg,
          }}
        >
          Select your role to get started. You can always change this later.
        </Text>
      </View>

      {/* Role Options */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {ROLE_OPTIONS.map((role) => {
          const isSelected = selectedRoles.includes(role.id);

          return (
            <TouchableOpacity
              key={role.id}
              onPress={() => handleRoleToggle(role.id)}
              style={{
                borderWidth: 2,
                borderColor: isSelected ? COLORS.primary : COLORS.border,
                borderRadius: RADIUS.lg,
                padding: SPACING.lg,
                marginBottom: SPACING.lg,
                backgroundColor: isSelected ? '#FFFCF0' : COLORS.background,
              }}
              activeOpacity={0.7}
            >
              {/* Icon and Title */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <Text style={{ fontSize: 32, marginRight: SPACING.md }}>{role.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: COLORS.text,
                      marginBottom: SPACING.xs,
                    }}
                  >
                    {role.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                    {role.description}
                  </Text>
                </View>
                {/* Checkbox */}
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: RADIUS.md,
                    borderWidth: 2,
                    borderColor: isSelected ? COLORS.primary : COLORS.border,
                    backgroundColor: isSelected ? COLORS.primary : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {isSelected && <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>✓</Text>}
                </View>
              </View>

              {/* Benefits */}
              <View style={{ marginLeft: 40 }}>
                {role.benefits.map((benefit, idx) => (
                  <Text
                    key={idx}
                    style={{
                      fontSize: 13,
                      color: COLORS.textSecondary,
                      marginBottom: idx < role.benefits.length - 1 ? SPACING.sm : 0,
                    }}
                  >
                    • {benefit}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.lg,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading || selectedRoles.length === 0}
          style={{
            backgroundColor: selectedRoles.length === 0 ? COLORS.border : COLORS.primary,
            paddingVertical: SPACING.md,
            borderRadius: RADIUS.md,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
          }}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.text} size="small" />
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: selectedRoles.length === 0 ? COLORS.textSecondary : '#000',
              }}
            >
              Continue
            </Text>
          )}
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            textAlign: 'center',
            marginTop: SPACING.md,
          }}
        >
          You can select multiple roles
        </Text>
      </View>
    </View>
  );
}