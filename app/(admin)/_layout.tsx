// app/(admin)/_layout.tsx
import { Accent } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

export default function AdminLayout() {
  const { user, role, loading } = useAuth();
  const normalizedRole = role?.toLowerCase();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (normalizedRole !== 'admin') return <Redirect href="/(user)/(tabs)/home" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#e5e7eb',
        },
        tabBarActiveTintColor: Accent.base,
        tabBarInactiveTintColor: '#6B7280',
        tabBarActiveBackgroundColor: '#FFFFFF',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="orders-management"
        options={{
          tabBarLabel: 'Quản lý nhà hàng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="table-management"
        options={{
          tabBarLabel: 'Quản lý sơ đồ bàn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu-management"
        options={{
          tabBarLabel: 'Quản lý Menu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}