import { Accent, Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChangePasswordScreen() {
  const { user, loading: authLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Kiểm tra từng điều kiện mật khẩu
  const isLongEnough = newPassword.length >= 8;
  const hasLetter = /[a-z]/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%]/.test(newPassword);

  const validatePassword = () => isLongEnough && hasLetter && hasUpper && hasNumber && hasSpecial;

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!validatePassword()) {
      Alert.alert(
        'Lỗi mật khẩu',
        'Mật khẩu mới phải ít nhất 8 ký tự, bao gồm chữ cái thường, chữ hoa, số và ký tự đặc biệt (!@#$%).'
      );
      return;
    }
    if (!user?.email) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }

    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng.');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        Alert.alert('Lỗi', updateError.message || 'Đã xảy ra lỗi.');
        return;
      }

      Alert.alert('Thành công', 'Mật khẩu đã được đổi thành công. Bạn vẫn đang đăng nhập.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={{ marginTop: 10, fontFamily: Fonts.sans, fontSize: 15 }}>Đang xử lý...</Text>
      </View>
    );
  }

  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    show: boolean,
    setShow: (val: boolean) => void,
    placeholder: string
  ) => (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={!show}
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={{ paddingHorizontal: 8 }}>
          <Ionicons name={show ? 'eye' : 'eye-off'} size={22} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPasswordRules = () => {
    const rules = [
      { label: 'Độ dài từ 8-12 ký tự bao gồm cả chữ cái và chữ số', passed: isLongEnough },
      { label: 'Có ít nhất 1 chữ cái in hoa', passed: hasUpper },
      { label: 'Chứa ký tự đặc biệt (!@#$%)', passed: hasSpecial },
    ];

    return (
      <View style={{ marginBottom: 15 }}>
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
      {renderPasswordInput('Mật khẩu hiện tại', currentPassword, setCurrentPassword, showCurrent, setShowCurrent, 'Nhập mật khẩu hiện tại')}
      {renderPasswordInput('Mật khẩu mới', newPassword, setNewPassword, showNew, setShowNew, 'Nhập mật khẩu mới')}
      {renderPasswordRules()}
      {renderPasswordInput('Xác nhận mật khẩu mới', confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, 'Xác nhận mật khẩu mới')}

      <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  label: {
    fontFamily: Fonts.sans,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Accent.light,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    paddingVertical: 12,
  },
  rulesTitle: {
    fontFamily: Fonts.sans,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
    color:'#555555ff',
  },
  button: {
    backgroundColor: Accent.base,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: Fonts.sans,
  },
});