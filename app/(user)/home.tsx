import { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
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
      image:
        "https://static.vinwonders.com/production/2025/02/tong-hop-cac-nha-hang-view-dep-o-tphcm.jpg",
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
    {
      id: 4,
      name: "Bàn B5 - Tầng 1",
      desc: "Bàn 3 người",
      image: "https://cdn.xanhsm.com/2025/01/ad86b5e4-nha-hang-quan-1-view-dep-6.jpg",
    },
    {
      id: 5,
      name: "Bàn b6 - Tầng 1",
      desc: "Bàn 6 người",
      image: "https://skylightnhatrang.com/wp-content/uploads/2024/08/nha-hang-view-dep-o-nha-trang-8.jpg",
    },
    {
      id: 6,
      name: "Bàn b3 - Tầng 2",
      desc: "Bàn 2 người",
      image: "https://digiticket.vn/blog/wp-content/uploads/2021/04/nha-hang-view-dep-ho-tay-10.jpg",
    },
  ];

  // ⭐ Slideshow logic
  const [slideIndex, setSlideIndex] = useState(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (slideIndex + 1) % seats.length;

      scrollRef.current?.scrollTo({
        x: nextIndex * 170, 
        animated: true,
      });

      setSlideIndex(nextIndex);
    }, 1500);

    return () => clearInterval(timer);
  }, [slideIndex]);

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    const { data, error } = await supabase.from("menu").select("*");

    if (error) {
      console.error("Lỗi load menu:", error.message);
      return;
    }

    setFoods((data || []).slice(0, 5)); 
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

      {/* CHỖ NGỒI NỔI BẬT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chỗ ngồi nổi bật</Text>

        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / 170
              );
              setSlideIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {seats.map((seat) => (
              <SeatCard key={seat.id} item={seat} />
            ))}
          </ScrollView>

          {/* Indicator */}
          <View style={styles.dotsContainer}>
            {seats.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  slideIndex === i && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
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
  banner: {
    width: "100%",
    height: 220,
  },
  bannerContent: {
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { marginTop: 4, color: "#555" },

  section: { marginTop: 20, paddingLeft: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600" },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#666",
  },

  sectionHeader: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bookBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  aboutBox: {
    backgroundColor: "#f5bd5c",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  aboutTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  aboutDesc: { fontSize: 14, color: "#555", marginBottom: 12 },
  aboutRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  aboutText: { marginLeft: 8, fontSize: 15, color: "#333" },
});
