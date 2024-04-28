import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { NativeBaseProvider, Text } from "native-base";
import Loading from "./src/components/Loading";
import { Routes } from "./src/routes";
import { THEME } from "./src/styles/theme";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { StatusBar } from "react-native";
import { RealmProvider } from "./src/libs/realms";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <RealmProvider>
        <AuthContextProvider>
          <StatusBar
            translucent
            backgroundColor="#1A998E"
            barStyle="light-content"
          />
          {fontsLoaded ? <Routes /> : <Loading />}
        </AuthContextProvider>
      </RealmProvider>
    </NativeBaseProvider>
  );
}
