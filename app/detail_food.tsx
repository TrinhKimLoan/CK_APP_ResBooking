import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/lib/supabase";

export default function DetailFood() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchDetail(Number(id));
  }, [id]);

  async function fetchDetail(foodId: number) {
    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .eq("id", foodId)
      .single();

    if (error) {
      console.log("Lỗi:", error);
      return;
    }

    setItem(data);
    setLoading(false);
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (!item)
    return (
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Text>Không tìm thấy món ăn</Text>
      </View>
    );

  // ⭐️ Kiểm tra ảnh hợp lệ — giống rule ở FoodCard
  const hasValidImage = item.img && item.img.startsWith("http");

  const imageSource = hasValidImage
    ? { uri: item.img }
    : require("@/assets/app/default_food.png"); // ảnh fallback

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 16 }}>
        <Text style={{ fontSize: 16 }}>← Quay lại</Text>
      </TouchableOpacity>

      <Image source={imageSource} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.price}>
          {Number(item.price).toLocaleString("vi-VN")} VND
        </Text>

        <Text style={styles.description}>
          {item.description || "Không có mô tả cho món ăn này."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
  },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f59e0b",
    marginVertical: 8,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
});
