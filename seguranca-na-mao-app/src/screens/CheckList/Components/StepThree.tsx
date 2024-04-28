import { Checkbox, ScrollView, Text, VStack } from "native-base";
import { heightDevice } from "../../../utils/dimensions";
import { CheckListStore } from "../../../store/CheckListStore";
import Loading from "../../../components/Loading";


export function StepThree(){
  const [equipamentos, equipamentosSelecionados, relatorioLido, onChangeRelatorioLido, isLoading] = CheckListStore((state) => [state.equipamentos, state.equipamentosSelecionados, state.relatorioLido, state.onChangeRelatorioLido, state.isLoading]);
  
  return(
    <ScrollView height={heightDevice * 0.65}>
      <Text textAlign="center" color="personColors.150" mb="8" fontSize="lg" fontWeight="bold">Resumo do checklist</Text>
      {/* @ts-ignore */}
      <Text color="personColors.150" fontSize="md">Equipamento(s) selecionado(s)</Text>
      {equipamentosSelecionados.map((item => <Text key={item} fontWeight="bold" textTransform="uppercase" color="personColors.150" mt="2">{equipamentos.find(equipa => equipa.id === item)?.nome}</Text>))}
      {/* @ts-ignore */}
      <Checkbox mt="8" value={relatorioLido} defaultIsChecked={relatorioLido} onChange={() => onChangeRelatorioLido()}><Text color="personColors.150" fontSize="sm">Concordo que foi realizado a leitura</Text></Checkbox>
    </ScrollView>
  )
}