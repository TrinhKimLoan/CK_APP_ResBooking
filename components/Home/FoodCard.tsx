import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SeatCard({ item }: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/",// Thêm để tới trang đặt bàn nha loan
          params: { table_id: item.id },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={{ marginTop: 6 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  desc: {
    color: "#777",
    fontSize: 13,
  },
});
