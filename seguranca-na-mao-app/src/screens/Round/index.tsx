import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropsRonda, getAllRondas } from "../../store/RondaStorage";
import { Text, View } from "react-native";

export function Round() {
  const [isLoading, setIsLoading] = useState(false);
  const [rondas, setRondas] = useState<PropsRonda[]>([]);
  const { user, signOut, updateUser } = useAuth();

  async function buscarRondas() {
    setIsLoading(true);
    try {
      const data = (await getAllRondas()).filter(item => !item.isSincronized);

      setRondas(data);
      checkFinishRondas();
    } catch (error: any) {
      if (error.response.status === 401) {
        signOut();
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
      <View className="items-center justify-center">
        <Text className="text-white">
          Suas Rondas
        </Text>
      </View>
      {/* {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={rondas}
          renderItem={({ item }) => <Cards item={item} fetchRondas={buscarRondas} fetchData={checkFinishRondas}/>}
        />
      )} */}
    </SafeAreaView>
  );
}
