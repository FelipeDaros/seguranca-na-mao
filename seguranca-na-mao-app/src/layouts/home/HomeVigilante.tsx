import { View, Text, Pressable, Alert } from "react-native";
import axios from "axios";
import { get } from 'lodash';
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment-timezone";
import CardsHome from "../../components/CardsHome";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { scheduleNotification } from "../../services/notifications";
import { generateNowTimesTamp, generateNowTimesTampAddMinutesForConfiguration, generateRandomNumber } from "../../utils/utils";
import { PropsAlerta, saveAlerta } from "../../store/AlertaStorage";
import { gerarRondasService } from "../../services/gerarRondasService";
import { sincronizarPontos } from "../../services/sincronizarPontos";
import { sincronizarRondas } from "../../services/sincronizarRondas";
import { sincronizarAlertas } from "../../services/sincronizarAlertas";
import { useNavigation } from "@react-navigation/native";
import { IAuthUser } from "../../interfaces/IAuthUser";
import { getAllRondas } from "../../store/RondaStorage";

export function HomeVigilante() {
  const navigation = useNavigation();
  const { userAuth, updateUser, isConnected } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment());
  const getUser = get(userAuth, "user", null);
  const proximaRonda = get(userAuth, "proximaRonda", null);
  const [rondas, setRondas] = useState<any[]>([]);

  async function panico() {
    setLoading(true);
    try {
      if (!getUser) return;

      await api.post("/panico", {
        usuario_id: getUser.id,
        verificado: false,
        empresa_id: getUser.empresa_id
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
    try {
      setLoading(true);

      if (!getUser) return;

      const data = generateNowTimesTamp();

      // Calcula o tempo desde o último alerta
      const diferencaTempoUltimoAlertaEmMinutos = moment(data).diff(userAuth?.ultimoAlerta, 'minutes');

      // Se não passou 5 minutos, bloqueia o alerta
      if (diferencaTempoUltimoAlertaEmMinutos < 5) {
        Alert.alert("Alerta", "A emissão não está agendada para o horário atual!");
        return;
      }

      await scheduleNotification(5);
      await alertaVigiaSave();

      if (moment().isAfter(moment(proximaRonda))) {
        await gerarRondas();
      }

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
      if (!getUser || !userAuth) return

      const alerta: PropsAlerta = {
        id: generateRandomNumber(),
        user_id: getUser.id,
        isSincronized: false,
        created_at: generateNowTimesTampAddMinutesForConfiguration(1)
      }

      const userParsed: IAuthUser = { ...userAuth, ultimoAlerta: new Date() };
      updateUser(userParsed)

      await saveAlerta(alerta);
    } catch (error) {
      throw error;
    }
  }

  async function buscarRondas() {
    try {
      const rondas = await getAllRondas();
      setRondas(rondas);
    } catch (error) {
      console.log('Erro ao buscar rondas:', error);
    }
  }

  async function gerarRondas() {
    try {
      if (!userAuth) return;

      await gerarRondasService(userAuth);
      const updatedUser: IAuthUser = {
        ...userAuth,
        proximaRonda: new Date(Date.now() + 60 * 60000), // Próxima ronda em 60 minutos
      }
      updateUser(updatedUser);
    } catch (error) {
      Alert.alert("Gerar rondas", "Ocorreu um erro ao tentar gerar as rondas");
    }
  }

  function acessarRondas() {
    //@ts-ignore
    return navigation.navigate('Round');
  }

  const textNextAlert = () => {
    if (!userAuth?.ultimoAlerta) {
      return 'Emita seu primeiro alerta!';
    }

    const proximoAlerta = moment(userAuth.ultimoAlerta).add(5, 'minutes');

    if (currentTime.isSameOrAfter(proximoAlerta)) {
      return 'Emita seu alerta!';
    }

    const diff = proximoAlerta.diff(currentTime);
    const duration = moment.duration(diff);
    const minutos = duration.minutes();
    const segundos = duration.seconds();

    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    async function sincronizarTudo() {
      if (!getUser || !userAuth) return;

      await buscarRondas();

      // Sincronizar pontos do vigilante se necessário
      if (!userAuth.isSincronized) {
        try {
          await sincronizarPontos(getUser, (current, total, remaining) => {
            const porcentagem = Math.round((current / total) * 100);
            console.log(`📊 ${current}/${total} (${porcentagem}%) | Faltam: ${remaining}`);
          });
          console.log(`✅ Sincronização completa! novos pontos adicionados`);

          const userUpdated = {
            ...userAuth,
            isSincronized: true
          };
          updateUser(userUpdated);
        } catch (error) {
          console.error('❌ Erro ao sincronizar pontos:', error);
          Alert.alert('Erro', 'Falha na sincronização de pontos');
        }
      }

      // Sincronizar rondas, alertas e buscar rondas
      try {
        await Promise.all([
          sincronizarRondas(),
          sincronizarAlertas(userAuth),
        ]);
      } catch (error) {
        console.error('❌ Erro na sincronização:', error);
      }
    }

    sincronizarTudo();
  }, [getUser, userAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-background-escuro p-6">
      {rondas.length > 0 &&
        <Pressable disabled={loading} onPress={acessarRondas} className="bg-red-escuro rounded-md p-2 items-center justify-center">
          <Text className="text-white font-bold text-base">Acessar Rondas</Text>
          <Text className="text-white font-bold text-sm">Suas rondas foram geradas!</Text>
        </Pressable>
      }
      {!rondas.length &&
        <Pressable disabled={loading} onPress={alerta} className="bg-green-escuro rounded-md p-2 items-center justify-center">
          <Text className="text-white font-bold text-base">Próximo Alerta</Text>
          <Text className="text-white font-bold text-xl">{textNextAlert()}</Text>
        </Pressable>}
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