import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Location from "expo-location";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPontos } from "../../../store/PontoStorage";
import { getAllRondas } from "../../../store/RondaStorage";
import { Text, View } from "react-native";

export function RoundSelected(props: any) {
  const navigation = useNavigation();
  const { signOut } = useAuth();
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

    const latitidadeMenos = Number(String(coords.latitude).replace("-", "")) * 0.996;
    const latitidadeMais = Number(String(coords.latitude).replace("-", "")) * 1.002;

    const rondaSelecionada = (await getAllRondas()).find(item => item.id === id);

    const pontoSelecionado = (await getAllPontos()).find(item => rondaSelecionada?.ponto_id)

    if (pontoSelecionado) {
      try {
        if (
          Number(pontoSelecionado.latitude) >= latitidadeMenos &&
          Number(pontoSelecionado.latitude) <= latitidadeMais &&
          String(dadosQrCode).toUpperCase() ===
          String(pontoSelecionado.nome).toUpperCase()
        ) {
          
          navigation.goBack();
        } else {
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          signOut();
          return;
        }
      } finally {
        setLoading(false);
      }
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
    <SafeAreaView>
      {/* <Header back /> */}
      <View className="items-center justify-center">
        <Text className="">
          Escanie o QRCODE
        </Text>
        {/* {statusCamera && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ width: 500, height: 500, marginTop: 20 }}
          />
        )} */}
      </View>
      {/* {scanned && (
        <CustomButton
          title="Enviar dados"
          onPress={handleVerificar}
          isLoading={loading}
          alignSelf="center"
          mt="2"
        />
      )} */}
    </SafeAreaView>
  );
}
