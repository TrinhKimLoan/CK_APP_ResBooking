import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function FoodCard({ item, onPress }: any) {
  // RULE: nếu img hợp lệ thì dùng img, không thì dùng asset
  const hasValidImage = item.img && item.img.startsWith("http");

  const imageSource = hasValidImage
    ? { uri: item.img }
    : require("@/assets/app/default_food.png"); // ảnh từ asset

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {Number(item.price).toLocaleString("vi-VN")} VND
        </Text>

        {onPress && (
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={{ fontSize: 13 }}>Xem chi tiết</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "600" },
  price: { marginVertical: 6, color: "#444" },
  btn: {
    marginTop: 4,
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});
