import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, PressableProps, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = PressableProps & {
  name: string;
  route?: string;
  iconName: any;
};

export default function CardsHome({ name, route, iconName, ...rest }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  function navigateRoute(route: string) {
    navigation.navigate(route as never);
  }

  return (
    <Pressable
      {...rest}
      onPress={() => {
        if (route) {
          navigateRoute(route);
        }
      }}
    >
      <View className="bg-gray-300 rounded-md mx-2 h-28 w-28 justify-center items-center">
        <Text className="text-center my-2">{name}</Text>
        <MaterialCommunityIcons name={iconName} size={28} />
      </View>
    </Pressable>
  );
}