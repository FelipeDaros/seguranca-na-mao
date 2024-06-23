import { IPosto } from "../../../interfaces/IPosto";
import { CheckListStore } from "../../../store/CheckListStore";
import { PreviousService } from "./PreviousService";
import Loading from "../../../components/Loading";
import { View, Text } from "react-native";

type Props = {
  postos: IPosto[];
}

export function StepOne({ postos }: Props) {
  const [postId, onChangePostId, isLoading] = CheckListStore((state) => [state.postId, state.onChangePostId, state.isLoading]);

  return (
    <View className="items-center justify-center">
      <Text >Selecione o posto</Text>
      {/* @ts-ignore */}
      {/* <Select w="80%" selectedValue={postId} onValueChange={onChangePostId}>
        {postos.map(item => (
          //@ts-ignore
          <Select.Item key={item.id} label={item.nome} value={item.id} />
        ))}
      </Select> */}
      <PreviousService />
    </View>
  )
}