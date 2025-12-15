import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Confirm() {
  const params = useLocalSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const people = params.people ? Number(params.people) : 0;
  const dateStr = params.date as string | undefined;
  const hour = params.hour ? Number(params.hour) : 0;
  const minute = params.minute ? Number(params.minute) : 0;
  const tableId = params.tableId ? Number(params.tableId) : 0;
  const note = (params.note as string) || "";

  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Confirm params:", params);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
        // 1) Lấy user hiện tại
        const {
        data: { user },
        error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
        console.log("Auth error:", userError);
        return;
        }

        if (!user) {
        console.log("Không có user đăng nhập!");
        return;
        }
        setUserId(user.id);

        // 2) Query bảng user_profile bằng id (vì bảng dùng cột id = user.id)
        const { data: profile, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("id", user.id)  
        .single();

        if (error) {
        console.log("Lỗi lấy user_profile:", error.message);
        return;
        }

        // 3) Lưu vào state để hiển thị + insert order
        console.log("Đã load profile:", profile);
        setUserProfile(profile);

    } catch (err) {
        console.log("Lỗi load profile:", err);
    } finally {
        setLoading(false);
    }
    };

  const submitOrder = async () => {
    if (!dateStr) {
      alert("Thiếu ngày đặt!");
      return;
    }

    const arrive_date = dateStr; // yyyy-mm-dd (đã đúng format)
    const arrive_time = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:00`;

    const { data, error } = await supabase.rpc(
      "create_order_with_check",
      {
        p_user_id: userId,
        p_table_id: tableId,
        p_arrive_date: arrive_date,
        p_arrive_time: arrive_time,
        p_note: note || "",
        p_people: people,
      }
    );

    if (error) {
      alert(error.message);
      return;
    }

    if (data?.status === "failed") {
      alert(data.message);
      return;
    }

    if (data?.status === "success") {
      router.push({
        pathname: "/(user)/success",
        params: { orderId: data.order_id },
      });
    }
  };

  // Loading UI
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Đang tải thông tin...</Text>
      </View>
    );
  }

  // Validate params
  if (!dateStr || !people || !tableId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", fontSize: 18 }}>
          Dữ liệu truyền sang confirm bị thiếu!
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.btn}>
          <Text style={styles.btnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.popup}>
      <Text style={styles.header}>Thông tin đơn đặt chỗ</Text>

      <View style={styles.box}>
        <Text>Số người: {people}</Text>
        <Text>
          Thời gian: {new Date(dateStr).toLocaleDateString("vi-VN")} –{" "}
          {hour}:{minute.toString().padStart(2, "0")}
        </Text>
        <Text>Bàn: {tableId}</Text>
        <Text>Ghi chú: {note || "(Không có)"}</Text>
      </View>

      <Text style={styles.header}>Thông tin người đặt</Text>
      <View style={styles.box}>
        <Text>SĐT: {userProfile?.phone}</Text>
        <Text>Tên: {userProfile?.full_name}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={submitOrder}>
        <Text style={styles.btnText}>Xác nhận đặt bàn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 20,
  },
  box: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
  },
  btn: {
    marginTop: 40,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
