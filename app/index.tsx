import { useEffect } from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function SplashScreen() {
  const router = useRouter();
  const { isSignedIn, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSignedIn) {
        router.replace("/(app)");
      } else {
        router.replace("/(auth)/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Image
        source={require("@/assets/images/ug-logo.png")}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
}
