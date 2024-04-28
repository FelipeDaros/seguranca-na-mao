import Realm from "realm"
import { generateRandomNumber } from "../../../utils/utils";

type PropsGerarRondas = {
  _id: number,
  user_id: string,
  verificado: boolean,
  atrasado: boolean,
  posto_id: number | null,
  ponto_id: number,
  maximo_horario: Date | string
  cancelado: boolean;
  motivo: string;
  nome: string;
  isSincronized: boolean;
  servico_id: number;
}

type PropsUpdateRondas = {
  _id: number;
  verificado: boolean;
}

export class GerarRondas extends Realm.Object<PropsGerarRondas>{
  _id!: number;
  user_id!: string;
  verificado!: boolean;
  atrasado!: boolean;
  posto_id!: number;
  ponto_id!: number;
  maximo_horario!: Date;
  cancelado!: boolean;
  motivo!: string;
  nome!: string;
  isSincronized!: boolean;
  servico_id!: number;

  static generate({ atrasado, ponto_id, posto_id, user_id, nome, maximo_horario, servico_id }: PropsGerarRondas) {
    return {
      _id: generateRandomNumber(),
      atrasado, 
      maximo_horario, 
      ponto_id, 
      posto_id, 
      user_id,
      nome,
      cancelado: false,
      motivo: ' ',
      verificado: false,
      isSincronized: false,
      servico_id
    }
  }

  static update({_id, verificado}: PropsUpdateRondas){
    return{
      _id,
      verificado
    }
  }

  static schema = {
    name: 'GerarRondas',
    primaryKey: '_id',

    properties: {
      _id: 'int',
      user_id: 'string',
      verificado: 'bool',
      atrasado: 'bool',
      posto_id: 'int',
      ponto_id: 'int',
      maximo_horario: 'date',
      cancelado: 'bool',
      motivo: 'string',
      nome: 'string',
      isSincronized: 'bool',
      servico_id: 'int'
    }
  }
}