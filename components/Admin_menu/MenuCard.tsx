import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const defaultDishImage = require("@/assets/app/default_food.png");

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  img?: string | null;
  active?: boolean;
};

type MenuCardProps = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onToggle: (item: MenuItem) => void;
};

export default function MenuCard({
  item,
  onEdit,
  onDelete,
}: MenuCardProps) {
  const imageSource = item.img
    ? { uri: item.img }
    : defaultDishImage;

  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/detail_food?id=${item.id}&role=admin`)}
    >
      <Image source={imageSource} style={styles.img} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>

        <Text
          style={styles.desc}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Mô tả: {item.description}
        </Text>

        <Text style={styles.price}>
          {formatPrice(item.price)} VND
        </Text>

        <View style={styles.row}>
          
          <TouchableOpacity onPress={() => onEdit(item)}>
            <Ionicons name="create-outline" size={22} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  img: { width: 90, height: 90, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  desc: { fontSize: 14, color: "#555" },
  price: { marginTop: 4, fontWeight: "600", color: "#007AFF" },
  row: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
    alignItems: "center",
    gap: 20,
  },
});
