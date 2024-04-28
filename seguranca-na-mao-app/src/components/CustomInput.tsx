import { Input, IInputProps } from "native-base";
import { TextInput } from "react-native";

type Props = IInputProps & {
  inputRef?: React.RefObject<TextInput>;
};

export default function CustomInput({ inputRef, ...rest }: Props) {
  return <Input ref={inputRef} borderColor="personColors.150" borderWidth={0.2} w="80%" {...rest}/>;
}
