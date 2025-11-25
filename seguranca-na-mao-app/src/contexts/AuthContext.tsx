import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../config/api";
import Loading from "../components/Loading";
import { useNetInfo } from '@react-native-community/netinfo';
import { IServico } from "../interfaces/IServico";
import { IAuthUser } from "../interfaces/IAuthUser";

type AuthContextDataProps = {
  userAuth: IAuthUser | null;
  isConnected: boolean;
  signIn(data: any, servico: IServico): Promise<void>;
  signOut(): Promise<void>;
  handleChecked(posto_id: number, servico: IServico): Promise<void>;
  updateUser(user: IAuthUser): Promise<void>;
  handleRonda(id: string, data: Date | string): Promise<void>;
};

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [userAuth, setUserAuth] = useState<IAuthUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const netInfo = useNetInfo();

  useEffect(() => {
    async function loadStoragedData() {
      try {
        const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");

        if (storagedUser) {
          const userParsed: IAuthUser = JSON.parse(storagedUser);
          api.defaults.headers["Authorization"] = `Bearer ${userParsed.token}`;
          setUserAuth(userParsed);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  useEffect(() => {
    setIsConnected(netInfo.isConnected ?? false);
  }, [netInfo.isConnected]);

  async function updateUser(user: IAuthUser): Promise<void> {
    try {
      await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(user));
      setUserAuth(user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await AsyncStorage.clear();
      setUserAuth(null);
      delete api.defaults.headers["Authorization"];
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }

  async function handleChecked(posto_id: number, servico: IServico): Promise<void> {
    try {
      const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");

      if (!storagedUser) {
        throw new Error("Usuário não encontrado");
      }

      const userParsed: IAuthUser = JSON.parse(storagedUser);

      const updatedUser: IAuthUser = {
        ...userParsed,
        user: {
          ...userParsed.user,
          posto_id,
          status_logado: 'LOGADO'
        },
        servico
      };

      await updateUser(updatedUser);
    } catch (error) {
      console.error("Erro ao fazer checklist:", error);
      throw error;
    }
  }

  async function handleRonda(id: string, data: Date | string): Promise<void> {
    try {
      const storagedUser = await AsyncStorage.getItem("@SEGMAO:user");

      if (!storagedUser) {
        throw new Error("Usuário não encontrado");
      }

      const userParsed: IAuthUser = JSON.parse(storagedUser);
      const dataFormatted = typeof data === 'string' ? new Date(data) : data;

      const updatedUser: IAuthUser = {
        ...userParsed,
        ultimaRonda: dataFormatted,
        isRondaActive: true
      };

      if (isConnected) {
        await api.post('/usuarios/update-horario-ronda', {
          id,
          horario_alerta: dataFormatted
        });
      }

      await updateUser(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar ronda:", error);
      throw error;
    }
  }

  async function signIn(data: any, servico: IServico): Promise<void> {
    try {
      if (!data || !data.token) {
        throw new Error("Dados de login inválidos");
      }

      api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

      const user: IAuthUser = {
        ...data,
        ultimaRonda: new Date(),
        isSincronized: false,
        proximaRonda: new Date(Date.now() + 60 * 60000),
        servico
      };

      if (user.user.tipo_usuario === "VIGILANTE") {
        if (!user.user.status_logado) {
          user.user.status_logado = "CHECKLIST";
          user.isRondaActive = false;
        }
      } else {
        user.user.status_logado = "LOGADO";
      }

      await AsyncStorage.setItem("@SEGMAO:user", JSON.stringify(user));
      setUserAuth(user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        userAuth,
        signIn,
        signOut,
        handleChecked,
        updateUser,
        handleRonda,
        isConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextDataProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }

  return context;
}

export { useAuth, AuthContextProvider };