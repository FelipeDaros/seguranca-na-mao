import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert, Pressable, Text, View } from "react-native";

type Props = {
  back?: boolean;
};

export default function Header({ back }: Props) {
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const { user, signOut, isConnected } = useAuth();
  //@ts-ignore
  const nomeUsuario = user?.user.nome[0].toUpperCase() + user?.user.nome?.substr(1);

  function handleNavigate() {
    //@ts-ignore
    navigation.navigate('Perfil')
  }

  function sair() {
    if (user?.user.tipo_usuario !== 'VIGILANTE') {
      return signOut();
    }
    
    if (!netInfo.isConnected) {
      Alert.alert("Sair", "Para finalizar expediente é necessário estar conectado");
    }
  }

  function chooseValue(selected: any) {
    switch (selected) {
      case 'perfil':
        handleNavigate();
        break;
      case 'sair':
        sair();
        break;
    }
  }

  return (
    <View className="bg-background-escuro gap-y-2 h-20 justify-center">
      {!isConnected &&
        <View className="flex-row justify-center h-8 items-center bg-red-claro">
          <Text className="text-white font-bold">Você está sem conexão!</Text>
        </View>
      }
      <View className={!!back ? "flex-row mx-2 justify-between items-center" : "flex-end items-end p-2"}>
        {!!back &&
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons size={22} color="#fff" name="arrow-left" />
          </Pressable>
        }
        <View className="flex-row gap-x-5 items-center">
          <Text className="text-white">
            {nomeUsuario}
          </Text>
          <Pressable onPress={sair} className="bg-red-escuro w-10 p-1 rounded-md items-center">
            <Text className="text-white">Sair</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
