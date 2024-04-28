export interface IPonto {
  id: number;
  _id: number;
  nome: string;
  latitude: number;
  longitude: number;
  posto_id: number;
  caminho_foto_qrcode: string;
  created_at: Date;
  updated_at: Date;
}