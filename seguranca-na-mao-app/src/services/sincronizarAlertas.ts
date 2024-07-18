import { api } from "../config/api";
import { IUsuario } from "../interfaces/IUsuario";
import { getAllAlertas, updateAlerta } from "../store/AlertaStorage";

import { useNetInfo } from "@react-native-community/netinfo";


export async function sincronizarAlertas(user: IUsuario) {
  const { type } = useNetInfo();

  if(type !== 'wifi') return;
  
  const alertasParaSincronizar = (await getAllAlertas()).filter(item => !item.isSincronized);
  
  if (alertasParaSincronizar.length) {
    alertasParaSincronizar.forEach(async (item) => {
      await updateAlerta(item.id);
      const payload = {
        servico_id: user?.servico?.id,
        created_at: item.created_at,
        user_id: user?.user.id,
      }

      await api.post('/import-app/sincronizar-alertas', payload);
    });
  }
}