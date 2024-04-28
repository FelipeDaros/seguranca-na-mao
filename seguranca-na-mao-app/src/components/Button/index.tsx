import { Button as NativeButton, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
}

export function Button({ title, ...props }: Props) {
  return (
    <NativeButton
      borderRadius="md"
      alignSelf="center"
      bgColor="personColors.50"
      width="80%"
      {...props}
    >
      <Text
        color="white"
        fontFamily="heading"
      >
        {title}
      </Text>
    </NativeButton>
  )
}