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
  Alert
} from "react-native";
import { supabase } from "@/lib/supabase";
import MenuModal from "@/components/Admin_menu/MenuModal";
import { Ionicons } from "@expo/vector-icons";

export default function DetailFood() {
  const { id, role } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const isAdmin = role === "admin";

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

  const hasValidImage = item.img && item.img.startsWith("http");

  const imageSource = hasValidImage
    ? { uri: item.img }
    : require("@/assets/app/default_food.png");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff",marginTop:35}}>
      <ScrollView>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />

        </TouchableOpacity>

        <Image source={imageSource} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.name}</Text>
          </View>

          <Text style={styles.price}>
            Giá tiền: {Number(item.price).toLocaleString("vi-VN")} VND
          </Text>

          <Text style={styles.sectionTitle}>Mô tả món ăn</Text>

          <Text style={styles.description}>
            {item.description || "Không có mô tả cho món ăn này."}
          </Text>
        </View>
      </ScrollView>

      {/* sửa và xóa cho admin */}
      {isAdmin && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={[styles.btn, styles.editBtn]}
            onPress={() => setShowEdit(true)}
          >
            <Ionicons name="create-outline" size={22} color="#fff" />
            <Text style={styles.btnText}>Sửa món ăn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={() => {
              Alert.alert(
                "Xác nhận xoá",
                "Bạn có chắc chắn muốn xoá món ăn này không?",
                [
                  { text: "Hủy", style: "cancel" },
                  {
                    text: "Xoá",
                    style: "destructive",
                    onPress: async () => {
                      const { error } = await supabase
                        .from("menu")
                        .delete()
                        .eq("id", item.id);

                      if (error) {
                        Alert.alert("Lỗi xoá", error.message);
                        return;
                      }

                      Alert.alert("Thành công", "Đã xoá món ăn.", [
                        {
                          text: "OK",
                          onPress: () => router.replace("/(admin)/menu-management"),
                        },
                      ]);
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={22} color="#fff" />
            <Text style={styles.btnText}>Xóa món ăn</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal sửa */}
      <MenuModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        defaultValue={{
          name: item.name,
          price: item.price,
          description: item.description,
          img: item.img,
        }}
        onSubmit={async (form) => {
        const { error } = await supabase
          .from("menu")
          .update({
            name: form.name,
            price: Number(form.price),
            description: form.description,
            img: form.img,
          })
          .eq("id", item.id);

        if (error) {
          Alert.alert("Lỗi", "Không thể cập nhật món ăn!");
          return;
        }

        setShowEdit(false);

        Alert.alert("Thành công", "Đã lưu thay đổi món ăn!");

        fetchDetail(item.id); // load lại dữ liệu
      }}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
  },

  backBtn: {
    position: "absolute",
    top: 15,
    left: 10,
    zIndex: 10,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#f59e0b",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },

  content: { padding: 16 },

  adminActions: {
    position: "absolute",
    bottom: 45,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 6,
    gap: 6,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  editBtn: { backgroundColor: "#007AFF" },
  deleteBtn: { backgroundColor: "#FF3B30" },

  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 24, fontWeight: "700", flex: 1 },

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
