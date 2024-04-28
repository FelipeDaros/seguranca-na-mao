import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { Servico } from '@prisma/client';
import { horarioAtualConfigurado } from 'src/utils/datetime';
import { FinishServicoDto } from './dto/finish-servico.dto';
import prisma from 'src/prisma.service';

@Injectable()
export class ServicoService {
  constructor() { }
  public async create({
    empresa_id,
    posto_id,
    relatorio_lido,
    usuario_id,
    equipamentos_id,
  }: CreateServicoDto): Promise<Servico> {
    const servico = await prisma.servico.create({
      data: {
        empresa_id,
        posto_id,
        usuario_id,
        relatorioLido: relatorio_lido,
      },
    });

    equipamentos_id.forEach(async (id) => {
      await prisma.equipamentosServico.create({
        data: {
          servico_id: servico.id,
          equipamento_id: id,
          created_at: horarioAtualConfigurado()
        }
      });
    });

    return servico;
  }

  public async finish({ data, user_id }: FinishServicoDto): Promise<void> {
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id: user_id
        }
      })

      user.status_logado = null;

      await prisma.usuario.update({
        where: {
          id: user.id
        },
        data: user
      });

      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async findAll(): Promise<Array<Servico>> {
    const servicos = await prisma.servico.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return servicos;
  }

  public async findOne(usuario_id: string) {
    const servico = await prisma.servico.findFirst({
      where: {
        usuario_id
      },
      orderBy: {
        id: `desc`
      }
    });

    return servico;
  }

  public async update(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} servico`;
  }

  public async findLatestServicePost(posto_id: number): Promise<any> {
    const servico = await prisma.servico.findFirst({
      where: {
        posto_id
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        Posto: {
          select: {
            nome: true,
            id: true
          }
        },
        User: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!servico) {
      return;
    }

    const equipamentosServico = await prisma.equipamentosServico.findMany({
      where: {
        servico_id: servico.id
      }
    });

    const ids = equipamentosServico.map(item => item.equipamento_id);

    const equipamentos = await prisma.equipamentos.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    const servicoData = {
      ...servico,
      equipamentos
    }

    return servicoData;
  }

  public async buscarInformacoesFinishDay(user_id: string) {
    const servico = await prisma.servico.findFirst({
      where: {
        usuario_id: user_id
      },
      orderBy: {
        id: 'desc'
      }
    });

    const equipamentosServico = await prisma.equipamentosServico.findMany({
      where: {
        servico_id: servico.id
      }
    });

    const ids = equipamentosServico.map(item => item.equipamento_id);

    const equipamentos = await prisma.equipamentos.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    const alertas = await prisma.alerta.findMany({
      where: {
        servico_id: servico.id
      }
    });

    const rondas = await prisma.gerarRondas.findMany({
      where: {
        servico_id: servico.id
      },
      include: {
        Ponto: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    const finishDayInfo = {
      ...servico,
      equipamentos,
      alertas,
      rondas
    }

    return finishDayInfo;
  }
}
