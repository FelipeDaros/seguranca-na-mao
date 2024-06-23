import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import Loading from "./src/components/Loading";
import { Routes } from "./src/routes";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { StatusBar } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  return (
    // @ts-ignore
    <AuthContextProvider>
      <StatusBar
        translucent
        backgroundColor="#525252"
        barStyle="light-content"
      />
      {fontsLoaded ? <Routes /> : <Loading />}
    </AuthContextProvider>
  );
}
