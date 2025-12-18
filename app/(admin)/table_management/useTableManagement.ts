import { Accent } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import type { Table } from '@/types/database';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export type TableStatus = 'available' | 'occupied';

export type TableWithStatus = Table & { status: TableStatus };

export const STATUS_SEQUENCE: TableStatus[] = ['available', 'occupied'];

export const TABLE_STATUS_DISPLAY: Record<TableStatus, {
  label: string;
  cardBackground: string;
  cardBorder: string;
  textColor: string;
  badgeBackground: string;
  badgeText: string;
}> = {
  available: {
    label: 'Trống',
    cardBackground: '#FFFFFF',
    cardBorder: Accent.light,
    textColor: '#1F2937',
    badgeBackground: '#fff7eb',
    badgeText: Accent.dark,
  },
  occupied: {
    label: 'Không còn chỗ',
    cardBackground: '#fef3c7',
    cardBorder: Accent.base,
    textColor: '#92400e',
    badgeBackground: '#fde68a',
    badgeText: '#92400e',
  },
};

const UI_STATUS_BY_DB: Record<string, TableStatus> = {
  available: 'available',
  occupied: 'occupied',
  pending: 'occupied',
  reserved: 'occupied',
  busy: 'occupied',
  empty: 'available',
  free: 'available',
  trong: 'available',
  'trong ': 'available',
  'trống': 'available',
  'không còn chỗ': 'occupied',
  'khong con cho': 'occupied',
  'dang_su_dung': 'occupied',
  'đang sử dụng': 'occupied',
};

const normalizeDbStatus = (value: string | null | undefined, fallback: TableStatus): TableStatus => {
  if (!value) return fallback;
  const normalized = typeof value.normalize === 'function' ? value.normalize('NFC') : value;
  const key = normalized.toLowerCase();
  return UI_STATUS_BY_DB[key] ?? fallback;
};

export const FLOOR_OPTIONS = [
  { key: '1', label: 'Tầng 1' },
  { key: '2', label: 'Tầng 2' },
  { key: '3', label: 'Tầng 3' },
] as const;

export const DEFAULT_START_TIME = '18:00';
export const DEFAULT_END_TIME = '20:00';

export const getTodayString = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

export const normalizeDateInput = (value: string) => {
  const digits = value.replace(/[^\d]/g, '').slice(0, 8);
  if (digits.length < 4) return digits;
  if (digits.length < 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

export const normalizeTimeInput = (value: string) => {
  const digits = value.replace(/[^\d]/g, '').slice(0, 4);
  if (!digits.length) return digits;
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

export const isValidDate = (value: string) => /^(\d{4})-(\d{2})-(\d{2})$/.test(value);
export const isValidTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const toDbDate = (value: string) => value;
const toDbTime = (value: string) => `${value}:00`;

type FloorKey = typeof FLOOR_OPTIONS[number]['key'];

export const getNextStatus = (status: TableStatus): TableStatus =>
  status === 'available' ? 'occupied' : 'available';

export function useTableManagement() {
  const { role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  const [tables, setTables] = useState<TableWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<FloorKey>('1');
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
      const [tablesResponse, freeResponse] = await Promise.all([
        supabase.from('tables').select('*'),
        supabase.rpc('get_free_tables_by_floor', {
          p_floor: selectedFloor,
          p_arrive_date: toDbDate(selectedDate),
          p_arrive_time: toDbTime(startTime),
        }),
      ]);

      if (tablesResponse.error) throw tablesResponse.error;
      if (freeResponse.error) throw freeResponse.error;

      const floorTables = (tablesResponse.data ?? [])
        .filter((table) => {
          const areaRaw = table.area ?? '';
          const matchedFloor = areaRaw.match(/\d+/)?.[0] ?? '1';
          return matchedFloor === selectedFloor;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      const freeIds = new Set(
        (freeResponse.data ?? []).map((item: any) => {
          if (typeof item === 'number') return item;
          if (item?.table_id) return item.table_id;
          return item?.id;
        }),
      );

      const shaped: TableWithStatus[] = floorTables.map((table) => {
        const fallback = (freeIds.has(table.id) ? 'available' : 'occupied') as TableStatus;
        const finalStatus = normalizeDbStatus(table.status, fallback);

        return {
          ...table,
          status: finalStatus,
        };
      });

      setTables(shaped);
    } catch (error: any) {
      console.error('fetchTables error', error);
      Alert.alert('Lỗi', error?.message ?? 'Không thể tải danh sách bàn');
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

  const ensureValidDate = useCallback(() => {
    setSelectedDate((value) => (isValidDate(value) ? value : getTodayString()));
  }, []);

  const ensureStartTime = useCallback(() => {
    setStartTime((prev) => (prev.trim().length ? prev : DEFAULT_START_TIME));
  }, []);

  const ensureEndTime = useCallback(() => {
    setEndTime((prev) => (prev.trim().length ? prev : DEFAULT_END_TIME));
  }, []);

  const applyStatus = useCallback(
    async (table: TableWithStatus, status: TableStatus) => {
      setUpdatingId(table.id);
      try {
        const payload: Partial<Table> = { status };
        if (status === 'available') {
          payload.active_until = null;
        }

        const { error } = await supabase
          .from('tables')
          .update(payload)
          .eq('id', table.id);

        if (error) throw error;
        await fetchTables();
        const statusLabel = TABLE_STATUS_DISPLAY[status]?.label ?? status;
        Alert.alert('Thành công', `Đã cập nhật bàn ${table.name} sang trạng thái "${statusLabel}".`);
      } catch (error: any) {
        console.error('applyStatus error', error);
        Alert.alert('Lỗi', error?.message ?? 'Không thể cập nhật trạng thái bàn');
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchTables],
  );

  return {
    isAdmin: normalizedRole === 'admin',
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
  };
}
