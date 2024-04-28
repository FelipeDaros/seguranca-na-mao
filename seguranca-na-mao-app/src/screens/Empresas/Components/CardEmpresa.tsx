import { Pressable, Text, IPressableProps } from "native-base";

type EmpresaProps = {
  id: number;
  cidade: string;
  estado: string;
  nome: string;
}

type Props = IPressableProps & {
  empresa: EmpresaProps;
  selecionar: () => void;
}

export function CardEmpresa({ empresa, selecionar, ...rest }: Props) {
  return (
    <Pressable
      w="64"
      h="12"
      mt="4"
      borderWidth={1}
      borderColor="personColors.150"
      justifyContent="center"
      alignItems="center"
      borderRadius="sm"
      _pressed={{
        opacity: 0.8,
      }}
      onPress={selecionar}
      alignSelf="center"
      {...rest}
    >
      <Text color="personColors.150">{empresa.nome}</Text>
    </Pressable>
  )
}