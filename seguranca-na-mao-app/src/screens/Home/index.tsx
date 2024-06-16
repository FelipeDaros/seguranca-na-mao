import {
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import Header from "../../components/Header";
import { api } from "../../config/api";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import moment from 'moment-timezone';
import CardsHome from "../../components/CardsHome";
import Loading from "../../components/Loading";
import * as Notifications from 'expo-notifications';
import { scheduleNotification } from "../../services/notifications";
import { IConfiguracoes } from "../../interfaces/IUsuario";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateNowTimesTamp, generateNowTimesTampAddMinutesForConfiguration, generateRandomNumber } from "../../utils/utils";
import { sincronizarPontos } from "../../services/sincronizarPontos";
import { PropsAlerta, saveAlerta } from "../../store/AlertaStorage";
import { sincronizarAlertas } from "../../services/sincronizarAlertas";
import { sincronizarRondas } from "../../services/sincronizarRondas";
import { gerarRondasService } from "../../services/gerarRondasService";

const tiposUsuarios = [
  "SUPERVISOR",
  "ADMINISTRADOR"
]

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Home() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { user, handleAlertaVigia, updateUser, handleRonda, isConnected } = useAuth();
  const [userConfigAlerta, setUserConfigAlerta] = useState<IConfiguracoes | undefined>({} as IConfiguracoes);
  const [userConfigRonda, setUserConfigRonda] = useState<IConfiguracoes | undefined>({} as IConfiguracoes);

  async function panico() {
    setLoading(true);
    try {
      await api.post("/panico", {
        usuario_id: user?.user.id,
        verificado: false,
      });
      toast.show({
        title: "Pânico emitido com sucesso!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
    } catch (error) {
      toast.show({
        title: "Erro ao emitir o alerta!",
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
    if (!user) return;

    const configuracaoRonda = userConfigRonda;

    const data = generateNowTimesTampAddMinutesForConfiguration(Number(configuracaoRonda?.valor));
    await gerarRondasService(user);
    handleRonda(user?.user?.id, data);
  }

  async function requestPermissions() {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  }

  useEffect(() => {
    requestPermissions();
    const configuracao = user?.configuracao?.find(config => config.tipo === 'ALERTA');
    const rondasConfiguracao = user?.configuracao?.find(configuracao => configuracao.tipo === 'RONDA');

    setUserConfigRonda(rondasConfiguracao);
    setUserConfigAlerta(configuracao);

    if (user?.user.tipo_usuario === 'VIGILANTE') {
      sincronizarPontos(user);
    }

  }, []);

  useEffect(() => {
    if (isConnected && user) {
      sincronizarRondas();
      sincronizarAlertas(user);
    }
  }, [isConnected]);

  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        <VStack justifyContent="center" alignItems="center" mt="4">
          {user?.user.tipo_usuario === 'VIGILANTE' && moment(user?.proximaRonda).isAfter(moment().format()) &&
            <>
              <Text color="personColors.150"
                fontFamily="heading"
                fontSize="lg">Alerta Vigia</Text>
              <Pressable _disabled={{ opacity: 0.5 }} disabled={loading} onPress={alerta} _pressed={{ bg: 'gray.300' }} bg="personColors.50" w="70%" h="20" mt="4" rounded="md" justifyContent="center" alignItems="center">
                <Text color="personColors.100">Pressione para emitir</Text>
                <Text color="personColors.100">Próximo horario: {!!user.ultimoAlerta ? moment(user.ultimoAlerta).add(Number(userConfigAlerta?.valor), String(userConfigAlerta?.parametro) as any).format('HH:mm:ss') : 'Não há horário'}</Text>
                {loading && <Loading />}
              </Pressable>
            </>
          }
          {user?.user.tipo_usuario === 'VIGILANTE' && moment(user?.proximaRonda).isBefore(moment().format()) &&
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
          <Text color="personColors.150"
            fontFamily="heading"
            fontSize="lg">Utilitários</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} m="2">
            <CardsHome name="Rondas"
              route="Round"
              iconName="alert-circle-outline"
            />
            <CardsHome
              name="Panico"
              iconName="account-alert-outline"
              onLongPress={panico}
            />
          </ScrollView>
        </VStack>
        <VStack justifyContent="center" alignItems="center" mt="4">
          <Text color="personColors.150"
            fontFamily="heading"
            fontSize="lg">Cadastros</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} m="2">
            {tiposUsuarios.some(item => item === user?.user.tipo_usuario) && <><CardsHome
              name="Cadastrar ponto"
              route="PointCreate"
              iconName="map-marker-plus-outline"
            />
              <CardsHome
                name="Cadastrar Equipamento"
                route="EquipamentCreate"
                iconName="plus-minus"
              />
              <CardsHome
                name="Cadastrar Posto"
                route="PostService"
                iconName="shield-home-outline"
              />
              <CardsHome
                name="Cadastrar Usuários"
                route="Usuarios"
                iconName="account-multiple-plus"
              />
              <CardsHome
                name="Configurações"
                route="Configuracoes"
                iconName="cog"
              />
            </>
            }
            <CardsHome
              name="Ocorrências"
              route="Occurrence"
              iconName="pistol"
            />
            {user?.user.tipo_usuario === 'ADMINISTRADOR' &&
              <CardsHome
                name="Empresas"
                iconName="shield-home-outline"
                route="Empresas"
              />
            }
          </ScrollView>
        </VStack>
        {tiposUsuarios.some(item => item === user?.user.tipo_usuario) && <VStack justifyContent="center" alignItems="center" mt="4">
          <Text color="personColors.150"
            fontFamily="heading"
            fontSize="lg">Relatórios</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} m="2">
            <CardsHome name="Rondas"
              route="RelatorioRonda"
              iconName="map-marker-distance"
            />
            <CardsHome
              name="Alertas"
              iconName="clipboard-clock-outline"
              route="RelatorioAlertas"
            />
          </ScrollView>
        </VStack>
        }
      </ScrollView>
    </SafeAreaView>
  );
}
