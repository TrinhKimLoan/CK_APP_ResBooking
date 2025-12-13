import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

interface TimeWheelProps {
  hour: number;
  minute: number;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
}

export default function TimeWheel({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: TimeWheelProps) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={styles.wrapper}>
      <View style={styles.column}>
        <Text style={styles.label}>Giờ</Text>

        <FlatList
          data={hours}
          keyExtractor={(i) => i.toString()}
          style={{ height: 200 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onHourChange(item)}>
              <Text style={[styles.item, item === hour && styles.selected]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>Phút</Text>

        <FlatList
          data={minutes}
          keyExtractor={(i) => i.toString()}
          style={{ height: 200 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onMinuteChange(item)}>
              <Text style={[styles.item, item === minute && styles.selected]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  column: { width: "45%" },
  label: { textAlign: "center", fontWeight: "700", marginBottom: 10 },
  item: {
    height: 40,
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    paddingVertical: 6,
  },
  selected: { color: "#000", fontWeight: "700", fontSize: 20 },
});
