import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import type { Table } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const STATUS_CONFIG: Record<string, {
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
  CHO: {
    label: 'Đang giữ',
    cardBackground: '#FEF9C3',
    cardBorder: '#FDE68A',
    textColor: '#92400E',
    badgeBackground: '#FEF3C7',
    badgeText: '#C2410C',
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

export default function TableManagementScreen() {
  const { role } = useAuth();
  const normalizedRole = role?.toLowerCase();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedDate] = useState<Date>(new Date());
  const [startTime] = useState('18:00');
  const [endTime] = useState('20:00');

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setTables(data ?? []);
    } catch (err: any) {
      console.error('fetchTables error', err);
      Alert.alert('Lỗi', err.message ?? 'Không thể tải danh sách bàn');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!tables.length) return;
    const defaultArea = tables[0].area?.trim() || 'Tầng 1';
    setSelectedArea((current) => current ?? defaultArea);
  }, [tables]);

  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTables();
  }, [fetchTables]);

  const areas = useMemo(() => {
    const unique = new Set<string>();
    tables.forEach((table) => {
      const areaName = table.area?.trim();
      if (areaName) {
        unique.add(areaName);
      }
    });
    if (!unique.size) {
      unique.add('Tầng 1');
      unique.add('Tầng 2');
      unique.add('Tầng 3');
    }
    return Array.from(unique);
  }, [tables]);

  const filteredTables = useMemo(() => {
    const currentArea = selectedArea ?? areas[0];
    return [...tables]
      .filter((table) => {
        const areaName = table.area?.trim();
        if (!currentArea) return true;
        if (!areaName) return currentArea === 'Tầng 1';
        return areaName === currentArea;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tables, selectedArea, areas]);

  const applyStatus = useCallback(
    async (table: Table, status: string) => {
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
      const normalizedStatus = table.status?.toUpperCase?.() ?? 'TRONG';
      const statusLabel = STATUS_CONFIG[normalizedStatus]?.label ?? normalizedStatus;

      Alert.alert(
        table.name ?? 'Bàn',
        `Trạng thái hiện tại: ${statusLabel}`,
        [
          {
            text: 'Đánh dấu trống',
            onPress: () => applyStatus(table, 'TRONG'),
          },
          {
            text: 'Giữ bàn',
            onPress: () => applyStatus(table, 'CHO'),
          },
          {
            text: 'Đang sử dụng',
            onPress: () => applyStatus(table, 'DANG_SU_DUNG'),
          },
          {
            text: 'Hủy',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    },
    [applyStatus],
  );

  const renderTable = ({ item }: { item: Table }) => {
    const normalizedStatus = item.status?.toUpperCase?.() ?? 'TRONG';
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
        data={filteredTables}
        keyExtractor={(item) => `${item.id}`}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderTable}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={filteredTables.length ? styles.listContent : styles.emptyContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Không có bàn trong khu vực này.</Text>
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Sơ đồ bàn</Text>

            <View style={styles.filterCard}>
              <Text style={styles.filterLabel}>Ngày</Text>
              <TouchableOpacity style={styles.inputField} activeOpacity={0.9}>
                <Text style={styles.inputText}>
                  {selectedDate.toLocaleDateString('vi-VN')}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </TouchableOpacity>

              <View style={styles.timeRow}>
                <View style={[styles.timeField, styles.timeFieldSpacing]}>
                  <Text style={styles.filterLabel}>Từ</Text>
                  <TouchableOpacity style={styles.inputField} activeOpacity={0.9}>
                    <Text style={styles.inputText}>{startTime} CH</Text>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.filterLabel}>Đến</Text>
                  <TouchableOpacity style={styles.inputField} activeOpacity={0.9}>
                    <Text style={styles.inputText}>{endTime} CH</Text>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.areaRow}>
                {areas.map((area, index) => {
                  const isActive = (selectedArea ?? areas[0]) === area;
                  const spacing = index === areas.length - 1 ? null : styles.areaChipSpacing;
                  return (
                    <TouchableOpacity
                      key={area}
                      style={[styles.areaChip, spacing, isActive && styles.areaChipActive]}
                      onPress={() => setSelectedArea(area)}
                    >
                      <Text style={[styles.areaChipText, isActive && styles.areaChipTextActive]}>{area}</Text>
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
  inputText: {
    fontSize: 16,
    color: '#111827',
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
