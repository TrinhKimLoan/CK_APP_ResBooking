import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#EC5A11";

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >

      <Tabs.Screen
        name="home"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create_order"
        options={{
          title: "Đặt bàn",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="his"
        options={{
          title: "Đơn của tôi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
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
