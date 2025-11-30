import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../context/auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("user1@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  // Tự động điều hướng nếu đã login
  useEffect(() => {
    if (user && role) {
      console.log("Auto-redirect from login:", role);
      if (role === "admin") {
        router.replace("/(tabs)/admin");
      } else {
        router.replace("/(tabs)/user");
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
      // AuthContext sẽ tự động cập nhật và useEffect trên sẽ xử lý điều hướng
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
});