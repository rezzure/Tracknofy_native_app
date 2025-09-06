import { Stack } from "expo-router";
import { ToastProvider } from 'react-native-toast-notifications';
// import global.css
import "../global.css";
export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* making screen */}
        <Stack.Screen name="index" />
      </Stack>
    </ToastProvider>
  );
}


