import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function OrderItem({ item, onCancel }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Đơn #{item.id}</Text>
      <Text>Ngày tạo: {new Date(item.created_at).toLocaleString()}</Text>
      <Text>Số người: {item.guests}</Text>
      <Text>Bàn: {item.table_id}</Text>
      <Text>Ngày đến: {item.arrive_date}</Text>
      <Text>Giờ đến: {item.arrive_time}</Text>
      {item.note ? <Text>Ghi chú: {item.note}</Text> : null}

      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelTxt}>Hủy đơn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  cancelBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 6,
  },
  cancelTxt: { textAlign: "center" },
});
