// components/MenuModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";
import { supabase } from "@/lib/supabase";

type MenuForm = {
  name: string;
  price: string; // dùng string cho TextInput
  description: string;
  img: string;   // URL ảnh (nếu có)
};

type MenuModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (form: MenuForm) => void;
  defaultValue?: {
    name: string;
    price: string | number;
    description: string;
    img: string;
  } | null;
};

export default function MenuModal({
  visible,
  onClose,
  onSubmit,
  defaultValue,
}: MenuModalProps) {
  const [form, setForm] = useState<MenuForm>({
    name: "",
    price: "",
    description: "",
    img: "",
  });

  const [uploading, setUploading] = useState(false);

  // Khi mở modal sửa → fill dữ liệu vào form
  useEffect(() => {
    if (defaultValue) {
      setForm({
        name: defaultValue.name ?? "",
        price: defaultValue.price !== undefined ? String(defaultValue.price) : "",
        description: defaultValue.description ?? "",
        img: defaultValue.img ?? "",
      });
    } else {
      // Modal ở chế độ thêm mới → reset form
      setForm({
        name: "",
        price: "",
        description: "",
        img: "",
      });
    }
  }, [defaultValue, visible]);

  // B1: Chọn ảnh (KHÔNG cắt, chọn xong là upload luôn)
  const pickImage = async () => {
    // xin quyền truy cập ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Ứng dụng cần quyền truy cập ảnh để tải hình.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: false, // không crop
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    await uploadImage(asset);
  };

  // B2: Upload ảnh lên Supabase Storage
  const uploadImage = async (asset: ImagePickerAsset) => {
    try {
      setUploading(true);

      // Lấy extension: ưu tiên fileName, fallback mimeType, cuối cùng "jpg"
      let ext = "jpg";

      if (asset.fileName && asset.fileName.includes(".")) {
        ext = asset.fileName.split(".").pop() || "jpg";
      } else if (asset.mimeType?.includes("/")) {
        ext = asset.mimeType.split("/")[1];
      }

      const fileName = `menu_${Date.now()}.${ext}`;

      // fetch uri → arrayBuffer
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("menu-images") // tên bucket BE tạo
        .upload(fileName, arrayBuffer, {
          contentType: asset.mimeType || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.log("Upload error:", uploadError);
        throw uploadError;
      }

      // Lấy public URL
      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      if (!data?.publicUrl) {
        throw new Error("Không lấy được URL ảnh sau khi upload.");
      }

      // Cập nhật vào form để preview + lưu DB
      setForm((prev) => ({ ...prev, img: data.publicUrl }));
    } catch (err: any) {
      console.log("Upload exception:", err);
      // KHÔNG gán ảnh mặc định ở đây, chỉ báo lỗi
      Alert.alert(
        "Lỗi upload ảnh!",
        err?.message || "Không thể tải ảnh lên. Bạn có thể lưu món không có hình, app sẽ dùng ảnh mặc định khi hiển thị."
      );
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (!form.name || !form.price) {
      Alert.alert("Thiếu thông tin", "Tên và giá là bắt buộc!");
      return;
    }

    // Không bắt buộc có img. Nếu img rỗng, MenuCard sẽ tự dùng ảnh mặc định.
    onSubmit(form);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {defaultValue ? "Sửa món ăn" : "Thêm món ăn mới"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Tên món ăn"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Giá"
            keyboardType="numeric"
            value={form.price}
            onChangeText={(t) => setForm({ ...form, price: t })}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Mô tả"
            multiline
            value={form.description}
            onChangeText={(t) => setForm({ ...form, description: t })}
          />

          {/* Nút chọn ảnh */}
          <TouchableOpacity
            style={[styles.uploadBtn, uploading && { opacity: 0.6 }]}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.uploadText}>
              {uploading ? "Đang upload ảnh..." : "Chọn ảnh"}
            </Text>
          </TouchableOpacity>

          {/* Chỉ preview nếu thực sự có URL ảnh */}
          {form.img ? (
            <Image source={{ uri: form.img }} style={styles.preview} />
          ) : null}

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.save} onPress={submit}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadBtn: {
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  uploadText: { color: "#fff", fontWeight: "600" },
  preview: { width: "100%", height: 150, marginTop: 10, borderRadius: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancel: {
    padding: 12,
    backgroundColor: "#aaa",
    flex: 1,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  save: {
    padding: 12,
    backgroundColor: "#28A745",
    flex: 1,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
