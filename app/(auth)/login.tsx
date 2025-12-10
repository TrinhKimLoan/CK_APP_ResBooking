import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("user1@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const normalizeRole = (value?: string | null) => {
    if (!value) return "user";
    const normalized = value.trim().toLowerCase();
    if (normalized === "admin" || normalized === "user") {
      return normalized;
    }
    return normalized || "user";
  };

  // Tự động điều hướng nếu đã login
  useEffect(() => {
    const normalizedRole = role ? normalizeRole(role) : null;

    if (user && normalizedRole && pathname !== "/(auth)/login") {
      console.log("Auto-redirect from login:", normalizedRole);
      if (normalizedRole === "admin") {
        router.replace("/(admin)/orders-management");
      } else {
        router.replace("/(user)/home");
      }
    }
  }, [user, role]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    console.log("Attempting login with:", email);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
    } else {
      console.log("Login successful, waiting for auth state update...");
      const { data: userResult } = await supabase.auth.getUser();
      const userId = userResult?.user?.id;

      if (userId) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profile")
          .select("role")
          .eq("id", userId)
          .single();

        const destination = profileError
          ? "user"
          : normalizeRole(profile?.role);

        if (destination === "admin") {
          router.replace("/(admin)/orders-management");
        } else {
          router.replace("/(user)/home");
        }
      } else {
        router.replace("/(user)/home");
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholder="Enter your email"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholder="Enter your password"
      />

      <Button
        title={loading ? "Signing in..." : "Sign in"}
        onPress={handleLogin}
        disabled={loading}
      />

      {user ? (
        <View style={styles.switchWrapper}>
          <Text style={styles.switchText}>Bạn đang đăng nhập với tài khoản khác?</Text>
          <Button title="Đăng xuất" onPress={signOut} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20,
    backgroundColor: '#fff',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 30, 
    textAlign: "center" 
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 12, 
    marginBottom: 16, 
    borderRadius: 8,
    fontSize: 16,
  },
  switchWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  switchText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 8,
  },
});