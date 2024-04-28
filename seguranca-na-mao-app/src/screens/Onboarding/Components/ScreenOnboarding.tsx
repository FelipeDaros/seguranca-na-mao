import { Image, Text, VStack } from "native-base";
import ImgSvg from '../../../assets/undraw_reminder_re_fe15.svg';

import Image1 from '../../../assets/image1.png';
import Image2 from '../../../assets/image2.png';
import Image3 from '../../../assets/image3.png';
import Image4 from '../../../assets/image4.png';
import Image5 from '../../../assets/image5.png';
import { useEffect, useState } from "react";
import { ImageSourcePropType } from "react-native";

interface ScreenOnboardingProps {
  text: string;
  step: number;
}

export function ScreenOnboarding({ text, step }: ScreenOnboardingProps) {
  const [imageAtual, setImageAtual] = useState<ImageSourcePropType | string>("");

  useEffect(() => {
    function handleImage() {
      switch (step) {
        case 2:
          setImageAtual(Image1);
          break;
        case 3:
          setImageAtual(Image2);
          break;
        case 4:
          setImageAtual(Image3);
          break;
        case 5:
          setImageAtual(Image4);
          break;
        case 6:
          setImageAtual(Image5);
          break;
        default:
          setImageAtual(""); // Defina um valor padrão caso step seja diferente de 2 a 6
          break;
      }
    }

    handleImage();
  }, [step]);

  return (
    <VStack alignItems="center">
      {step !== 1 && imageAtual && // Certifique-se de que imageAtual não está vazio
        <Image
          //@ts-ignore
          source={imageAtual}
          alt={text}
          width={200}
          height={400}
        />
      }
      {step === 1 &&
        <ImgSvg
          width={300}
          height={300}
        />
      }
      <Text
        color="personColors.150"
        fontFamily="body"
        fontSize="sm"
        textAlign="center"
        mt="4"
        width={350}
      >
        {text}
      </Text>
    </VStack>
  )
}
