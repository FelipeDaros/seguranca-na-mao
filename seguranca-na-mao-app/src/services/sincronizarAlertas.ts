import { api } from "../config/api";
import { IAuthUser } from "../interfaces/IAuthUser";
import { getAllAlertas, updateAlerta } from "../store/AlertaStorage";

export async function sincronizarAlertas(
  user: IAuthUser
) {
  try {
    const alertasParaSincronizar = (await getAllAlertas()).filter(item => !item.isSincronized);

    if (alertasParaSincronizar.length === 0) {
      console.log('✅ Nenhum alerta para sincronizar');
      return 0;
    }

    let totalSincronizados = 0;
    console.log(`🔄 Sincronizando ${alertasParaSincronizar.length} alertas...`);

    await Promise.all(
      alertasParaSincronizar.map(async (item) => {
        try {
          const payload = {
            servico_id: user?.servico?.id,
            created_at: item.created_at,
            user_id: user?.user.id,
          };

          await api.post('/import-app/sincronizar-alertas', payload);
          await updateAlerta(item.id);
          totalSincronizados++;
        } catch (error) {
          console.error(`❌ Erro ao sincronizar alerta ${item.id}:`, error);
        }
      })
    );

    return totalSincronizados;

  } catch (error) {
    console.error('❌ Erro ao sincronizar alertas:', error);
    throw error;
  }
}