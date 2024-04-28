import {
  Button,
  HStack,
  Progress,
  VStack,
  useToast,
} from "native-base";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { StepOne } from "./Components/StepOne";
import { StepTwo } from "./Components/StepTwo";
import { StepThree } from "./Components/StepThree";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../config/api";
import { IPosto } from "../../interfaces/IPosto";
import { CheckListStore } from "../../store/CheckListStore";
import Loading from "../../components/Loading";

export default function CheckList() {
  const [postId, onChangeEquipamentos, onChangePreviousService, setIsLoading, equipamentosSelecionados, relatorioLido, checkListStoreClear, isLoading] = CheckListStore((state) => [state.postId, state.onChangeEquipamentos, state.onChangePreviousService, state.setIsLoading, state.equipamentosSelecionados, state.relatorioLido, state.checkListStoreClear, state.isLoading]);

  const { user, signOut, handleChecked } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [postos, setPostos] = useState<IPosto[]>([] as IPosto[]);

  async function buscarEquipamentosPostoServico(posto_id: number) {
    setIsLoading();
    try {
      const { data } = await api.get(
        `/equipamentos-posto/listar-equipamentos/${posto_id}`
      );
      onChangeEquipamentos(data);
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
      setIsLoading();
    }
  }

  async function buscarPostosDeServico() {
    setIsLoading();
    try {
      const { data } = await api.get(`/posto-servico/${user?.user.empresa_id}`);
      setPostos(data);
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
      setIsLoading();
    }
  }

  async function buscarUltimoServicoNoPosto(posto_id: number) {
    try {
      const { data } = await api.get(`/servico/ultimo-servico/${posto_id}`);
      if (!data) {
        return
      }
      onChangePreviousService(data);
    } catch (error) {
      return toast.show({
        title: "Ocorreu um erro ao tentar buscar os servicos",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    }
  }

  const onChangeStep = (type: string) => {
    if (type === 'FRONT') {
      setStep(step + 1);
    }

    if (type === 'BACK') {
      setStep(step - 1);
    }
  };

  async function handleFinsh() {
    try {
      setIsLoading();

      const payload = {
        usuario_id: user?.user.id,
        empresa_id: user?.user.empresa_id,
        posto_id: postId,
        relatorio_lido: relatorioLido,
        equipamentos_id: equipamentosSelecionados
      }

      const statusUsuario = `LOGADO`;

      const { data } = await api.post(`/servico`, payload);

      await api.put(`/usuarios/update-status-logado/${user?.user.id}/${statusUsuario}`);
      //@ts-ignore
      handleChecked(postId, data);
      checkListStoreClear();
    } catch (error) {
      return toast.show({
        title: "Ocorreu um erro ao tentar finalizar o checklist",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    } finally {
      setIsLoading();
    }
  }

  useEffect(() => {
    buscarPostosDeServico();
    if (postId) {
      buscarUltimoServicoNoPosto(postId);
      buscarEquipamentosPostoServico(postId);
    }
  }, [postId]);

  return (
    <SafeAreaView>
      {isLoading && <Loading />}
      {!isLoading &&
        <VStack justifyContent="center" alignItems="center">
          <Progress w="80%" my="10" colorScheme="emerald" value={step === 1 ? 33.333333333 : step === 2 ? 66.666666666 : 100} />
          {step === 1 && <StepOne postos={postos} />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          <HStack justifyContent="space-around" my="10">
            <Button bg="personColors.50" w="24" mx="12" disabled={step <= 1} onPress={() => onChangeStep('BACK')}>
              Anterior
            </Button>
            {step < 3 &&
              <Button bg="personColors.50" w="24" mx="12" disabled={step >= 3} onPress={() => onChangeStep('FRONT')}>
                Próximo
              </Button>
            }
            {step === 3 &&
              <Button bg="personColors.50" w="24" isLoading={isLoading} disabled={step !== 3} mx="12" onPress={handleFinsh}>
                Finalizar
              </Button>
            }
          </HStack>
        </VStack>
      }
    </SafeAreaView>
  );
}
