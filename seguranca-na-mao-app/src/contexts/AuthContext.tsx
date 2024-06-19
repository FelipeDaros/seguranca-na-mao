import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { api } from "../config/api";
import { IUsuario } from "../interfaces/IUsuario";
import Loading from "../components/Loading";
import { useNetInfo } from '@react-native-community/netinfo';
import { generateNowTimesTamp } from "../utils/utils";
import { IServico } from "../interfaces/IServico";
import moment from "moment-timezone";

type AuthContextDataProps = {
  user: IUsuario | null;
  isConnected: boolean;
  signIn(data: any, servico: IServico): Promise<any>;
  signOut(): Promise<void>;
  handleChecked(posto_id: number, servico: IServico): Promise<void>;
  handleAlertaVigia(id: string, data: Date | string): Promise<void>;
  updateUser(user: IUsuario): Promise<void>;
  handleRonda(id: string, data: Date | string): Promise<void>;
  handleFinishDay(): Promise<void>;
};

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);
// @ts-ignore
const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const netInfo = useNetInfo();

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");

      if (storagedUser) {
        const userParsed = JSON.parse(storagedUser);
        api.defaults.headers["Authorization"] = `Bearer ${userParsed.token}`;
        setUser(userParsed);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
    loadStoragedData();

    if (netInfo.isConnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }

  }, [netInfo.isConnected]);

  async function handleFinishDay(): Promise<void> {
    const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");

    // @ts-ignore
    const userParsed: IUsuario = JSON.parse(storagedUser);

    userParsed.user.status_logado = 'FINALIZADO';
    setUser(userParsed);

    await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(userParsed));

    await api.put(`/usuarios/${userParsed.user.id}`, userParsed.user)

    return
  }

  async function updateUser(user: IUsuario): Promise<void> {
    await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(user));
    setUser(user);
    return;
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  async function handleChecked(posto_id: number, servico: IServico): Promise<void> {
    const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");

    // @ts-ignore
    const userParsed: IUsuario = JSON.parse(storagedUser);

    userParsed.user.posto_id = posto_id;
    userParsed.user.status_logado = 'LOGADO';
    userParsed.servico = servico;

    if (userParsed.user.tipo_usuario === 'VIGILANTE') {
      const config = userParsed?.configuracao?.find(configuracao => configuracao.tipo === 'RONDA');

      if (config) {
        // @ts-ignore
        userParsed.proximaRonda = moment().add(config?.valor, config?.parametro).format();
      }
    }

    setUser(userParsed);

    await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(userParsed));
  }

  async function handleAlertaVigia(id: string, data: Date) {
    try {
      const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");
      // @ts-ignore
      const userParsed: IUsuario = JSON.parse(storagedUser);

      userParsed.user.horario_alerta = data;
      userParsed.ultimoAlerta = data;

      if (netInfo.isConnected) {
        await api.post('/usuarios/update-horario-alerta', {
          id,
          horario_alerta: data
        });
      }

      setUser(userParsed);

      await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(userParsed));
    } catch (error) {
      throw error;
    }
  }

  async function handleRonda(id: string, data: Date) {
    try {
      const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");
      // @ts-ignore
      const userParsed: IUsuario = JSON.parse(storagedUser);

      userParsed.ultimaRonda = data;
      userParsed.isRondaActive = true;

      if (netInfo.isConnected) {
        await api.post('/usuarios/update-horario-ronda', {
          id,
          horario_alerta: data
        })
      }

      if (userParsed.user.tipo_usuario === 'VIGILANTE') {
        const config = userParsed?.configuracao?.find(configuracao => configuracao.tipo === 'RONDA');

        if (config) {
          // @ts-ignore
          userParsed.proximaRonda = moment().add(config?.valor, config?.parametro).format();
        }
      }

      setUser(userParsed);

      await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(userParsed));
    } catch (error) {
      throw error;
    }
  }

  async function signIn(data: any, servico: IServico): Promise<any> {
    try {
      api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

      if (data) {
        const user = {
          ...data,
          ultimaRonda: generateNowTimesTamp()
        };

        if (user.user.tipo_usuario === "VIGILANTE") {
          if (!user.user.status_logado) {
            user.user.status_logado = "CHECKLIST";
            user.isRondaActive = false;
          }
        } else {
          user.user.status_logado = "LOGADO";
        }

        user.servico = servico;

        await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(user));

        setUser(data);
      }

      return;
    } catch (error: any) {
      throw error;
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    // @ts-ignore
    <AuthContext.Provider value={{ user, signIn, signOut, handleChecked, handleAlertaVigia, updateUser, handleRonda, isConnected, handleFinishDay }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { useAuth, AuthContextProvider };
