import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import type { Table } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TableStatus = 'TRONG' | 'DANG_SU_DUNG';

const STATUS_CONFIG: Record<TableStatus, {
  label: string;
  cardBackground: string;
  cardBorder: string;
  textColor: string;
  badgeBackground: string;
  badgeText: string;
}> = {
  TRONG: {
    label: 'Trống',
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E7EB',
    textColor: '#111827',
    badgeBackground: '#DCFCE7',
    badgeText: '#15803D',
  },
  DANG_SU_DUNG: {
    label: 'Đang sử dụng',
    cardBackground: '#DBEAFE',
    cardBorder: '#BFDBFE',
    textColor: '#1D4ED8',
    badgeBackground: '#DBEAFE',
    badgeText: '#1D4ED8',
  },
};

const FLOOR_OPTIONS = [
  { key: '1', label: 'Tầng 1' },
  { key: '2', label: 'Tầng 2' },
  { key: '3', label: 'Tầng 3' },
] as const;

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`;
};

const DEFAULT_START_TIME = '18:00';
const DEFAULT_END_TIME = '20:00';

const normalizeDateInput = (value: string) => {
  const digits = value.replace(/[^\d]/g, '').slice(0, 8);
  if (digits.length < 4) return digits;
  if (digits.length < 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

const normalizeTimeInput = (value: string) => {
  const digits = value.replace(/[^\d]/g, '').slice(0, 4);
  if (!digits.length) return digits;
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const toDbDate = (value: string) => value;
const toDbTime = (value: string) => `${value}:00`;

export default function TableManagementScreen() {
  const { role } = useAuth();
  const normalizedRole = role?.toLowerCase();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<typeof FLOOR_OPTIONS[number]['key']>('1');
  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);

  const fetchTables = useCallback(async () => {
    const dateReady = isValidDate(selectedDate);
    const startReady = isValidTime(startTime);
    const endReady = isValidTime(endTime);
    if (!dateReady || !startReady || !endReady || !selectedFloor) {
      setRefreshing(false);
      return;
    }

    setLoading(true);
    try {
      const [{ data: allTables, error: tablesError }, { data: freeTables, error: freeError }] = await Promise.all([
        supabase.from('tables').select('*'),
        supabase.rpc('get_free_tables_by_floor', {
          p_floor: selectedFloor,
          p_arrive_date: toDbDate(selectedDate),
          p_arrive_time: toDbTime(startTime),
        }),
      ]);

      if (tablesError) throw tablesError;
      if (freeError) throw freeError;

      const floorTables = (allTables ?? []).filter((table) => {
        const areaRaw = table.area ?? '';
        const matchedFloor = areaRaw.match(/\d+/)?.[0] ?? '1';
        return matchedFloor === selectedFloor;
      }).sort((a, b) => a.name.localeCompare(b.name));

      const freeIds = new Set(
        (freeTables ?? []).map((item: any) => {
          if (typeof item === 'number') return item;
          if (item?.table_id) return item.table_id;
          return item?.id;
        }),
      );

      const shaped = floorTables.map((table) => ({
        ...table,
        status: (freeIds.has(table.id) ? 'TRONG' : 'DANG_SU_DUNG') as TableStatus,
      }));

      setTables(shaped);
    } catch (err: any) {
      console.error('fetchTables error', err);
      Alert.alert('Lỗi', err.message ?? 'Không thể tải danh sách bàn');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate, selectedFloor, startTime, endTime]);

  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables]),
  );

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTables();
  }, [fetchTables]);

  const applyStatus = useCallback(
    async (table: Table, status: TableStatus) => {
      setUpdatingId(table.id);
      try {
        const payload: Partial<Table> = {
          status,
        };
        if (status === 'TRONG') {
          payload.active_until = null;
        }
        const { error } = await supabase.from('tables').update(payload).eq('id', table.id);
        if (error) throw error;
        await fetchTables();
        const statusLabel = STATUS_CONFIG[status]?.label ?? status;
        Alert.alert('Thành công', `Đã cập nhật bàn ${table.name} sang trạng thái "${statusLabel}".`);
      } catch (err: any) {
        console.error('applyStatus error', err);
        Alert.alert('Lỗi', err.message ?? 'Không thể cập nhật trạng thái bàn');
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchTables],
  );

  const handleTablePress = useCallback(
    (table: Table) => {
      const normalizedStatus = (table.status?.toUpperCase?.() ?? 'TRONG') as TableStatus;
      const targetStatus: TableStatus = normalizedStatus === 'TRONG' ? 'DANG_SU_DUNG' : 'TRONG';
      applyStatus(table, targetStatus);
    },
    [applyStatus],
  );

  const renderTable = ({ item }: { item: Table }) => {
    const normalizedStatus = (item.status?.toUpperCase?.() ?? 'TRONG') as TableStatus;
    const config = STATUS_CONFIG[normalizedStatus] ?? {
      label: normalizedStatus,
      cardBackground: '#F3F4F6',
      cardBorder: '#E5E7EB',
      textColor: '#111827',
      badgeBackground: '#E5E7EB',
      badgeText: '#374151',
    };
    const isUpdating = updatingId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.tableCard,
          { backgroundColor: config.cardBackground, borderColor: config.cardBorder },
          isUpdating && styles.tableCardDisabled,
        ]}
        activeOpacity={0.8}
        onPress={() => handleTablePress(item)}
        disabled={isUpdating}
      >
        <Text style={[styles.tableLabel, { color: config.textColor }]}>{item.name}</Text>
        <View style={[styles.tableBadge, { backgroundColor: config.badgeBackground }]}
        >
          <Text style={[styles.tableBadgeText, { color: config.badgeText }]}>{config.label}</Text>
        </View>
        <Text style={styles.tableSub}>{item.capacity ? `${item.capacity} khách` : 'Chưa cập nhật'}</Text>
      </TouchableOpacity>
    );
  };

  if (normalizedRole !== 'admin') {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Bạn không có quyền truy cập trang này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tables}
        keyExtractor={(item) => `${item.id}`}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderTable}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={tables.length ? styles.listContent : styles.emptyContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Không có bàn trong khu vực này.</Text>
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Sơ đồ bàn</Text>

            <View style={styles.filterCard}>
              <Text style={styles.filterLabel}>Ngày</Text>
              <View style={styles.inputField}>
                <TextInput
                  value={selectedDate}
                  onChangeText={(value) => setSelectedDate(normalizeDateInput(value))}
                  onBlur={() => {
                    setSelectedDate((value) => (isValidDate(value) ? value : getTodayString()));
                  }}
                  placeholder="YYYY-MM-DD"
                  keyboardType="number-pad"
                  style={styles.inputControl}
                />
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>

              <View style={styles.timeRow}>
                <View style={[styles.timeField, styles.timeFieldSpacing]}>
                  <Text style={styles.filterLabel}>Từ</Text>
                  <View style={styles.inputField}>
                    <TextInput
                      value={startTime}
                      onChangeText={(value) => setStartTime(normalizeTimeInput(value))}
                      onBlur={() => {
                        setStartTime((prev) => (prev.trim().length ? prev : DEFAULT_START_TIME));
                      }}
                      placeholder="HH:MM"
                      keyboardType="number-pad"
                      style={styles.inputControl}
                    />
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </View>
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.filterLabel}>Đến</Text>
                  <View style={styles.inputField}>
                    <TextInput
                      value={endTime}
                      onChangeText={(value) => setEndTime(normalizeTimeInput(value))}
                      onBlur={() => {
                        setEndTime((prev) => (prev.trim().length ? prev : DEFAULT_END_TIME));
                      }}
                      placeholder="HH:MM"
                      keyboardType="number-pad"
                      style={styles.inputControl}
                    />
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </View>
                </View>
              </View>

              <View style={styles.areaRow}>
                {FLOOR_OPTIONS.map((option, index) => {
                  const isActive = selectedFloor === option.key;
                  const spacing = index === FLOOR_OPTIONS.length - 1 ? null : styles.areaChipSpacing;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[styles.areaChip, spacing, isActive && styles.areaChipActive]}
                      onPress={() => setSelectedFloor(option.key)}
                    >
                      <Text style={[styles.areaChipText, isActive && styles.areaChipTextActive]}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.legendRow}>
              {Object.values(STATUS_CONFIG).map((status) => (
                <View key={status.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: status.badgeBackground }]} />
                  <Text style={styles.legendText}>{status.label}</Text>
                </View>
              ))}
            </View>
          </View>
        }
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  inputControl: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginRight: 12,
  },
  timeRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  timeField: {
    flex: 1,
  },
  timeFieldSpacing: {
    marginRight: 12,
  },
  areaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  areaChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  areaChipSpacing: {
    marginRight: 12,
  },
  areaChipActive: {
    backgroundColor: '#111827',
  },
  areaChipText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  areaChipTextActive: {
    color: '#FFFFFF',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendText: {
    fontSize: 14,
    color: '#4B5563',
  },
  tableCard: {
    flex: 1,
    minHeight: 90,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCardDisabled: {
    opacity: 0.6,
  },
  tableLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  tableBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  tableBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tableSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
