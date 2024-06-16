import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { NativeBaseProvider } from "native-base";
import Loading from "./src/components/Loading";
import { Routes } from "./src/routes";
import { THEME } from "./src/styles/theme";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { StatusBar } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      {/* @ts-ignore */}
        <AuthContextProvider>
          <StatusBar
            translucent
            backgroundColor="#1A998E"
            barStyle="light-content"
          />
          {fontsLoaded ? <Routes /> : <Loading />}
        </AuthContextProvider>
    </NativeBaseProvider>
  );
}
