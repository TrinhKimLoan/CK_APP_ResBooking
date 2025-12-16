import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function FoodCard({ item }: any) {
  const img = item?.img ?? "";
  const hasValidImage = typeof img === "string" && img.startsWith("http");

  const fallback = require("@/assets/app/default_food.png");

  const imageSource = hasValidImage ? { uri: img } : fallback;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/detail_food?id=${item.id}`)}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.price}>
          Giá: {Number(item.price).toLocaleString("vi-VN")} VND
        </Text>
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
    width: 250,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    flexWrap: "wrap",
    width: "100%",
  },

  price: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
  },
});
