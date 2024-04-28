import { Icon, Pressable, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { StepsOnboarding } from "./Components/StepsOnboarding";
import { ScreenOnboarding } from "./Components/ScreenOnboarding";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";

type Props = {
  step: number;
  text: string;
}

export function Onboarding() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => step < arraySteps.length ? setStep(step + 1) : handleFinishOnboarding();

  async function handleFinishOnboarding() {
    try {
      setLoading(true);
      const payload = {
        ...user?.user,
        welcome_screen: true
      }

      const payloadContext = {
        ...user,
        user: {
          // @ts-ignore
          ...user.user,
          welcome_screen: true
        }
      };

      await api.put(`/usuarios/${user?.user.id}`, payload);
      updateUser(payloadContext);
    } catch (error) {
      toast.show({
        title: "Erro ao tentar efetuar o onboarding",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    }finally{
      setLoading(false);
    }
  }

  if(loading){
    return(<Loading />);
  }

  const arraySteps: Props[] = [
    {
      step: 1,
      text: 'Vamos fazer uma breve apresentação das funcionalidades e de onde estão localizadas para que você se sinta familiarizado com o ambiente.'
    },
    {
      step: 2,
      text: 'O botão retratado na imagem acima é onde você emitirá seus alertas de vigilância.',
    },
    {
      step: 3,
      text: 'Suas rondas estão localizadas no card destacado acima na imagem.',
    },
    {
      step: 4,
      text: 'Em caso de emergência durante o serviço, pressione e segure o card destacado acima na imagem por alguns segundos.',
    },
    {
      step: 5,
      text: 'Para registrar uma ocorrência durante o serviço, basta acessar o card mencionado acima.',
    },
    {
      step: 6,
      text: 'Para encerrar o expediente, pressione o botão ao lado de sua foto e selecione a opção "Finalizar expediente" conforme indicado na imagem mencionada acima.',
    },
  ];

  const currentStep = arraySteps.find((item) => item.step === step);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack justifyContent="center" alignItems="center" flex={1}>
        {step === 1 && (
          <Text
            color="personColors.150"
            fontFamily="heading"
            fontSize="2xl"
            mb="4"
          >
            Seja bem vindo!
          </Text>
        )}
        <ScreenOnboarding
          // @ts-ignore
          text={currentStep?.text}
          // @ts-ignore
          step={currentStep?.step}
        />
        <VStack alignItems="center" justifyContent="center" bottom={5} position="absolute">
          <StepsOnboarding step={step} quantitySteps={arraySteps.length} />
          <Pressable
            _pressed={{
              opacity: 0.5
            }}
            onPress={nextStep}
          >
            <Icon
              size={12}
              as={MaterialCommunityIcons}
              color="personColors.50"
              name="arrow-right-bold-circle"
            />
          </Pressable>
        </VStack>
      </VStack>
    </SafeAreaView>
  )
}
