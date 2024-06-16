import { Button, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
};

export default function CustomButton({ title, ...rest }: Props) {
  return (
    <Button rounded="full" bg="personColors.50" w="80%" bottom={0} mb="4" {...rest}>
      <Text color="white" fontFamily="mono">
        {title}
      </Text>
    </Button>
  );
}
