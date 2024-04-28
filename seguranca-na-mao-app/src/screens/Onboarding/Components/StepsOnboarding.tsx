import { Box, HStack } from "native-base";

type Props = {
  step: number;
  quantitySteps: number;
}

export function StepsOnboarding({ step, quantitySteps }: Props) {
  const stepsArray = Array.from({ length: quantitySteps }, (_, index) => index + 1);

  return (
    <HStack>
      {stepsArray.map((index) => (
        <Box
          key={index}
          w="4"
          h="4"
          bg={index === step ? "#1A998E" : "#D9D9D9"}
          rounded="full"
          m="2"
        ></Box>
      ))}
    </HStack>
  )
}
