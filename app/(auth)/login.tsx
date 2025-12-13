import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto redirect nếu đã login
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(user)/home');
      }
    }
  }, [user, role]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      Alert.alert('Đăng nhập thất bại', error.message);
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.appName}>Reserva</Text>
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.welcome}>Chào mừng bạn đến với app Reserva!</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email của bạn"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />

      {/* Nút Đăng nhập */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Text>
      </TouchableOpacity>

      {/* Nút Đăng ký ngay */}
      <View style={styles.registerContainer}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: Colors.light.background },
  appName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontFamily: Fonts.sans },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontFamily: Fonts.sans },
  welcome: { fontSize: 16, textAlign: 'center', marginBottom: 30, fontFamily: Fonts.sans },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500', fontFamily: Fonts.sans },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 16, fontFamily: Fonts.sans },
  loginButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: Colors.light.tint, fontWeight: 'bold' },
});
