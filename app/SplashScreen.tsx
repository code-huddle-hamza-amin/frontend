import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/screens/reg-login/onboarding");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="flex-row items-center">
        <Text className="text-3xl font-bold text-[#23272F]">Budget</Text>
        <View className="ml-2 bg-[#19E28A] rounded-md">
          <Text className="text-3xl font-bold text-white px-3 py-0.5">Nest</Text>
        </View>
      </View>
    </View>
  );
}