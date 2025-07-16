import { Stack } from "expo-router";
import "../globals.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="reg-login" options={{ headerShown: false }} />
    </Stack>
  );
}
