import TimeWheel from "@/components/TimeWheel";
import { Accent } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DateTimeSectionProps {
  date: Date;
  hour: number;
  minute: number;
  setDate: (date: Date) => void;
  setHour: (hour: number) => void;
  setMinute: (minute: number) => void;
}

export default function DateTimeSection({
  date,
  hour,
  minute,
  setDate,
  setHour,
  setMinute,
}: DateTimeSectionProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View>
      {/* Date Picker */}
      <Text style={styles.sectionTitle}>Ngày đặt</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {date.toLocaleDateString("vi-VN")}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(_, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      {/* Time Picker */}
      <Text style={styles.sectionTitle}>Giờ đến</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.dateText}>
          {hour.toString().padStart(2, "0")}:
          {minute.toString().padStart(2, "0")}
        </Text>
      </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },
  dateBox: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Accent.light,
  },
  dateText: { fontSize: 16, fontWeight: "600" },
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
    backgroundColor: Accent.base,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});