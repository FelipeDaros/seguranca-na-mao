import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { getAllRondas, updateRonda } from "../../../store/RondaStorage";

export function Cards(props: any) {
  const [isVisible, setIsVisible] = useState(false);
  const [rondaSelecionadaId, setRondaSelecionadaId] = useState<number | null>(null);
  const navigation = useNavigation();

  function handleRound(id: any) {
    //@ts-ignore
    navigation.navigate("RoundSelected", id);
  }

  async function handleDelete(motivo: string) {
    const ronda = ((await getAllRondas()).find(item => item.id === rondaSelecionadaId));

    const rondaUpdate = {
      ...ronda,
      isSincronized: true,
      cancelado: true,
      motivo
    }

    // @ts-ignore
    await updateRonda(rondaUpdate);
    onClose();
    props.fetchRondas();
  }

  const onClose = () => setIsVisible(!isVisible);

  return (
    <Pressable onPress={() => handleRound(props.item?.id)} className="w-72 h-20 bg-zinc-800 items-center justify-center rounded-md mt-6">
      <Text className="text-white text-base">Local: {props.item?.nome}</Text>
    </Pressable>
  );
}
