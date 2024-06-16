import { Image, useToast } from "native-base";
import { useState } from "react";
import axios from "axios";

import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import OnboardingComponent from 'react-native-onboarding-swiper';

import Image1 from '../../assets/image1.png';
import Image2 from '../../assets/image2.png';
import Image3 from '../../assets/image3.png';
import Image4 from '../../assets/image4.png';
import Image5 from '../../assets/image5.png';
import ImgSvg from '../../assets/undraw_reminder_re_fe15.svg';

import { Next } from "./Components/Next";
import { Done } from "./Components/Done";
import { Skip } from "./Components/Skip";
import { Dot } from "./Components/Dot";

export function Onboarding() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

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
      if(axios.isAxiosError(error)){
        toast.show({
          title: error.response?.data.message,
          duration: 3000,
          bg: "error.500",
          placement: "top",
        });
        return;
      }
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

  
  const steps = [
    {
      backgroundColor: '#fff',
      image: <ImgSvg width={350} height={350}/>,
      title: 'Seja bem vindo!',
      subtitle: 'Vamos fazer uma breve apresentação das funcionalidades e de onde estão localizadas para que você se sinta familiarizado com o ambiente.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={Image1} alt="image" style={{width: 200, height: 380}}/>,
      title: 'Alertas',
      subtitle: 'O botão retratado na imagem acima é onde você emitirá seus alertas de vigilância.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={Image2} alt="image" style={{width: 200, height: 380}}/>,
      title: 'Rondas',
      subtitle: 'Suas rondas estão localizadas no card destacado acima na imagem.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={Image3} alt="image" style={{width: 200, height: 380}}/>,
      title: 'Emergência',
      subtitle: 'Em caso de emergência durante o serviço, pressione e segure o card destacado acima na imagem por alguns segundos.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={Image4} alt="image" style={{width: 200, height: 380}}/>,
      title: 'Ocorrência',
      subtitle: 'Para registrar uma ocorrência durante o serviço, basta acessar o card mencionado acima.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={Image5} alt="image" style={{width: 200, height: 380}}/>,
      title: 'Expediente',
      subtitle: 'Para encerrar o expediente, pressione o botão ao lado de sua foto e selecione a opção "Finalizar expediente" conforme indicado na imagem mencionada acima.',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnboardingComponent 
        pages={steps}
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dot}
        bottomBarHeight={40}
        onDone={handleFinishOnboarding}
      />
    </SafeAreaView>
  )
}
