import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function FoodCard({ item }: any) {
  const hasValidImage = item.img && item.img.startsWith("http");

  const imageSource = hasValidImage
    ? { uri: item.img }
    : require("@/assets/app/default_food.png");

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
        pathname: "/detail_food",
        params: { id: item.id },
        })
      }
    >
      <Image source={imageSource} style={styles.image} />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {Number(item.price).toLocaleString("vi-VN")} VND
        </Text>

        <View style={styles.btn}>
          <Text style={{ fontSize: 13 }}>Xem chi tiết</Text>
        </View>
      </View>
    </TouchableOpacity>
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
