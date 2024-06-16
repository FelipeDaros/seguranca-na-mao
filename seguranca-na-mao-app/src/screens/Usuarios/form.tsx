import { ScrollView, Select, Text, VStack, useToast } from "native-base";
import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { IPosto } from "../../interfaces/IPosto";
import Loading from "../../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import axios from "axios";

interface IUser {
    nome: string;
    senha: string;
    email: string;
    posto_id: number;
    tipo_usuario: string;
    empresa_id: number;
}

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

const tiposUsuarios = [
    "VIGILANTE",
    "SUPERVISOR"
]

export function FormUsuarios() {
    const toast = useToast();
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
            toast.show({
                title: "Usuário criado com sucesso!",
                duration: 3000,
                bg: "green.500",
                placement: "top",
            });
            reset();
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return toast.show({
                    title: error.response?.data.message,
                    duration: 3000,
                    bg: "error.500",
                    placement: "top",
                });
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

    async function fetchEmpresas() {
        try {
            const { data } = await api.get('/empresa');
            setEmpresas(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return toast.show({
                    title: error.response?.data.message,
                    duration: 3000,
                    bg: "error.500",
                    placement: "top",
                });
            }
        }
    }

    useEffect(() => {
        if (user?.user.tipo_usuario === 'ADMINISTRADOR') {
            if (!!empresa) {
                console.log(empresa)
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
        <SafeAreaView style={{ flex: 1 }}>
            <Header back />
            {isLoading &&
                <VStack flex={1} justifyContent="center" alignItems="center" mt="4">
                    <Loading />
                </VStack>}
            {!isLoading &&
                <ScrollView>
                    <VStack alignItems="center" mt="4" mb="4">
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
                            {user?.user.tipo_usuario === 'ADMINISTRADOR' &&
                                <>
                                    <Text mt="4" color="personColors.150" fontWeight="bold">Empresa</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: user?.user.tipo_usuario === 'ADMINISTRADOR',
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Select
                                                mt="4"
                                                placeholder="Selecione aqui"
                                                // @ts-ignore
                                                selectedValue={value}
                                                onValueChange={(empresa: any) => {
                                                    setEmpresa(empresa);
                                                    onChange(empresa);
                                                }}
                                            >
                                                {empresas.map((empresa: any) => (
                                                    <Select.Item
                                                        key={empresa?.id}
                                                        label={empresa?.nome}
                                                        value={empresa.id}
                                                    />
                                                ))}
                                            </Select>
                                        )}
                                        name="empresa_id"
                                    />
                                    {errors.empresa_id && <Text color="danger.500">Campo obrigatório</Text>}
                                </>
                            }
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
                                        isDisabled={user?.user.tipo_usuario === 'ADMINISTRADOR' && !empresa}
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
                                        isDisabled={user?.user.tipo_usuario === 'ADMINISTRADOR' && !empresa}
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
                        <CustomButton title="Salvar" mt="6" onPress={handleSubmit(handleSave)} />
                    </VStack>
                </ScrollView>
            }
        </SafeAreaView>
    )
}