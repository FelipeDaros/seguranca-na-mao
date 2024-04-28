import { Box, HStack, Icon, Row, Text, VStack } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRealm } from "../../../libs/realms";
import { useState } from "react";
import { CustomAlert } from "../../../components/Alert/CustomAlert";

export function Cards(props: any) {
  const [isVisible, setIsVisible] = useState(false);
  const [rondaSelecionadaId, setRondaSelecionadaId] = useState(null);
  const navigation = useNavigation();
  const realm = useRealm();

  function handleRound(id: any) {
    //@ts-ignore
    navigation.navigate("RoundSelected", id);
  }

  function handleDelete(motivo: string) {
    realm.write(() => {
      realm.create('GerarRondas', { _id: rondaSelecionadaId, isSincronized: true, motivo, cancelado: true }, Realm.UpdateMode.Modified);
    });

    onClose();
    props.fetchRondas();
  }

  const onClose = () => setIsVisible(!isVisible);

  return (
    <HStack
      mt="8"
      alignItems="center"
      justifyContent="flex-start"
      w="64"
      alignSelf="center"
    >
      <Box
        bg="personColors.100"
        h="12"
        w="12"
        rounded="full"
        justifyContent="center"
        alignItems="center"
      >
        <Icon
          size={8}
          as={MaterialCommunityIcons}
          color="personColors.50"
          name="home"
        />
      </Box>
      <VStack ml="4">
        <Text color="personColors.150" fontFamily="heading">
          Local: {props.item?.nome}
        </Text>
        <Row justifyContent="space-around" m="4" w="24">
          <TouchableOpacity onPress={() => handleRound(props.item._id)}>
            <Icon
              size={6}
              as={MaterialCommunityIcons}
              color="personColors.150"
              name="qrcode-scan"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setIsVisible(true)
            setRondaSelecionadaId(props.item._id)
          }}>
            <Icon
              size={6}
              as={MaterialCommunityIcons}
              color="red.600"
              name="delete-empty"
            />
          </TouchableOpacity>
        </Row>
      </VStack>
      <CustomAlert
        content="Informe o motivo do cancelamento"
        title="Excluir Ronda"
        isVisible={isVisible}
        onClick={handleDelete}
        onClose={onClose}
        titleBotao="Excluir"
        input
      />
    </HStack>
  );
}
