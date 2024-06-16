import AsyncStorage from "@react-native-async-storage/async-storage";

const ALERTA_COLLECTION = '@SEGMAO:ALERTA';

export type PropsAlerta = {
  id: number;
  user_id: string;
  created_at: string;
  isSincronized: boolean;
}

async function getAllAlertas() {
  try {
    const storage = await AsyncStorage.getItem(ALERTA_COLLECTION);
    const aletas: PropsAlerta[] = storage ? JSON.parse(storage) : [];

    return aletas;
  } catch (error) {
    throw error;
  }
}

async function saveAlerta(alerta: PropsAlerta) {
  try {
    const storageAletas = await getAllAlertas();

    const storage = JSON.stringify([...storageAletas, alerta]);

    await AsyncStorage.setItem(ALERTA_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

async function updateAlerta(id: number) {
  try {
    const storageAlertas = await getAllAlertas();

    const index = storageAlertas.findIndex(item => item.id === id);

    if (index === -1) {
      return;
    }

    const alertaUpdate = {
      ...storageAlertas[index],
      isSincronized: true
    };

    storageAlertas[index] = alertaUpdate;

    const storage = JSON.stringify(storageAlertas);

    await AsyncStorage.setItem(ALERTA_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}

export { getAllAlertas, saveAlerta, updateAlerta };