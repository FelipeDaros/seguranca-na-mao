import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import * as Location from "expo-location";
import { Alert, Text, View } from "react-native";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import CustomInput from "../../components/CustomInput";
import CustomSelect from "../../components/CustomSelect";

type FormData = {
  nome: string;
  posto_id: number;
  latitude: number;
  longitude: number;
};


export default function PointCreate() {
  const navigation = useNavigation();
  const { userAuth, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState<number>(0);
  const [location, setLocation] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({});

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
        email: userAuth?.user?.email
      });
      Alert.alert("Salvar", "Ponto cadastrado com sucesso!");
      reset();
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Salvar", error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarPostoVinculadoAoUsuario() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/posto-servico/${userAuth?.user.empresa_id}`);
      setData(data);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Salvar", error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    buscarLocalizacao();
    buscarPostoVinculadoAoUsuario();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <Text className="text-white text-xl">Cadastrar ponto</Text>
        <View className="w-full items-center my-5 gap-y-3">
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="w-full justify-center items-center gap-y-2">
                <View className="w-full items-center my-5 gap-y-2">
                  <Text className="text-white text-lg">
                    Nome
                  </Text>
                  <CustomInput
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              </View>
            )}
            name="nome"
          />

          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="w-full justify-center items-center gap-y-2">
                <Text className="text-white text-xl mb-2">Posto Vinculado</Text>
                <CustomSelect value={value} isDisabled={isLoading} data={data} selectValue={onChange} />
              </View>
            )}
            name="posto_id"
          />
          <View className="w-full justify-center items-center">
          </View>
        </View>
        <CustomButton title="Salvar" loading={isLoading} onPress={handleSubmit(handleSave)} />
      </View>
    </SafeAreaView>
  );
}
