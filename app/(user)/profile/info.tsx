import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Colors, Fonts } from '@/constants/theme';

export default function ProfileInfoScreen() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (data) {
        setName(data.full_name);
        setEmail(data.email);
        setPhone(data.phone);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    await supabase.rpc('user_update_profile', {
      p_full_name: name,
      p_email: email,
      p_phone: phone,
    });

    Alert.alert('Thành công', 'Cập nhật thông tin thành công');
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
            // NOTE: nếu bị chặn permission → hỏi Loan
            await supabase.auth.signOut();
            signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên tài khoản</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu thông tin</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Xóa tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  label: {
    fontFamily: Fonts.sans,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#f59e0b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
  },
});
