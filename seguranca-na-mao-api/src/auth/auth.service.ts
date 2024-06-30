import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dto/loginPayload.dto';
import { PayloadUser } from './dto/payload-user-dto';
import { horarioAtualConfigurado } from 'src/utils/datetime';
import prisma from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}
  public async login({ senha, nome }: LoginDto) {
    const user = await prisma.usuario.findFirst({
      where: {
        nome,
        senha
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário ou senha incorretos");
    }

    if(!user.ativo){
      throw new NotFoundException("Usuário desativado!");
    }

    user.ultimo_login = horarioAtualConfigurado();

    await prisma.usuario.update({
      where: {
        id: user.id
      },
      data: user
    });

    const configs = await prisma.configuracoes.findMany({
      where: {
        usuario_id: user.id
      }
    });

    const ultimoServico = await prisma.servico.findFirst({
      where: {
        usuario_id: user.id
      },
      orderBy: {
        id: "desc"
      }
    })

    return {
      token: await this.jwtService.signAsync({
        ...new LoginPayload(user),
      }),
      user: new PayloadUser(user),
      configuracao: configs,
      ultimoServico
      // acessToken: await this.jwtService.signAsync(),
    };
  }
}
