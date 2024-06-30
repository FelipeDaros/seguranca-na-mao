import { Text, View } from "react-native";
import CardsHome from "../../components/CardsHome";

export function HomeAdministrador() {
  return (
    <View className="flex-1 bg-background-escuro p-6 items-center">
      <View className="gap-y-5">
        <Text className="text-white font-bold text-lg text-center">
          Cadastros
        </Text>
        <View className="flex-row">
          <CardsHome
            name="Cadastrar Usuários"
            route="Usuarios"
            iconName="account-multiple-plus"
          />
          <CardsHome
            name="Empresas"
            iconName="shield-home-outline"
            route="Empresas"
          />
        </View>
      </View>
    </View>
  )
}