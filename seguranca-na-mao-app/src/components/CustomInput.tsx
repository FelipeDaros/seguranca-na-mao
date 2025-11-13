import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  inputRef?: React.RefObject<TextInput>;
  disabled?: boolean;
};

const inputDisabled = "w-full h-12 p-2 items-center opacity-30 text-gray-100 text-lg bg-[#121214] rounded-md focus:border-[#00B37E] focus:border-[1px]";

export default function CustomInput({ inputRef, disabled = false, ...rest }: Props) {
  return (
    <TextInput
      ref={inputRef}
      className={disabled ? inputDisabled : "w-full h-12 p-2 items-center text-white text-lg bg-[#121214] rounded-md focus:border-[#00B37E] focus:border-[1px] placeholder:text-white"}
      editable={!disabled}
      {...rest}
    />
  );
}
