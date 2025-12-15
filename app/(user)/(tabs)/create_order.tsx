import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Table } from "@/types/database";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";

// Components
import PeopleCounter from "@/components/PeopleCounter";
import DateTimeSection from "@/components/DateTimeSection";
import AreaSelector from "@/components/AreaSelector";
import TableSection from "@/components/TableSection";
import NoteSection from "@/components/NoteSection";

// Hooks
import { useTables } from "@/hooks/useTables";
import { useFreeTables } from "@/hooks/useFreeTables";

export default function CreateBooking() {
  /* ================= STATE ================= */
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  /* ================= HOOKS ================= */
  const { tables, areas } = useTables();
  const { freeTableIds } = useFreeTables(selectedArea, date, hour, minute, selectedTableId);

  /* ================= EFFECTS ================= */
  
  // Set initial area when areas load
  useEffect(() => {
    if (areas.length > 0 && !selectedArea) {
      setSelectedArea(areas[0]);
    }
  }, [areas]);

  // Reset table if capacity is insufficient
  useEffect(() => {
    if (!selectedTableId) return;

    const table = tables.find(t => t.id === selectedTableId);
    if (table && table.capacity < people) {
      setSelectedTableId(null);
    }
  }, [people, selectedTableId, tables]);

  // Alert if people exceed max capacity
  useEffect(() => {
    if (!selectedArea) return;

    const filteredTables = tables.filter((t) => t.area === selectedArea);
    const freeTables = filteredTables.filter(t => freeTableIds.includes(t.id));

    if (freeTables.length === 0) return;

    const maxCapacity = Math.max(...freeTables.map(t => t.capacity));

    if (people > maxCapacity) {
      Alert.alert(
        "Thông báo",
        `Tại tầng này, bàn trống lớn nhất chỉ phục vụ tối đa ${maxCapacity} người. \n` +
        `Quý khách hãy thử chuyển sang các tầng khác hoặc liên hệ hotline: 0-xxx-xxx để được hỗ trợ ạ!`
      );
    }
  }, [people, tables, freeTableIds, selectedArea]);

  /* ================= HANDLERS ================= */
  const handleSubmit = () => {
    if (!selectedTableId) {
      Alert.alert("Thông báo", "Bạn phải chọn bàn trống");
      return;
    }

    router.push({
      pathname: "/(user)/confirm",
      params: {
        people: String(people),
        date: date.toLocaleDateString("en-CA"),
        hour: String(hour),
        minute: String(minute),
        tableId: String(selectedTableId),
        note,
      },
    });
  };

  const handleTableChange = (table: Table) => {
    setSelectedTableId(table.id);
  };

  /* ================= RENDER ================= */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Đơn đặt bàn</Text>

          {/* Thông tin đặt chỗ */}
          <Text style={styles.sectionTitle}>Thông tin đặt chỗ</Text>
          <PeopleCounter people={people} setPeople={setPeople} />

          {/* Ngày & Giờ */}
          <DateTimeSection
            date={date}
            hour={hour}
            minute={minute}
            setDate={setDate}
            setHour={setHour}
            setMinute={setMinute}
          />

          {/* Khu vực */}
          <Text style={styles.sectionTitle}>Khu vực (Tầng)</Text>
          <AreaSelector
            areas={areas}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          />

          {/* Bàn */}
          <TableSection
            tables={tables}
            selectedArea={selectedArea}
            freeTableIds={freeTableIds}
            selectedTableId={selectedTableId}
            people={people}
            onTableChange={handleTableChange}
          />

          {/* Ghi chú */}
          <NoteSection note={note} setNote={setNote} />

          {/* Nút tiếp tục */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2f2f2" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },
  submitBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});