import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { useAuth } from "../context/auth";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    if (loading) return;

    console.log("Redirector - User:", user?.email, "Role:", role);

    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (role) {
      if (role === "admin") {
        router.replace("/(admin)/dashboard");
      } else {
        router.replace("/(user)/home");
      }
    }
  }, [loading, user, role, navigationState?.key]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}