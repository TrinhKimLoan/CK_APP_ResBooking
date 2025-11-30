import { View, Text } from "react-native";
import { useAuth } from "../../context/auth";
import { Redirect } from "expo-router";

export default function AdminScreen() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user || role !== "admin") {
    return <Redirect href="/(tabs)/user" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Admin Panel</Text>
      <Text>Welcome, Admin!</Text>
    </View>
  );
}