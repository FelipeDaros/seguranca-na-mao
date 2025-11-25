import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../config/api";
import { Alert, ScrollView, Text, View } from "react-native";
import { IEquipamento } from "../../interfaces/IEquipamento";
import Checkbox from "expo-checkbox";
import axios from "axios";
import CustomButton from "../../components/CustomButton";

export default function CheckList() {
  const { userAuth, signOut, handleChecked } = useAuth();
  const [confirmarLeitura, setConfirmarLeitura] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [equipamentos, setEquipamentos] = useState<IEquipamento[]>([] as IEquipamento[]);
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<
    number[]
  >([]);

  async function buscarEquipamentosPostoServico() {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/equipamentos-posto/listar-equipamentos/${userAuth?.user.posto_id}`
      );
      setEquipamentos(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Checklist", error.response?.data.message);
      }

      Alert.alert("Checklist", "Ocorreu um erro ao buscar os equipamentos");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFinsh() {
    try {
      setIsLoading(true);

      const payload = {
        usuario_id: userAuth?.user.id,
        empresa_id: userAuth?.user.empresa_id,
        posto_id: userAuth?.user.posto_id,
        relatorio_lido: true,
        equipamentos_id: equipamentosSelecionados
      }

      const statusUsuario = `LOGADO`;

      const { data } = await api.post(`/servico`, payload);

      await api.put(`/usuarios/update-status-logado/${userAuth?.user.id}/${statusUsuario}`);
      // @ts-ignore
      handleChecked(userAuth?.user.posto_id, data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Checklist", error.response?.data.message);
      }

      Alert.alert("Checklist", "Ocorreu um erro ao tentar confirmar");
    } finally {
      setIsLoading(false)
    }
  }

  async function selecionarEquipamentos(id: number) {
    if (equipamentosSelecionados.some((item) => item === id)) {
      const equipamentosAlterados = equipamentosSelecionados.filter(
        (item) => item !== id
      );
      setEquipamentosSelecionados(equipamentosAlterados);
    } else {
      setEquipamentosSelecionados([...equipamentosSelecionados, id]);
    }
  }

  useEffect(() => {
    buscarEquipamentosPostoServico()
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <ScrollView className="flex-1 w-full h-40 gap-y-2 px-2" showsVerticalScrollIndicator={false}>
          {equipamentos?.map(item => (
            <View key={item.id} className="flex-row gap-x-2 items-center justify-between">
              <Text className="text-white text-lg">{item.nome}</Text>
              <Checkbox
                value={equipamentosSelecionados.includes(item.id)}
                onValueChange={() => selecionarEquipamentos(item.id)}
              />
            </View>
          ))}
        </ScrollView>
        <Text className="text-white text-sm">
          Confirmo a leitura dos equipamamentos
        </Text>
        <Checkbox className="mb-2" value={confirmarLeitura} onValueChange={setConfirmarLeitura} aria-label="confirmaLeitura" />
        <CustomButton title="Confirmar" loading={isLoading} onPress={handleFinsh} />
      </View>
    </SafeAreaView>
  );
}
