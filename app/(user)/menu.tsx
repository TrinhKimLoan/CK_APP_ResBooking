import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { supabase } from "@/lib/supabase";
import FoodCard from "@/components/Home/FoodCard";

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
        placeholder="Tìm món..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredMenu.length === 0 ? (
        <Text style={styles.empty}>Không có món nào phù hợp.</Text>
      ) : (
        filteredMenu.map((item) => <FoodCard key={item.id} item={item} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  search: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  empty: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});
