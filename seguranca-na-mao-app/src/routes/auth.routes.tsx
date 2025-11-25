import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CheckList from "../screens/CheckList";
import Home from "../screens/Home";
import PointCreate from "../screens/PointCreate";
import { EquipamentCreate } from "../screens/EquipamentCreate";
import PostService from "../screens/PostService";
import Occurrence from "../screens/Occurrence";
import RegisterOccurrence from "../screens/Occurrence/Register";
import { useAuth } from "../contexts/AuthContext";
import { FormUsuarios } from "../screens/Usuarios/form";
import { Usuarios } from "../screens/Usuarios";
import { EditUsuarios } from "../screens/Usuarios/edit";
import { Perfil } from "../screens/Usuarios/perfil";
import Configuracoes from "../screens/Configuracoes";
import RegisterConfiguracoes from "../screens/Configuracoes/register";
import { RelatorioRonda } from "../screens/Relatorios/rondas";
import { RelatorioAlertas } from "../screens/Relatorios/aletas";
import { Empresas } from "../screens/Empresas";
import { EmpresaSelecionada } from "../screens/Empresas/EmpresaSelecionada";
import { FinishDay } from "../screens/FinishDay";
import { RegisterEmpresa } from "../screens/Empresas/RegisterEmpresa";
import { Round } from "../screens/Round";
import { RoundSelected } from "../screens/Round/Components/RoundSelected";

export function AuthRoutes() {
  const { Screen, Navigator, Group } = createNativeStackNavigator();
  const { userAuth } = useAuth();
  return (
    <Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      {(userAuth?.user.status_logado === 'CHECKLIST' && userAuth?.user.tipo_usuario === 'VIGILANTE') && <Screen name="CheckList" component={CheckList} />}
      {(userAuth?.user.status_logado === 'FINALIZADO' && userAuth?.user.tipo_usuario === 'VIGILANTE') && <Screen name="FinishDay" component={FinishDay} />}
      {((userAuth?.user.status_logado === 'LOGADO' && userAuth?.user.tipo_usuario === 'VIGILANTE') || userAuth?.user.tipo_usuario !== 'VIGILANTE') &&
        <Group>
          <Screen name="Home" component={Home} />
          <Screen name="PointCreate" component={PointCreate} />
          <Screen name="PostService" component={PostService} />
          <Screen name="EquipamentCreate" component={EquipamentCreate} />
          <Screen name="Usuarios" component={Usuarios} />
          <Screen name="FormUsuarios" component={FormUsuarios} />
          <Screen name="EditUsuarios" component={EditUsuarios} />
          <Screen name="Configuracoes" component={Configuracoes} />
          <Screen name="RegisterConfiguracoes" component={RegisterConfiguracoes} />
          <Screen name="Perfil" component={Perfil} />
          <Screen name="Empresas" component={Empresas} />
          {/* <Screen name="EmpresaSelecionada" component={EmpresaSelecionada} /> */}
          <Screen name="RegisterEmpresa" component={RegisterEmpresa} />
          
          <Screen name="Occurrence" component={Occurrence} />
          <Screen name="RegisterOccurrence" component={RegisterOccurrence} />
          <Screen name="Round" component={Round} />
          <Screen name="RoundSelected" component={RoundSelected} />

          {/* 
          <Screen name="RelatorioRonda" component={RelatorioRonda} />
          <Screen name="RelatorioAlertas" component={RelatorioAlertas} />
          */}
        </Group>
      }
    </Navigator>
  );
}
