import { FlatList, Text, VStack, useToast } from "native-base";
import Header from "../../components/Header";
import { useCallback, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Cards } from "./Components/Cards";
import Loading from "../../components/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { GerarRondas } from "../../libs/realms/schemas/Rondas";
import { useQuery } from "../../libs/realms";
import { SafeAreaView } from "react-native-safe-area-context";

export function Round() {
  const [isLoading, setIsLoading] = useState(false);
  const [rondas, setRondas] = useState<GerarRondas[] | null>([]);
  const { user, signOut } = useAuth();
  const toast = useToast();

  const rondasSchema = useQuery(GerarRondas);
  useFocusEffect(
    useCallback(() => {
      buscarRondas();
    }, [])
  );
    
  async function buscarRondas() {
    setIsLoading(true);
    try {
      const data = rondasSchema.filter(item => !item.isSincronized);

      setRondas(data);
    } catch (error: any) {
      if (error.response.status === 401) {
        signOut();
        toast.show({
          title: "Você precisa efetuar o login!",
          duration: 3000,
          bg: "error.500",
          placement: "top",
        });
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <Header back />
      <VStack mt="2" justifyItems="center" alignItems="center">
        <Text
          color="personColors.150"
          fontFamily="heading"
          fontSize="2xl"
          mb="4"
        >
          Suas Rondas
        </Text>
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={rondas}
          renderItem={({ item }) => <Cards item={item} fetchRondas={buscarRondas}/>}
        />
      )}
    </SafeAreaView>
  );
}
