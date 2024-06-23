// import { Pressable, ScrollView, Text, VStack, useToast } from "native-base";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment-timezone";
import Loading from "../../components/Loading";
import CardsHome from "../../components/CardsHome";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { scheduleNotification, scheduleNotificationGerarRondas } from "../../services/notifications";
import { generateNowTimesTamp, generateNowTimesTampAddMinutesForConfiguration, generateRandomNumber } from "../../utils/utils";
import { PropsAlerta, saveAlerta } from "../../store/AlertaStorage";
import { IConfiguracoes } from "../../interfaces/IUsuario";
import { gerarRondasService } from "../../services/gerarRondasService";
import { sincronizarPontos } from "../../services/sincronizarPontos";
import { sincronizarRondas } from "../../services/sincronizarRondas";
import { sincronizarAlertas } from "../../services/sincronizarAlertas";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export function HomeVigilante() {
  const navigation = useNavigation();
  const toast = useToast();
  const { user, handleRonda, isConnected, handleAlertaVigia } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userConfigAlerta, setUserConfigAlerta] = useState<IConfiguracoes | undefined>({} as IConfiguracoes);
  const [userConfigRonda, setUserConfigRonda] = useState<IConfiguracoes | undefined>({} as IConfiguracoes);

  async function panico() {
    setLoading(true);
    try {
      await api.post("/panico", {
        usuario_id: user?.user.id,
        verificado: false,
        empresa_id: user?.user?.empresa_id
      });
      toast.show({
        title: "Pânico emitido com sucesso!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return toast.show({
          title: error?.response?.data.message,
          duration: 3000,
          bg: "error.500",
          placement: "top",
        });
      }

      toast.show({
        title: "Erro ao emitir!",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  }

  async function alerta() {
    const data = generateNowTimesTamp();

    const isValidHorario = moment(data).diff(user?.user?.horario_alerta, String(userConfigAlerta?.parametro) as any);

    if (!userConfigAlerta?.parametro) {
      return toast.show({
        title: 'Usuário sem configuração, entre em contato com o supervisor para realizar a configuração',
        duration: 5000,
        bg: "warning.400",
        placement: "top",
      });
    }

    if (isValidHorario < Number(userConfigAlerta?.valor)) {
      toast.show({
        title: 'A emissão não está agendada para o horário atual!',
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });

      return;
    }

    try {
      setLoading(true);
      // @ts-ignore
      await handleAlertaVigia(user?.user.id, data);
      await scheduleNotification(userConfigAlerta);
      await alertaVigiaSave();

      toast.show({
        title: "Alerta emitido com sucesso!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
      return;
    } catch (error: any) {
      if (!!error.response) {
        toast.show({
          title: error.response.data.message,
          duration: 3000,
          bg: "error.500",
          placement: "top",
        });
        return;
      }
      toast.show({
        title: "Erro ao emitir o alerta",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
      return;
    } finally {
      setLoading(false);
    }
  }

  async function alertaVigiaSave() {
    try {
      if (!!user?.user) {
        const alerta: PropsAlerta = {
          id: generateRandomNumber(),
          user_id: user.user.id,
          isSincronized: false,
          created_at: generateNowTimesTampAddMinutesForConfiguration(1)
        }

        await saveAlerta(alerta);
      }
    } catch (error) {
      throw error;
    }
  }

  async function gerarRondas() {
    try {
      if (!user) return;

      const configuracaoRonda = userConfigRonda;

      const data = generateNowTimesTampAddMinutesForConfiguration(Number(configuracaoRonda?.valor));
      await gerarRondasService(user);
      handleRonda(user?.user?.id, data);
    } catch (error) {
      toast.show({
        title: "Ocorreu um erro ao tentar gerar as rondas",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    }
  }

  useEffect(() => {
    const configuracao = user?.configuracao?.find(config => config.tipo === 'ALERTA');
    const rondasConfiguracao = user?.configuracao?.find(configuracao => configuracao.tipo === 'RONDA');

    setUserConfigRonda(rondasConfiguracao);
    setUserConfigAlerta(configuracao);

    if (user?.user.tipo_usuario === 'VIGILANTE') {
      sincronizarPontos(user);
    }

    if (moment(user?.proximaRonda).isBefore(moment().format())) {
      scheduleNotificationGerarRondas();
    }

  }, []);

  useEffect(() => {
    if (isConnected && user) {
      sincronizarRondas();
      sincronizarAlertas(user);
    }
  }, [isConnected]);

  return (
    <>
      {/* <VStack justifyContent="center" alignItems="center" mt="4">
        {moment(user?.proximaRonda).isAfter(moment().format()) &&
          <>
            <Text color="personColors.150"
              fontFamily="heading"
              fontSize="lg">Alerta Vigia</Text>
            <Pressable _disabled={{ opacity: 0.5 }} disabled={loading} onPress={alerta} _pressed={{ bg: 'gray.300' }} bg="personColors.50" w="70%" h="20" mt="4" rounded="md" justifyContent="center" alignItems="center">
              <Text color="personColors.100">Pressione para emitir</Text>
              <Text color="personColors.100">Próximo horario: {!!user?.ultimoAlerta ? moment(user?.ultimoAlerta).add(Number(userConfigAlerta?.valor), String(userConfigAlerta?.parametro) as any).format('HH:mm:ss') : 'Não há horário'}</Text>
              {loading && <Loading />}
            </Pressable>
          </>
        }
        {moment(user?.proximaRonda).isBefore(moment().format()) &&
          <>
            <Text color="personColors.150"
              fontFamily="heading"
              fontSize="lg">Alerta Vigia</Text>
            <Pressable _disabled={{ opacity: 0.5 }} disabled={loading} onPress={gerarRondas} _pressed={{ bg: 'gray.300' }} bg="error.500" w="70%" h="20" mt="4" rounded="md" justifyContent="center" alignItems="center">
              <Text color="personColors.100">GERAR RONDAS!</Text>
            </Pressable>
          </>
        }
      </VStack>
      <VStack justifyContent="center" alignItems="center" mt="4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} m="2">
          <CardsHome
            name="Panico"
            iconName="account-alert-outline"
            onLongPress={panico}
          />
          <CardsHome
            name="Ocorrências"
            route="Occurrence"
            iconName="pistol"
          />
        </ScrollView>
      </VStack> */}
    </>
  )
}