import Header from "../../components/Header";
import { api } from "../../config/api";
import { useCallback, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import axios from "axios";

type PropsUser = {
    id: string;
    nome: string;
    email: string;
    created_at: Date;
    ultimo_login: Date;
    isAdmin: boolean;
    empresa_id: number;
    horario_alerta: Date;
    tipo_usuario: string;
    posto_id?: number;
}

export function Usuarios() {
    const navigation = useNavigation();
    const { userAuth } = useAuth();
    const [usuarios, setUsuarios] = useState<PropsUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchUsuarios() {
        try {
            setIsLoading(true);
            // @ts-ignore
            const { data } = await api.get(`usuarios/${userAuth.user.tipo_usuario}/${userAuth?.user.empresa_id}/${userAuth?.user.id}`);
            setUsuarios(data);
        } catch (error) {
            return Alert.alert("Usuário", "Erro ao listar usuários")
        } finally {
            setIsLoading(false);
        }
    }

    function handleFormUsuario() {
        // @ts-ignore
        navigation.navigate('FormUsuarios');
    }

    function handleEdit(id: string) {
        // @ts-ignore
        navigation.navigate('EditUsuarios', { id });
    }

    async function handleDelete(id: string) {
        try {
            setIsLoading(true);
            await api.delete(`/usuarios/${id}`);
            fetchUsuarios();
            Alert.alert("Usuário", "Usuário excluído!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return Alert.alert("Usuário", error.response?.data.message);
            }
            Alert.alert("Usuário", "Erro ao deletar");
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchUsuarios();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1 bg-background-escuro">
            <Header back />
            <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
                <Text className="text-white text-xl">Lista de usuários</Text>

                <ScrollView className="flex-1 w-full h-40 gap-y-4 px-2" showsVerticalScrollIndicator={false}>
                    {usuarios?.map(item => (
                        <View key={item.id} className="flex-row px-2 items-center justify-between bg-zinc-800 rounded-md">
                            <View className="flex-col gap-x-5">
                                <Text className="text-white text-lg">Nome: {item?.nome}</Text>
                                <Text className="text-white text-lg">Tipo: {item?.tipo_usuario}</Text>
                            </View>
                            <View className="flex-row items-center gap-x-5">
                                <Pressable onPress={() => handleEdit(item.id)}>
                                    <MaterialCommunityIcons size={36} color="#00B37E" name="pencil-circle-outline" />
                                </Pressable>
                                <Pressable onPress={() => Alert.alert("Desativar usuário", "Deseja desativar o usuário ?", [
                                    {
                                        text: 'Cancelar',
                                    },
                                    {
                                        text: 'Confirmar',
                                        onPress: () => handleDelete(item.id),
                                        style: 'cancel',
                                    },
                                ],)}>
                                    <MaterialCommunityIcons size={36} color="#F75A68" name="close-circle-outline" />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <CustomButton title="Cadastrar usuário" loading={isLoading} onPress={handleFormUsuario} />
            </View>
        </SafeAreaView>
    )
}