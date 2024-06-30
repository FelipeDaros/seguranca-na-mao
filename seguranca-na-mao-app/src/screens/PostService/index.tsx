import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import CustomButton from "../../components/CustomButton";
import { Alert, ScrollView, Text, View } from "react-native";
import Checkbox from 'expo-checkbox';

type FormData = {
  nome: string;
  empresa_id: number;
  equipaments: number[];
  empresa_nome: string;
};

type equipamento = {
  id: number;
  nome: string;
};

type EmpresaProps = {
  id: number;
  cidade: string;
  estado: string;
  nome: string;
};

export default function PostService() {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({});
  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState<EmpresaProps[]>([]);
  const [equipaments, setEquipaments] = useState<equipamento[]>([]);
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<
    number[]
  >([]);
  const [isChecked, setChecked] = useState(false);

  async function buscarEquipamentos() {
    try {
      const { data } = await api.get("/equipamentos");
      setEquipaments(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Posto", error.response?.data.message);
      }
      return Alert.alert("Posto", "Erro ao listar!");
    }
  }

  async function selecionarEquipamentos(id: number) {
    if (equipamentosSelecionados.some((item) => item === id)) {
      const equipamentosAlterados = equipamentosSelecionados.filter(
        (item) => item !== id
      );
      setValue("equipaments", equipamentosAlterados);
      setEquipamentosSelecionados(equipamentosAlterados);
    } else {
      setValue("equipaments", [...equipamentosSelecionados, id]);
      setEquipamentosSelecionados([...equipamentosSelecionados, id]);
    }
  }

  async function handleSave(data: FormData) {
    setIsLoading(true);
    if (!data.equipaments?.length || !data.equipaments) {
      setIsLoading(false);
      return Alert.alert("Posto", "Informe pelo menos um equipamento!");
    }

    try {
      await api.post(
        "/posto-servico",
        {
          nome: data.nome,
          empresa_id: data.empresa_id,
          equipaments: data.equipaments,
        }
      );
      setEquipamentosSelecionados([]);
      reset();
      navigation.goBack();
      return Alert.alert("Posto", "Posto criado com sucesso!");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return Alert.alert("Posto", error.response?.data.message);
      }
      return Alert.alert("Posto", "Erro ao cadastrar o posto");
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarEmpresa() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/empresa/${user?.user.empresa_id}`);
      setValue("empresa_id", data.id);
      setValue("empresa_nome", data.nome);
      setEmpresa(data)
    } catch (error: any) {
      return Alert.alert("Posto", "Erro ao buscar a empresa");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    buscarEquipamentos();
    buscarEmpresa()
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <Text className="text-white text-xl mb-4">Cadastrar posto</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full items-center my-5 gap-y-2">
              <Text className="font-bold text-white text-base">Nome</Text>
              <CustomInput value={value} onChangeText={(text) => onChange(text)} />
              {errors.nome && <Text className="text-red-500">Campo é obrigatório</Text>}
            </View>
          )}
          name="nome"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full items-center my-5 gap-y-2">
              <Text className="font-bold text-white text-base">Empresa</Text>
              <CustomInput disabled value={value} onChangeText={(text) => onChange(text)} />
            </View>
          )}
          name="empresa_nome"
        />

        <ScrollView className="flex-1 w-full h-40 gap-y-2 px-2" showsVerticalScrollIndicator={false}>
          {equipaments?.map(item => (
            <View key={item.id} className="flex-row gap-x-2 items-center justify-between">
              <Text className="text-white text-lg">{item.nome}</Text>
              <Checkbox
                value={equipamentosSelecionados.includes(item.id)}
                onValueChange={() => selecionarEquipamentos(item.id)}
              />
            </View>
          ))}
        </ScrollView>
        <CustomButton title="Entrar" loading={isLoading} onPress={handleSubmit(handleSave)} />
      </View>
    </SafeAreaView>
  );
}
