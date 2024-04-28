import { Select, ISelectProps } from "native-base";
import { useEffect, useState } from "react";

type Props = ISelectProps & {
  values: any[];
  selectItem: (item: any) => void;
};

export default function CustomSelect({ values, selectItem, ...rest }: Props) {
  const [value, setValue] = useState();
  useEffect(() => {
    selectItem(value);
  }, [value]);

  return (
    <Select
      borderColor="personColors.150"
      borderWidth={0.2}
      w="100%"
      bg="white"
      placeholder="Informe o posto"
      onValueChange={(item: any) => {
        setValue(item);
      }}
      {...rest}
    >
      {values.map((option) => (
        <Select.Item key={option.id} label={option.nome} value={option.id} />
      ))}
    </Select>
  );
}
