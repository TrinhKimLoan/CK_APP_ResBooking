import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { useAuth } from "../context/auth";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Đợi navigation ready
    if (!navigationState?.key) return;
    if (loading) return;

    console.log("Index navigation - User:", user?.email, "Role:", role);

    if (!user) {
      console.log("Redirecting to login");
      router.replace("/login");
      return;
    }

    if (role) {
      console.log("Redirecting to:", role);
      if (role === "admin") {
        router.replace("/(tabs)/admin");
      } else {
        router.replace("/(tabs)/user");
      }
    }
  }, [loading, user, role, navigationState?.key]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}