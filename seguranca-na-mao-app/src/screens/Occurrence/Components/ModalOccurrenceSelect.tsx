import { useEffect, useState } from "react";
import { IOcorrenciaProps } from "../Interfaces/IOcorrence";
import { api } from "../../../config/api";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { FlatList, View, Text } from "react-native";

type Props = {
  id: number | undefined;
  open: boolean;
  setIsClose: () => void;
};

export default function ModalOccurrenceSelect({ id, open, setIsClose }: Props) {
  const [ocorrencia, setOcorrencia] = useState<IOcorrenciaProps>();

  async function buscarInformacoes() {
    const { data } = await api.get(`/ocorrencia/${id}`);
    setOcorrencia(data);
  }



  useEffect(() => {
    if (open) {
      buscarInformacoes();
    }
  }, [open]);
  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
          <Header back />
          <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
            <Text className="text-white text-xl">Empresas</Text>
            {/* @ts-ignore */}
            <CustomButton title="Cadastrar" loading={loading} onPress={() => navigation.navigate('RegisterEmpresa')} />
          </View>
        </SafeAreaView>
  );
}
