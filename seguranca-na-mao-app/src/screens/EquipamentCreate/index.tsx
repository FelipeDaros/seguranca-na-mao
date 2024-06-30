import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { api } from "../../config/api";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export function EquipamentCreate() {
  const [equipamentos, setEquipamentos] = useState<string[]>([]);
  const [equipamento, setEquipamento] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  function adicionarEquipamento() {
    if (equipamento === "" || !equipamento) {
      return Alert.alert("Equipamentos", "Informe um nome para o equipamento");
    }

    // Verifica se o equipamento já está na lista
    if (equipamentos.some((e) => e === equipamento.toUpperCase())) {
      return Alert.alert("Equipamentos", "Equipamento já existe na lista");
    }

    // Adiciona o novo equipamento à lista
    setEquipamentos([...equipamentos, equipamento.toUpperCase()]);
    setEquipamento("");
  }


  async function removerEquipamento(nome: string) {
    const equipamentosAlterados = equipamentos.filter((item) => item !== nome);
    setEquipamentos(equipamentosAlterados);
  }

  async function salvarItens() {
    setIsLoading(true);
    if (!equipamentos.length) {
      setIsLoading(false);
      return Alert.alert("Equipamentos", "Informe pelo menos um equipamento");
    }

    try {
      await api.post("/equipamentos", {
        nome: equipamentos,
      });
      setEquipamento("");
      setEquipamentos([]);
      return Alert.alert("Equipamentos", "Equipamentos cadastrados com sucesso!");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Equipamentos", error.response?.data.message);
      }

      return Alert.alert("Equipamentos", "Erro ao cadastrar os equipamentos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <Text className="text-white text-xl">Cadastrar equipamento(s)</Text>
        <Text className="text-white text-lg">
          Nome
        </Text>
        <View className="w-full flex-row items-center justify-center gap-x-10">
          <CustomInput
            onChangeText={(value: any) => {
              setEquipamento(value);
            }}
            className="w-5/6"
            value={equipamento}
          />
          <Pressable onPress={adicionarEquipamento}>
            <MaterialCommunityIcons size={30} color="#00B37E" name="check-circle-outline" />
          </Pressable>
        </View>
        <ScrollView className="flex-1 w-full h-40 gap-y-2 px-2" showsVerticalScrollIndicator={false}>
          {equipamentos?.map(item => (
            <View key={item} className="flex-row gap-x-2 items-center justify-between">
              <Text className="text-white text-lg">{item}</Text>
              <Pressable onPress={() => removerEquipamento(item)}>
                <MaterialCommunityIcons size={30} color="#F75A68" name="close-circle-outline" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <CustomButton title="Salvar" loading={isLoading} onPress={salvarItens} />
      </View>
    </SafeAreaView >
  );
}
