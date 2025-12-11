import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "@/lib/supabase";
import FoodCard from "@/components/Home/FoodCard";
import SeatCard from "@/components/Home/SeatCard";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const seats = [
    {
      id: 1,
      name: "Bàn B3 - Tầng 2",
      desc: "Bàn 4 người",
      image: "https://i.imgur.com/tVv8a7X.jpeg",
    },
    {
      id: 2,
      name: "Bàn B7 - Tầng 3",
      desc: "Bàn 6 người",
      image: "https://i.imgur.com/tVv8a7X.jpeg",
    },
    {
      id: 3,
      name: "Bàn B5",
      desc: "Bàn 2 người",
      image: "https://i.imgur.com/tVv8a7X.jpeg",
    },
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    const { data, error } = await supabase.from("menu").select("*");

    if (error) {
      console.error("Lỗi load menu:", error.message);
      return;
    }

    setFoods((data || []).slice(0, 3)); // Lấy 3 món đầu
    setLoading(false);
  }

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      {/* Banner */}
      <Image
        style={styles.banner}
        source={{ uri: "https://i.imgur.com/efQvJkW.jpeg" }}
      />

      <View style={styles.bannerContent}>
        <Text style={styles.title}>Nhà hàng phong cách Á - Âu</Text>
        <Text style={styles.subtitle}>Không gian ấm cúng cho mỗi bữa tiệc</Text>
      </View>

      <Link href="/" asChild> 
        <View style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Đặt bàn ngay</Text>
        </View>
      </Link>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chỗ ngồi nổi bật</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {seats.map((seat) => (
            <SeatCard key={seat.id} item={seat} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Các món ăn</Text>

        <Link href="/(user)/menu">
          <Text style={{ color: "#777" }}>Xem tất cả →</Text>
        </Link>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 16 }}
      >
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          foods.map((food) => <FoodCard key={food.id} item={food} />)
        )}
      </ScrollView>

      {/* Về chúng tôi */}
      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>Về chúng tôi</Text>

        <Text style={styles.aboutDesc}>Mô tả ngắn về nhà hàng....</Text>

        {/* Giờ mở cửa */}
        <View style={styles.aboutRow}>
          <Ionicons name="time-outline" size={20} color="#000" />
          <Text style={styles.aboutText}>Giờ mở cửa</Text>
        </View>

        {/* Hotline */}
        <View style={styles.aboutRow}>
          <Ionicons name="call-outline" size={20} color="#000" />
          <Text style={styles.aboutText}>Hotline</Text>
        </View>

        {/* Địa điểm */}
        <View style={styles.aboutRow}>
          <Ionicons name="location-outline" size={20} color="#000" />
          <Text style={styles.aboutText}>Địa điểm</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: { width: "100%", height: 220 },
  bannerContent: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { marginTop: 4, color: "#555" },
  section: { marginTop: 20, paddingLeft: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  sectionHeader: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  aboutBox: {
    backgroundColor: "#f5f5f5",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  aboutDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  bookBtn: {
  marginTop: 12,
  backgroundColor: "#f59e0b",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignSelf: "center",
},
  bookBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

    aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aboutText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
});
