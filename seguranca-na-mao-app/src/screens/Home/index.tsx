import {
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import Header from "../../components/Header";
import { api } from "../../config/api";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import moment from 'moment-timezone';
import CardsHome from "../../components/CardsHome";
import { IPonto } from "../../interfaces/IPonto";
import Loading from "../../components/Loading";
import * as Notifications from 'expo-notifications';
import { scheduleNotification } from "../../services/notifications";
import { IConfiguracoes } from "../../interfaces/IUsuario";
import { GerarRondas } from "../../libs/realms/schemas/Rondas";
import { useQuery, useRealm } from "../../libs/realms";
import { Pontos } from "../../libs/realms/schemas/Pontos";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alerta } from "../../libs/realms/schemas/Alerta";
import { generateNowTimesTamp, generateNowTimesTampAddMinutesForConfiguration } from "../../utils/utils";

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
  const { user, handleAlertaVigia, signOut, handleRonda, isConnected } = useAuth();
  const [userConfigAlerta, setUserConfigAlerta] = useState<IConfiguracoes | undefined>({} as IConfiguracoes);
  const [userConfigRonda, setUserConfigRonda] = useState<IConfiguracoes | undefined>({} as IConfiguracoes);

  const realm = useRealm();
  const rondasSchema = useQuery(GerarRondas);
  const pontosSchema = useQuery(Pontos).filter(item => item.posto_id === user?.user?.posto_id);
  const alertaSchema = useQuery(Alerta);

  const isExistsRondasVerificadas = rondasSchema.some(item => item.isSincronized);
  
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
      await sincronizarAlertas();
      await gerarRondas();

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
        const id = user.user.id;

        realm.write(() => {
          realm.create('Alerta', Alerta.generate({
            user_id: id,
            // @ts-ignore
            created_at: generateNowTimesTamp()
          }));
        })
      }
    } catch (error) {
      throw error;
    }
  }

  async function sincronizarPontos() {
    try {
      setLoading(true);
      const { data } = await api.get<IPonto[]>(`/ponto/sincronizar/${user?.user.posto_id}`);

      for (const ponto of data) {
        const pontoExists = pontosSchema.some(item => item._id === ponto.id);

        if (pontoExists) return;

        realm.write(() => {
          realm.create('Pontos', Pontos.generate({
            _id: ponto.id,
            caminho_foto_qrcode: ponto.caminho_foto_qrcode ? ponto.caminho_foto_qrcode : " ",
            latitude: ponto.latitude,
            longitude: ponto.longitude,
            nome: ponto.nome,
            posto_id: ponto.posto_id,
            created_at: ponto.created_at
          }));
        })
      }
    } catch (error) {
      toast.show({
        title: 'Erro ao sincronizar os pontos',
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  }

  async function gerarRondas() {
    let incrementTempo = 0;
    const configuracaoRonda = userConfigRonda;
    const configuracaoAlerta = userConfigAlerta;
    const alertaDecrescente = alertaSchema.sorted('created_at', true).slice(0, Number(configuracaoRonda?.valor) / Number(configuracaoAlerta?.valor));

    if (configuracaoAlerta && configuracaoRonda) {
      alertaDecrescente.forEach((alerta: Alerta) => {
        incrementTempo = incrementTempo + Math.abs(moment(moment(user?.ultimaRonda).format()).subtract(3, "hours").diff(alerta.created_at, 'minutes'));
      })
    }

    const data = generateNowTimesTampAddMinutesForConfiguration(Number(configuracaoRonda?.valor));

    if (incrementTempo >= Number(configuracaoRonda?.valor)) {
      pontosSchema.forEach(ponto => {
        realm.write(() => {
          realm.create('GerarRondas', GerarRondas.generate({
            ponto_id: ponto._id,
            // @ts-ignore
            posto_id: user?.user?.posto_id,
            user_id: user?.user.id ?? " ",
            verificado: false,
            atrasado: false,
            nome: ponto.nome,
            maximo_horario: moment().add(15, 'minutes').format(),
            // @ts-ignore
            servico_id: user?.servico.id
          }));
        })
      });

      realm.write(() => {
        realm.delete(alertaSchema);
      });
      //@ts-ignore
      handleRonda(user?.user.id, data);
    }
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

  const sincronizarDados = useCallback(() => {
    const rondasVerificadas = rondasSchema.filter(item => item.isSincronized);

    if (rondasVerificadas.length >= 1) {
      rondasVerificadas.forEach(async (ronda) => {
        try {
          setLoading(true);
          await api.post('/import-app/sincronizar-rondas', ronda);

          realm.write(() => {
            const rondaParaExcluir = realm.objectForPrimaryKey('GerarRondas', ronda._id);
            if (rondaParaExcluir) {
              realm.delete(rondaParaExcluir);
            }
          });
          toast.show({
            title: "Sua(s) ronda(s) foram sincronizada(s)",
            duration: 3000,
            bg: "personColors.50",
            placement: "top",
          });
        } catch (error) {
          toast.show({
            title: 'Erro ao tentar enviar os dados',
            duration: 3000,
            bg: "error.500",
            placement: "top",
          });
        } finally {
          setLoading(false);
        }
      });
    }
  }, []);

  async function sincronizarAlertas() {
    const alertasParaSincronizar = alertaSchema.filter(item => !item.isSincronized);

    if (isConnected && alertasParaSincronizar.length) {
      alertasParaSincronizar.forEach(async (item) => {
        realm.write(() => {
          item.isSincronized = true;
        });

        const payload = {
          servico_id: user?.servico.id,
          created_at: item.created_at,
          user_id: user?.user.id,
        }
        await api.post('/import-app/sincronizar-alertas', payload);
      });
    }
  }

  useEffect(() => {
    requestPermissions();
    const configuracao = user?.configuracao?.find(config => config.tipo === 'ALERTA');
    const rondasConfiguracao = user?.configuracao?.find(configuracao => configuracao.tipo === 'RONDA');

    setUserConfigRonda(rondasConfiguracao);
    setUserConfigAlerta(configuracao);

    if (user?.user.tipo_usuario === 'VIGILANTE') {
      sincronizarPontos();
    }
  }, []);

  useEffect(() => {
    if (isExistsRondasVerificadas && isConnected) {
      sincronizarDados();
    }


  }, [isConnected, isExistsRondasVerificadas])

  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        <VStack justifyContent="center" alignItems="center" mt="4">
          {user?.user.tipo_usuario === 'VIGILANTE' &&
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
