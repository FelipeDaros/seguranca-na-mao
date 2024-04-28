import { IEquipamento } from "./IEquipamento";
import { IPosto } from "./IPosto";
import { IUsuario } from "./IUsuario";


export interface IPreviousService {
    id: number;
    Posto: IPosto;
    User: IUsuario;
    created_at: Date;
    empresa_id: number;
    posto_id: number;
    relatorioLido: boolean;
    usuario_id: string;
    equipamentos: IEquipamento[];
}