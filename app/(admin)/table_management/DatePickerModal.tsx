import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerEvent,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const palette = {
  backdrop: 'rgba(26, 26, 18, 0.35)',
  surface: '#FFFFFF',
  shadow: '#E8D959',
  textPrimary: '#1A1A12',
  textSecondary: '#6F6500',
  accent: '#FFF01F',
  accentDark: '#D4BC00',
};

type DatePickerDisplay = AndroidNativeProps['display'] | IOSNativeProps['display'];

interface DatePickerModalProps {
  visible: boolean;
  dateValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
    return new Date(year, month - 1, day);
  }
  return new Date();
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function DatePickerModal({ visible, dateValue, onClose, onSelect }: DatePickerModalProps) {
  const [currentDate, setCurrentDate] = useState(parseDate(dateValue));

  useEffect(() => {
    if (visible) {
      setCurrentDate(parseDate(dateValue));
    }
  }, [visible, dateValue]);

  const display: DatePickerDisplay = Platform.OS === 'ios' ? 'inline' : 'calendar';

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (_event.type === 'set' && selectedDate) {
        onSelect(formatDate(selectedDate));
      } else if (_event.type === 'dismissed') {
        onClose();
      }
    } else if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onSelect(formatDate(currentDate));
  };

  if (!visible && Platform.OS === 'android') {
    return null;
  }

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={currentDate}
        mode="date"
        display={display}
        onChange={handleChange}
      />
    );
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Chọn ngày</Text>
          <DateTimePicker
            value={currentDate}
            mode="date"
            display={display}
            onChange={handleChange}
            style={styles.picker}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={[styles.buttonText, styles.confirmText]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: palette.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  picker: {
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  confirmButton: {
    backgroundColor: palette.accent,
    marginLeft: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.accentDark,
  },
  confirmText: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
});
