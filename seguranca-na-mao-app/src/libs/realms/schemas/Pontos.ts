import Realm from "realm"

type PropsPontos = {
  _id: number,
  nome: string,
  latitude: number,
  longitude: number,
  posto_id: number,
  caminho_foto_qrcode: string,
  created_at: Date
}

export class Pontos extends Realm.Object<PropsPontos>{
  _id!: number;
  nome!: string;
  latitude!: number;
  longitude!: number;
  posto_id!: number;
  caminho_foto_qrcode!: string;
  created_at!: Date;

  static generate({ _id, caminho_foto_qrcode, created_at, latitude, longitude, nome, posto_id }: PropsPontos) {
    return {
      _id,
      caminho_foto_qrcode,
      created_at,
      latitude,
      longitude,
      nome,
      posto_id
    }
  }

  static schema = {
    name: 'Pontos',
    primaryKey: '_id',

    properties: {
      _id: 'int',
      nome: 'string',
      latitude: 'float',
      longitude: 'float',
      posto_id: 'int',
      caminho_foto_qrcode: 'string',
      created_at: 'date'
    }
  }
}