import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function MenuScreen() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    const { data, error } = await supabase.from("menu").select("*");

    if (error) {
      console.error("Lỗi load menu:", error.message);
      return;
    }

    setMenu(data || []);
    setLoading(false);
  }

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thực đơn</Text>

      <TextInput
        placeholder="🔍 Tìm món..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredMenu.length === 0 ? (
        <Text style={styles.empty}>Không có món nào phù hợp.</Text>
      ) : (
        filteredMenu.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/detail_food",
                params: { id: item.id },
              })
            }
          >
            <Image
              source={
                item.img?.startsWith("http")
                  ? { uri: item.img }
                  : require("@/assets/app/default_food.png")
              }
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.price}>
                {Number(item.price).toLocaleString("vi-VN")} đ
              </Text>

              {item.description ? (
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  search: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  empty: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },

  /* CARD HIỂN THỊ 1 DÒNG */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 12,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "700", color: "#e63946" },
  desc: {
    marginTop: 6,
    fontSize: 13,
    color: "#777",
  },
});
