import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, ScrollView, Select, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { api } from "../../config/api";
import CustomInput from "../../components/CustomInput";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";

type EmpresaProps = {
  nome: string;
  estado: string;
  cidade: string;
  documento: string;
  responsavel: string;
  contato: string;
  endereco: string;
  email: string;
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
    <SafeAreaView style={{ flex: 1 }}>
      <Header back />
      <ScrollView>
        <VStack alignItems="center" mt="8" mb="8">
          <Text color="personColors.150" fontFamily="body" fontSize="md">
            Nome empresa
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            onChangeText={(value) => setEmpresa({ ...empresa, nome: value })}
            value={empresa.nome}
            _input={{
              maxLength: 250
            }}
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
            _input={{
              maxLength: 150
            }}
          />
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Responsável
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            onChangeText={(value) => setEmpresa({ ...empresa, responsavel: value })}
            value={empresa.responsavel}
            _input={{
              maxLength: 100
            }}
          />
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Documento
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            placeholder="CNPJ/CPF somente números"
            onChangeText={(value) => setEmpresa({ ...empresa, documento: value })}
            value={empresa.documento}
            _input={{
              maxLength: 14
            }}
          />
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Contato
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            placeholder="00000000000"
            onChangeText={(value) => setEmpresa({ ...empresa, contato: value })}
            value={empresa.contato}
            _input={{
              maxLength: 11
            }}
          />
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Endereço
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            placeholder="Bairro/Rua/Numero"
            onChangeText={(value) => setEmpresa({ ...empresa, endereco: value })}
            value={empresa.endereco}
            _input={{
              maxLength: 250
            }}
          />
          <Text color="personColors.150" fontFamily="body" fontSize="md" mt="4">
            Email
          </Text>
          <CustomInput
            bg="white"
            mt="2"
            placeholder="exemplo@exemplo.com"
            onChangeText={(value) => setEmpresa({ ...empresa, email: value })}
            value={empresa.email}
            _input={{
              maxLength: 250
            }}
          />
          <CustomButton
            onPress={handleUpdate}
            bg="personColors.50"
            w="80%"
            mt="6"
            title="Salvar"
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}