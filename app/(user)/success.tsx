import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function Success() {
  const { orderId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt bàn thành công!</Text>
      <Text>Mã đơn: {orderId}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/(user)/home")}
      >
        <Text style={styles.btnText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  btn: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
