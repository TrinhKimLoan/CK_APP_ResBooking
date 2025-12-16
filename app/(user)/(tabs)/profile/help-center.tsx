import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Fonts, Colors } from '@/constants/theme';

export default function HelpCenterScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>📞 Hotline</Text>
      <TouchableOpacity onPress={() => Linking.openURL('tel:19001234')}>
        <Text style={styles.text}>1900 1234</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Giờ làm việc: 08:00 - 21:00 (Tất cả các ngày trong tuần)</Text>

      <Text style={styles.sectionTitle}>📧 Email hỗ trợ</Text>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:support@reserva.vn')}>
        <Text style={styles.text}>support@reserva.vn</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</Text>

      <Text style={styles.sectionTitle}>❓ Câu hỏi thường gặp (FAQ)</Text>
      <Text style={styles.text}>
        1. Làm thế nào để đặt bàn?{'\n'}
        → Bạn có thể đặt trực tiếp trong app ở mục "Đặt bàn".
      </Text>
      <Text style={styles.text}>
        2. Làm sao để hủy hoặc thay đổi đặt bàn?{'\n'}
        → Liên hệ hotline hoặc email để được hỗ trợ.
      </Text>
      <Text style={styles.text}>
        3. Tôi quên mật khẩu thì làm sao?{'\n'}
        → Sử dụng chức năng "Quên mật khẩu" ở màn đăng nhập.
      </Text>

      <Text style={styles.sectionTitle}>💡 Lưu ý</Text>
      <Text style={styles.text}>
        Mọi thắc mắc khác vui lòng liên hệ trực tiếp hotline hoặc email để được hỗ trợ nhanh chóng.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 10,
  },
  note: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
});
