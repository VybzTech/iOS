import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { trpc } from "../../lib/trpc";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

export default function HomeScreen() {
  // const { signOut } = useAuth();
  const { data: user } = trpc.auth.me.useQuery();

  const handleSignOut = async () => {
    // await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {user?.name || "User"}!</Text>
      <Text style={styles.email}>Email: {user?.email}</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(app)/(tenant)/profile")}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
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
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
