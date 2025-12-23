/**
 * 
 * // mobile/src/app/(auth)/basic-info.tsx
// ==========================================
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuthContext } from '@/context/AuthContext';

export default function BasicInfoScreen() {
  const { completeOnboarding, user } = useAuthContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    if (!firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await completeOnboarding({
        firstName,
        lastName,
        roles: user?.roles || ['TENANT'],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      <Text className="text-2xl font-bold mb-2">Tell us about yourself</Text>
      <Text className="text-gray-600 mb-6">
        We need some basic information to get started
      </Text>

      {error && (
        <View className="bg-red-100 p-3 rounded-lg mb-4">
          <Text className="text-red-800">{error}</Text>
        </View>
      )}

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        className="border border-gray-300 rounded-lg p-3 mb-3"
        editable={!loading}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        className="border border-gray-300 rounded-lg p-3 mb-8"
        editable={!loading}
      />

      <TouchableOpacity
        onPress={handleComplete}
        disabled={loading || !firstName || !lastName}
        className={`p-4 rounded-lg ${
          firstName && lastName ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold text-lg">
            Complete Onboarding
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
 
 * 
 * 
 */



// Collect user's basic information
// ==========================================

import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/hooks/useAuth";
import { COLORS, SPACING, RADIUS } from "@/lib/constants";

interface Interest {
  id: string;
  name: string;
  emoji: string;
}

const AVAILABLE_INTERESTS: Interest[] = [
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "fitness", name: "Fitness", emoji: "💪" },
  { id: "cooking", name: "Cooking", emoji: "🍳" },
  { id: "reading", name: "Reading", emoji: "📚" },
  { id: "music", name: "Music", emoji: "🎵" },
  { id: "gaming", name: "Gaming", emoji: "🎮" },
  { id: "art", name: "Art", emoji: "🎨" },
  { id: "sports", name: "Sports", emoji: "⚽" },
  { id: "movies", name: "Movies", emoji: "🎬" },
  { id: "photography", name: "Photography", emoji: "📸" },
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export default function BasicInfoScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  // const params = useLocalSearchParams();
  // const roles = JSON.parse((params.roles as string) || '["TENANT"]');
  const roles = ["TENANT"];

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [nin, setNin] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Validation
  const isFormValid =
    firstName.trim() && lastName.trim() && dateOfBirth && gender;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      // Check age (must be 18+)
      const age = new Date().getFullYear() - selectedDate.getFullYear();
      if (age < 18) {
        Alert.alert("Age Requirement", "You must be at least 18 years old");
        return;
      }
      setDateOfBirth(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleComplete = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding(
        firstName,
        lastName,
        roles
        // Could add interests to user metadata here if needed
      );

      // Navigate to app
      router.replace("/(app)/home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.xl,
          paddingBottom: SPACING.lg,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}
        >
          Tell us about yourself
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
          This info will appear on your profile
        </Text>
      </View>

      {/* Form */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* First Name */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            First Name <Text style={{ color: COLORS.error }}>*</Text>
          </Text>
          <TextInput
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.md,
              fontSize: 16,
              color: COLORS.text,
            }}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Last Name */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            Last Name <Text style={{ color: COLORS.error }}>*</Text>
          </Text>
          <TextInput
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.md,
              fontSize: 16,
              color: COLORS.text,
            }}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Date of Birth */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            Date of Birth <Text style={{ color: COLORS.error }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.md,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: dateOfBirth ? COLORS.text : COLORS.textSecondary,
              }}
            >
              {dateOfBirth
                ? dateOfBirth.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Select date"}
            </Text>
            <Text style={{ fontSize: 18 }}>📅</Text>
          </TouchableOpacity>
          {dateOfBirth && (
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginTop: SPACING.sm,
              }}
            >
              Age: {calculateAge(dateOfBirth)}
            </Text>
          )}
        </View>

        {/* Gender */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            Gender <Text style={{ color: COLORS.error }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowGenderModal(true)}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.md,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: gender ? COLORS.text : COLORS.textSecondary,
              }}
            >
              {gender || "Select gender"}
            </Text>
            <Text style={{ fontSize: 18 }}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* NIN (Optional) */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            NIN (Optional) - for verification
          </Text>
          <TextInput
            placeholder="11 characters"
            value={nin}
            onChangeText={setNin}
            maxLength={11}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.md,
              fontSize: 16,
              color: COLORS.text,
            }}
            placeholderTextColor={COLORS.textSecondary}
          />
          <Text
            style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              marginTop: SPACING.sm,
            }}
          >
            Your National ID Number helps us verify your identity
          </Text>
        </View>

        {/* Interests (Optional) */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: SPACING.md,
            }}
          >
            Your Interests (Optional)
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: SPACING.sm,
            }}
          >
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  onPress={() => handleInterestToggle(interest.id)}
                  style={{
                    borderWidth: 1,
                    borderColor: isSelected ? COLORS.primary : COLORS.border,
                    borderRadius: RADIUS.lg,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    backgroundColor: isSelected ? "#FFFCF0" : COLORS.background,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: SPACING.sm,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{interest.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: isSelected ? COLORS.text : COLORS.textSecondary,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {interest.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer - Complete Button */}
      <View
        style={{
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.lg,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          onPress={handleComplete}
          disabled={!isFormValid || loading}
          style={{
            backgroundColor:
              isFormValid && !loading ? COLORS.primary : COLORS.border,
            paddingVertical: SPACING.md,
            borderRadius: RADIUS.md,
            alignItems: "center",
            justifyContent: "center",
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
                fontWeight: "600",
                color: isFormValid ? "#000" : COLORS.textSecondary,
              }}
            >
              Complete Registration
            </Text>
          )}
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            textAlign: "center",
            marginTop: SPACING.md,
          }}
        >
          Fields marked with * are required
        </Text>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date(2000, 0, 1)}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 18))
          }
        />
      )}

      {/* Gender Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.background,
              paddingVertical: SPACING.lg,
              borderTopLeftRadius: RADIUS.xl,
              borderTopRightRadius: RADIUS.xl,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: SPACING.lg,
                color: COLORS.text,
              }}
            >
              Select Gender
            </Text>

            {GENDERS.map((genderOption) => (
              <TouchableOpacity
                key={genderOption}
                onPress={() => {
                  setGender(genderOption);
                  setShowGenderModal(false);
                }}
                style={{
                  paddingVertical: SPACING.md,
                  paddingHorizontal: SPACING.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        gender === genderOption ? COLORS.primary : COLORS.text,
                      fontWeight: gender === genderOption ? "600" : "400",
                    }}
                  >
                    {genderOption}
                  </Text>
                  {gender === genderOption && (
                    <Text style={{ fontSize: 20, color: COLORS.primary }}>
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowGenderModal(false)}
              style={{
                marginTop: SPACING.lg,
                paddingVertical: SPACING.md,
                marginHorizontal: SPACING.lg,
                backgroundColor: COLORS.surface,
                borderRadius: RADIUS.md,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: COLORS.text }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
