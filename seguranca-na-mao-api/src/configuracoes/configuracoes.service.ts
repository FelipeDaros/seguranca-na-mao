import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConfiguracoeDto } from './dto/create-configuracoe.dto';
import { UpdateConfiguracoeDto } from './dto/update-configuracoe.dto';
import { Configuracoes, Usuario } from '@prisma/client';
import prisma from 'src/prisma.service';

@Injectable()
export class ConfiguracoesService {
  constructor() { }
  public async create({ tipo, usuario_id, valor, parametro }: CreateConfiguracoeDto): Promise<Configuracoes> {
    try {
      const configExists = await prisma.configuracoes.findFirst({
        where: {
          usuario_id,
          tipo
        }
      });

      if (configExists) throw new BadRequestException("A configuração já existe para o vigilante.");

      return await prisma.configuracoes.create({
        data: {
          usuario_id,
          tipo,
          valor: Number(valor),
          parametro
        }
      });
    } catch (error) {
      throw new BadRequestException(error, error);
    }
  }

  public async buscarConfigAlerta(usuario_id: string): Promise<Configuracoes> {
    const configExists = await prisma.configuracoes.findFirst({
      where: {
        usuario_id,
        tipo: 'ALERTA'
      }
    });

    if (!configExists) throw new BadRequestException("Configuração não existente");

    return configExists;
  }

  public async buscarConfigRonda(usuario_id: string): Promise<Configuracoes> {
    const configExists = await prisma.configuracoes.findFirst({
      where: {
        usuario_id,
        tipo: 'RONDA'
      }
    });

    if (!configExists) throw new BadRequestException("Configuração não existente");

    return configExists;
  }

  public async update({ parametro, tipo, usuario_id, valor }: UpdateConfiguracoeDto): Promise<Configuracoes> {
    try {
      const configExists = await prisma.configuracoes.findFirst({
        where: {
          usuario_id,
          tipo
        }
      });
      console.log(parametro)
      if (!configExists) throw new BadRequestException("Configuração não existente");

      configExists.tipo = tipo;
      configExists.parametro = parametro;
      configExists.valor = Number(valor);

      const configUpdate = await prisma.configuracoes.update({
        where: {
          id: configExists.id
        },
        data: configExists
      });

      return configUpdate;
    } catch (error) {
      throw new BadRequestException(error, error);
    }
  }


  public async buscarConfiguracoesVigilantesEmpresa(empresa_id: number): Promise<Usuario[]>{
    const vigilantes = await prisma.usuario.findMany({
      where: {
        empresa_id,
        tipo_usuario: 'VIGILANTE',
        Configuracoes: {
          every: {
            tipo: {
              in: ['ALERTA', 'RONDA']
            }
          }
        }
      },
      include: {
        Configuracoes: true
      }
    });

    return vigilantes;
  }

  public async findOne(vigilante_id: string): Promise<Usuario>{
    const vigilante = await prisma.usuario.findFirst({
      where: {
        id: vigilante_id,
        tipo_usuario: 'VIGILANTE'
      },
      include: {
        Configuracoes: true
      }
    });

    if(!vigilante) throw new BadRequestException('Vigilante não encontrado!');

    return vigilante;
  }
}
