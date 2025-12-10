// app/(admin)/_layout.tsx
import { useAuth } from '@/context/auth';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

export default function AdminLayout() {
  const { user, role, loading } = useAuth();
  const normalizedRole = role?.toLowerCase();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (normalizedRole !== 'admin') return <Redirect href="/(user)/home" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
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
    </Tabs>
  );
}