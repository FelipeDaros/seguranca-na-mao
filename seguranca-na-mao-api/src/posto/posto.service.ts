import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostoServicoDto } from './dto/create-posto-servico.dto';
import { UpdatePostoServicoDto } from './dto/update-posto-servico.dto';
import * as moment from 'moment';
import prisma from 'src/prisma.service';

@Injectable()
export class PostoService {
  constructor() { }

  public async create({
    nome,
    empresa_id,
    equipaments,
  }: CreatePostoServicoDto) {
    const postoServico = await prisma.posto.findFirst({
      where: {
        nome,
        empresa_id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    const postoServicoCreated = await prisma.posto.create({
      data: {
        nome,
        empresa_id,
      },
    });

    for await (const equipament of equipaments) {
      await prisma.equipamentosPosto.create({
        data: {
          equipamento_id: equipament,
          posto_id: postoServicoCreated.id,
          created_at: moment().add(-3, 'hours').toDate()
        },
      });
    }

    return postoServicoCreated;
  }

  public async findAll(empresa_id: number) {
    const postosServicos = await prisma.posto.findMany({
      where: {
        empresa_id,
      },
    });

    return postosServicos;
  }

  public async findOne(id: number) {
    const postoServico = await prisma.posto.findFirst({
      where: {
        id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    return postoServico;
  }

  public async update(
    id: number,
    updatePontoServicoDto: UpdatePostoServicoDto,
  ) {
    const postoServico = await prisma.posto.findFirst({
      where: {
        id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    const postoServicoAlterado = await prisma.posto.update({
      where: {
        id,
      },
      data: updatePontoServicoDto,
    });

    return postoServicoAlterado;
  }

  public async remove(id: number) {
    const postoServico = await prisma.posto.findFirst({
      where: {
        id,
      },
    });

    if (postoServico) {
      throw new BadRequestException('Posto já existente');
    }

    await prisma.posto.delete({
      where: {
        id,
      },
    });

    return;
  }
}
