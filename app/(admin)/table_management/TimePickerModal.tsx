import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const palette = {
  backdrop: 'rgba(17, 24, 39, 0.35)',
  surface: '#FFFFFF',
  shadow: '#f59e0b',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  accent: '#f59e0b',
  accentMuted: '#fff7eb',
  accentBorder: '#d97706',
};

const TIME_STEP_MINUTES = 30;

export interface TimeOption {
  value: string;
  label: string;
}

const formatLabel = (value: string) => {
  const [hourPart, minutePart] = value.split(':');
  const hour = Number(hourPart);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minutePart} ${suffix}`;
};

const generateTimeOptions = () => {
  const options: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += TIME_STEP_MINUTES) {
      const value = `${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')}`;
      options.push({ value, label: formatLabel(value) });
    }
  }
  return options;
};

interface TimePickerModalProps {
  visible: boolean;
  title: string;
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export function TimePickerModal({ visible, title, selectedValue, onClose, onSelect }: TimePickerModalProps) {
  const timeOptions = useMemo(generateTimeOptions, []);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={22} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={timeOptions}
            keyExtractor={(item) => item.value}
            initialScrollIndex={Math.max(timeOptions.findIndex((item) => item.value === selectedValue), 0)}
            getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  style={[styles.option, isSelected && styles.optionActive]}
                  onPress={() => onSelect(item.value)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />
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
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: palette.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    shadowColor: palette.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  option: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionActive: {
    backgroundColor: palette.accentMuted,
    borderWidth: 1,
    borderColor: palette.accentBorder,
  },
  optionText: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  optionTextActive: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
});
