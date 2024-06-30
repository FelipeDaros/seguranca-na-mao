import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { IFinishDay } from "../../interfaces/IFinishDay";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import moment from "moment-timezone";
import CustomButton from "../../components/CustomButton";
import { ScrollView, Text, View } from "react-native";
import Checkbox from "expo-checkbox";

export function FinishDay() {
  const [loading, setLoading] = useState(false);
  const [finishDay, setFinishDay] = useState<IFinishDay>();
  const [confirmaDevolucao, setConfirmaDevolucao] = useState(false);
  const { user, signOut } = useAuth();

  async function fetchData() {
    try {
      setLoading(true);
      //@ts-ignore
      const { data } = await api.get(`/import-app/finish-day/${user.user.id}`);
      setFinishDay(data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const handleDevolucaoCheckBox = () => setConfirmaDevolucao(!confirmaDevolucao);
  useEffect(() => {
    fetchData();
  }, []);

  async function finish(): Promise<void> {
    if (!confirmaDevolucao) {
      // return toast.show({
      //   title: "Confirme a devolução dos equipamentos!",
      //   duration: 3000,
      //   bg: "personColors.50",
      //   placement: "top",
      // });
    }

    try {
      setLoading(true);
      const payload = {
        user_id: user?.user.id,
        data: moment().toDate()
      };

      await api.post('/servico/finish', payload);
      signOut();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (<Loading />)
  }

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <Text className="text-white text-xl mb-4">Finalizando expediente</Text>
        <Text className="text-white text-xl mb-4">Rondas excluídas</Text>
        <View className="flex-col w-full">
          {finishDay?.equipamentos.map(item => <Text key={item?.id} className="text-white text-sm">{item?.nome}</Text>)}
        </View>
        <ScrollView className="flex-1 w-full h-40 gap-y-2 px-2" showsVerticalScrollIndicator={false}>
          {finishDay?.rondasCanceladas?.map(item => (
            <View key={item.id} className="flex-row gap-x-2 items-center justify-between bg-red-claro">
              <Text className="text-white text-lg">{item.Ponto.nome}</Text>
              <Text className="text-white text-sm">{item.motivo}</Text>
            </View>
          ))}
        </ScrollView>
        <Text className="text-white text-sm mb-4">
          Total de rondas efetuadas: {finishDay?.finishDay?.GerarRondas?.length}
        </Text>
        <Text className="text-white text-sm mb-4">
          Total de alertas emitidos: {finishDay?.finishDay?.Alerta?.length}
        </Text>
        <Text className="text-white text-sm mb-4">
          Confirmar devolução
        </Text>
        <Checkbox value={confirmaDevolucao} onValueChange={handleDevolucaoCheckBox} aria-label="confirmaDevolucao" />
        <CustomButton className="bg-red-claro" title="Finalizar" loading={loading} onPress={finish} />
      </View>
    </SafeAreaView>
  )
}