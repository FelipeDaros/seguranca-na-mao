import { generateRandomNumber } from "../../../utils/utils";

type PropsAlerta = {
  _id?: number;
  user_id?: string;
  created_at?: Date;
  isSincronized?: boolean;
}

export class Alerta extends Realm.Object<PropsAlerta>{
  _id!: number;
  user_id!: string;
  created_at!: Date;
  isSincronized!: boolean;

  static generate({ user_id }: PropsAlerta) {
    const dataAtual = new Date();

    return {
      _id: generateRandomNumber(),
      user_id, 
      created_at: new Date(dataAtual.getTime() - 3 * 60 * 60 * 1000),
      isSincronized: false
    }
  }

  static schema = {
    name: 'Alerta',
    primaryKey: '_id',

    properties: {
      _id: 'int',
      user_id: 'string',
      created_at: 'date',
      isSincronized: 'bool'
    }
  }
}