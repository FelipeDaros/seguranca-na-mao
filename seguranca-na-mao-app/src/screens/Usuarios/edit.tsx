import { ScrollView, Select, Text, VStack, useToast } from "native-base";
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
import { Button } from "../../components/Button";

interface IUser {
    nome: string;
    senha: string;
    email: string;
    posto_id: number;
    tipo_usuario: string;
}

const tiposUsuarios = [
    "VIGILANTE",
    "SUPERVISOR",
    "ADMINISTRADOR"
]

export function EditUsuarios() {
    const navigation = useNavigation();
    const route = useRoute();
    const toast = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [postos, setPostos] = useState<IPosto[]>([]);

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
            const { data } = await api.get(`/posto-servico/${user?.user.empresa_id}`);
            setPostos(data);
        } catch (error) {
            toast.show({
                title: "Erro ao buscar os postos de serviço!",
                duration: 3000,
                bg: "error.500",
                placement: "top",
            });
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchUser() {
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
            await api.put(`/usuarios/${route.params.id}`, {
                nome,
                senha,
                email,
                posto_id,
                empresa_id: user?.user?.empresa_id,
                tipo_usuario: tipo_usuario
            });
            toast.show({
                title: "Usuário alterado com sucesso!",
                duration: 3000,
                bg: "green.500",
                placement: "top",
            });
            reset();
            navigation.goBack();
        } catch (error: any) {
            if (error.response.data.statusCode === 400 || error.response.data.statusCode === 404) {
                toast.show({
                    title: error.response.data.message,
                    duration: 3000,
                    bg: "error.500",
                    placement: "top",
                });
                return;
            }
            toast.show({
                title: "Erro ao cadastrar Usuário!",
                duration: 3000,
                bg: "error.500",
                placement: "top",
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        buscarPostos()
        fetchUser();
    }, []);

    return (
        <SafeAreaView>
            <Header back />
            {isLoading &&
                <VStack flex={1} justifyContent="center" alignItems="center" mt="4">
                    <Loading />
                </VStack>}
            {!isLoading &&
                <ScrollView>
                    <VStack justifyContent="center" alignItems="center" mt="4" mb="4">
                        <Text fontFamily="mono" color="personColors.150" fontSize="lg">
                            Painel de controle de usuários
                        </Text>
                        <VStack mt="5%">
                            <Text mb="2" color="personColors.150" fontWeight="bold">Usuário</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <CustomInput
                                        placeholder="ex: nometal"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                                name="nome"
                            />
                            {errors.nome && <Text color="danger.500">Campo obrigatório</Text>}

                            <Text mb="2" mt="4" color="personColors.150" fontWeight="bold">Senha</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <CustomInput
                                        placeholder="ex: ****"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        type="password"
                                    />
                                )}
                                name="senha"
                            />
                            {errors.senha && <Text color="danger.500">Campo obrigatório</Text>}

                            <Text mb="2" mt="4" color="personColors.150" fontWeight="bold">Email</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <CustomInput
                                        placeholder="ex: teste@hotmail.com"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                                name="email"
                            />
                            {errors.email && <Text color="danger.500">Campo obrigatório</Text>}
                            <Text mt="4" color="personColors.150" fontWeight="bold">Posto de servico</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                        mt="4"
                                        placeholder="Selecione aqui"
                                        // @ts-ignore
                                        selectedValue={value}
                                        onValueChange={(posto: any) => {
                                            onChange(posto)
                                        }}
                                    >
                                        {postos.map((posto: any) => (
                                            <Select.Item
                                                key={posto?.id}
                                                label={posto?.nome}
                                                value={posto?.id}
                                            />
                                        ))}
                                    </Select>
                                )}
                                name="posto_id"
                            />
                            {errors.posto_id && <Text color="danger.500">Campo obrigatório</Text>}
                            <Text mt="4" color="personColors.150" fontWeight="bold">Tipo usuário</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                        mt="4"
                                        placeholder="Selecione aqui"
                                        selectedValue={value}
                                        onValueChange={(value: any) => {
                                            onChange(value)
                                        }}
                                    >
                                        {tiposUsuarios.map((tipo: any) => (
                                            <Select.Item
                                                key={tipo}
                                                label={tipo}
                                                value={tipo}
                                            />
                                        ))}
                                    </Select>
                                )}
                                name="tipo_usuario"
                            />
                            {errors.posto_id && <Text color="danger.500">Campo obrigatório</Text>}
                        </VStack>
                        <Button title="Salvar" mt="6" onPress={handleSubmit(handleSave)} />
                    </VStack>
                </ScrollView>
            }
        </SafeAreaView>
    )
}