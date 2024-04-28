import { Usuario } from '../../../node_modules/prisma/prisma-client/index';

export class CreateUsuarioDto {
  nome: string;
  senha: string;
  email: string;
  posto_id: number;
  empresa_id: number;
  email_responsavel: string;
  tipo_usuario: string;
}
