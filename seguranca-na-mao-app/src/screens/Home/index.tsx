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
  const { user } = useAuth();

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
    <SafeAreaView>
      <Header />
      {user?.user.tipo_usuario === 'VIGILANTE' && <HomeVigilante />}
      {/* {user?.user.tipo_usuario === 'SUPERVISOR' && <HomeSupervisor />} */}
      {/* {user?.user.tipo_usuario === 'ADMINISTRADOR' && <HomeAdministrador />} */}
    </SafeAreaView>
  );
}
