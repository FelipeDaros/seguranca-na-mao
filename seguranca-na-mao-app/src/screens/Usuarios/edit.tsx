import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { IPosto } from "../../interfaces/IPosto";
import Loading from "../../components/Loading";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import axios from "axios";
import CustomSelect from "../../components/CustomSelect";

interface IUser {
    nome: string;
    senha: string;
    email: string;
    posto_id: number;
    tipo_usuario: string;
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

export function EditUsuarios() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [postos, setPostos] = useState<any[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<IUser>({
        defaultValues: {
            nome: "",
            senha: "",
            email: ""
        },
    });

    async function buscarPostos() {
        try {
            setIsLoading(true)
            const { data } = await api.get(`/posto-servico/${userAuth?.user.empresa_id}`);
            setPostos(data);
        } catch (error) {
            Alert.alert("Usuário", "Erro ao buscar os postos de serviço!");
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchUser() {
        // @ts-ignore
        const { data } = await api.get(`/usuarios/find/${route.params.id}`);
        setValue('nome', data.nome);
        setValue('senha', data.senha);
        setValue('email', data.email);
        setValue('posto_id', data.posto_id);
        setValue('tipo_usuario', data.tipo_usuario);
    }

    async function handleSave({ email, nome, senha, posto_id, tipo_usuario }: IUser) {
        try {
            setIsLoading(true);
            // @ts-ignore
            await api.put(`/usuarios/${route.params.id}`, {
                nome,
                senha,
                email,
                posto_id,
                empresa_id: userAuth?.user?.empresa_id,
                tipo_usuario: tipo_usuario
            });
            reset();
            Alert.alert("Usuário", "Usuário alterado com sucesso!");
            navigation.goBack();
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return Alert.alert("Usuário", error.response?.data.message);
            }

            Alert.alert("Usuário", "Erro ao cadastrar Usuário!");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        buscarPostos()
        fetchUser();
    }, []);

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

                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 100,
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="w-full justify-center items-center gap-y-2">
                                        <View className="w-full items-center my-5 gap-y-2">
                                            <Text className="font-bold text-white text-base mb-2">Posto</Text>
                                            <CustomSelect value={value} isDisabled={isLoading} data={postos} selectValue={onChange} />
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