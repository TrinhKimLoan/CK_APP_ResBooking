import TableGrid from "@/components/TableGrid";
import { Accent } from "@/constants/theme";
import { Table } from "@/types/database";
import { StyleSheet, Text, View } from "react-native";

interface TableSectionProps {
  tables: Table[];
  selectedArea: string | null;
  freeTableIds: number[];
  selectedTableId: number | null;
  people: number;
  onTableChange: (table: Table) => void;
}

export default function TableSection({
  tables,
  selectedArea,
  freeTableIds,
  selectedTableId,
  people,
  onTableChange,
}: TableSectionProps) {
  const filteredTables = tables.filter((t) => t.area === selectedArea);

  return (
    <View>
      <Text style={styles.sectionTitle}>Chọn bàn</Text>

      <TableGrid
        tables={filteredTables}
        selectedTableId={selectedTableId}
        freeTableIds={freeTableIds}
        people={people}
        onChange={onTableChange}
      />

      {selectedTableId && (
        <Text style={styles.selectedInfo}>
          Bạn đã chọn:{" "}
          {tables.find((t) => t.id === selectedTableId)?.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },
  selectedInfo: { marginTop: 10, color: Accent.base, fontWeight: "700" },
});