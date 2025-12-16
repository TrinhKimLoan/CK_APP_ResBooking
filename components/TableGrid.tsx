import React from "react";
import { View, StyleSheet } from "react-native";
import TableItem from "./TableItem";
import { Table } from "@/types/database";

interface TableGridProps {
  tables: Table[];
  selectedTableId: number | null;
  freeTableIds: number[]; 
  people: number;
  onChange: (table: Table) => void;
}

export default function TableGrid({
  tables,
  selectedTableId,
  freeTableIds,
  people,
  onChange,
}: TableGridProps) {
  return (
    <View style={styles.grid}>
      {[...tables]
      .sort((a, b) => a.name.localeCompare(b.name, "vi"))
      .map((t) => {
        const isDisabled = !freeTableIds.includes(t.id) || t.capacity < people;

        return (
          <TableItem
            key={t.id}
            table={t}
            selected={selectedTableId === t.id}
            disabled={isDisabled}
            onSelect={() => onChange(t)}
          />
        );
      })}
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
