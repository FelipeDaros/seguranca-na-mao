import {
  Box,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";

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
  const toast = useToast();
  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState<EmpresaProps[]>([]);
  const [equipaments, setEquipaments] = useState<equipamento[]>([]);
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<
    number[]
  >([]);

  async function buscarEquipamentos() {
    try {
      const { data } = await api.get("/equipamentos");
      setEquipaments(data);
    } catch (error) {
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

      toast.show({
        title: "Erro ao listar!",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
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
      toast.show({
        title: "Informe pelo menos um equipamento",
        duration: 3000,
        bg: "warning.400",
        placement: "top",
      });
      setIsLoading(false);
      return;
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
      toast.show({
        title: "Posto criado com sucesso!",
        duration: 3000,
        bg: "green.500",
        placement: "top",
      });
    } catch (error: any) {
      if (error.response.status === 401) {
        await AsyncStorage.removeItem("usuario");
        signOut();
      }

      toast.show({
        title: "Erro ao cadastrar o posto",
        duration: 3000,
        bg: "red.400",
        placement: "top",
      });
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
      if (error.response.status === 401) {
        await AsyncStorage.removeItem("usuario");
        signOut();
      }
      return toast.show({
        title: "Erro ao buscar a empresa",
        duration: 3000,
        bg: "red.400",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    buscarEquipamentos();
    buscarEmpresa()
  }, []);

  return (
    <SafeAreaView>
      <Header back />
      <VStack alignItems="center" justifyItems="center" mt="4">
        <Text fontFamily="mono" color="personColors.150" fontSize="lg">
          Cadastrar Posto
        </Text>
        <VStack mt="15%">
          <Controller
            control={control}
            rules={{
              maxLength: 100,
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text color="personColors.150" fontFamily="body" fontSize="md">
                  Nome
                </Text>
                <CustomInput
                  onBlur={onBlur}
                  bg="white"
                  mt="2"
                  onChangeText={onChange}
                  value={value}
                />
              </>
            )}
            name="nome"
          />
          {errors.nome && <Text color={"error.500"}>Campo é obrigatório</Text>}

          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text color="personColors.150" fontFamily="body" fontSize="md" mt={2}>
                  Empresa
                </Text>
                <CustomInput
                  onBlur={onBlur}
                  bg="white"
                  mt="2"
                  onChangeText={onChange}
                  value={value}
                  isDisabled
                />
              </>
            )}
            name="empresa_nome"
          />
          <VStack>
            <ScrollView
              maxH="56"
              w="90%"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {equipaments?.length >= 1 &&
                equipaments?.map((equipaments, index) => (
                  <Box
                    mt="4"
                    ml="2"
                    key={equipaments.id}
                    flexDir="row"
                    alignItems="center"
                  >
                    <Pressable
                      flexDir="row"
                      justifyItems="center"
                      onPress={() => {
                        selecionarEquipamentos(equipaments.id);
                      }}
                    >
                      <Text
                        color="personColors.150"
                        opacity={
                          equipamentosSelecionados.some(
                            (item) => item === equipaments.id
                          )
                            ? 1
                            : 0.5
                        }
                        mt="1"
                      >
                        {equipaments.id} - {equipaments.nome}
                      </Text>

                      {equipamentosSelecionados.some(
                        (item) => item === equipaments.id
                      ) ? (
                        <Icon
                          ml="2"
                          size="lg"
                          as={MaterialCommunityIcons}
                          color="green.500"
                          name="check"
                        />
                      ) : (
                        <Icon
                          ml="2"
                          size="lg"
                          as={MaterialCommunityIcons}
                          color="gray.200"
                          name="check"
                        />
                      )}
                    </Pressable>
                  </Box>
                ))}
            </ScrollView>
          </VStack>
        </VStack>
      </VStack>
      <Button
        title="Salvar"
        isLoading={isLoading}
        onPress={handleSubmit(handleSave)}
      />
    </SafeAreaView>
  );
}
