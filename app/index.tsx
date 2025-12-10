import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/auth";

export default function Index() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    if (loading) return;

    console.log("Redirector - User:", user?.email, "Role:", role);

    const normalizedRole = role?.toLowerCase();

    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (normalizedRole) {
      if (normalizedRole === "admin") {
        router.replace("/(admin)/orders-management");
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