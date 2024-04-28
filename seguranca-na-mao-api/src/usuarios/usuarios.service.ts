import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { MailService } from 'src/mail/mail.service';
import { emailRegex } from 'src/utils/emailRegex';
import * as moment from 'moment';
import { Usuario } from '@prisma/client';
import { IUpdateUserHorarioAlerta } from './dto/update-horario-alerta';
import { IUpdateUserHorarioRonda } from './dto/update-horario-ronda.dto';
import prisma from 'src/prisma.service';
import { horarioAtualConfigurado } from 'src/utils/datetime';

@Injectable()
export class UsuariosService {
  constructor(private readonly mailService: MailService) { }

  public async create(user: CreateUsuarioDto) {
    const usuarioExiste = await prisma.usuario.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!emailRegex(user.email.trim())) {
      throw new BadRequestException('O endereço de email fornecido não é válido');
    }

    if (usuarioExiste) {
      throw new BadRequestException('Usuario já existe na base');
    }

    try {
      const usuario = prisma.usuario.create({
        data: {
          nome: user.nome.toLowerCase(),
          email: user.email.toLowerCase().trim(),
          senha: user.senha.toLowerCase(),
          posto_id: user.posto_id,
          empresa_id: user.empresa_id,
          estaLogado: false,
          tipo_usuario: user.tipo_usuario.toUpperCase()
        },
      });
      
      await this.mailService.enviarEmailUsuarioCriado(user);

      return usuario;
    } catch (error: any) {
      throw new BadRequestException('Erro ao cadastrar usuário', { cause: new Error(), description: error });
    }
  }

  public async findAll(tipo_usuario: string, empresa_id: number) {
    let usuarios = [];

    if(tipo_usuario === 'SUPERVISOR'){
      usuarios = await prisma.usuario.findMany({
        where: {
          empresa_id,
          tipo_usuario: 'VIGILANTE'
        }
      });
    }

    if(tipo_usuario === 'ADMINISTRADOR'){
      usuarios = await prisma.usuario.findMany({
        where: {
          empresa_id,
        }
      });
    }

    return usuarios;
  }

  public async findOne(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id,
      },
    });
    if (!usuario) {
      throw new NotFoundException('Não foi possível encontrar o usuário com esse id', { cause: new Error(), description: 'Não foi possível encontrar o usuário com esse id' });
    }
    return usuario;
  }

  public async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      let user = await this.findOne(id);

      user = {
        ...user,
        ...updateUsuarioDto
      }

      await prisma.usuario.update({
        where: {
          id
        },
        data: user
      });

      return user;
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Erro ao atualizar o usuário', { cause: new Error(), description: error });
    }
  }

  public async remove(id: string): Promise<void> {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new BadRequestException(
        'Não foi possível encontrar o usuário com esse id',
      );
    }

    await prisma.usuario.delete({
      where: {
        id,
      },
    });

    return;
  }

  public async adicionarHoraAlertAoUsuario(id: string): Promise<void> {
    const user = await prisma.usuario.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    user.horario_alerta = moment().add(-3, 'hours').toDate();

    await prisma.usuario.update({
      where: {
        id
      },
      data: user
    });
    return;
  }

  public async updateHorarioAlerta({ id, horario_alerta }: IUpdateUserHorarioAlerta): Promise<void> {
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id
        }
      });

      user.horario_alerta = horario_alerta;

      await prisma.usuario.update({
        data: user,
        where: {
          id
        }
      });

      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async updateHorarioRonda({ id, horario_ronda }: IUpdateUserHorarioRonda): Promise<void> {
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id
        }
      });

      user.ultima_ronda = horario_ronda;

      await prisma.usuario.update({
        data: user,
        where: {
          id
        }
      });

      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async updateStatusLogado(id: string, status: string): Promise<void> {
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id
        }
      });

      user.status_logado = status.toUpperCase();

      await prisma.usuario.update({
        data: user,
        where: {
          id
        }
      });

      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
