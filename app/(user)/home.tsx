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
      image: "https://static.vinwonders.com/production/2025/02/tong-hop-cac-nha-hang-view-dep-o-tphcm.jpg",
    },
    {
      id: 2,
      name: "Bàn B7 - Tầng 3",
      desc: "Bàn 6 người",
      image: "https://gofood.vn/upload/r/tong-hop-tin-tuc/kinh-nghiem-meo-hay/nha-hang-the-deck.jpg",
    },
    {
      id: 3,
      name: "Bàn B5",
      desc: "Bàn 2 người",
      image: "https://digiticket.vn/blog/wp-content/uploads/2021/04/nha-hang-view-dep-ho-tay-10.jpg",
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

    setFoods((data || []).slice(0, 5)); // chỉ lấy 5 món đầu
    setLoading(false);
  }

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      {/* Banner */}
      <Image
        style={styles.banner}
        source={{
          uri: "https://treobangron.com.vn/wp-content/uploads/2022/12/banner-quang-cao-nha-hang-32.jpg",
        }}
      />

      <View style={styles.bannerContent}>
        <Text style={styles.title}>Nhà hàng phong cách Á - Âu</Text>
        <Text style={styles.subtitle}>Không gian ấm cúng cho mỗi bữa tiệc</Text>
      </View>

      {/* Đặt bàn ngay */}
      <Link href="/" asChild>
        <View style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Đặt bàn ngay</Text>
        </View>
      </Link>

      {/* Chỗ ngồi nổi bật */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chỗ ngồi nổi bật</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {seats.map((seat) => (
            <SeatCard key={seat.id} item={seat} />
          ))}
        </ScrollView>
      </View>

      {/* Món ăn */}
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
        <Text style={styles.aboutDesc}>
          Nhà hàng phục vụ các món ăn Á – Âu với không gian ấm cúng.
        </Text>

        <View style={styles.aboutRow}>
          <Ionicons name="time-outline" size={20} color="#000" />
          <Text style={styles.aboutText}>Giờ mở cửa</Text>
        </View>

        <View style={styles.aboutRow}>
          <Ionicons name="call-outline" size={20} color="#000" />
          <Text style={styles.aboutText}>Hotline</Text>
        </View>

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
  aboutBox: {
    backgroundColor: "#f5f5f5",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  aboutTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  aboutDesc: { fontSize: 14, color: "#555", marginBottom: 12 },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aboutText: { marginLeft: 8, fontSize: 15, color: "#333" },
});
