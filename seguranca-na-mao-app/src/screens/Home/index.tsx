import Header from "../../components/Header";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeVigilante } from "../../layouts/home/HomeVigilante";
import { HomeSupervisor } from "../../layouts/home/HomeSupervisor";
import { HomeAdministrador } from "../../layouts/home/HomeAdministrador";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Home() {
  const { userAuth } = useAuth();

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
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header />
      {userAuth?.user.tipo_usuario === 'VIGILANTE' && <HomeVigilante />}
      {userAuth?.user.tipo_usuario === 'SUPERVISOR' && <HomeSupervisor />}
      {userAuth?.user.tipo_usuario === 'ADMINISTRADOR' && <HomeAdministrador />}
    </SafeAreaView>
  );
}
