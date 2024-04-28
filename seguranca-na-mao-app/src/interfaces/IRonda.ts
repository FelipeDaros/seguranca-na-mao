import { IPonto } from "./IPonto";
import { IPosto } from "./IPosto";

export interface IRonda {
  id: number;
  user_id: string;
  verificado: boolean;
  atrasado: boolean;
  posto_id: number;
  created_at: Date;
  maximo_horario: Date;
  ponto_id: number;
  Posto: IPosto;
  Ponto: IPonto;
  motivo: string;
}
