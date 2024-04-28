import { Text, VStack } from "native-base";
import { CheckListStore } from "../../../store/CheckListStore";
import moment from "moment-timezone";
import Loading from "../../../components/Loading";


export function PreviousService() {
    const [previousService, isLoading] = CheckListStore((state) => [state.previousService, state.isLoading]);

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <VStack mt="4">
            {!previousService && <Text color="personColors.150" fontWeight="bold">Não foi localizado último serviço no posto</Text>}
            {!!previousService &&
                <VStack>
                    {/* @ts-ignore */}
                    <Text my="2" color="personColors.150" fontWeight="bold">Vigilante: {previousService.User.nome}</Text>
                    <Text my="2" color="personColors.150" fontWeight="bold">Vigilante: {moment(previousService.created_at).format("DD-MM-YYYY")}</Text>
                    <Text my="2" color="personColors.150" fontWeight="bold">Equipamentos</Text>
                    {previousService.equipamentos.map(item => (<Text mt="1" color="personColors.150" key={item.id}>{item.nome}</Text>))}
                </VStack>
            }
        </VStack>
    )
}