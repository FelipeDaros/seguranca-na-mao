import { Box, Button, FlatList, HStack, Text, VStack, useToast } from "native-base";
import Header from "../../components/Header";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../config/api";
import { IVigilanteConfig } from "../../interfaces/IVigilanteConfig";
import CardVigilante from "./Components/CardVigilante";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../components/Loading";


export default function Configuracoes() {
    const toast = useToast();
    const user = useAuth();

    const [loading, setLoading] = useState(false);
    const [vigilantes, setVigilantes] = useState<IVigilanteConfig[]>([] as IVigilanteConfig[]);

    async function fetchVigilantes() {
        try {
            setLoading(true);
            const { data } = await api.get<IVigilanteConfig[]>(`/configuracoes/${user.user?.user.empresa_id}`);
            setVigilantes(data);
        } catch (error) {
            toast.show({
                title: "Erro ao buscar os vigilantes!",
                duration: 3000,
                bg: "error.500",
                placement: "top",
            });
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchVigilantes();
        }, [])
    );

    return (<SafeAreaView>
        <VStack>
            <Header back />
            <VStack alignItems="center" justifyItems="center" mt="4">
                <Text fontFamily="mono" color="personColors.150" fontSize="lg">
                    Configurações
                </Text>
                <HStack alignItems="center" justifyItems="center" mt="2" mb="8" w="70%">
                    <Text color="personColors.150" textAlign="center">
                        As configurações que existem no vigilante serão listadas ao lado do nome
                    </Text>
                </HStack>
                {loading && <Loading/>}
                {!loading &&
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        height="3/5"
                        data={vigilantes}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => (<CardVigilante vigilante={item} />)}
                    />
                }
            </VStack>
        </VStack>
    </SafeAreaView>)
}