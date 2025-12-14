import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/theme';

export default function HelpCenterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📞 Hotline: 1900 1234</Text>
      <Text style={styles.text}>📧 Email: support@reserva.vn</Text>
      <Text style={styles.text}>❓ FAQ: Liên hệ admin để biết thêm chi tiết</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    marginBottom: 10,
  },
});
