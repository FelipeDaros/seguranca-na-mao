import { api } from "../config/api";
import { IPonto } from "../interfaces/IPonto";
import { IUsuario } from "../interfaces/IUsuario";
import { getAllPontos, createPonto } from "../store/PontoStorage";

type SincronizacaoResponse = {
  pontos: IPonto[];
  total: number;
  hasMore: boolean;
}

export async function sincronizarPontos(
  user: IUsuario, 
  onProgress?: (current: number, total: number, remaining: number) => void
) {
  try {
    let page = 1;
    const limit = 50;
    let hasMore = true;
    let totalSincronizados = 0;
    let totalProcessados = 0;

    while (hasMore) {
      const { data } = await api.get<SincronizacaoResponse>(
        `/ponto/sincronizar/${user.posto_id}?page=${page}&limit=${limit}`
      );

      const pontosLocais = await getAllPontos();

      for (const ponto of data.pontos) {
        const pontoExists = pontosLocais.some(item => item.id === ponto.id);
        
        if (!pontoExists) {
          await createPonto({
            id: ponto.id,
            latitude: ponto.latitude,
            longitude: ponto.longitude,
            nome: ponto.nome,
            posto_id: ponto.posto_id,
            created_at: new Date(),
            caminho_foto_qrcode: ponto.caminho_foto_qrcode,
          });
          totalSincronizados++;
        }
      }

      totalProcessados = Math.min(page * limit, data.total);
      const remaining = data.total - totalProcessados;

      // Callback de progresso
      if (onProgress) {
        onProgress(totalProcessados, data.total, remaining);
      }

      hasMore = data.hasMore;
      page++;

      // Pequeno delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Sincronização concluída: ${totalSincronizados} novos pontos`);
    return totalSincronizados;
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}