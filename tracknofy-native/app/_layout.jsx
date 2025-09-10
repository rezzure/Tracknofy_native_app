import { Stack } from "expo-router";
import { ToastProvider } from 'react-native-toast-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import global.css
import "../global.css";
import { AuthProvider } from "../contexts/AuthContext";
export default function RootLayout() {
  return (
    <AuthProvider>
    <SafeAreaProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* making screen */}
          <Stack.Screen name="index" />
          {/* <Stack.Screen name="(supervisor)" /> */}
           {/* <Stack.Screen name="dashboard" />
           <Stack.Screen name="payments" />
           <Stack.Screen name="siteUpdate" />
           <Stack.Screen name="helpDesk" /> */}
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
    </AuthProvider>
  );
}


