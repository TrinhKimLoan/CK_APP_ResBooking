import { ScrollView, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.sectionTitle}>1. Giới thiệu</Text>
      <Text style={styles.text}>
        Chào mừng bạn đến với ứng dụng Reserva. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân theo các điều khoản và chính sách bảo mật dưới đây.
      </Text>

      <Text style={styles.sectionTitle}>2. Thu thập thông tin</Text>
      <Text style={styles.text}>
        Chúng tôi thu thập thông tin cá nhân như tên, email, số điện thoại khi bạn đăng ký tài khoản để cung cấp dịch vụ và trải nghiệm tốt nhất.
      </Text>

      <Text style={styles.sectionTitle}>3. Sử dụng thông tin</Text>
      <Text style={styles.text}>
        Thông tin cá nhân của bạn được sử dụng để:
        {'\n'}• Quản lý tài khoản và đăng nhập
        {'\n'}• Cải thiện trải nghiệm người dùng
        {'\n'}• Liên hệ thông báo thông tin quan trọng
        {'\n'}• Phân tích, nghiên cứu để nâng cao chất lượng dịch vụ
      </Text>

      <Text style={styles.sectionTitle}>4. Bảo mật thông tin</Text>
      <Text style={styles.text}>
        Chúng tôi cam kết bảo vệ dữ liệu của bạn bằng các biện pháp bảo mật hợp lý và không chia sẻ thông tin cá nhân cho bên thứ ba nếu không có sự đồng ý của bạn.
      </Text>

      <Text style={styles.sectionTitle}>5. Quyền của bạn</Text>
      <Text style={styles.text}>
        Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình theo quy định của pháp luật.
      </Text>

      <Text style={styles.sectionTitle}>6. Thay đổi điều khoản</Text>
      <Text style={styles.text}>
        Chúng tôi có thể cập nhật điều khoản và chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo trên ứng dụng. Vui lòng kiểm tra định kỳ để cập nhật thông tin mới nhất.
      </Text>

      <Text style={styles.sectionTitle}>7. Liên hệ</Text>
      <Text style={styles.text}>
        Nếu bạn có thắc mắc về điều khoản hoặc chính sách bảo mật, vui lòng liên hệ với chúng tôi qua email: support@reserva.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
});
