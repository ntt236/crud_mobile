import 'react-native-reanimated';
import "../global.css";
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false, // Ẩn header mặc định của Expo
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        {/* Điều hướng mặc định sẽ tự tìm đến file index.tsx hoặc nhóm route */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
      </Stack>

      {/* Quan trọng: Để Toast ở đây để nó có thể hiển thị đè lên mọi màn hình */}
      <Toast />
    </View>
  );
}