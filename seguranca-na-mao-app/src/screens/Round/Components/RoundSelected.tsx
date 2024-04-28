import { Text, VStack, useToast } from "native-base";
import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Location from "expo-location";

import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useRealm } from "../../../libs/realms";
import { Pontos } from "../../../libs/realms/schemas/Pontos";
import { GerarRondas } from "../../../libs/realms/schemas/Rondas";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/Button";

export function RoundSelected(props: any) {
  const toast = useToast();
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusCamera, setStatusCamera] = useState(false);
  const [statusLocation, setStatusLocation] = useState(false);
  const [dadosQrCode, setDadosQrCode] = useState(null);
  const [scanned, setScanned] = useState(false);
  const _id = props.route.params as any;

  const realm = useRealm();

  const pontosSchema = useQuery(Pontos);
  const rondasSchema = useQuery(GerarRondas);

  const rondaSelecionada = rondasSchema.find(item => item._id === _id);

  const pontoSelecionado = pontosSchema.find(item => item._id === rondaSelecionada?.ponto_id);

  async function handleVerificar() {

    setLoading(true);

    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const latitidadeMenos = Number(String(coords.latitude).replace("-", "")) * 0.996;
    const latitidadeMais = Number(String(coords.latitude).replace("-", "")) * 1.002;

    if (pontoSelecionado) {
      try {
        if (
          Number(pontoSelecionado.latitude) >= latitidadeMenos &&
          Number(pontoSelecionado.latitude) <= latitidadeMais &&
          String(dadosQrCode).toUpperCase() ===
          String(pontoSelecionado.nome).toUpperCase()
        ) {
          realm.write(() => {
            realm.create('GerarRondas', { _id: _id, verificado: true, isSincronized: true }, Realm.UpdateMode.Modified);
          });

          toast.show({
            title: "Ponto verificado!",
            duration: 3000,
            bg: "personColors.50",
            placement: "top",
          });
          navigation.goBack();
        } else {
          toast.show({
            title: "Você não está no local correto!",
            duration: 3000,
            bg: "error.500",
            placement: "top",
          });
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          signOut();
          toast.show({
            title: "Você precisa efetuar o login!",
            duration: 3000,
            bg: "error.500",
            placement: "top",
          });
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
      <Header back />
      <VStack alignItems="center" justifyContent="center">
        <Text color="personColors.150" fontFamily="heading" fontSize="md" mt="2">
          Nome do ponto: {pontoSelecionado?.nome}
        </Text>
        {statusCamera && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ width: 500, height: 500, marginTop: 20 }}
          />
        )}
      </VStack>
      {scanned && (
        <Button
          title="Enviar dados"
          onPress={handleVerificar}
          isLoading={loading}
          alignSelf="center"
          mt="2"
        />
      )}
    </SafeAreaView>
  );
}
