import { Button, Icon, ScrollView, useToast } from "native-base";
import { api } from "../../config/api";
import { useState, useEffect } from "react"; // Importe o useEffect
import { IVigilanteConfig } from "../../interfaces/IVigilanteConfig";
import Loading from "../../components/Loading";
import { CardConfiguracao } from "./Components/CardConfiguracao";
import Header from "../../components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";

interface Configuracoes {
    id: number;
    tipo: 'RONDA' | 'ALERTA';
    valor: number;
    parametro: string;
    usuario_id: string
    created_at: Date;
}

export default function RegisterConfiguracoes({ route }: any) {
    const toast = useToast();

    const [vigilante, setVigilante] = useState<IVigilanteConfig>({} as IVigilanteConfig);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchVigilante() {
        try {
            setIsLoading(true);
            const { data } = await api.get<IVigilanteConfig>(`/configuracoes/vigilante/${route.params.vigilante_id}`);
            setVigilante(data);
        } catch (error) {
            toast.show({
                title: "Erro ao buscar o vigilante!",
                duration: 3000,
                bg: "error.500",
                placement: "top",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const updateConfiguracao = (configuracao: Configuracoes) => {
        setVigilante((prevVigilante) => ({
            ...prevVigilante,
            Configuracoes: prevVigilante.Configuracoes.map((item) =>
                item.id === configuracao.id ? { ...item, ...configuracao } : item
            ),
        }));
    };

    useEffect(() => {
        fetchVigilante();
    }, []);

    if (isLoading) {
        return <Loading />
    }

    async function handleEdit() {
        try {
            setIsLoading(true);

            for await (const configuracao of vigilante.Configuracoes) {
                await api.put('/configuracoes', configuracao);
            }

            toast.show({
                title: 'Vigilante alterado com sucesso!',
                duration: 3000,
                bg: "personColors.50",
                placement: "top",
            });

            fetchVigilante();
        } catch (error: any) {
            Alert.alert("Erro ao salvar", "Acabou gerando erro, por favor falar com o administrador");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddConfig() {
        let tipo;

        if (vigilante.Configuracoes.find(item => item.tipo === 'RONDA')) tipo = 'ALERTA';

        if (vigilante.Configuracoes.find(item => item.tipo === 'ALERTA')) tipo = 'RONDA';

        const data = {
            tipo: !!tipo ? tipo : 'ALERTA',
            parametro: 'minutes',
            valor: '5',
            usuario_id: vigilante.id
        }

        await api.post('/configuracoes/', data);
        fetchVigilante();
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Header back />
                <ScrollView>
                    {!!vigilante && vigilante.Configuracoes?.map((configuracao) => (
                        <CardConfiguracao key={configuracao.id} updateConfiguracao={updateConfiguracao} configuracao={configuracao} />
                    ))}
                    {!!vigilante && vigilante.Configuracoes?.length < 2 &&
                        <Pressable onPress={handleAddConfig}>
                            <Icon
                                ml="2"
                                size="lg"
                                as={MaterialCommunityIcons}
                                color="personColors.150"
                                name="plus"
                                mt="2"
                            />
                        </Pressable>}
                    <CustomButton title="Salvar" alignSelf="center" mt="4" onPress={handleEdit}/>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
}
