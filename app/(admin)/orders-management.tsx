import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import type { Order, Table, UserProfile } from '@/types/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
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

type OrderStatus = 'pending' | 'approved' | 'declined';

type OrderRecord = Omit<Order, 'status'> & { status?: string | null };

// Chuẩn hóa trạng thái lấy từ DB để tránh lỗi khi dữ liệu không đồng nhất
const normalizeOrderStatus = (status?: string | null): OrderStatus => {
  const value = (status ?? '').trim().toLowerCase();
  if (value === 'approved' || value === 'declined') return value;
  return 'pending';
};

const buildLocalDateTime = (dateValue?: string | null, timeValue?: string | null): Date | null => {
  if (!dateValue) return null;

  const [y, m, d] = dateValue.split('-').map((part) => Number.parseInt(part, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

  const parseTimePart = (value?: string) => {
    const normalized = (value ?? '').trim();
    if (!normalized) return 0;
    const parsed = Number.parseInt(normalized, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const [hRaw, minRaw, secRaw] = (timeValue ?? '').split(':');
  const h = parseTimePart(hRaw);
  const min = parseTimePart(minRaw);
  const sec = parseTimePart(secRaw);

  return new Date(y, m - 1, d, h, min, sec);
};

const STATUS_BADGE: Record<OrderStatus, { label: string; background: string; color: string }> = {
  pending: { label: 'Pending', background: '#FFF4E5', color: '#C88000' },
  approved: { label: 'Đã duyệt', background: '#E6F4FF', color: '#0B5ED7' },
  declined: { label: 'Đã từ chối', background: '#FDE8E8', color: '#C23321' },
};

const STATUS_TO_DB: Record<OrderStatus, string> = {
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
};

const FILTERS = [
  { key: 'pending', label: 'Đơn đang chờ' },
  { key: 'upcoming', label: 'Đơn sắp tới' },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

type UserContact = Pick<UserProfile, 'id' | 'full_name' | 'phone' | 'email'>;

interface EnrichedOrder extends OrderRecord {
  status: OrderStatus;
  table?: Table | null;
  customer?: UserContact | null;
  arrivalDateTime?: Date | null;
  party_size?: number | null;
}

const getArrivalDateTime = (order: OrderRecord): Date | null => {
  const primary = buildLocalDateTime(order.arrive_date, order.arrive_time);
  if (primary) return primary;

  const arrivalAt = (order as any).arrival_at as string | undefined;
  if (arrivalAt) {
    const timestamp = Date.parse(arrivalAt);
    if (Number.isFinite(timestamp)) return new Date(timestamp);
  }

  return null;
};

const badgeForStatus = (status: OrderStatus) => STATUS_BADGE[status];

const formatDate = (date?: Date | null) => {
  if (!date) return 'Không rõ thời gian';
  return `${date.toLocaleDateString('vi-VN')} - ${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const STATUS_SUCCESS_MESSAGE: Record<OrderStatus, string> = {
  pending: 'Đã chuyển đơn về trạng thái pending.',
  approved: 'Đơn đã được duyệt.',
  declined: 'Đơn đã bị từ chối.',
};

const STATUS_ACTIONS: Record<OrderStatus, { label: string; next: OrderStatus; tone: 'primary' | 'danger' }[]> = {
  pending: [
    { label: 'Duyệt', next: 'approved', tone: 'primary' },
    { label: 'Từ chối', next: 'declined', tone: 'danger' },
  ],
  approved: [
    { label: 'Chuyển Pending', next: 'pending', tone: 'primary' },
    { label: 'Từ chối', next: 'declined', tone: 'danger' },
  ],
  declined: [],
};

export default function OrdersManagementScreen() {
  const { role } = useAuth();
  const normalizedRole = role?.toLowerCase();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('pending');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersData = (data ?? []) as OrderRecord[];
      const tableIds = Array.from(
        new Set(ordersData.map((o) => o.table_id).filter((id): id is number => typeof id === 'number')),
      );
      const userIds = Array.from(
        new Set(ordersData.map((o) => o.user_id).filter((id): id is string => typeof id === 'string')),
      );

      const tablesPromise = (async () => {
        if (!tableIds.length) return new Map<number, Table>();
        const { data: tables, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .in('id', tableIds);
        if (tableError) throw tableError;
        const map = new Map<number, Table>();
        (tables ?? []).forEach((table) => map.set(table.id, table));
        return map;
      })();

      const usersPromise = (async () => {
        if (!userIds.length) return new Map<string, UserContact>();
        const { data: users, error: userError } = await supabase
          .from('user_profile')
          .select('id, full_name, phone, email')
          .in('id', userIds);
        if (userError) throw userError;
        const map = new Map<string, UserContact>();
        (users ?? []).forEach((user) => map.set(user.id, user));
        return map;
      })();

      const [tablesMap, usersMap] = await Promise.all([tablesPromise, usersPromise]);

      const enriched: EnrichedOrder[] = ordersData.map((order) => {
        const normalizedStatus = normalizeOrderStatus(order.status);
        return {
          ...order,
          status: normalizedStatus,
          table: order.table_id ? tablesMap.get(order.table_id) ?? null : null,
          customer: order.user_id ? usersMap.get(order.user_id) ?? null : null,
          arrivalDateTime: getArrivalDateTime(order),
        };
      });

      setOrders(enriched);
    } catch (err: any) {
      console.error('fetchOrders error', err);
      Alert.alert('Lỗi', err.message ?? 'Không thể tải đơn đặt bàn');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchTerm = search.trim().toLowerCase();
      const matchesSearch = searchTerm
        ? [
            `#${order.id}`,
            order.customer_name ?? '',
            order.customer?.full_name ?? '',
            order.customer?.phone ?? '',
            order.customer_phone ?? '',
            order.table?.name ?? '',
          ]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm)
        : true;

      if (!matchesSearch) return false;

      const status = normalizeOrderStatus(order.status);
      switch (filter) {
        case 'pending':
          return status === 'pending';
        case 'upcoming': {
          const now = new Date();
          const arrival = order.arrivalDateTime ?? getArrivalDateTime(order);
          const isFutureArrival = arrival ? arrival.getTime() >= now.getTime() : false;
          return status === 'approved' && isFutureArrival;
        }
        default:
          return false;
      }
    });
  }, [orders, search, filter]);

  const transitionOrder = useCallback(
    async (order: EnrichedOrder, nextStatus: OrderStatus) => {
      setProcessingId(order.id);
      try {
        const dbStatus = STATUS_TO_DB[nextStatus] ?? nextStatus.toLowerCase();
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: dbStatus })
          .eq('id', order.id);
        if (updateError) throw updateError;

        await fetchOrders();

        const message = STATUS_SUCCESS_MESSAGE[nextStatus] ?? 'Đã cập nhật trạng thái thành công.';
        Alert.alert('Thành công', message);
      } catch (err: any) {
        console.error('transitionOrder error', err);
        Alert.alert('Lỗi', err.message ?? 'Không thể cập nhật trạng thái');
      } finally {
        setProcessingId(null);
      }
    },
    [fetchOrders],
  );

  const renderActions = (order: EnrichedOrder) => {
    const disabled = processingId === order.id;
    const actions = STATUS_ACTIONS[order.status] ?? [];
    if (!actions.length) return null;

    return (
      <View style={styles.actionsRow}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={`${action.next}-${index}`}
            style={[
              styles.actionButton,
              index === actions.length - 1 && styles.actionButtonLast,
              disabled && styles.disabledButton,
            ]}
            onPress={() => transitionOrder(order, action.next)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.actionButtonText,
                action.tone === 'primary' ? styles.actionPrimaryText : styles.actionDangerText,
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderOrder = ({ item }: { item: EnrichedOrder }) => {
    const badge = badgeForStatus(item.status);
    const displayPhone = item.customer_phone || item.customer?.phone;
    const isWaiting = item.status === 'pending';
    const createdAt = item.created_at ? new Date(item.created_at) : null;
    const guestName = item.customer_name || item.customer?.full_name || 'Không rõ';
    const createdAtText = createdAt ? formatDate(createdAt) : 'Không rõ';
    const arrivalText = item.arrivalDateTime ? formatDate(item.arrivalDateTime) : 'Chưa cập nhật';
    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={styles.idGroup}>
            <Text style={styles.orderId}>#{item.id}</Text>
            <View style={[styles.statusPill, { backgroundColor: badge.background }]}> 
              <Text style={[styles.statusPillText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
          <Text style={styles.arrivalText}>Đặt bàn lúc {createdAtText}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.infoText}>Khách hàng: {guestName}</Text>
          {displayPhone ? <Text style={styles.infoText}>SĐT: {displayPhone}</Text> : null}
          <Text style={styles.infoText}>Ngày đến: {arrivalText}</Text>
          <Text style={styles.infoText}>Số lượng: {item.party_size ?? 'Không rõ'} người</Text>
          <Text style={styles.infoText}>
            Bàn: {item.table?.name ?? (isWaiting ? 'Đang chờ bàn trống' : 'Chưa gán')}
          </Text>
          {item.notes ? <Text style={styles.infoText}>Ghi chú: {item.notes}</Text> : null}
          {isWaiting ? (
            <Text style={styles.helperText}>Liên hệ khách khi có bàn trống để xác nhận.</Text>
          ) : null}
        </View>
        {renderActions(item)}
      </View>
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
      <Text style={styles.title}>Quản lý đơn đặt bàn</Text>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm kiếm đơn đặt bàn"
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
        />
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const isActive = item.key === filter;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderOrder}
          contentContainerStyle={filteredOrders.length ? undefined : styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Không có đơn nào phù hợp với bộ lọc hiện tại.</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterChipText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrivalText: {
    fontSize: 14,
    color: '#6B7280',
    flexShrink: 1,
    textAlign: 'right',
  },
  cardBody: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  helperText: {
    fontSize: 13,
    color: '#C2410C',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonLast: {
    marginRight: 0,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  actionPrimaryText: {
    color: '#0B5ED7',
  },
  actionDangerText: {
    color: '#DC2626',
  },
  disabledButton: {
    opacity: 0.6,
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
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
