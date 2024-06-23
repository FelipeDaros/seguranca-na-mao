import { TextInput, TextInputProps } from "react-native";

type Props = TextInputProps & {
  inputRef?: React.RefObject<TextInput>;
};

export default function CustomInput({ inputRef, ...rest }: Props) {
  return <TextInput ref={inputRef} className="w-9/12 h-10 p-2 text-white text-lg bg-[#121214] rounded-md focus:border-[#00B37E] focus:border-[1px]" {...rest}/>;
}
