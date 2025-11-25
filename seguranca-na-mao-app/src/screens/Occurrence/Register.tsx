import Header from "../../components/Header";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { api } from "../../config/api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { View, Text, Alert, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as ImageManipulator from 'expo-image-manipulator';

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      data_selecionada: new Date(),
      fotos: []
    }
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { userAuth } = useAuth();

  const fotos = watch("fotos");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: false
      });

      if (!result.canceled) {
        // Comprimir cada imagem
        const compressedImages = await Promise.all(
          result.assets.map(async (asset) => {
            const manipResult = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 1024 } }],
              { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            return {
              ...asset,
              base64: manipResult.base64,
              uri: manipResult.uri
            };
          })
        );
        
        setValue("fotos", compressedImages);
        Alert.alert("Sucesso", `${compressedImages.length} foto(s) selecionada(s)`);
      }
    } else {
      Alert.alert("Permissão negada", "É necessário permitir acesso à galeria");
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  };

  const showDateTimePicker = (currentDate: Date, onChange: (date: Date) => void) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentDate || new Date(),
        mode: 'date',
        maximumDate: new Date(),
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: 'time',
              onChange: (timeEvent, selectedTime) => {
                if (timeEvent.type === 'set' && selectedTime) {
                  onChange(selectedTime);
                }
              }
            });
          }
        }
      });
    } else {
      setShowDatePicker(true);
    }
  };

  async function salvarOcorrencia(data: FormData) {
    try {
      setLoading(true);
      await api.post('/ocorrencia', {
        descricao: data.descricao,
        titulo: data.titulo,
        usuario_id: userAuth?.user.id,
        data_ocorrencia: data.data_selecionada,
        fotos: data.fotos
      });
      Alert.alert("Sucesso", "Ocorrência registrada com sucesso!");
      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Erro ao registrar ocorrência!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-escuro">
      <Header back />
      <ScrollView className="flex-1" contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }}>
        <Text className="text-white text-2xl mb-10">
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
            <View className="w-full px-10">
              <Text className="text-white text-base mb-2">
                Título
              </Text>
              <CustomInput
                onChangeText={onChange}
                value={value}
                placeholder="Digite o título"
                className={errors.titulo ? "border-red-500" : ""}
              />
              {errors.titulo && (
                <Text className="text-red-500 mt-2">{errors.titulo.message}</Text>
              )}
            </View>
          )}
          name="titulo"
        />

        <Controller
          control={control}
          rules={{
            maxLength: { value: 500, message: "Máximo de 500 caracteres" },
            required: "Campo é obrigatório",
            minLength: { value: 6, message: "Mínimo de 6 caracteres" }
          }}
          render={({ field: { onChange, value } }) => (
            <View className="w-full px-10 mt-6">
              <Text className="text-white text-base mb-2">
                Descrição
              </Text>
              <CustomInput
                onChangeText={onChange}
                value={value}
                placeholder="Digite a descrição"
                multiline
                numberOfLines={4}
                className={errors.descricao ? "border-red-500" : ""}
                style={{ height: 100, textAlignVertical: 'top' }}
              />
              {errors.descricao && (
                <Text className="text-red-500 mt-2">{errors.descricao.message}</Text>
              )}
            </View>
          )}
          name="descricao"
        />

        <Controller
          control={control}
          rules={{
            required: "Selecione uma data"
          }}
          render={({ field: { onChange, value } }) => (
            <View className="w-full px-10 mt-4">
              {Platform.OS === 'ios' && showDatePicker && (
                <DateTimePicker
                  mode="datetime"
                  display="spinner"
                  value={value || new Date()}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (event?.type === "set" && selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
              {value && (
                <View className="p-3 bg-zinc-800 rounded-md">
                  <Text className="text-white text-center">
                    📅 {new Date(value).toLocaleDateString('pt-BR')} às {new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              )}
              <CustomButton
                loading={false}
                title="Selecionar data e hora"
                onPress={() => showDateTimePicker(value || new Date(), onChange)}
                className="w-full mt-3"
              />
              {errors.data_selecionada && (
                <Text className="text-red-500 mt-2">{errors.data_selecionada.message}</Text>
              )}
            </View>
          )}
          name="data_selecionada"
        />

        <View className="w-full px-10 mt-4">
          {fotos && fotos.length > 0 && (
            <View className="mb-4 p-3 bg-zinc-800 rounded-md">
              <Text className="text-white font-bold mb-2">
                📷 Fotos selecionadas ({fotos.length}):
              </Text>
              {fotos.map((foto, index) => (
                <Text key={index} className="text-gray-300 text-sm ml-2">
                  • {foto.fileName || `Foto ${index + 1}`}
                </Text>
              ))}
            </View>
          )}
          
          <CustomButton
            loading={false}
            title="Selecionar fotos"
            onPress={pickImage}
            className="w-full"
          />
        </View>

        <CustomButton
          title="Salvar"
          onPress={handleSubmit(salvarOcorrencia)}
          loading={loading}
          className="mt-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}