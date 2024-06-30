import Header from "../../components/Header";
import CardsOccurrence from "./Components/CardsOccurrence";
import { api } from "../../config/api";
import { useCallback, useEffect, useState } from "react";
import { IOcorrenciaProps } from "./Interfaces/IOcorrence";
import ModalOccurrenceSelect from "./Components/ModalOccurrenceSelect";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Occurrence() {
  const navigation = useNavigation();
  const [ocorrencias, setOcorrencias] = useState<IOcorrenciaProps[]>([]);
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  async function buscarOccorrencias() {
    try {
      const { data } = await api.get("/ocorrencia");
      setOcorrencias(data);
    } catch (error: any) {
      if (error.response.status === 401) {
        signOut();
        // toast.show({
        //   title: "Você precisa efetuar o login!",
        //   duration: 3000,
        //   bg: "error.500",
        //   placement: "top",
        // });
        return;
      }
      // toast.show({
      //   title: "Erro ao listar!",
      //   duration: 3000,
      //   bg: "error.500",
      //   placement: "top",
      // });
    }
  }

  function handleNavigateRegistroOcorrencia() {
    navigation.navigate("RegisterOccurrence");
  }

  useFocusEffect(
    useCallback(() => {
      buscarOccorrencias();
    }, [])
  );

  return (
    <SafeAreaView>
      <Header back />
      {/* <VStack alignItems="center" justifyItems="center" mt="4">
        <Text fontFamily="mono" color="personColors.150" fontSize="lg">
          Ocorrências
        </Text>
        <Button
          variant="outline"
          onPress={handleNavigateRegistroOcorrencia}
          borderColor="personColors.50"
          w="80%"
          mt="8"
        >
          <Text color="personColors.50" fontFamily="heading">
            Registrar Ocorrência
          </Text>
        </Button>
        <FlatList
          mt="4"
          showsVerticalScrollIndicator={false}
          height="3/5"
          data={ocorrencias}
          keyExtractor={(item, index) => item.id as any}
          renderItem={({ item }) => (
            <CardsOccurrence
              ocorrenciaProps={item}
              selecionarOcorrencia={setOcorrenciaSelecionada}
              setIsOpen={() => setIsOpen(true)}
            />
          )}
        />
      </VStack> */}
      <ModalOccurrenceSelect
        id={ocorrenciaSelecionada}
        open={isOpen}
        setIsClose={() => setIsOpen(false)}
      />
    </SafeAreaView>
  );
}
