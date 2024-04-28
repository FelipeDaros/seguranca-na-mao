import { Button, Image, Modal, ScrollView, Text } from "native-base";
import { useEffect, useState } from "react";
import { IOcorrenciaProps } from "../Interfaces/IOcorrence";
import { api } from "../../../config/api";
import dayjs from "dayjs";

type Props = {
  id: number | undefined;
  open: boolean;
  setIsClose: () => void;
};

export default function ModalOccurrenceSelect({ id, open, setIsClose }: Props) {
  const [ocorrencia, setOcorrencia] = useState<IOcorrenciaProps>();

  async function buscarInformacoes() {
    const { data } = await api.get(`/ocorrencia/${id}`);
    setOcorrencia(data);
  }



  useEffect(() => {
    if (open) {
      buscarInformacoes();
    }
  }, [open]);
  return (
    <Modal isOpen={open} onClose={() => setIsClose()}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{ocorrencia?.titulo}</Modal.Header>
        <Modal.Body>
          <Text fontFamily="mono" color="personColors.150">
            Data: {dayjs(ocorrencia?.dataOcorrencia).format('DD/MM/YYYY')}
          </Text>
          <Text
            fontFamily="body"
            color="personColors.150"
            textAlign="center"
            mt="2"
          >
            {ocorrencia?.descricao}
          </Text>
          <Text fontFamily="mono" color="personColors.150" mt="4">
            Usuário resposável: {ocorrencia?.User.nome}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            {ocorrencia?.FotosOcorrencia.map(item => (
              <Image key={item.id} style={{height: 200, width: 250}} source={{uri: 'data:image/png;base64,'+item.url}} alt="foto"/>
            ))}
            
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
