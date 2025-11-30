// app/(user)/_layout.tsx
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UserLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

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
    </Tabs>
  );
}