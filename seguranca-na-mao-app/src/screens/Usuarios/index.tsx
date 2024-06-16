import { Button, FlatList, HStack, Icon, Text, VStack, useToast } from "native-base";
import Header from "../../components/Header";
import { api } from "../../config/api";
import { useCallback, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loading from "../../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";



export function Usuarios() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const toast = useToast();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    async function fetchUsuarios() {
        try {
            setIsLoading(true);
            // @ts-ignore
            const { data } = await api.get(`usuarios/${user.user.tipo_usuario}/${user?.user.empresa_id}/${user?.user.id}`);
            setUsuarios(data);
        } catch (error) {
            toast.show({
                title: "Erro ao listar usuários",
                duration: 3000,
                bg: "error.500",
                placement: "top",
            });
            return;
        } finally {
            setIsLoading(false);
        }
    }

    function handleFormUsuario() {
        navigation.navigate('FormUsuarios');
    }

    function handleEdit(id: number) {
        navigation.navigate('EditUsuarios', { id });
    }

    async function handleDelete(id: string) {
        try {
            setIsLoading(true);
            await api.delete(`/usuarios/${id}`);
            toast.show({
                title: "Usuário excluído!",
                duration: 3000,
                bg: "personColors.50",
                placement: "top",
            });
            fetchUsuarios();
        } catch (error) {

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
        <SafeAreaView>
            <Header back />
            <VStack justifyContent="center" alignItems="center" mt="4">
                <Text fontFamily="mono" color="personColors.150" fontSize="lg">
                    Lista de usuários
                </Text>
                <Button
                    variant="outline"
                    onPress={handleFormUsuario}
                    borderColor="personColors.50"
                    w="80%"
                    mt="8"
                >
                    <Text color="personColors.50" fontFamily="heading">
                        Cadastrar usuário
                    </Text>
                </Button>
                <FlatList
                    mt="4"
                    data={usuarios}
                    renderItem={({ item }) => (
                        <VStack key={item?.id} bg="gray.200" mt="2" w="72" rounded="sm" alignItems="center" justifyContent="center">
                            <Text fontFamily="mono" fontSize="md" color="personColors.150">Nome: {String(item?.nome).slice(0, 20)}</Text>
                            <Text fontFamily="mono" fontSize="sm" color="personColors.150">
                                TIPO: {item?.tipo_usuario}
                            </Text>
                            <HStack m="4">
                                <Text fontFamily="mono" fontSize="md" color="personColors.150" onPress={() => handleEdit(item.id)}><Icon
                                    ml="2"
                                    size={8}
                                    as={MaterialCommunityIcons}
                                    position="absolute"
                                    color="personColors.50"
                                    name="pencil"
                                /></Text>
                                <Text fontFamily="mono" fontSize="md" color="personColors.150" onPress={() => handleDelete(item.id)}><Icon
                                    ml="2"
                                    size={8}
                                    as={MaterialCommunityIcons}
                                    position="absolute"
                                    color="personColors.50"
                                    name="delete"
                                /></Text>
                            </HStack>
                        </VStack>
                    )}
                />
            </VStack>
        </SafeAreaView>
    )
}