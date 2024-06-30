import { api } from "../../config/api";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Loading from "../../components/Loading";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../../components/CustomSelect";

type EmpresaProps = {
  nome: string;
  estado: string;
  cidade: string;
  documento: string;
  responsavel: string;
  contato: string;
  endereco: string;
  email: string;
}

const estados = [
  {
    id: "SC",
    nome: "SC"
  },
  {
    id: "PR",
    nome: "PR"
  },
  {
    id: "RS",
    nome: "RS"
  },
  {
    id: "SP",
    nome: "SP"
  }
]

export function RegisterEmpresa() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getFieldState,
    formState: { errors },
  } = useForm<EmpresaProps>({
    defaultValues: {
      nome: "",
      estado: "",
      cidade: "",
      documento: "",
      responsavel: "",
      contato: "",
      endereco: "",
      email: "",
    },
  });


  if (loading) {
    return (
      <Loading />
    )
  }

  async function handleSave(empresa: EmpresaProps) {
    try {
      setLoading(true);
      await api.post(`/empresa`, empresa);
      Alert.alert("Empresa", "Empresa foi salva com sucesso!");
      reset();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessages = error.response?.data.message;
        if (errorMessages && Array.isArray(errorMessages)) {
          const combinedMessages = errorMessages.join('\n');
          Alert.alert("Empresa", combinedMessages);
        }else{
          return Alert.alert("Empresa", error.response?.data.message);
        }
      }
      Alert.alert("Empresa", "Erro ao tentar alterar empresa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-background-escuro">
        <Header back />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 flex-col items-center p-6 gap-y-3 bg-background-escuro">
            <Controller
              control={control}
              rules={{
                maxLength: 100,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Nome empresa</Text>
                    <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                    {errors.nome && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="nome"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 14,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Documento</Text>
                    <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                    {errors.documento && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="documento"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 100,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Email</Text>
                    <CustomInput keyboardType="email-address" value={value} onChangeText={(text) => onChange(text)} />
                    {errors.email && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 11,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Contato</Text>
                    <CustomInput keyboardType="phone-pad" placeholder="Ex: ************" value={value} onChangeText={(text) => onChange(text)} />
                    {errors.contato && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="contato"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 50,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Responsável</Text>
                    <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                    {errors.responsavel && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="responsavel"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 50,
                max: 50,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Cidade</Text>
                    <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                    {errors.cidade && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="cidade"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 100,
                max: 100,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base">Endereço</Text>
                    <CustomInput value={value} onChangeText={(text) => onChange(text)} />
                    {errors.endereco && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="endereco"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 2,
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full justify-center items-center gap-y-2">
                  <View className="w-full items-center my-5 gap-y-2">
                    <Text className="font-bold text-white text-base mb-2">Estado</Text>
                    <CustomSelect value={value} isDisabled={loading} data={estados} selectValue={onChange} />
                    {errors.estado && <Text className="text-red-500">Campo é obrigatório</Text>}
                  </View>
                </View>
              )}
              name="estado"
            />

            <CustomButton title="Salvar" loading={loading} onPress={handleSubmit(handleSave)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}