// app/(user)/_layout.tsx
import { useAuth } from '@/context/auth';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

export default function UserLayout() {
  const { user, loading, role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (normalizedRole === 'admin') return <Redirect href="/(admin)/dashboard" />;

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e0e0e0',
      }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Trang Chủ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="menu" 
        options={{ 
          title: "Thực Đơn",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="reservations" 
        options={{ 
          title: "Đặt bàn",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="orders" 
        options={{ 
          title: "Đơn của tôi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}