import AsyncStorage from "@react-native-async-storage/async-storage";

const RONDA_COLLECTION = '@SEGMAO:RONDA';

export type PropsRonda = {
  id: number,
  user_id: string | undefined,
  verificado: boolean,
  atrasado: boolean,
  posto_id: number,
  ponto_id: number,
  maximo_horario: string,
  cancelado: boolean;
  motivo: string;
  nome: string;
  isSincronized: boolean;
  servico_id: number | undefined;
}

async function getAllRondas(): Promise<PropsRonda[]> {
  try {
    const storage = await AsyncStorage.getItem(RONDA_COLLECTION);
    const rondas: PropsRonda[] = storage ? JSON.parse(storage) : [];

    return rondas;
  } catch (error) {
    throw error;
  }
}

async function createRonda(ronda: PropsRonda[]) {
  try {
    const storage = JSON.stringify(ronda);
    await AsyncStorage.setItem(RONDA_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

async function updateRonda(ronda: PropsRonda) {
  try {
    const storageRondas = await getAllRondas();

    const index = storageRondas.findIndex(r => r.id === ronda.id);

    if (index !== -1) {
      storageRondas[index] = ronda;
    }

    const storage = JSON.stringify(storageRondas);
    await AsyncStorage.setItem(RONDA_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

async function deleteRonda(id: number) {
  try {
    const storageRondas = await getAllRondas();

    const rondasUpdate = storageRondas.filter(item => item.id !== id);

    const storage = JSON.stringify(rondasUpdate);
    await AsyncStorage.setItem(RONDA_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}


export { getAllRondas, createRonda, updateRonda, deleteRonda };