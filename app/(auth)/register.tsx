import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    const minLength = /.{8,}/;
    const hasLetter = /[A-Za-z]/;
    const hasNumber = /[0-9]/;
    const hasSpecial = /[!@#$%]/;
    return minLength.test(pwd) && hasLetter.test(pwd) && hasNumber.test(pwd) && hasSpecial.test(pwd);
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Lỗi', 'Bạn cần đồng ý với điều khoản để đăng ký.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        'Lỗi mật khẩu',
        'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt (!@#$%).'
      );
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp(
        {
          email: email.trim().toLowerCase(),
          password,
          options: { data: { name, phone } },
        },
        { redirectTo: 'http://localhost' } // tránh auto-login
      );

      if (error) throw error;

      // Clear session nếu Supabase vẫn tự login
      await supabase.auth.signOut();

      Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.appName}>Tên App</Text>
      <Text style={styles.title}>Đăng ký</Text>
      <Text style={styles.welcome}>Chào mừng bạn đến với app “Tên App”!</Text>

      <Text style={styles.label}>Tên tài khoản</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên tài khoản"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
      />

      {/* Checkbox với dấu tick */}
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)}>
        <View style={styles.checkbox}>
          {agreeTerms && <Text style={styles.tick}>✔</Text>}
        </View>
        <Text style={styles.checkboxLabel}>
          Tôi đã đọc và đồng ý với chính sách bảo mật và điều khoản sử dụng
        </Text>
      </TouchableOpacity>

      {/* Nút đăng ký */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
      </TouchableOpacity>

      {/* Nút chuyển sang đăng nhập */}
      <View style={styles.registerContainer}>
        <Text>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.registerText}>Đăng nhập</Text>
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
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: Colors.light.tint, fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: { fontSize: 16, color: Colors.light.tint, fontWeight: 'bold' },
  checkboxLabel: { fontSize: 14, fontFamily: Fonts.sans, flex: 1, flexWrap: 'wrap' },
});
