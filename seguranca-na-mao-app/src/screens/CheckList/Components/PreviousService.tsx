import { CheckListStore } from "../../../store/CheckListStore";
import moment from "moment-timezone";
import Loading from "../../../components/Loading";
import { Text, View } from "react-native";


export function PreviousService() {
    const [previousService, isLoading] = CheckListStore((state) => [state.previousService, state.isLoading]);

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <View>
            {!previousService && <Text>Não foi localizado último serviço no posto</Text>}
            {!!previousService &&
                <View>
                    {/* @ts-ignore */}
                    <Text>Vigilante: {previousService.User.nome}</Text>
                    <Text>Vigilante: {moment(previousService.created_at).format("DD-MM-YYYY")}</Text>
                    <Text>Equipamentos</Text>
                    {previousService.equipamentos.map(item => (<Text key={item.id}>{item.nome}</Text>))}
                </View>
            }
        </View>
    )
}