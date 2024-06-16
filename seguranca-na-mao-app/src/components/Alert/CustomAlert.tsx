import React, { useRef, useState } from "react";
import { Center, Button, Text } from 'native-base';
import { AlertDialog } from 'native-base';
import CustomInput from "../CustomInput";

type Props = {
  title: string;
  content: string;
  onClick: (motivo: string) => void;
  onClose: () => void;
  isVisible: boolean;
  titleBotao: string;
  input: boolean;
}

export function CustomAlert({ content, title, isVisible, titleBotao, input = false, onClick, onClose }: Props) {
  const cancelRef = useRef(null);
  const [motivo, setMotivo] = useState(""); // Adiciona um estado para o valor do input


  return (
    <Center flex={1}>
      <AlertDialog
        isOpen={isVisible}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{title}</AlertDialog.Header>
          <AlertDialog.Body>
            <Text>{content}</Text>
            {input && <CustomInput value={motivo} onChangeText={(text) => setMotivo(text)} my="6"/>}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={() => {
                onClick(motivo);
                setMotivo("");
              }}>
                {titleBotao}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
}
