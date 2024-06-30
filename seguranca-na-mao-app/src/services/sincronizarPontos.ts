import { api } from "../config/api";
import { IPonto } from "../interfaces/IPonto";
import { IUsuario } from "../interfaces/IUsuario";
import { getAllPontos, createPonto } from "../store/PontoStorage";

export async function sincronizarPontos(user: IUsuario) {
  try {
    const { data } = await api.get<IPonto[]>(`/ponto/sincronizar/${user?.user.posto_id}`);
    for (const ponto of data) {
      const pontoExists = (await getAllPontos()).some(item => item.id === ponto.id);

      if (!pontoExists) {
        await createPonto({
          id: ponto.id,
          latitude: ponto.latitude,
          longitude: ponto.longitude,
          nome: ponto.nome,
          posto_id: ponto.posto_id,
          created_at: new Date(),
          caminho_foto_qrcode: ponto.caminho_foto_qrcode,
        })
      }
    }
  } catch (error) {
    throw error;
  }
}