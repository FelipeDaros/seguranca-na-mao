import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Location from "expo-location";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPontos } from "../../../store/PontoStorage";
import { getAllRondas, updateRonda } from "../../../store/RondaStorage";
import { Alert, Text, View } from "react-native";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";

export function RoundSelected(props: any) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [statusCamera, setStatusCamera] = useState(false);
  const [statusLocation, setStatusLocation] = useState(false);
  const [dadosQrCode, setDadosQrCode] = useState(null);
  const [scanned, setScanned] = useState(false);
  const id = props.route.params as any;

  async function handleVerificar() {

    setLoading(true);

    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const latitidadeMenos = Number(String(coords.latitude).replace("-", "")) * 0.999;
    const latitidadeMais = Number(String(coords.latitude).replace("-", "")) * 1.001;

    const rondaSelecionada = (await getAllRondas()).find(item => item.id === id);

    const pontoSelecionado = (await getAllPontos()).find(item => rondaSelecionada?.ponto_id)

    if (!pontoSelecionado) {
      setLoading(false);
      setScanned(false)
      return Alert.alert("Ponto selecionado", "Ponto selecionado não localizado");
    }
    
    if(String(dadosQrCode).toUpperCase() !== String(rondaSelecionada?.nome).toUpperCase()){
      setLoading(false);
      setScanned(false);
      return Alert.alert("Ponto selecionado", "QRCODE incorreto!");
    }

    try {
      if (
        Number(pontoSelecionado.latitude) >= latitidadeMenos &&
        Number(pontoSelecionado.latitude) <= latitidadeMais
      ) {
        const rondaUpdate = {
          ...rondaSelecionada,
          isSincronized: true,
          verificado: true
        }
    
        // @ts-ignore
        await updateRonda(rondaUpdate);
        navigation.goBack();
      } else {
        return Alert.alert("Ponto selecionado", "Local incorreto!");
      }
    } catch (error: any) {
      Alert.alert("Ponto selecionado", "Ocorreu um erro ao tentar validar!");
    } finally {
      setLoading(false);
    }
  }

  async function handlePermissions() {
    setLoading(true);
    const barCode = await BarCodeScanner.requestPermissionsAsync();
    setStatusCamera(barCode.granted);

    const location = await Location.requestForegroundPermissionsAsync();
    setStatusLocation(location.granted);
    setLoading(false);
  }
  //@ts-ignore
  const handleBarCodeScanned = ({ type, data, cornerPoints }) => {
    setScanned(true);
    setDadosQrCode(data);
  };

  useEffect(() => {
    handlePermissions();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <View className="flex-1 flex-col items-center p-6 bg-background-escuro">
        <Text className="text-white text-lg">
          Escanie o QRCODE
        </Text>
        {statusCamera && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ width: 400, height: 400, marginTop: 20 }}
          />
        )}
        {scanned && (
          <CustomButton className="mt-8" title="Enviar" loading={loading} onPress={handleVerificar} />
        )}
      </View>
    </SafeAreaView>
  );
}
