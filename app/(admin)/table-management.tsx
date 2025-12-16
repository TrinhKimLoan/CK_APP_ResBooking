import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TableManagementView } from './table_management/TableManagementView';
import { TableStatusModal } from './table_management/TableStatusModal';
import {
  TableStatus,
  TableWithStatus,
  getNextStatus,
  useTableManagement,
} from './table_management/useTableManagement';

export default function TableManagementScreen() {
  const {
    isAdmin,
    tables,
    loading,
    refreshing,
    updatingId,
    selectedFloor,
    setSelectedFloor,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    ensureValidDate,
    ensureStartTime,
    ensureEndTime,
    applyStatus,
    onRefresh,
  } = useTableManagement();

  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(null);
  const [defaultStatusChoice, setDefaultStatusChoice] = useState<TableStatus>('available');

  const openStatusModal = useCallback((table: TableWithStatus) => {
    setSelectedTable(table);
    setDefaultStatusChoice(getNextStatus(table.status));
  }, []);

  const closeStatusModal = useCallback(() => {
    setSelectedTable(null);
  }, []);

  const handleConfirmStatus = useCallback(
    async (status: TableStatus) => {
      if (!selectedTable) return;
      await applyStatus(selectedTable, status);
      setSelectedTable(null);
    },
    [applyStatus, selectedTable],
  );

  if (!isAdmin) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Bạn không có quyền truy cập trang này.</Text>
      </View>
    );
  }

  return (
    <>
      <TableManagementView
        tables={tables}
        loading={loading}
        refreshing={refreshing}
        updatingId={updatingId}
        selectedFloor={selectedFloor}
        selectedDate={selectedDate}
        startTime={startTime}
        endTime={endTime}
        onRefresh={onRefresh}
        onFloorChange={setSelectedFloor}
        onDateChange={setSelectedDate}
        onDateBlur={ensureValidDate}
        onStartTimeChange={setStartTime}
        onStartTimeBlur={ensureStartTime}
        onEndTimeChange={setEndTime}
        onEndTimeBlur={ensureEndTime}
        onTablePress={openStatusModal}
      />
      <TableStatusModal
        visible={Boolean(selectedTable)}
        table={selectedTable}
        initialStatus={defaultStatusChoice}
        onClose={closeStatusModal}
        onConfirm={handleConfirmStatus}
        submitting={selectedTable ? updatingId === selectedTable.id : false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});
