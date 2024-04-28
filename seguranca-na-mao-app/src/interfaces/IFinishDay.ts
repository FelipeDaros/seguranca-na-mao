import { IAlerta } from "./IAlerta";
import { IEquipamento } from "./IEquipamento";
import { IRonda } from "./IRonda";


export interface IFinishDay {
  id: number;
  posto_id: number;
  empresa_id: number;
  created_at: Date;
  relatorioLido: boolean;
  usuario_id: string;
  equipamentos: IEquipamento[];
  rondasCanceladas: IRonda[];
  finishDay: {
    id: string;
    nome: string;
    email: string;
    created_at: Date;
    ultimo_login: Date;
    isAdmin: boolean;
    empresa_id: number;
    horario_alerta: Date;
    tipo_usuario: string;
    posto_id?: number;
    status_logado: string;
    GerarRondas: IRonda[];
    Alerta: IAlerta[];
  }
}