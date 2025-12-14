import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Colors, Fonts } from '@/constants/theme';

export default function ProfileInfoScreen() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.full_name);
        setEmail(data.email);
        setPhone(data.phone);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await supabase.rpc('user_update_profile', {
        p_full_name: name,
        p_email: email,
        p_phone: phone,
      });

      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Sau khi xóa tài khoản, toàn bộ dữ liệu sẽ bị mất và không thể khôi phục. Bạn chắc chắn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;

            setLoading(true);
            try {
              // 1. Xóa row trong bảng user_profile
              await supabase.from('user_profile').delete().eq('id', user.id);

              // 2. Xóa user khỏi Supabase Auth
              await supabase.auth.admin.deleteUser(user.id); // cần key admin hoặc gọi function RPC ở backend

              // 3. Logout khỏi app
              signOut();

              Alert.alert('Thành công', 'Tài khoản đã được xóa');
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Xóa tài khoản thất bại');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Tên tài khoản</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveText}>{loading ? 'Đang lưu...' : 'Lưu thông tin'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount} disabled={loading}>
        <Text style={styles.deleteText}>Xóa tài khoản</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  label: {
    fontFamily: Fonts.sans,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
    fontFamily: Fonts.sans,
  },
  saveButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: Fonts.sans,
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Fonts.sans,
  },
});
