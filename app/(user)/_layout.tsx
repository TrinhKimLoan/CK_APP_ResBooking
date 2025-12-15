// app/(user)/_layout.tsx
import { useAuth } from "@/context/auth";
import { Redirect, Stack } from "expo-router";

export default function UserLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Chưa login → về login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Confirm */}
      <Stack.Screen
        name="confirm"
        options={{
          headerShown: true,
          title: "Xác nhận đặt bàn",
        }}
      />
      <Stack.Screen name="success" />
    </Stack>
  );
}
