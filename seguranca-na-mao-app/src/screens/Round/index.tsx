import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropsRonda, getAllRondas } from "../../store/RondaStorage";
import { FlatList, Text, View } from "react-native";
import { Cards } from "./Components/Cards";

export function Round() {
  const [isLoading, setIsLoading] = useState(false);
  const [rondas, setRondas] = useState<PropsRonda[]>([]);
  const { userAuth, signOut, updateUser } = useAuth();

  async function buscarRondas() {
    try {
      setIsLoading(true);
      const data = (await getAllRondas()).filter(item => !item.isSincronized);
      // console.log(data);
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

  async function checkFinishRondas() {
    const data = (await getAllRondas()).filter(item => !item.isSincronized);

    if (!data.length) {
      const userUpdateFinishRondas = {
        ...userAuth,
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
    <SafeAreaView className="flex-1 bg-background-escuro">
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <Text className="text-white text-xl mb-4">Suas rondas</Text>
        <FlatList
          data={rondas}
          renderItem={({ item }) => <Cards item={item} fetchRondas={buscarRondas} fetchData={checkFinishRondas} />}
        />
      </View>
    </SafeAreaView>
  );
}
