import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Table } from "@/types/database";
import { router } from "expo-router";
import TableGrid from "@/components/TableGrid";
import TimeWheel from "@/components/TimeWheel";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateBooking() {
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  const [showDate, setShowDate] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [tables, setTables] = useState<Table[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    const { data, error } = await supabase.from("tables").select("*");

    if (!error && data) {
      setTables(data);

      const uniqueAreas = [...new Set(data.map((t) => t.area))];
      setAreas(uniqueAreas);
      setSelectedArea(uniqueAreas[0] || null);
    }
  };

  const handleSubmit = () => {
    if (!selectedTable) {
      alert("Bạn phải chọn bàn");
      return;
    }

    router.push({
      pathname: "/(user)/confirm",
      params: {
        people: String(people),
        date: date.toISOString(),
        hour: String(hour),
        minute: String(minute),
        tableId: String(selectedTable),
        note,
      },
    });
  };

  const filteredTables = tables.filter((t) => t.area === selectedArea);

  return (
    <>
      {/* MAIN SCROLL SCREEN — FIX TOUCH 100% */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Đơn đặt bàn</Text>

          {/* Số người */}
          <Text style={styles.sectionTitle}>Thông tin đặt chỗ</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Số người:</Text>

            <View style={styles.counterBox}>
              <TouchableOpacity
                onPress={() => setPeople((p) => Math.max(1, p - 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.peopleText}>{people}</Text>

              <TouchableOpacity
                onPress={() => setPeople((p) => p + 1)}
                style={styles.counterBtn}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ngày */}
          <Text style={styles.sectionTitle}>Ngày đặt</Text>

          <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateBox}>
            <Text style={styles.dateText}>{date.toLocaleDateString("vi-VN")}</Text>
          </TouchableOpacity>

          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={(e, selected) => {
                setShowDate(false);
                if (selected) setDate(selected);
              }}
            />
          )}

          {/* Giờ */}
          <Text style={styles.sectionTitle}>Giờ đến</Text>

          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.dateBox}
          >
            <Text style={styles.dateText}>
              {hour.toString().padStart(2, "0")}:
              {minute.toString().padStart(2, "0")}
            </Text>
          </TouchableOpacity>

          {/* POPUP GIỜ */}
          <Modal visible={showTimePicker} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TimeWheel
                  hour={hour}
                  minute={minute}
                  onHourChange={setHour}
                  onMinuteChange={setMinute}
                />

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Xong</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Khu vực */}
          <Text style={styles.sectionTitle}>Khu vực</Text>

          <View style={styles.areaRow}>
            {areas.map((area) => (
              <TouchableOpacity
                key={area}
                style={[
                  styles.areaBtn,
                  selectedArea === area && styles.areaBtnActive,
                ]}
                onPress={() => setSelectedArea(area)}
              >
                <Text
                  style={[
                    styles.areaText,
                    selectedArea === area && styles.areaTextActive,
                  ]}
                >
                  {area}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* BÀN — GIỜ TOUCHABLE HOẠT ĐỘNG */}
          <Text style={styles.sectionTitle}>Chọn bàn</Text>

          <TableGrid
            tables={filteredTables}
            selectedTableId={selectedTable}
            onChange={(t) => setSelectedTable(t.id)}
          />

          {selectedTable && (
            <Text style={styles.selectedInfo}>
              Bạn đã chọn:{" "}
              {tables.find((x) => x.id === selectedTable)?.name} –{" "}
              {tables.find((x) => x.id === selectedTable)?.capacity} người
            </Text>
          )}

          {/* Ghi chú */}
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Nhập ghi chú"
            value={note}
            onChangeText={setNote}
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2f2f2" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  label: { fontSize: 16 },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  counterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  counterText: { fontSize: 20, fontWeight: "700" },
  peopleText: { marginHorizontal: 15, fontSize: 18, fontWeight: "700" },

  areaRow: { flexDirection: "row", marginTop: 10, gap: 10 },
  areaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  areaBtnActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  areaText: { fontSize: 16 },
  areaTextActive: { color: "#fff" },

  selectedInfo: { marginTop: 10, color: "#FF6600", fontWeight: "700" },

  noteInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    height: 90,
    textAlignVertical: "top",
  },

  submitBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },

  dateBox: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  dateText: { fontSize: 16, fontWeight: "600" },

  // MODAL FIX
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginHorizontal: 20,
  },
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
