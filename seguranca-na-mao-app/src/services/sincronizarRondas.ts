import { api } from "../config/api";
import { deleteRonda, getAllRondas } from "../store/RondaStorage";

export async function sincronizarRondas() {
  const rondasVerificadas = (await getAllRondas()).filter(item => item.isSincronized);

  if (rondasVerificadas.length >= 1) {
    rondasVerificadas.forEach(async (ronda) => {
      try {
        await api.post('/import-app/sincronizar-rondas', ronda);

        await deleteRonda(ronda.id);
      } catch (error) {
        throw error;
      }
    });
  }
}