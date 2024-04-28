import { Usuario } from '@prisma/client';

export class PayloadUser {
  id: string;
  nome: string;
  email: string;
  created_at: Date;
  ultimo_login: Date;
  isAdmin: boolean;
  empresa_id: number;
  horario_alerta: Date;
  tipo_usuario: string;
  isFinishDay: boolean;
  status_logado: string;
  posto_id: number;
  welcome_screen: boolean;
  constructor(user: Usuario) {
    this.id = user.id;
    this.nome = user.nome;
    this.email = user.email;
    this.created_at = user.created_at;
    this.ultimo_login = user.ultimo_login;
    this.isAdmin = user.isAdmin;
    this.empresa_id = user.empresa_id;
    this.horario_alerta = user.horario_alerta;
    this.tipo_usuario = user.tipo_usuario;
    this.status_logado = user.status_logado;
    this.posto_id = user.posto_id;
    this.welcome_screen = user.welcome_screen;
  }
}
