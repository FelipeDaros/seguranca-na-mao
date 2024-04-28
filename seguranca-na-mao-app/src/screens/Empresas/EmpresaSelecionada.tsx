import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, Select, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { api } from "../../config/api";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomSelect from "../../components/CustomSelect";

type EmpresaProps = {
  id: number;
  cidade: string;
  estado: string;
  nome: string;
}

export function EmpresaSelecionada(props: any) {
  const toast = useToast();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [empresa, setEmpresa] = useState<EmpresaProps>({} as EmpresaProps);

  if (!props.route.params.id) {
    navigation.goBack();
  }

  async function fetchData() {
    try {
      setLoading(true);
      const { data } = await api.get(`/empresa/${props.route.params.id}`);
      setEmpresa(data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      setLoading(true);
      await api.patch(`/empresa/${props.route.params.id}`, empresa);
      toast.show({
        title: "Dados foram alterados  com sucesso!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });
      await fetchData();
    } catch (error: any) {
      if (!!error.response) {
        return toast.show({
          title: error.response.data.message,
          duration: 3000,
          bg: "error.500",
          placement: "top",
        });
      }

      return toast.show({
        title: "Erro ao tentar alterar empresa",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });

    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <VStack flex={1}>
      <Header back />
      <Text color="personColors.150" textAlign="center" fontFamily="mono" fontSize="lg" mt="4">
        Empresa Selecionada
      </Text>
      {loading && <Loading />}
      {!loading &&
        <VStack alignItems="center" mt="8">
          <Text color="personColors.150" fontFamily="body" fontSize="md">
            Nome empresa
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            onChangeText={(value) => setEmpresa({ ...empresa, nome: value })}
            value={empresa.nome}
          />
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Estado
          </Text>
          <Select
            bg="white"
            mt="2"
            onValueChange={itemValue => setEmpresa({ ...empresa, estado: itemValue })}
            selectedValue={empresa.estado}
            w="80%"
          >
            <Select.Item shadow={2} label="Santa Catarina" value="SC" />
            <Select.Item shadow={2} label="Paraná" value="PR" />
            <Select.Item shadow={2} label="Rio Grande do Sul" value="RS" />
          </Select>
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Cidade
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            onChangeText={(value) => setEmpresa({ ...empresa, cidade: value })}
            value={empresa.cidade}
          />
          <Button
            onPress={handleUpdate}
            bg="personColors.50"
            w="80%"
            mt="6"
          >
            Salvar
          </Button>
        </VStack>
      }
    </VStack>
  )
}