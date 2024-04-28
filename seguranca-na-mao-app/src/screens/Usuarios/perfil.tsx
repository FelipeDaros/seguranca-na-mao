import { Button, Text, VStack, ScrollView, useToast } from "native-base";
import Header from "../../components/Header";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { SafeAreaView } from "react-native-safe-area-context";

interface IUser {
    nome: string;
    senha: string;
    email: string;
    tipo_usuario: string;
}

export function Perfil() {
    const toast = useToast();
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

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
            email: "",
            tipo_usuario: "tipo_usuario"
        },
    });

    async function fetchData() {
        const { data } = await api.get(`/usuarios/find/${user?.user.id}`);
        setValue("nome", data.nome);
        setValue("senha", data.senha);
        setValue("email", data.email);
        setValue("tipo_usuario", data.tipo_usuario);
    }

    async function handleSave(userData: IUser) {
        try {
            setIsLoading(true);
            await api.put(`/usuarios/${user?.user.id}`, userData);
            toast.show({
                title: "Usuário atualizado com sucesso!",
                duration: 3000,
                bg: "personColors.50",
                placement: "top",
            });

            const updateUserContext = {
                ...user,
                user: {
                    ...user?.user,
                    nome: userData.nome,
                    email: userData.email 
                }
            }
            
             // @ts-ignore
            await updateUser(updateUserContext);
        } catch (error) {
            toast.show({
                title: "Erro ao atualizar usuário!",
                duration: 3000,
                bg: "error.500",
                placement: "top",
            });
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    return (
        <SafeAreaView>
            <Header back />
            <VStack justifyContent="center" alignItems="center" mt="4" mb="4">
                <Text fontFamily="mono" color="personColors.150" fontSize="lg">
                    Perfil do usuário
                </Text>
                <VStack mt="5%">
                    <Text mb="2" mt="4" color="personColors.150" fontWeight="bold">Nome</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomInput
                                placeholder="ex: exemplo teste"
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
                                placeholder="ex: *******"
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
                            pattern: /^\S+@\S+$/i
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
                    {errors.email && <Text color="danger.500">Campo obrigatório/Email inválido</Text>}
                    <Text mb="2" mt="4" color="personColors.150" fontWeight="bold">Tipo usuário</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomInput
                                isDisabled
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="tipo_usuario"
                    />
                    {errors.tipo_usuario && <Text color="danger.500">Campo obrigatório</Text>}
                </VStack>
                <Button isLoading={isLoading} mt="6" w="80%" rounded="full" bgColor="personColors.50" onPress={handleSubmit(handleSave)}>Salvar</Button>
            </VStack>
        </SafeAreaView>
    )
}