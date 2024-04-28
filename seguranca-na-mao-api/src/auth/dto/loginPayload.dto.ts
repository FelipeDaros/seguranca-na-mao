import { Usuario } from '@prisma/client';

export class LoginPayload {
  id: string;

  constructor(user: Usuario) {
    this.id = user.id;
  }
}
