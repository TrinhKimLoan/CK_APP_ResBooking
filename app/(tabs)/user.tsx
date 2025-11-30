import { View, Text } from "react-native";
import { useAuth } from "../../context/auth";
import { Redirect } from "expo-router";

export default function UserScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>User Dashboard</Text>
      <Text>Welcome, User!</Text>
    </View>
  );
}