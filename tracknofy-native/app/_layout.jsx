import { Stack } from "expo-router";
import { ToastProvider } from 'react-native-toast-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import global.css
import "../global.css";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* making screen */}
          <Stack.Screen name="index" />
          {/* <Stack.Screen name="(client)" /> */}
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}


