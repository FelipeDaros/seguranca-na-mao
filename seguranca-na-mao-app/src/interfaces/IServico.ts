export interface IServico{
  id: number;
  usuario_id: string;
  empresa_id: number;
  posto_id: number;
  relatorio_lido: boolean;
  created_at: Date;
}