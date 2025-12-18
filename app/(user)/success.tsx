import { Accent } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Success() {
  const { orderId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt bàn thành công!</Text>
      <Text>Mã đơn: {orderId}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/(user)/(tabs)/his")}
      >
        <Text style={styles.btnText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  btn: {
    marginTop: 30,
    backgroundColor: Accent.base,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
