import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { IPosto } from "../../interfaces/IPosto";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import CustomSelect from "../../components/CustomSelect";

interface IEmpresa {
    id: number;
    nome: string;
    estado: string;
    cidade: string;
    documento: string;
    responsavel: string;
    contato: string;
    endereco: string;
    email: string;
}

interface IUser {
    nome: string;
    senha: string;
    email: string;
    posto_id: number;
    tipo_usuario: string;
    empresa_id: number;
}

const tiposUsuarios = [
    {
        id: "VIGILANTE",
        nome: "VIGILANTE"
    },
    {
        id: "SUPERVISOR",
        nome: "SUPERVISOR"
    },
    {
        id: "ADMINISTRADOR",
        nome: "ADMINISTRADOR"
    }
]

export function FormUsuarios() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [postos, setPostos] = useState<IPosto[]>([]);
    const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
    const [empresa, setEmpresa] = useState<number>();

    const {
        control,
        handleSubmit,
        reset,
        getFieldState,
        formState: { errors },
    } = useForm<IUser>({
        defaultValues: {
            nome: "",
            senha: "",
            email: ""
        },
    });

    async function buscarPostos(id: number) {
        try {
            setIsLoading(true)
            const { data } = await api.get(`/posto-servico/${id}`);
            setPostos(data);
        } catch (error) {
            Alert.alert("Cadastrar", "Erro ao buscar os postos de serviço!");
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSave({ email, nome, senha, posto_id, tipo_usuario, empresa_id }: IUser) {
        try {
            setIsLoading(true);
            await api.post('/usuarios', {
                nome: nome.toLowerCase().replace(/\s/g, ''),
                senha: senha.toLowerCase().replace(/\s/g, ''),
                email,
                posto_id,
                empresa_id: empresa_id ?? user?.user?.empresa_id,
                email_responsavel: user?.user?.email,
                tipo_usuario: tipo_usuario
            });
            reset();
            Alert.alert("Cadastrar", "Usuário criado com sucesso!");
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return Alert.alert("Cadastrar", error.response?.data.message);
            }
            Alert.alert("Cadastrar", "Erro ao cadastrar Usuário!");
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchEmpresas() {
        try {
            const { data } = await api.get('/empresa');
            setEmpresas(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return Alert.alert("Cadastrar", error.response?.data.message);
            }
        }
    }

    useEffect(() => {
        if (user?.user.tipo_usuario === 'ADMINISTRADOR') {
            if (!!empresa) {
                buscarPostos(empresa);
            }
        } else {
            // @ts-ignore
            buscarPostos(user?.user?.empresa_id);
        }

        if (user?.user.tipo_usuario === 'ADMINISTRADOR') {
            fetchEmpresas();
        }
    }, [empresa]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="flex-1 bg-background-escuro">
                <Header back />
                <ScrollView>
                    <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
                        <Text className="text-white text-xl">Painel de controle de usuários</Text>
                        <View className="w-full items-center my-5 gap-y-3">
                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 100,
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="w-full justify-center items-center gap-y-2">
                                        <View className="w-full items-center my-5 gap-y-2">
                                            <Text className="font-bold text-white text-base">Nome</Text>
                                            <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                                            {errors.nome && <Text className="text-red-500">Campo é obrigatório</Text>}
                                        </View>
                                    </View>
                                )}
                                name="nome"
                            />

                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 100,
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="w-full justify-center items-center gap-y-2">
                                        <View className="w-full items-center my-5 gap-y-2">
                                            <Text className="font-bold text-white text-base">Senha</Text>
                                            <CustomInput secureTextEntry value={value} onChangeText={(text) => onChange(text)} />
                                            {errors.senha && <Text className="text-red-500">Campo é obrigatório</Text>}
                                        </View>
                                    </View>
                                )}
                                name="senha"
                            />

                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 100,
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="w-full justify-center items-center gap-y-2">
                                        <View className="w-full items-center my-5 gap-y-2">
                                            <Text className="font-bold text-white text-base">Email</Text>
                                            <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                                            {errors.email && <Text className="text-red-500">Campo é obrigatório</Text>}
                                        </View>
                                    </View>
                                )}
                                name="email"
                            />

                            {user?.user.tipo_usuario === "ADMINISTRADOR" &&
                                <Controller
                                    control={control}
                                    rules={{
                                        maxLength: 1,
                                        required: user?.user.tipo_usuario === "ADMINISTRADOR"
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className="w-full justify-center items-center gap-y-2">
                                            <View className="w-full items-center my-5 gap-y-2">
                                                <Text className="font-bold text-white text-base mb-2">Empresa</Text>
                                                <CustomSelect value={value} isDisabled={isLoading} data={empresas} selectValue={e => {
                                                    onChange(e)
                                                    // @ts-ignore
                                                    setEmpresa(e);
                                                }} />
                                                {errors.empresa_id && <Text className="text-red-500">Campo é obrigatório</Text>}
                                            </View>
                                        </View>
                                    )}
                                    name="empresa_id"
                                />
                            }

                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 1,
                                    required: false
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="w-full justify-center items-center gap-y-2">
                                        <View className="w-full items-center my-5 gap-y-2">
                                            <Text className="font-bold text-white text-base mb-2">Posto serviço</Text>
                                            <CustomSelect value={value} isDisabled={isLoading || user?.user.tipo_usuario === "ADMINISTRADOR" && !empresas.length} data={postos} selectValue={onChange} />
                                            {errors.posto_id && <Text className="text-red-500">Campo é obrigatório</Text>}
                                        </View>
                                    </View>
                                )}
                                name="posto_id"
                            />

                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 20,
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="w-full justify-center items-center gap-y-2">
                                        <View className="w-full items-center my-5 gap-y-2">
                                            <Text className="font-bold text-white text-base mb-2">Tipo usuário</Text>
                                            <CustomSelect value={value} isDisabled={isLoading} data={tiposUsuarios} selectValue={onChange} />
                                            {errors.tipo_usuario && <Text className="text-red-500">Campo é obrigatório</Text>}
                                        </View>
                                    </View>
                                )}
                                name="tipo_usuario"
                            />
                        </View>
                        <CustomButton title="Salvar" loading={isLoading} onPress={handleSubmit(handleSave)} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}