export class CreateOcorrenciaDto {
  descricao: string;
  titulo: string;
  usuario_id: string;
  data_ocorrencia: string;
  fotos: Fotos[];
}

export class Fotos {
  base64: string;
  uri: string;
  rotation: any;
  width: number;
  height: number;
  exif: any;
  duration: any;
  type: string;
  assetId: string;
}