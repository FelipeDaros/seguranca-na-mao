import { api } from "../../config/api";
import { useState, useEffect } from "react";
import { IVigilanteConfig } from "../../interfaces/IVigilanteConfig";
import Header from "../../components/Header";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomSelect from "../../components/CustomSelect";

interface Configuracoes {
    id: number;
    tipo: 'RONDA' | 'ALERTA';
    valor: number | string;
    parametro: string;
    usuario_id: string
    created_at: Date;
}

const options = [
    {
        id: 'minutes',
        nome: 'Minutos'
    }
];

const tipos = [
    {
        id: "RONDA",
        nome: "RONDA"
    },
    {
        id: "ALERTA",
        nome: "ALERTA"
    }
]

export default function RegisterConfiguracoes({ route }: any) {
    const [vigilante, setVigilante] = useState<IVigilanteConfig>({} as IVigilanteConfig);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Configuracoes>({});

    async function fetchVigilante() {
        try {
            setIsLoading(true);
            const { data } = await api.get<IVigilanteConfig>(`/configuracoes/vigilante/${route.params.vigilante_id}`);
            setVigilante(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return Alert.alert("Configurações", error.response?.data.message);
            }
            Alert.alert("Configurações", "Erro ao buscar o vigilante!");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleEdit() {
        try {
            setIsLoading(true);

            for await (const configuracao of vigilante.Configuracoes) {
                await api.put('/configuracoes', configuracao);
            }
            Alert.alert("Configurações", "Vigilante alterado com sucesso!");
            fetchVigilante();
        } catch (error: any) {
            Alert.alert("Erro ao salvar", "Acabou gerando erro, por favor falar com o administrador");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave({ parametro, tipo, valor }: Configuracoes) {
        try {
            const data = {
                tipo: tipo,
                parametro: parametro,
                valor: valor,
                usuario_id: vigilante.id
            }

            await api.post('/configuracoes/', data);
            Alert.alert("Configuração", "Configuração cadastrada");
            fetchVigilante();
        } catch (error) {
            if(axios.isAxiosError(error)){
                return Alert.alert("Configuração", error.response?.data.message);
            }

            Alert.alert("Configuração", "Erro ao tentar cadastrar configuração");
        }
    }

    useEffect(() => {
        fetchVigilante();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-background-escuro">
            <Header back />
            <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
                <Text className="text-white text-xl">Cadastrar configuração</Text>
                <View className="w-full items-center my-5 gap-y-3">
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="w-full justify-center items-center gap-y-2">
                                <Text className="text-white text-lg mb-2">
                                    Tipo
                                </Text>
                                <CustomSelect value={value} isDisabled={isLoading} data={tipos} selectValue={onChange} />
                                {errors.tipo && <Text className="text-red-500">Campo é obrigatório</Text>}
                            </View>
                        )}
                        name="tipo"
                    />

                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="w-full justify-center items-center gap-y-2 mt-2">
                                <Text className="text-white text-lg mb-2">
                                    Parametro
                                </Text>
                                <CustomSelect value={value} isDisabled={isLoading} data={options} selectValue={onChange} />
                                {errors.parametro && <Text className="text-red-500">Campo é obrigatório</Text>}
                            </View>
                        )}
                        name="parametro"
                    />


                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="w-full justify-center items-center gap-y-2 mt-2">
                                <Text className="text-white text-xl mb-2">Valor</Text>
                                <CustomInput
                                    onChangeText={onChange}
                                    // @ts-ignore
                                    value={value}
                                />
                                {errors.valor && <Text className="text-red-500">Campo é obrigatório</Text>}
                            </View>
                        )}
                        name="valor"
                    />
                    <View className="w-full justify-center items-center">
                    </View>
                </View>
                <CustomButton title="Salvar" loading={isLoading} onPress={handleSubmit(handleSave)} />
            </View>
        </SafeAreaView>
    );
}
