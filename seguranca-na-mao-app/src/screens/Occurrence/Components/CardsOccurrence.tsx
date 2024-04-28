import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { IOcorrenciaProps } from "../Interfaces/IOcorrence";

type DataProps = {
  ocorrenciaProps: IOcorrenciaProps;
  selecionarOcorrencia: (id: number) => void;
  setIsOpen: () => void;
};

export default function CardsOccurrence({
  ocorrenciaProps,
  selecionarOcorrencia,
  setIsOpen
}: DataProps) {
  const [statusColor, setStatusColor] = useState<string>();

  function setDataCard() {
    switch (ocorrenciaProps.status) {
      case "CONCLUIDO":
        setStatusColor("personColors.50");
        break;
      default:
        setStatusColor("amber.300");
        break;
    }
  }

  useEffect(() => {
    setDataCard();
  }, []);

  return (
    <Pressable
      w="72"
      h="16"
      borderRadius="md"
      bg="#fafafa"
      shadow={1}
      mt="4"
      onPress={() => {
        selecionarOcorrencia(ocorrenciaProps.id);
        setIsOpen();
      }}
    >
      <HStack>
        <Box
          w="2"
          h="16"
          bg={statusColor}
          borderTopLeftRadius="sm"
          borderBottomLeftRadius="sm"
        ></Box>
        <VStack justifyContent="center" ml="2">
          <Text color="personColors.200" fontFamily="body">
            {ocorrenciaProps.titulo}
          </Text>
          <Text color="personColors.150" fontFamily="body">
            {ocorrenciaProps.dataOcorrencia}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
