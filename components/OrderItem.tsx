import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

type OrderStatus = 'approved' | 'pending' | 'declined';

const STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  approved: { label: "Đã duyệt", color: "#4CAF50" },
  pending: { label: "Chờ duyệt", color: "#FF9800" },
  declined: { label: "Đã hủy", color: "#F44336" },
};

const isExpired = (date: string, time: string) => {
  const arriveDateTime = new Date(`${date}T${time}`);
  return new Date() >= arriveDateTime;
};

export default function OrderItem({ item, onCancel }: any) {
  const statusInfo = STATUS_MAP[item.status as OrderStatus];
  const expired = isExpired(item.arrive_date, item.arrive_time);

  const handleCancelPress = () => {
    if (expired) {
      Alert.alert(
        "Không thể hủy",
        "Đơn đã đến hoặc đã quá thời gian sử dụng bàn."
      );
      return;
    }

    Alert.alert(
      "Xác nhận hủy đơn",
      "Bạn có chắc chắn muốn hủy đơn đặt bàn này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy đơn",
          style: "destructive",
          onPress: onCancel,
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* STATUS */}
      <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
        <Text style={styles.statusText}>{statusInfo.label}</Text>
      </View>

      <Text style={styles.title}>Đơn #{item.id}</Text>
      <Text>Ngày tạo: {new Date(item.created_at).toLocaleString()}</Text>
      <Text>Số người: {item.people}</Text>
      <Text>Bàn: {item.table_id}</Text>
      <Text>Ngày đến: {item.arrive_date}</Text>
      <Text>Giờ đến: {item.arrive_time}</Text>

      {item.notes ? <Text>Ghi chú: {item.notes}</Text> : null}

      {item.status === "approved" && (
        <TouchableOpacity
          style={[
            styles.cancelBtn,
            expired && { opacity: 0.5 },
          ]}
          onPress={handleCancelPress}
          disabled={expired}
        >
          <Text style={styles.cancelTxt}>
            {expired ? "Đã quá giờ cho phép hủy đơn" : "Hủy đơn"}
          </Text>
        </TouchableOpacity>
      )}
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

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  cancelBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  cancelTxt: {
    textAlign: "center",
    fontWeight: "600",
    color: "#D32F2F",
  },
});
