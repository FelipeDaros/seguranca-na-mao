import AsyncStorage from "@react-native-async-storage/async-storage";

const PONTO_COLLECTION = '@SEGMAO:PONTO';

type PropsPonto = {
  id: number,
  nome: string,
  latitude: number,
  longitude: number,
  posto_id: number,
  caminho_foto_qrcode: string,
  created_at: Date
}

async function getAllPontos() {
  try {
    const storage = await AsyncStorage.getItem(PONTO_COLLECTION);
    const pontos: PropsPonto[] = storage ? JSON.parse(storage) : [];

    return pontos;
  } catch (error) {
    throw error;
  }
}

async function createPonto(ponto: PropsPonto) {
  try {
    const storageAletas = await getAllPontos();

    const storage = JSON.stringify([...storageAletas, ponto]);

    await AsyncStorage.setItem(PONTO_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

export { getAllPontos, createPonto };