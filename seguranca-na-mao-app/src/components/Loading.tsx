import { View, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View className="flex-1 justify-center">
      <ActivityIndicator />
    </View>
  );
}
