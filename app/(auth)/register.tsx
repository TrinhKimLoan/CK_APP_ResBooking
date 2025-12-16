import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kiểm tra từng điều kiện mật khẩu
  const isLongEnough = password.length >= 8;
  const hasLetter = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%]/.test(password);

  const validatePassword = (pwd: string) => isLongEnough && hasLetter && hasUpper && hasNumber && hasSpecial;

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
        'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ cái thường, chữ hoa, số và ký tự đặc biệt (!@#$%).'
      );
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name, phone } },
      });

      if (error) throw error;

      await supabase.auth.signOut(); // Sign out nếu Supabase tự login

      Alert.alert('Đăng ký thành công', 'Vui lòng kiểm tra email để xác nhận trước khi đăng nhập.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordRules = () => {
    const rules = [
      { label: 'Độ dài từ 8-12 ký tự bao gồm cả chữ cái và chữ số', passed: isLongEnough },
      { label: 'Có ít nhất 1 chữ cái in hoa', passed: hasUpper },
      { label: 'Chứa ký tự đặc biệt (!@#$%)', passed: hasSpecial },
    ];

    return (
      <View style={{ marginBottom: 16 }}>
        {rules.map((rule, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: rule.passed ? 'green' : '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              {rule.passed && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'green' }} />}
            </View>
            <Text style={{ fontFamily: Fonts.sans, color: rule.passed ? 'green' : '#555', fontSize: 14 }}>
              {rule.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <Text style={styles.label}>Tên tài khoản</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nhập tên tài khoản" />

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
      {renderPasswordRules()}

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)}>
        <View style={styles.checkbox}>{agreeTerms && <Text style={styles.tick}>✔</Text>}</View>
        <Text style={styles.checkboxLabel}>
          Tôi đã đọc và đồng ý với chính sách bảo mật và điều khoản sử dụng
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
      </TouchableOpacity>

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
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontFamily: Fonts.sans },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500', fontFamily: Fonts.sans },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 15, fontFamily: Fonts.sans },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  inputPassword: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 15, fontFamily: Fonts.sans },
  eyeIcon: { position: 'absolute', right: 10 },
  loginButton: { backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: Fonts.sans },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: '#f59e0b', fontWeight: 'bold', fontFamily: Fonts.sans },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  tick: { fontSize: 16, color: '#f59e0b', fontWeight: 'bold' },
  checkboxLabel: { fontSize: 14, fontFamily: Fonts.sans, flex: 1, flexWrap: 'wrap' },
});
