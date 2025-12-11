import { useEffect, useState } from "react";
import { View, ScrollView, TextInput, ActivityIndicator, StyleSheet } from "react-native";
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
    const { data, error } = await supabase
      .from("menu")
      .select("*");

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
    <ScrollView style={{ padding: 16, backgroundColor: "#fff" }}>
      <TextInput
        placeholder="Tìm món..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        filteredMenu.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
});
