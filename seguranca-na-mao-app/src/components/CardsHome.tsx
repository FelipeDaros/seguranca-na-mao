import { useNavigation } from "@react-navigation/native";
import {
  Pressable,
  IPressableProps,
  Text,
  Icon,
  Box,
  VStack,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = IPressableProps & {
  name: string;
  route?: string;
  iconName: string;
};

export default function CardsHome({ name, route, iconName, ...rest }: Props) {
  const navigation = useNavigation();

  function navigateRoute(route: string) {
    navigation.navigate(route);
  }

  return (
    <Pressable
      {...rest}
      onPress={() => {
        if (route) {
          navigateRoute(route);
        }
      }}
      _pressed={{ bg: 'gray.300' }}
      bg="gray.200"
      w="32"
      h="32"
      m="2"
      p="2"
      rounded="md"
      justifyContent="center"
      alignItems="center"
    >
      <VStack justifyContent="center" alignItems="center">
        <Text color="personColors.150" textAlign="center">{name}</Text>
        <Icon
          mt="2"
          size={8}
          as={MaterialCommunityIcons}
          color="personColors.50"
          name={iconName}
        />
      </VStack>
    </Pressable>
  );
}
