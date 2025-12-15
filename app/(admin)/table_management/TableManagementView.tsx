import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { DatePickerModal } from './DatePickerModal';
import { TimePickerModal } from './TimePickerModal';
import {
  FLOOR_OPTIONS,
  TABLE_STATUS_DISPLAY,
  TableStatus,
  TableWithStatus,
  getTodayString,
} from './useTableManagement';

const palette = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceBorder: '#F4E664',
  surfaceMuted: '#FFF6B1',
  accent: '#FFF01F',
  accentDark: '#D4BC00',
  textPrimary: '#1A1A12',
  textSecondary: '#5C5300',
  textMuted: '#7A740A',
  overlay: 'rgba(255,255,255,0.6)',
};

interface TableManagementViewProps {
  tables: TableWithStatus[];
  loading: boolean;
  refreshing: boolean;
  updatingId: number | null;
  selectedFloor: typeof FLOOR_OPTIONS[number]['key'];
  selectedDate: string;
  startTime: string;
  endTime: string;
  onRefresh: () => void;
  onFloorChange: (floor: typeof FLOOR_OPTIONS[number]['key']) => void;
  onDateChange: (value: string) => void;
  onDateBlur: () => void;
  onStartTimeChange: (value: string) => void;
  onStartTimeBlur: () => void;
  onEndTimeChange: (value: string) => void;
  onEndTimeBlur: () => void;
  onTablePress: (table: TableWithStatus) => void;
}

export function TableManagementView({
  tables,
  loading,
  refreshing,
  updatingId,
  selectedFloor,
  selectedDate,
  startTime,
  endTime,
  onRefresh,
  onFloorChange,
  onDateChange,
  onDateBlur,
  onStartTimeChange,
  onStartTimeBlur,
  onEndTimeChange,
  onEndTimeBlur,
  onTablePress,
}: TableManagementViewProps) {
  const { width } = useWindowDimensions();
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end' | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const formatTimeLabel = useMemo(() => (
    (value: string) => {
      const [hourPart, minutePart] = value.split(':');
      const hour = Number(hourPart);
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const adjustedHour = hour % 12 || 12;
      return `${adjustedHour}:${minutePart} ${suffix}`;
    }
  ), []);

  const openTimePicker = (target: 'start' | 'end') => setPickerTarget(target);
  const closeTimePicker = () => {
    if (pickerTarget === 'start') {
      onStartTimeBlur();
    } else if (pickerTarget === 'end') {
      onEndTimeBlur();
    }
    setPickerTarget(null);
  };

  const handleSelectTime = (value: string) => {
    if (pickerTarget === 'start') {
      onStartTimeChange(value);
      onStartTimeBlur();
    } else if (pickerTarget === 'end') {
      onEndTimeChange(value);
      onEndTimeBlur();
    }
    setPickerTarget(null);
  };

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const closeDatePicker = () => {
    setDatePickerVisible(false);
    onDateBlur();
  };

  const handleSelectDate = (value: string) => {
    onDateChange(value);
    onDateBlur();
    setDatePickerVisible(false);
  };

  const cardWidth = useMemo(() => {
    const horizontalPadding = 40; // container padding * 2
    const gap = 12;
    const columns = 3;
    const available = Math.max(width - horizontalPadding - gap * (columns - 1), 0);
    return Math.max(available / columns, 96);
  }, [width]);

  const renderTable = ({ item, index }: { item: TableWithStatus; index: number }) => {
    const normalizedStatus = (
      item.status && TABLE_STATUS_DISPLAY[item.status as TableStatus]
        ? (item.status as TableStatus)
        : 'available'
    );
    const config = TABLE_STATUS_DISPLAY[normalizedStatus];
    const isUpdating = updatingId === item.id;
    const isLastColumn = (index + 1) % 3 === 0;

    return (
      <View
        style={[
          styles.tableWrapper,
          { width: cardWidth, marginRight: isLastColumn ? 0 : 12 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tableCard,
            { backgroundColor: config.cardBackground, borderColor: config.cardBorder },
            isUpdating && styles.tableCardDisabled,
          ]}
          activeOpacity={0.8}
          onPress={() => onTablePress(item)}
          disabled={isUpdating}
        >
          <Text style={[styles.tableLabel, { color: config.textColor }]}>{item.name}</Text>
          <View style={[styles.tableBadge, { backgroundColor: config.badgeBackground }]}
          >
            <Text style={[styles.tableBadgeText, { color: config.badgeText }]}>{config.label}</Text>
          </View>
          <Text style={styles.tableSub}>{item.capacity ? `${item.capacity} khách` : 'Chưa cập nhật'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Ngày</Text>
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={openDatePicker}
                  activeOpacity={0.85}
                >
                  <Text style={styles.inputValue}>{selectedDate || getTodayString()}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.timeRow}>
                <View style={[styles.timeField, styles.timeFieldSpacing]}>
                  <Text style={styles.filterLabel}>Từ</Text>
                  <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => openTimePicker('start')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.inputValue}>{formatTimeLabel(startTime)}</Text>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.filterLabel}>Đến</Text>
                  <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => openTimePicker('end')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.inputValue}>{formatTimeLabel(endTime)}</Text>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
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
                      onPress={() => onFloorChange(option.key)}
                    >
                      <Text style={[styles.areaChipText, isActive && styles.areaChipTextActive]}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.legendRow}>
              {Object.values(TABLE_STATUS_DISPLAY).map((status) => (
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
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      )}

      <TimePickerModal
        visible={pickerTarget !== null}
        title={pickerTarget === 'start' ? 'Chọn giờ bắt đầu' : 'Chọn giờ kết thúc'}
        selectedValue={pickerTarget === 'start' ? startTime : endTime}
        onClose={closeTimePicker}
        onSelect={handleSelectTime}
      />
      <DatePickerModal
        visible={isDatePickerVisible}
        dateValue={selectedDate || getTodayString()}
        onClose={closeDatePicker}
        onSelect={handleSelectDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 16,
  },
  filterCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    marginBottom: 20,
    shadowColor: '#E8D959',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary,
    marginBottom: 8,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: palette.surface,
  },
  inputValue: {
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    marginTop: 4,
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
    marginTop: 16,
  },
  areaChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: palette.surfaceMuted,
  },
  areaChipSpacing: {
    marginRight: 12,
  },
  areaChipActive: {
    backgroundColor: palette.accent,
    borderWidth: 1,
    borderColor: palette.accentDark,
  },
  areaChipText: {
    color: palette.textMuted,
    fontWeight: '600',
  },
  areaChipTextActive: {
    color: palette.textPrimary,
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
    color: palette.textMuted,
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  tableWrapper: {
    marginBottom: 16,
  },
  tableCard: {
    width: '100%',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  tableBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tableSub: {
    fontSize: 12,
    color: palette.textMuted,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: palette.textMuted,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
