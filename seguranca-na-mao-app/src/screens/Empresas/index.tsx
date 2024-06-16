import { FlatList, ScrollView, Text, VStack } from "native-base";
import Header from "../../components/Header";
import { api } from "../../config/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Loading from "../../components/Loading";
import { CardEmpresa } from "./Components/CardEmpresa";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

type EmpresaProps = {
  id: number;
  cidade: string;
  estado: string;
  nome: string;
}

export function Empresas() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([] as EmpresaProps[]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data } = await api.get('/empresa');
      setEmpresas(data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  function handleEmpresa(empresa_id: number) {
    //@ts-ignore
    return navigation.navigate('EmpresaSelecionada', { id: empresa_id });
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header back />
      <Text color="personColors.150" textAlign="center" fontFamily="mono" fontSize="lg" mt="4">
        Empresas
      </Text>
      {loading && <Loading />}
      {!loading &&
        <FlatList
          mt="4"
          showsVerticalScrollIndicator={false}
          height="3/5"
          data={empresas}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => <CardEmpresa key={item.id} empresa={item} selecionar={() => handleEmpresa(item.id)} />}
        />
      }
      {/* @ts-ignore */}
      <CustomButton title="Cadastrar" alignSelf="center" onPress={() => navigation.navigate('RegisterEmpresa')} />
    </SafeAreaView>
  )
}