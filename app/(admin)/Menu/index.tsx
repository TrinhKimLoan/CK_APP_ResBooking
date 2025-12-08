// app/(admin)/menu/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import MenuCard from "@/components/Admin_menu/MenuCard";
import MenuModal from "@/components/Admin_menu/MenuModal";
import { supabase } from "@/lib/supabase";

export default function AdminMenuScreen() {
  const [menu, setMenu] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchMenu = async () => {
    const { data } = await supabase.from("menu").select("*").order("id");
    setMenu(data || []);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addOrUpdate = async (form: any) => {
    if (editItem) {
      await supabase.from("menu").update(form).eq("id", editItem.id);
    } else {
      await supabase.from("menu").insert([form]);
    }

    setModalVisible(false);
    setEditItem(null);
    fetchMenu();
  };

//   const deleteItem = async (id: number) => {
//     await supabase.from("menu").delete().eq("id", id);
//     fetchMenu();
//   };
const handleDelete = (id: number) => {
  Alert.alert(
    "Xác nhận xoá",
    "Bạn có chắc chắn muốn xoá món ăn này không?",
    [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => confirmDelete(id),
      },
    ]
  );
};

const confirmDelete = async (id: number) => {
  const { error } = await supabase.from("menu").delete().eq("id", id);
  if (error) {
    Alert.alert("Lỗi xoá", error.message);
    return;
  }
  setMenu((prev) => prev.filter((item) => item.id !== id));
  Alert.alert("Thành công", "Đã xoá món ăn.");
};

  const toggleActive = async (item: any) => {
    await supabase.from("menu").update({ active: !item.active }).eq("id", item.id);
    fetchMenu();
  };

  const filtered = menu.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Món Ăn</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.search}
          placeholder="Tìm kiếm món ăn"
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditItem(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addText}>+ Thêm món</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filtered.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onEdit={(i: any) => {
              setEditItem(i);
              setModalVisible(true);
            }}
            onDelete={handleDelete}
            onToggle={toggleActive}
          />
        ))}
      </ScrollView>

      <MenuModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addOrUpdate}
        defaultValue={editItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 15 },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  addBtn: {
    paddingHorizontal: 15,
    marginLeft: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
  },
  addText: { color: "#fff", fontWeight: "bold" },
});
