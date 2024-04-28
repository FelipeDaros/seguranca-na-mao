import { Button as NativeButton, HStack, Text, VStack, useToast } from "native-base";
import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";

type FormData = {
  titulo: string;
  descricao: string;
  data_selecionada: Date;
  fotos: any[];
};

export default function RegisterOccurrence() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});
  const toast = useToast();
  const [isOpenData, setIsOpenData] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // No permissions request is necessary for launching the image library
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      if (!result.cancelled) {
        setValue("fotos", result.assets);
      }
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  };

  async function salvarOcorrencia(data: FormData) {
    try {
      await api.post('/ocorrencia', {
        descricao: data.descricao,
        titulo: data.titulo,
        usuario_id: user?.user.id,
        dataOcorrencia: data.data_selecionada,
        fotos: data.fotos
      });
      navigation.goBack();
      toast.show({
        title: "Ocorrência registrada com sucesso!",
        duration: 3000,
        bg: "green.400",
        placement: "top",
      });
    } catch (error) {
      toast.show({
        title: "Erro ao registrar ocorrência!",
        duration: 3000,
        bg: "error.500",
        placement: "top",
      });
    }
  }

  return (
    <SafeAreaView>
      <Header back />
      <VStack alignItems="center" justifyItems="center" mt="6">
        <Text color="personColors.150" fontFamily="body" fontSize="2xl" mb="10">
          Registrar Ocorrência
        </Text>
        <Controller
          control={control}
          rules={{
            maxLength: { value: 100, message: "Máximo de 100 caracteres" },
            required: "Campo é obrigatório",
            minLength: { value: 6, message: "Mínimo de 6 caracteres" }
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <Text
                color="personColors.150"
                fontFamily="body"
                fontSize="md"
                ml="10"
                alignSelf="flex-start"
              >
                Título
              </Text>
              <CustomInput
                bg="white"
                borderColor={errors.titulo && 'error.500'}
                mt="2"
                onChangeText={onChange}
                value={value}
              />
              {errors.titulo && <Text color="error.500" my="2">{errors.titulo.message}</Text>}
            </>
          )}
          name="titulo"
        />
        <Controller
          control={control}
          rules={{
            maxLength: { value: 100, message: "Máximo de 100 caracteres" },
            required: "Campo é obrigatório",
            minLength: { value: 6, message: "Mínimo de 6 caracteres" }
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <Text
                color="personColors.150"
                fontFamily="body"
                fontSize="md"
                ml="10"
                mt="6"
                alignSelf="flex-start"
              >
                Descrição
              </Text>
              <CustomInput
                bg="white"
                borderColor={errors.descricao && 'error.500'}
                mt="2"
                onChangeText={onChange}
                value={value}
                multiline
              />
              {errors.descricao && <Text color="error.500" my="2">{errors.descricao.message}</Text>}
            </>
          )}
          name="descricao"
        />
        <Button title="Selecionar data" w="60%" mt="6" onPress={() => setIsOpenData(true)} />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              {isOpenData && (
                <RNDateTimePicker
                  mode="datetime"
                  value={value ? new Date(value) : new Date()}
                  onChange={(event, selectedDate) => {
                    setIsOpenData(false);
                    if (event?.type === "set" && selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
            </>
          )}
          name="data_selecionada"
        />
        <Button title="Selecionar foto" w="60%" mt="6" onPress={pickImage} />
      </VStack>
      <Button mt="10" onPress={handleSubmit(salvarOcorrencia)} title="Salvar" />
    </SafeAreaView>
  );
}
