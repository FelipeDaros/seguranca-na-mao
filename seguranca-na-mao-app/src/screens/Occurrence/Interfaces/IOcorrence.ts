export interface IOcorrenciaProps {
  id: number;
  titulo: string;
  descricao: string;
  usuario_id: string;
  possuiFoto: boolean;
  dataOcorrencia: Date;
  created_at: Date;
  status: string;
  FotosOcorrencia: FotosOcorrenciaProps[];
  User: UserProps;
}

interface FotosOcorrenciaProps {
  id: number;
  nomeArquivo: string;
  registro_ocorrencia_id: number;
  url: string;
  created_at: Date;
}

interface UserProps {
  id: string;
  nome: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  estaLogado: boolean;
}
