// app/(user)/_layout.tsx

import { useAuth } from "@/context/auth";
import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function UserLayout() {
  const { user, loading, role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Chưa login → về login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Bottom Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Các màn KHÔNG có bottom tab */}
      <Stack.Screen
        name="confirm"
        options={{
          headerShown: true,
          title: "Xác nhận đặt bàn",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          headerShown: true,
          title: "Xem menu",
        }}
      />
    </Stack>

  );
}
