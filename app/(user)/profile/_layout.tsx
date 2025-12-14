import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      {/* Trang cá nhân chính – KHÔNG HEADER */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      {/* Các màn phụ – CÓ HEADER + NÚT BACK */}
      <Stack.Screen
        name="info"
        options={{ title: 'Thông tin tài khoản' }}
      />
      <Stack.Screen
        name="help-center"
        options={{ title: 'Trung tâm trợ giúp' }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{ title: 'Điều khoản & chính sách' }}
      />
    </Stack>
  );
}
