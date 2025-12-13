import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Table } from "@/types/database";

interface TableItemProps {
  table: Table;
  selected: boolean;
  onSelect: () => void;
}

export default function TableItem({ table, selected, onSelect }: TableItemProps) {
  const isDisabled = table.status !== "Trống";

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={isDisabled}
      style={[
        styles.box,
        isDisabled && styles.disabled,
        selected && styles.selected,
      ]}
    >
      <Text style={styles.title}>{table.name}</Text>
      <Text style={styles.sub}>Bàn {table.capacity} người</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    marginBottom: 12,
  },
  selected: {
    backgroundColor: "#FFDDAA",
    borderColor: "#FF9900",
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: "#DDD",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  sub: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
  },
});
