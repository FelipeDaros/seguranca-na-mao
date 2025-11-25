import Header from "../../../components/Header";
import CustomInput from "../../../components/CustomInput";
// import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import moment from "moment";
import { api } from "../../../config/api";
import { printToFileAsync } from "expo-print";
import { shareAsync } from 'expo-sharing';
import { useAuth } from "../../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";

type Props = 'inicial' | 'final';

export function RelatorioRonda() {
  const { userAuth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [isShowDateTimePickerInicial, setIsShowDateTimePickerInicial] = useState(false);
  const [dataInicial, setDataInicial] = useState<string>("");

  const [isShowDateTimePickerFinal, setIsShowDateTimePickerFinal] = useState(false);
  const [dataFinal, setDataFinal] = useState<string>("");

  function handleOpenDateTimePicker(type: Props) {
    if (type === 'inicial') {
      isShowDateTimePickerInicial ? setIsShowDateTimePickerInicial(false) : setIsShowDateTimePickerInicial(true);
    }

    if (type === 'final') {
      isShowDateTimePickerFinal ? setIsShowDateTimePickerFinal(false) : setIsShowDateTimePickerFinal(true);
    }
  }

  async function gerarPdf() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/relatorios/ronda?dataInicial=${dataInicial}&dataFinal=${dataFinal}&empresa_id=${userAuth?.user.empresa_id}`);

      const file = await printToFileAsync({
        html: createDynamicTable(data),
        base64: false
      });
      await shareAsync(file.uri);
    } catch (error: any) {
      if (!!error.response) {
        // toast.show({
        //   title: error.response.data.message,
        //   duration: 3000,
        //   bg: "error.500",
        //   placement: "top",
        // });
        return
      }

      // toast.show({
      //   title: "Erro ao gerar o relatório",
      //   duration: 3000,
      //   bg: "error.500",
      //   placement: "top",
      // });
    } finally {
      setIsLoading(false);
    }
  }

  const createDynamicTable = (data: any) => {
    var table = '';
    let empresa = '';
    for (let i in data) {
      const item = data[i];
      empresa = item.Posto.Empresa.nome;
      const dataFormatada = moment(data[i].created_at).format('DD-MM-YYYY HH:mm:ss');
      table = table + `
      <tr>
        <td>${item.id}</td>
        <td>${item.User.nome}</td>
        <td>${item.Ponto.nome}</td>
        <td>${item.atrasado ? "SIM" : "NÃO"}</td>
        <td>${item.verificado ? "SIM" : "NÃO"}</td>
        <td>${item.motivo ?? "Não foi cancelado"}</td>
        <td>${dataFormatada}</td>
      </tr>
      `
    }

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
      <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        
        tr:nth-child(even) {
          background-color: #dddddd;
        }

        strong {
          text-transform: uppercase;
        }

        th{
          font-size: 8px;
        }
        td {
          font-size: 6px;
        }
      </style>
      </head>
      <body>
      
      <h2>Relatório de Rondas empresa | <strong>${empresa}</strong></h2>
      
      <table>
        <tr>
          <th>ID</th>
          <th>Vigilante</th>
          <th>Ponto</th>
          <th>Atrasado</th>
          <th>Verificado</th>
          <th>Motivo</th>
          <th>Horário</th>
        </tr>
        ${table}
      </table>
      
      </body>
    </html>
      `;
    return html;
  }


  return (
    <SafeAreaView>
      <Header back />
      {/* <VStack alignItems="center" justifyItems="center" mt="4">
        <Text color="personColors.150" fontFamily="mono" fontSize="lg">
          Relatório de Rondas
        </Text>
        <Text color="personColors.150" fontFamily="body" fontSize="md" my="4">Data inicial</Text>
        <CustomInput my="2" isDisabled value={dataInicial ? moment(dataInicial).format('DD-MM-YYYY') : ""} />
        <CustomButton title="Selecionar" w="80%" bg="personColors.50" onPress={() => {
          handleOpenDateTimePicker('inicial');
        }} />
        <Text color="personColors.150" fontFamily="body" fontSize="md" my="4">Data Final</Text>
        <CustomInput my="2" isDisabled value={dataFinal ? moment(dataFinal).format('DD-MM-YYYY') : ""} />
        <CustomButton title="Selecionar" w="80%" bg="personColors.50" onPress={() => {
          handleOpenDateTimePicker("final");
        }} />
      </VStack>

      {isShowDateTimePickerInicial && <RNDateTimePicker value={new Date()} onChange={(event) => {
        if (event.type === 'set') {
          setDataInicial(moment(event.nativeEvent.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
        }
        setIsShowDateTimePickerInicial(false);
      }} />}

      {isShowDateTimePickerFinal && <RNDateTimePicker value={new Date()} onChange={(event) => {
        if (event.type === 'set') {
          setDataFinal(moment(event.nativeEvent.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
        }
        setIsShowDateTimePickerFinal(false);
      }} />}

      <CustomButton isLoading={isLoading} onPress={gerarPdf} title="Gerar" alignSelf="center" mt="10" /> */}
    </SafeAreaView>
  )
}