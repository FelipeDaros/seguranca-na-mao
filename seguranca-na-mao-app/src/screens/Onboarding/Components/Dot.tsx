import { Box } from "native-base";

type Props = {
  isLight: boolean;
  selected: boolean;
}

export const Dot = ({ isLight, selected }: Props) => {
  let backgroundColor;

  if (isLight) {
    backgroundColor = selected ? '#1A998E' : 'rgba(151, 151, 151, 0.3)';
  } else {
    backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
  }

  return (
    <Box
      w="3"
      h="3"
      bg={backgroundColor}
      rounded="full"
      m="2"
    ></Box>
  );
};