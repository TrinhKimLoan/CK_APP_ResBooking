import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=Nguyen+Van+A' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Nguyễn Văn A</Text>
        <Text style={styles.email}>vana@gmail.com</Text>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        <ProfileItem
          label="Thông tin tài khoản"
          onPress={() => router.push('/(user)/profile/info')}
        />
        <ProfileItem
          label="Trung tâm trợ giúp"
          onPress={() => router.push('/(user)/profile/help-center')}
        />
        <ProfileItem
          label="Điều khoản & chính sách"
          onPress={() => router.push('/(user)/profile/privacy-policy')}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{label}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
  },

  email: {
    fontSize: 14,
    color: '#666',
    fontFamily: Fonts.sans,
  },

  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 30,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  itemText: {
    fontSize: 16,
    fontFamily: Fonts.sans,
  },

  arrow: {
    fontSize: 22,
    color: '#999',
  },

  logoutButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
  },
});
