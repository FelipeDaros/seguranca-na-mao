import { IServico } from "./IServico";
import { IUsuario } from "./IUsuario";

export interface IAuthUser {
  token?: string;
  ultimoAlerta?: Date;
  user: IUsuario;
  ultimaRonda?: Date;
  servico?: IServico;
  proximaRonda?: Date;
  isRondaActive?: boolean;
  isSincronized?: boolean;
}