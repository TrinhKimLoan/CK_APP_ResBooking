import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Table } from "@/types/database";

interface TableItemProps {
  table: Table;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

export default function TableItem({
  table,
  selected,
  disabled,
  onSelect,
}: TableItemProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.box,
        !disabled && styles.available,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.title,
          selected && styles.titleSelected,
        ]}
      >
        {table.name}
      </Text>
      <Text style={styles.sub}>Bàn {table.capacity} người</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
  },

  /* ===== AVAILABLE ===== */
  available: {
    backgroundColor: "#FFF4EE",
    borderColor: "#EC5A11",
  },

  /* ===== SELECTED ===== */
  selected: {
    backgroundColor: "#ea804cff",
    borderColor: "#EC5A11",
  },

  /* ===== DISABLED ===== */
  disabled: {
    backgroundColor: "#DDD",
    borderColor: "#CCC",
    opacity: 0.6,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  titleSelected: {
    color: "#fff",
  },
  sub: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
});
