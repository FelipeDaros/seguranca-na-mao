import Header from "../../components/Header";
import { api } from "../../config/api";
import { useCallback, useState } from "react";
import { IOcorrenciaProps } from "./Interfaces/IOcorrence";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Occurrence() {
  const navigation = useNavigation();
  const [ocorrencias, setOcorrencias] = useState<IOcorrenciaProps[]>([]);
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const { userAuth, signOut } = useAuth();

  async function buscarOccorrencias() {
    try {
      const { data } = await api.get("/ocorrencia");
      setOcorrencias(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        signOut();
        Alert.alert("Erro", "Você precisa efetuar o login!");
        return;
      }
      Alert.alert("Erro", "Erro ao listar ocorrências!");
    }
  }

  function handleNavigateRegistroOcorrencia() {
    navigation.navigate("RegisterOccurrence" as never);
  }

  useFocusEffect(
    useCallback(() => {
      buscarOccorrencias();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <View className="flex-1 items-center mt-4">
        <Text className="text-white text-lg font-mono">
          Ocorrências
        </Text>
        <Pressable
          onPress={handleNavigateRegistroOcorrencia}
          className="border border-green-500 rounded-md w-4/5 p-3 mt-8 items-center"
        >
          <Text className="text-green-500 font-bold">
            Registrar Ocorrência
          </Text>
        </Pressable>
        <FlatList
          className="mt-4 w-full"
          showsVerticalScrollIndicator={false}
          data={ocorrencias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setOcorrenciaSelecionada(item.id);
                setIsOpen(true);
              }}
              className="bg-zinc-800 mx-4 my-2 p-4 rounded-md"
            >
              <Text className="text-white text-base">
                Ocorrência #{item.id}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}