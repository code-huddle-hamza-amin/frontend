import { Stack } from "expo-router";
import "../globals.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen 
        name="screens/reg-login/login" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/reg-login/onboarding" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/reg-login/signup" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/home/index" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/forgotpassword/index" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/forgotpassword/changepassword" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/forgotpassword/otp" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/recored/index" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
      <Stack.Screen 
        name="screens/Managepermission/index" 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }} 
      />
    </Stack>
  );
}
