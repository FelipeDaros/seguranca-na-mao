import {
  Avatar,
  HStack,
  HamburgerIcon,
  Icon,
  Menu,
  Pressable,
  Text,
  VStack,
  useToast,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useNetInfo } from "@react-native-community/netinfo";

type Props = {
  back?: boolean;
};

export default function Header({ back }: Props) {
  const toast = useToast();
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const { user, signOut, isConnected, handleFinishDay } = useAuth();
  //@ts-ignore
  const nomeUsuario = user?.user.nome[0].toUpperCase() + user?.user.nome?.substr(1);

  function handleNavigate() {
    //@ts-ignore
    navigation.navigate('Perfil')
  }

  function sair(){
    if(user?.user.tipo_usuario !== 'VIGILANTE'){
      return signOut();
    }

    if(!netInfo.isConnected){
      return toast.show({
        title: "Para finalizar expediente é necessário estar conectado",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
    }

    return handleFinishDay();
  }

  return (
    <VStack>
      {!isConnected &&
        <HStack position="absolute" justifyContent="center" borderBottomLeftRadius="md" borderBottomRightRadius="md" top="0" alignItems="center" backgroundColor="red.600" height="7" w="100%">
          <Text textAlign="center" color="white">Você está sem conexão</Text>
        </HStack>
      }
      <HStack
        justifyContent={back ? "space-between" : "flex-end"}
        px="6"
        alignItems="center"
        height={20}
        bg="personColors.50"
        borderBottomLeftRadius="xl"
        borderBottomRightRadius="xl"
      >
        {back && (
          <Pressable onPress={() => navigation.goBack()}>
            <Icon
              ml="2"
              size="lg"
              as={MaterialCommunityIcons}
              color="white"
              name="arrow-left"
            />
          </Pressable>
        )}
        <HStack alignItems="center">
          <Text color="white" mr="6" fontFamily="mono">
            {nomeUsuario}
          </Text>
          <Avatar marginRight="4" />
          <Menu
            w="140"
            color="white"
            
            trigger={(triggerProps) => {
              return (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                >
                  <HamburgerIcon color="white"/>
                </Pressable>
              );
            }}
          >
            <Menu.Item onPress={handleNavigate}>Perfil</Menu.Item>
            <Menu.Item onPress={sair}>{user?.user.tipo_usuario === 'VIGILANTE' ? "Finalizar expediente" : "Sair"}</Menu.Item>
          </Menu>
        </HStack>
      </HStack>
    </VStack>
  );
}
