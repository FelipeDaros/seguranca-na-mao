export interface IUsuario {
  id: string;
  nome: string;
  email: string;
  created_at: Date;
  ultimo_login: Date;
  isAdmin: boolean;
  empresa_id: number;
  horario_alerta: Date;
  tipo_usuario: string;
  posto_id?: number;
  status_logado: string;
  welcome_screen: boolean;
};