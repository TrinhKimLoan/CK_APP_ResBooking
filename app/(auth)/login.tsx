import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && role) {
      if (role === 'admin') router.replace('/(admin)/dashboard');
      else router.replace('/(user)/home');
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
      if (error.message.includes('Email not confirmed')) {
        Alert.alert('Lỗi', 'Email chưa được xác nhận. Vui lòng check email.');
      } else {
        Alert.alert('Đăng nhập thất bại', error.message);
      }
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.appName}>BookRestaurant</Text>
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.welcome}>Chào mừng bạn đến với BookRestaurant!</Text>

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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ alignSelf: 'flex-end', marginBottom: 20 }}
        onPress={() => router.push('/(auth)/forgot-password')}
      >
        <Text style={{ color: '#f59e0b', fontWeight: '500' }}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>

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
  appName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontFamily: Fonts.sans, color: '#f59e0b' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontFamily: Fonts.sans },
  welcome: { fontSize: 16, textAlign: 'center', marginBottom: 30, fontFamily: Fonts.sans },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500', fontFamily: Fonts.sans },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 16, fontFamily: Fonts.sans },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  inputPassword: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, fontFamily: Fonts.sans },
  eyeIcon: { position: 'absolute', right: 10 },
  loginButton: { backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: '#f59e0b', fontWeight: 'bold' },
});
