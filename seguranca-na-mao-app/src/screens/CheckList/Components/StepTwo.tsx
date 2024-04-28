import { Checkbox, FlatList, Text, VStack } from "native-base";
import { heightDevice } from "../../../utils/dimensions";
import Loading from "../../../components/Loading";
import { CheckListStore } from "../../../store/CheckListStore";

export function StepTwo() {
  const [equipamentos, equipamentosSelecionados, onHandleEquipamento, isLoading] = CheckListStore((state) => [state.equipamentos, state.equipamentosSelecionados, state.onHandleEquipamento, state.isLoading]);

  return (
    <VStack alignItems="center" height={heightDevice * 0.65}>
      <Text color="personColors.150" mb="8" fontWeight="bold">Selecione seus equipamentos</Text>
      <FlatList
        data={equipamentos}
        renderItem={({ item }) => (<Checkbox key={item.id} value={String(item.id)} onChange={() => onHandleEquipamento(item.id)} defaultIsChecked={equipamentosSelecionados.some(id => id === item.id)} aria-label={item.nome} accessibilityLabel={item.nome}>{String(item.nome).toUpperCase()}</Checkbox>)}
        ListEmptyComponent={() => (<Text textAlign="center">Listagem vazia, selecione o posto para buscar os equipamentos</Text>)}
      />
    </VStack>
  )
}