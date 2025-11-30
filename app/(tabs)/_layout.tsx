import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/auth';

export default function TabLayout() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* User tab - ai cũng xem được */}
      <Tabs.Screen 
        name="menu" 
        options={{ 
          title: "Trang Menu",
        }} 
      />
      
      {/* Admin menu tab - chỉ admin thấy */}
      <Tabs.Screen 
        name="admin-menu" 
        options={{ 
          title: "Thêm Món",
          href: role === "admin" ? "/(tabs)/admin-menu" : null,
        }} 
      />
      
      {/* Admin panel tab - chỉ admin thấy */}
      <Tabs.Screen 
        name="admin" 
        options={{ 
          title: "Admin Panel",
          href: role === "admin" ? "/(tabs)/admin" : null,
        }} 
      />
    </Tabs>
    
  );
}