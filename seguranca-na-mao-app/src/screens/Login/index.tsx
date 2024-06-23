import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { api } from "../../config/api";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

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
      setLoading(false);
      return;
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 flex-col items-center justify-center gap-y-5 bg-[#201F24]">
      <Text className="font-bold text-white text-4xl mb-10">Bem vindo</Text>
      <Text className="font-normal text-white text-lg mb-10">Efetue o login para continuar</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="container items-center my-5 gap-y-2">
            <Text className="font-bold text-white text-base">Usuário</Text>
            <CustomInput inputRef={inputUsuarioRef} value={value} onChangeText={(text) => onChange(text)} />
          </View>
        )}
        name="nome"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="container items-center my-5 gap-y-2">
            <Text className="font-bold text-white  text-base">Senha</Text>
            <CustomInput inputRef={inputSenhaRef} value={value} onChangeText={(text) => onChange(text)}  secureTextEntry/>
          </View>
        )}
        name="senha"
      />
      <CustomButton title="Entrar" loading={loading} onPress={handleSubmit(login)} />
    </View>
  );
}
