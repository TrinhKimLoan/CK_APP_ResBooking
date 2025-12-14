import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('user_profile')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const image = result.assets[0];
    uploadAvatar(image.uri);
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await supabase
        .from('user_profile')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: data.publicUrl } : prev
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handlePickAvatar}>
          <Image
            source={{
              uri:
                profile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}`,
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {uploading && (
          <Text style={styles.uploading}>Đang cập nhật ảnh...</Text>
        )}

        <Text style={styles.name}>
          {profile?.full_name || 'Người dùng'}
        </Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        <ProfileItem
          label="Thông tin tài khoản"
          onPress={() => router.push('/(user)/profile/info')}
        />
        <ProfileItem
          label="Đổi mật khẩu"
          onPress={() => router.push('/(user)/profile/change-password')}
        />
        <ProfileItem
          label="Trung tâm trợ giúp"
          onPress={() => router.push('/(user)/profile/help-center')}
        />
        <ProfileItem
          label="Điều khoản & chính sách bảo mật"
          onPress={() => router.push('/(user)/profile/privacy-policy')}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

function ProfileItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
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

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  uploading: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
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
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
},
});
