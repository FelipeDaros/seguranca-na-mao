import { Select, Text, VStack } from "native-base";
import { IPosto } from "../../../interfaces/IPosto";
import { heightDevice } from "../../../utils/dimensions";
import { CheckListStore } from "../../../store/CheckListStore";
import { PreviousService } from "./PreviousService";
import Loading from "../../../components/Loading";

type Props = {
  postos: IPosto[];
}

export function StepOne({ postos }: Props) {
  const [postId, onChangePostId, isLoading] = CheckListStore((state) => [state.postId, state.onChangePostId, state.isLoading]);

  return (
    <VStack alignItems="center" height={heightDevice * 0.65}>
      <Text color="personColors.150" fontWeight="bold" fontSize="md" my="4">Selecione o posto</Text>
      {/* @ts-ignore */}
      <Select w="80%" selectedValue={postId} onValueChange={onChangePostId}>
        {postos.map(item => (
          //@ts-ignore
          <Select.Item key={item.id} label={item.nome} value={item.id} />
        ))}
      </Select>
      <PreviousService />
    </VStack>
  )
}