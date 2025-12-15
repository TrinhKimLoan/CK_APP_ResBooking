import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  TABLE_STATUS_DISPLAY,
  TableStatus,
  TableWithStatus,
} from './useTableManagement';

const palette = {
  backdrop: 'rgba(26, 26, 18, 0.45)',
  sheet: '#FFFFFF',
  textPrimary: '#1A1A12',
  textSecondary: '#6F6500',
  textMuted: '#7A740A',
  badgeBackground: '#FFF6B1',
  badgeText: '#5C5300',
  border: '#F4E664',
  activeBorder: '#FFF01F',
  activeBackground: '#FFF9BE',
  radioInactive: '#E8DC50',
  radioActive: '#FFF01F',
  confirmBackground: '#FFF01F',
  confirmDisabled: '#E6DF9B',
  confirmText: '#1A1A12',
};

type TableStatusModalProps = {
  visible: boolean;
  table: TableWithStatus | null;
  initialStatus: TableStatus;
  onClose: () => void;
  onConfirm: (status: TableStatus) => void | Promise<void>;
  submitting: boolean;
};

const STATUS_DESCRIPTIONS: Record<TableStatus, string> = {
  available: 'Bàn sẵn sàng, cho phép khách đặt bàn',
  occupied: 'Bàn bận, hỏng hoặc đang bảo trì',
};

const STATUS_ORDER: TableStatus[] = ['available', 'occupied'];

export function TableStatusModal({
  visible,
  table,
  initialStatus,
  onClose,
  onConfirm,
  submitting,
}: TableStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TableStatus>(initialStatus);

  useEffect(() => {
    if (!visible) return;
    setSelectedStatus(initialStatus);
  }, [visible, initialStatus, table?.id]);

  const currentStatusLabel = useMemo(() => {
    if (!table) return '';
    const config = TABLE_STATUS_DISPLAY[table.status];
    return config?.label ?? '';
  }, [table]);

  const options = useMemo(() => {
    return STATUS_ORDER.map((status) => ({
      status,
      label: TABLE_STATUS_DISPLAY[status].label,
      description: STATUS_DESCRIPTIONS[status],
    }));
  }, []);

  const disableConfirm = useMemo(() => {
    if (!table) return true;
    if (submitting) return true;
    return selectedStatus === table.status;
  }, [selectedStatus, submitting, table]);

  const handleConfirmPress = () => {
    if (disableConfirm) return;
    onConfirm(selectedStatus);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{table ? `Bàn ${table.name}` : 'Cập nhật bàn'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          {table && (
            <>
              <Text style={styles.sectionLabel}>Trạng thái hiện tại</Text>
              <View style={styles.currentStatusBadge}>
                <Text style={styles.currentStatusText}>{currentStatusLabel}</Text>
              </View>

              <Text style={[styles.sectionLabel, styles.sectionSpacing]}>Đổi trạng thái bàn:</Text>
              {options.map((option) => {
                const isSelected = option.status === selectedStatus;
                return (
                  <TouchableOpacity
                    key={option.status}
                    style={[styles.optionRow, isSelected && styles.optionRowActive]}
                    onPress={() => setSelectedStatus(option.status)}
                    activeOpacity={0.8}
                    disabled={submitting}
                  >
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.optionTexts}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.confirmButton, disableConfirm && styles.confirmButtonDisabled]}
                onPress={handleConfirmPress}
                activeOpacity={0.8}
                disabled={disableConfirm}
              >
                {submitting ? (
                  <ActivityIndicator color={palette.confirmText} />
                ) : (
                  <Text style={styles.confirmButtonText}>Lưu thay đổi</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: palette.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: palette.sheet,
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: '#E8D959',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  closeButton: {
    padding: 4,
    marginRight: -4,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: palette.textMuted,
  },
  sectionSpacing: {
    marginTop: 16,
  },
  currentStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.badgeBackground,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  currentStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.badgeText,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: palette.sheet,
  },
  optionRowActive: {
    borderColor: palette.activeBorder,
    backgroundColor: palette.activeBackground,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.radioInactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: palette.radioActive,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.radioActive,
  },
  optionTexts: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 13,
    color: palette.textSecondary,
  },
  confirmButton: {
    marginTop: 8,
    backgroundColor: palette.confirmBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: palette.confirmDisabled,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.confirmText,
  },
});
