// app/(admin)/_layout.tsx
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLayout() {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (role !== 'admin') return <Redirect href="/(user)/home" />;

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#1a1a1a', // Dark theme for admin
        borderTopColor: '#333',
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#888',
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="menu-management" 
        options={{ 
          title: "Quản lý Menu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}