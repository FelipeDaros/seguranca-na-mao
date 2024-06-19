import { Flex, ScrollView, Text, View } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import CardsHome from "../../components/CardsHome";

export function HomeSupervisor() {
  return (
    <View alignItems="center" mt="8">
      <Text
        color="personColors.150"
        fontFamily="heading"
        fontSize="lg"
        mb="4"
      >
        Cadastros
      </Text>
      <Flex direction="row">
        <CardsHome
          name="Cadastrar ponto"
          route="PointCreate"
          iconName="map-marker-plus-outline"
        />
        <CardsHome
          name="Cadastrar Equipamento"
          route="EquipamentCreate"
          iconName="plus-minus"
        />
      </Flex>
      <Flex direction="row">
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
      </Flex>
      <Flex direction="row">
        <CardsHome
          name="Configurações"
          route="Configuracoes"
          iconName="cog"
        />
      </Flex>
    </View>
  )
}