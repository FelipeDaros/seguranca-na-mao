import { View, Text, Pressable, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment-timezone";
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
import { getAllPontos } from "../../store/PontoStorage";

export function HomeVigilante() {
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
      Alert.alert("Panico", "Foi emitido com sucesso!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Panico", error?.response?.data.message);
      }
      return Alert.alert("Panico", "Erro ao emitir!");
    } finally {
      setLoading(false);
    }
  }

  async function alerta() {
    const data = generateNowTimesTamp();

    const isValidHorario = moment(data).diff(user?.user?.horario_alerta, String(userConfigAlerta?.parametro) as any);

    if (!userConfigAlerta?.parametro) {
      Alert.alert("Alerta", "Usuário sem configuração, entre em contato com o supervisor para realizar a configuração");
    }

    if (isValidHorario < Number(userConfigAlerta?.valor)) {
      Alert.alert("Alerta", "A emissão não está agendada para o horário atual!");
      return;
    }

    try {
      setLoading(true);
      // @ts-ignore
      await handleAlertaVigia(user?.user.id, data);
      await scheduleNotification(userConfigAlerta);
      await alertaVigiaSave();
      Alert.alert("Alerta", "Alerta emitido com sucesso!");
      return;
    } catch (error: any) {
      if (!!error.response) {
        return Alert.alert("Alerta", error.response.data.message);
      }
      Alert.alert("Alerta", "Erro ao emitir o alerta");
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
      Alert.alert("Gerar rondas", "Ocorreu um erro ao tentar gerar as rondas");
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
    <View className="flex-1 bg-background-escuro p-6">
      {moment(user?.proximaRonda).isAfter(moment().format()) &&
        <Pressable disabled={loading} onPress={alerta} className="bg-green-escuro rounded-md p-2 items-center justify-center">
          <Text className="text-white font-bold text-lg">Alerta Vigia</Text>
          <Text className="text-white">Pressione para emitir</Text>
          <Text className="text-white">Próximo horario: {!!user?.ultimoAlerta ? moment(user?.ultimoAlerta).add(Number(userConfigAlerta?.valor), String(userConfigAlerta?.parametro) as any).format('HH:mm:ss') : 'Não há horário'}</Text>
        </Pressable>
      }
      {moment(user?.proximaRonda).isBefore(moment().format()) &&
        <Pressable disabled={loading} onPress={gerarRondas} className="bg-red-escuro rounded-md p-2 items-center justify-center">
          <Text className="text-white font-bold text-base">Alerta Vigia</Text>
          <Text className="text-white font-bold text-xl">GERAR RONDAS!</Text>
        </Pressable>
      }
      <View className="mt-2 flex-row items-center justify-center">
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
      </View>
    </View>
  )
}