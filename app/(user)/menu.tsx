import { Accent } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.title}>Thực đơn</Text>

      <TextInput
        placeholder="Tìm kiếm món ăn..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView style={styles.list}>
        {loading ? (
          <ActivityIndicator size="large" color={Accent.base} />
        ) : filteredMenu.length === 0 ? (
          <Text style={styles.empty}>Không có món nào phù hợp.</Text>
        ) : (
          filteredMenu.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
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
                  Giá tiền: {Number(item.price).toLocaleString("vi-VN")} đ
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center",
  },

  search: {
    borderWidth: 1,
    borderColor: Accent.light,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,      
    fontSize: 15,
  },

  list: {
    marginTop: 5,
  },

  empty: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Accent.light,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,

    gap: 12,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },

  price: { fontSize: 15, fontWeight: "700", color: Accent.base },

  desc: { marginTop: 4, fontSize: 13, color: "#777" },
});
