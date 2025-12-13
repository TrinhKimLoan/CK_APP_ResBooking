import React from "react";
import { View, StyleSheet } from "react-native";
import TableItem from "./TableItem";
import { Table } from "@/types/database";

interface TableGridProps {
  tables: Table[];
  selectedTableId: number | null;
  onChange: (table: Table) => void;
}

export default function TableGrid({
  tables,
  selectedTableId,
  onChange,
}: TableGridProps) {
  return (
    <View style={styles.grid}>
      {tables.map((t: Table) => (
        <TableItem
          key={t.id}
          table={t}
          selected={selectedTableId === t.id}
          onSelect={() => onChange(t)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
