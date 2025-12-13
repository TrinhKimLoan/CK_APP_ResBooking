import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import OrderItem from "../../components/OrderItem";

export default function BookingScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id: number) => {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", id);
    fetchOrders();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(user)/create")}
      >
        <Text style={styles.createText}>+ Tạo đơn đặt bàn</Text>
      </TouchableOpacity>

      <FlatList
        data={orders}
        refreshing={loading}
        onRefresh={fetchOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderItem item={item} onCancel={() => cancelOrder(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  createButton: {
    backgroundColor: "#EC5A11",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  createText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
});
