import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import MenuCard from "@/components/Admin_menu/MenuCard";
import MenuModal from "@/components/Admin_menu/MenuModal";
import { supabase } from "@/lib/supabase";

export default function AdminMenuScreen() {
  const [menu, setMenu] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Load danh sách từ DB
  const fetchMenu = async () => {
    const { data } = await supabase.from("menu").select("*").order("id");
    setMenu(data || []);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [])
  );

 
 // Thêm hoặc sửa món
const addOrUpdate = async (form: any) => {
  if (editItem) {
    // Sửa món
    const { error } = await supabase
      .from("menu")
      .update(form)
      .eq("id", editItem.id);

    if (error) {
      Alert.alert("Lỗi", "Không thể cập nhật món ăn!");
      return;
    }

    Alert.alert("Thành công", "Cập nhật món ăn thành công!");
  } else {
    // Thêm món mới
    const { error } = await supabase.from("menu").insert([form]);

    if (error) {
      Alert.alert("Lỗi", "Không thể thêm món ăn!");
      return;
    }

    Alert.alert("Thành công", "Thêm món ăn thành công!");
  }

  setModalVisible(false);
  setEditItem(null);
  fetchMenu(); // reload danh sách
};

  // Xóa có confirm
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

  // Lọc theo tìm kiếm
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
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20 
  },
  row: {
    flexDirection: "row",
    marginBottom: 15 
  },
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
