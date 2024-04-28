import { Progress, Text, VStack, useToast } from "native-base";
import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomSelect from "../../components/CustomSelect";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormData = {
  nome: string;
  posto_id: number;
  latitude: number;
  longitude: number;
};

export default function PointCreate() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState<number>(0);
  const [location, setLocation] = useState(null);

  async function buscarLocalizacao() {
    setProgress(25);
    
    let { status } = await Location.requestForegroundPermissionsAsync();

    setProgress(50);
    if (status !== "granted") {
      Alert.alert("Não autorizado!");
      return;
    }
    setProgress(75);

    let { coords } = await Location.getCurrentPositionAsync({});

    setValue("latitude", Number(String(coords.latitude).replace("-", "")));
    setValue("longitude", Number(String(coords.longitude).replace("-", "")));
    setProgress(100);
  }

  async function handleSave({ latitude, longitude, nome, posto_id }: FormData) {
    try {
      setIsLoading(true);
      await api.post("/ponto", {
        nome,
        latitude,
        longitude,
        posto_id,
        email: user?.user?.email
      });
      toast.show({
        title: "Ponto cadastrado com sucesso!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
      reset();
      navigation.goBack();
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
    }finally{
      setIsLoading(false);
    }
  }

  const handleSelectItem = (item: any) => {
    setValue("posto_id", item);
  };

  async function buscarPostoVinculadoAoUsuario() {
    try {
      const {data} = await api.get(`/posto-servico/${user?.user.empresa_id}`);
      setData(data);
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
    }
  }

  useEffect(() => {
    buscarLocalizacao();
    buscarPostoVinculadoAoUsuario();
  }, []);

  return (
    <SafeAreaView>
      <Header back />
      <VStack alignItems="center" justifyItems="center" mt="4">
        <Text color="personColors.150" fontFamily="mono" fontSize="lg">
          Cadastrar ponto
        </Text>
        <VStack mt="20%">
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text color="personColors.150" fontFamily="body" fontSize="md">
                  Nome
                </Text>
                <CustomInput
                  bg="white"
                  mt="2"
                  onChangeText={onChange}
                  value={value}
                />
              </>
            )}
            name="nome"
          />

          <Text
            color="personColors.150"
            mt="10%"
            fontFamily="body"
            fontSize="md"
          >
            Posto Vinculado
          </Text>
          <CustomSelect values={data} mt="2" selectItem={handleSelectItem} />
        </VStack>
        <VStack mt="12" alignItems="center">
          <Text fontFamily="mono">Geolocalização</Text>
          <Progress value={progress} mx="4" w="64" mt="4" />
        </VStack>
      </VStack>
      <VStack
        alignItems="center"
        justifyItems="center"
        position="relative"
        flex={1}
      >
        <CustomButton isLoading={isLoading} title="Salvar" onPress={handleSubmit(handleSave)} />
      </VStack>
    </SafeAreaView>
  );
}
