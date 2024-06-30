import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  loading: boolean;
};

export default function CustomButton({ title, loading = false, ...rest }: Props) {
  return (
    <TouchableOpacity className="bg-green-escuro rounded-md p-2 w-40 h-10 items-center justify-center shadow-lg" {...rest}>
      {loading && <ActivityIndicator />}
      {!loading && <Text className="text-white font-bold">{title}</Text>}
    </TouchableOpacity>
  );
}
