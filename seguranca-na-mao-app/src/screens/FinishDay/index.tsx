import { Box, Checkbox, FlatList, HStack, Icon, ScrollView, Text, VStack, useToast } from "native-base";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { IFinishDay } from "../../interfaces/IFinishDay";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import Loading from "../../components/Loading";
import moment from "moment-timezone";

export function FinishDay() {
  const toast = useToast();
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
      return toast.show({
        title: "Confirme a devolução dos equipamentos!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
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
    <SafeAreaView>
      <ScrollView>
        <VStack alignItems="center" justifyItems="center" mt="4">
          <Text fontFamily="mono" color="personColors.150" fontSize="lg">
            Finalizando expediente
          </Text>
          <Text fontFamily="heading" color="personColors.150" fontSize="sm" mt="4">
            Informe os equipamentos para devolução
          </Text>
          <Box bg="personColors.100" width="56" alignItems="center" justifyItems="center" borderRadius="md" padding="2" mt="2">
            {finishDay?.equipamentos.map(item => <Text key={item?.id} color="personColors.150">{item?.nome}</Text>)}
          </Box>
          <Text fontFamily="heading" color="personColors.150" fontSize="sm" mt="4">
            Rondas excluídas
          </Text>
          {finishDay?.rondasCanceladas.map(item =>
            <HStack key={item.id} width="56" alignItems="center" borderRadius="md" bg="error.500" mt="2">
              <VStack justifyContent="center" alignItems="center" w="20%">
                <Icon
                  size={8}
                  as={MaterialCommunityIcons}
                  color="white"
                  name="alert-circle"
                />
              </VStack>
              <VStack justifyContent="center">
                <Text fontFamily="body" color="white" fontSize="sm">
                  {item?.Ponto?.nome}
                </Text>
                <Text fontFamily="body" color="white" fontSize="10">
                  {item?.motivo}
                </Text>
              </VStack>
            </HStack>
          )}
          <Text fontFamily="heading" color="personColors.150" fontSize="sm" mt="4">
            Total de rondas efetuadas: {finishDay?.finishDay?.GerarRondas?.length}
          </Text>
          <Text fontFamily="heading" color="personColors.150" fontSize="sm" mt="4">
            Total de alertas emitidos: {finishDay?.finishDay?.Alerta?.length}
          </Text>
          <Text fontFamily="heading" color="personColors.150" fontSize="sm" mt="4">
            Confirmar devolução
          </Text>
          {/* @ts-ignore */}
          <Checkbox mt="2" value={confirmaDevolucao} onChange={handleDevolucaoCheckBox} aria-label="confirmaDevolucao" />
        </VStack>
        <Button bg="error.500" title="Finalizar Expediente" onPress={finish} mt="4" />
      </ScrollView>
    </SafeAreaView>
  )
}