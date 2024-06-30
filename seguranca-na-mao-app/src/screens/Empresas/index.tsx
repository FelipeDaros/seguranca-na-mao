import Header from "../../components/Header";
import { api } from "../../config/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, Text, View } from "react-native";

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
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
        <Text className="text-white text-xl">Empresas</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={empresas}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) =>
            <Pressable onPress={() => handleEmpresa(item.id)} key={item.id} className="flex-col px-2 mt-2 w-72 h-20 items-center justify-center bg-zinc-800 rounded-md">
              <Text className="text-lg text-white">Nome: {item.nome}</Text>
              <Text className="text-lg text-white overflow-ellipsis">Cidade: {item.cidade}</Text>
            </Pressable>
          }
        />
        {/* @ts-ignore */}
        <CustomButton title="Cadastrar" loading={loading} onPress={() => navigation.navigate('RegisterEmpresa')} />
      </View>
    </SafeAreaView>
  )
}