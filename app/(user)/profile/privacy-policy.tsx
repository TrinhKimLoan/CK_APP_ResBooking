import { ScrollView, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        Ứng dụng Reserva cam kết bảo mật thông tin cá nhân của người dùng...
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
});
