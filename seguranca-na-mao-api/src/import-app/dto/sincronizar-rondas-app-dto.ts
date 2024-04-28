

export class SincronizarRondasAppDto{
  user_id: string;
  verificado: boolean;
  atrasado: boolean;
  posto_id: number;
  ponto_id: number;
  maximo_horario: Date;
  cancelado: boolean;
  motivo: string;
  servico_id: number;
}