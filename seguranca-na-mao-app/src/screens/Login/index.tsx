import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { api } from "../../config/api";

export default function Login() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const inputUsuarioRef = useRef<TextInput>(null);
  const inputSenhaRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      senha: "",
    },
  });

  async function login(form: any) {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const { data } = await api.post("/auth", {
        nome: form.nome.trim(),
        senha: form.senha.trim()
      });
      await signIn(data, data.ultimoServico);

      toast.show({
        title: "Login efetuado com sucesso!",
        duration: 3000,
        bg: "personColors.50",
        placement: "top",
      });

      setLoading(false);

      return;
    } catch (error: any) {
      // if (!!error.response) {
      //   toast.show({
      //     title: error.response.data.message,
      //     duration: 3000,
      //     bg: "error.500",
      //     placement: "top",
      //   });
      //   return;
      // }
      // toast.show({
      //   title: "Erro ao tentar efetuar login!",
      //   duration: 3000,
      //   bg: "error.500",
      //   placement: "top",
      // });
    } finally {
      setLoading(false);
    }
  }

  return (
    // <VStack flex={1} justifyContent="center" alignItems="center">
    //   <VStack justifyContent="center" alignItems="center">
    //     <Text fontFamily="heading" fontSize="2xl" color="personColors.200">
    //       Bem vindo
    //     </Text>
    //     <Text fontFamily="mono" color="personColors.150" mt="4">
    //       Efetue o login para continuar
    //     </Text>
    //   </VStack>
    //   <VStack>
    //     <Controller
    //       control={control}
    //       rules={{
    //         required: true,
    //       }}
    //       render={({ field: { onChange, onBlur, value } }) => (
    //         <CustomInput
    //           placeholder="informe seu usuário"
    //           onChangeText={(text) => onChange(text)}
    //           borderColor={errors.nome && "error.500"}
    //           borderWidth={errors.nome && "1"}
    //           onSubmitEditing={(e) => {
    //             inputSenhaRef.current?.focus();
    //           }}
    //           inputRef={inputUsuarioRef}
    //           returnKeyType="go"
    //           InputLeftElement={
    //             <Icon
    //               ml="2"
    //               size="md"
    //               as={MaterialCommunityIcons}
    //               position="absolute"
    //               color="personColors.150"
    //               name="account"
    //             />
    //           }
    //           textAlign="center"
    //           _focus={{ textAlign: "center" }}
    //           my="6"
    //         />
    //       )}
    //       name="nome"
    //     />
    //     {errors.nome && (
    //       <Text color={"error.500"} fontSize={10} mb="2">
    //         Campo é obrigatório
    //       </Text>
    //     )}
    //     <Controller
    //       control={control}
    //       rules={{
    //         required: true,
    //       }}
    //       render={({ field: { onChange, onBlur, value } }) => (
    //         <CustomInput
    //           placeholder="Insira sua senha"
    //           onChangeText={(text) => onChange(text)}
    //           borderColor={errors.senha && "error.500"}
    //           borderWidth={errors.senha && "1"}
    //           inputRef={inputSenhaRef}
    //           InputRightElement={
    //             <Icon
    //               ml="2"
    //               size="md"
    //               as={MaterialCommunityIcons}
    //               position="absolute"
    //               color="personColors.150"
    //               name="lock-outline"
    //             />
    //           }
    //           textAlign="center"
    //           _focus={{ textAlign: "center" }}
    //           my="6"
    //           secureTextEntry
    //         />
    //       )}
    //       name="senha"
    //     />
    //     {errors.senha && (
    //       <Text color={"error.500"} fontSize={10} mb="2">
    //         Campo é obrigatório
    //       </Text>
    //     )}
    //   </VStack>
    //   <CustomButton
    //     title="Entrar"
    //     isLoading={loading}
    //     onPress={handleSubmit(login)}
    //     mt="10"
    //   />
    // </VStack>
    <View className="flex-1 justify-center">
      <Text>Login</Text>
    </View>
  );
}
