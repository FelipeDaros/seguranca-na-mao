import { Text, View } from "react-native";
import CardsHome from "../../components/CardsHome";

export function HomeSupervisor() {
  return (
    <View className="flex-1 bg-background-escuro p-6 items-center">
      <View className="gap-y-5">
        <Text className="text-white font-bold text-lg text-center">
          Cadastros
        </Text>
        <View className="flex-row">
          <CardsHome
            name="Cadastrar Ponto"
            route="PointCreate"
            iconName="map-marker-plus-outline"
          />
          <CardsHome
            name="Cadastrar Equipamentos"
            route="EquipamentCreate"
            iconName="plus-minus"
          />
        </View>
        <View className="flex-row">
          <CardsHome
            name="Cadastrar Posto"
            route="PostService"
            iconName="shield-home-outline"
          />
          <CardsHome
            name="Cadastrar Usuários"
            route="Usuarios"
            iconName="account-multiple-plus"
          />
        </View>
        <View className="flex-row">
          <CardsHome
            name="Configurações"
            route="Configuracoes"
            iconName="cog"
          />
        </View>
      </View>
    </View>
  )
}