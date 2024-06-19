import { FlatList, Text, VStack, useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Cards } from "./Components/Cards";
import Loading from "../../components/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropsRonda, getAllRondas } from "../../store/RondaStorage";

export function Round() {
  const [isLoading, setIsLoading] = useState(false);
  const [rondas, setRondas] = useState<PropsRonda[]>([]);
  const { user, signOut, updateUser } = useAuth();
  const toast = useToast();

  async function buscarRondas() {
    setIsLoading(true);
    try {
      const data = (await getAllRondas()).filter(item => !item.isSincronized);

      setRondas(data);
      checkFinishRondas();
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

  async function checkFinishRondas(){
    const data = (await getAllRondas()).filter(item => !item.isSincronized);

    if(!data.length){
      const userUpdateFinishRondas = {
        ...user,
        isRondaActive: false
      }
      // @ts-ignore
      await updateUser(userUpdateFinishRondas);
    }
  }

  useFocusEffect(
    useCallback(() => {
      buscarRondas();
      checkFinishRondas();
    }, [])
  );

  return (
    <SafeAreaView style={{flex: 1}}>
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
          renderItem={({ item }) => <Cards item={item} fetchRondas={buscarRondas} fetchData={checkFinishRondas}/>}
        />
      )}
    </SafeAreaView>
  );
}
