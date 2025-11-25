import Header from "../../components/Header";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../config/api";
import { IVigilanteConfig } from "../../interfaces/IVigilanteConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function Configuracoes() {
    const navigation = useNavigation();
    const { userAuth } = useAuth();

    const [loading, setLoading] = useState(false);
    const [vigilantes, setVigilantes] = useState<IVigilanteConfig[]>([] as IVigilanteConfig[]);

    async function fetchVigilantes() {
        try {
            setLoading(true);
            const { data } = await api.get<IVigilanteConfig[]>(`/configuracoes/${userAuth?.user.empresa_id}`);
            setVigilantes(data);
        } catch (error) {
            Alert.alert("Configuração", "Erro ao buscar os vigilantes!");
        } finally {
            setLoading(false);
        }
    }

    function handleVigilante(vigilante_id: string) {
        //@ts-ignore
        navigation.navigate(`RegisterConfiguracoes`, { vigilante_id });
    }

    useFocusEffect(
        useCallback(() => {
            fetchVigilantes();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1 bg-background-escuro">
            <Header back />
            <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
                <Text className="text-white text-xl mb-4">Cadastrar posto</Text>
                <Text className="text-white text-center text-sm mb-4">
                    As configurações que existem no vigilante serão listadas ao lado do nome
                </Text>
                <ScrollView className="flex-1 w-full h-40 gap-y-2 px-2" showsVerticalScrollIndicator={false}>
                    {vigilantes?.map(item => (
                        <Pressable onPress={() => handleVigilante(item.id)} key={item.id} className="flex-row px-2 items-center justify-between bg-zinc-800 rounded-md">
                            <View className="flex-col gap-x-5">
                                <Text className="text-white text-lg">Nome: {item?.nome}</Text>
                                <Text className="text-white text-lg">Tipo: {item?.tipo_usuario}</Text>
                            </View>
                            <View className="flex-row items-center w-40  justify-stretch gap-x-5">
                                {item.Configuracoes.map(config => (
                                    <View key={config.id} className="bg-green-claro rounded-sm p-1">
                                        <Text className="text-white text-sm">{config?.tipo}</Text>
                                    </View>
                                ))}
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}