import { Stack } from "expo-router";
// import global.css
import "../global.css";
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* making screen */}
      <Stack.Screen name="index" />
    </Stack>
  );
}


