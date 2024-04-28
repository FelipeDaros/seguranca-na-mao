import { Box, Icon, ScrollView, Text, VStack, useToast } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { api } from "../../config/api";
import { SafeAreaView } from "react-native-safe-area-context";

export function EquipamentCreate() {
  const [equipamentos, setEquipamentos] = useState<string[]>([]);
  const [equipamento, setEquipamento] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  function adicionarEquipamento() {
    if (equipamento === "" || !equipamento) {
      toast.show({
        title: "Informe um nome para o equipamento",
        duration: 3000,
        bg: "red.500",
        placement: "top",
      });
      return;
    }

    setEquipamentos([...equipamentos, equipamento]);
    setEquipamento("");
  }

  async function removerEquipamento(nome: string) {
    const equipamentosAlterados = equipamentos.filter((item) => item !== nome);
    setEquipamentos(equipamentosAlterados);
  }

  async function salvarItens() {
    setIsLoading(true);
    if (!equipamentos.length) {
      toast.show({
        title: "Informe pelo menos um equipamento",
        duration: 3000,
        bg: "warning.600",
        placement: "top",
      });
      setIsLoading(false)
      return;
    }

    try {
      await api.post("/equipamentos", {
        nome: equipamentos,
      });
      setEquipamento("");
      setEquipamentos([]);
      toast.show({
        title: "Equipamentos cadastrados com sucesso!",
        duration: 3000,
        bg: "green.500",
        placement: "top",
      });
    } catch (error) {
      toast.show({
        title: "Erro ao cadastrar os equipamentos",
        duration: 3000,
        bg: "red.500",
        placement: "top",
      });
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <Header back />
      <VStack alignItems="center" justifyContent="center" mt="4">
        <Text fontFamily="mono" color="personColors.150" fontSize="lg">
          Cadastrar Equipamento
        </Text>
        <VStack mt="20%">
          <Text color="personColors.150" fontFamily="body" fontSize="md">
            Nome
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            onChangeText={(value: any) => {
              setEquipamento(value);
            }}
            value={equipamento}
          />
        </VStack>
      </VStack>
      <Pressable onPress={adicionarEquipamento}>
        <Icon
          ml="2"
          size="lg"
          as={MaterialCommunityIcons}
          color="personColors.150"
          name="plus"
          ml="10%"
          mt="2"
        />
      </Pressable>
      <VStack ml="12%" mt="4">
        <ScrollView
          h="40"
          w="90%"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {equipamentos?.length >= 1 &&
            equipamentos?.map((equipamento, index) => (
              <Box mt="2" key={index} flexDir="row" alignItems="center">
                <Text color="personColors.150" mt="1">
                  {index} - {equipamento}
                </Text>
                <Pressable onPress={() => removerEquipamento(equipamento)}>
                  <Icon
                    ml="2"
                    size="lg"
                    as={MaterialCommunityIcons}
                    color="red.500"
                    name="close"
                    mt="2"
                  />
                </Pressable>
              </Box>
            ))}
        </ScrollView>
      </VStack>
      <VStack mt="40%" alignItems="center">
        <CustomButton title="Salvar" onPress={salvarItens} isLoading={isLoading}/>
      </VStack>
    </SafeAreaView>
  );
}
