import { Tabs } from 'expo-router';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

export default function UserLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  // 🔥 Ẩn tab bar khi vào các màn hình phụ của profile
  const hideTabBar =
    pathname.startsWith('/profile/') && pathname !== '/profile';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          display: hideTabBar ? 'none' : 'flex', // 👈 QUAN TRỌNG
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang Chủ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: 'Thực Đơn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Trang cá nhân',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
