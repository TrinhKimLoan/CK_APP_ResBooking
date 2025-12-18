import { Accent } from "@/constants/theme";
import { Table } from "@/types/database";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
  },

  /* ===== AVAILABLE ===== */
  available: {
    backgroundColor: "#fff7eb",
  },

  /* ===== SELECTED ===== */
  selected: {
    backgroundColor: Accent.base,
  },

  /* ===== DISABLED ===== */
  disabled: {
    backgroundColor: "#DDD",
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
