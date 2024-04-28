import { Box, HStack, Pressable, Text, VStack } from "native-base"
import { IVigilanteConfig } from "../../../interfaces/IVigilanteConfig"
import { useNavigation } from "@react-navigation/native";

type Props = {
    vigilante: IVigilanteConfig
}

export default function CardVigilante({ vigilante }: Props) {
    const navigation = useNavigation();

    function handleVigilante(vigilante_id: string) {
        //@ts-ignore
        navigation.navigate(`RegisterConfiguracoes`, { vigilante_id });
    }

    return (
        <Pressable onPress={({ target }) => handleVigilante(vigilante.id)} flexDirection="row" alignItems="center">
            <Box w="4" h="4" rounded="md" backgroundColor={vigilante.Configuracoes.length >= 2 ? "personColors.50" : "amber.300"} m="2" />
            <Text m="2">{vigilante.nome}</Text>
            {vigilante.Configuracoes.some(config => config.tipo === 'ALERTA') && <Text mx="1" color="personColors.50" fontWeight="bold" textTransform="uppercase">Alerta</Text>}
            {vigilante.Configuracoes.some(config => config.tipo === 'RONDA') && <Text mx="1" color="personColors.50" fontWeight="bold" textTransform="uppercase">Ronda</Text>}
        </Pressable>
    )
}