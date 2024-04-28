import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipamentosPostoDto } from './dto/create-equipamentos-posto.dto';
import { UpdateEquipamentosPostoDto } from './dto/update-equipamentos-posto.dto';
import { Equipamentos } from '@prisma/client';
import prisma from 'src/prisma.service';

@Injectable()
export class EquipamentosPostoService {
  constructor() { }
  public async create({
    equipamento_id,
    posto_id,
  }: CreateEquipamentosPostoDto) {
    for await (const equipamento of equipamento_id) {
      const equipamentoPostoExistente =
        await prisma.equipamentosPosto.findFirst({
          where: {
            equipamento_id: equipamento,
            posto_id,
          },
        });

      if (equipamentoPostoExistente) {
        throw new BadRequestException('Equipamento já cadastrado ao posto');
      }

      await prisma.equipamentosPosto.create({
        data: {
          equipamento_id: equipamento,
          posto_id,
        },
      });
    }
  }

  public async findAll(posto_id: number): Promise<Equipamentos[]> {
    const equipamentosPosto =
      await prisma.equipamentosPosto.findMany({
        where: {
          posto_id,
        },
      });

    const ids = equipamentosPosto.map(item => item.equipamento_id);

    const equipamentos = await prisma.equipamentos.findMany({
      where: {
        id: {
          in: ids
          }
        }
      });

    return equipamentos;
  }

  public async findOne(id: number) {
    const equipamentoPosto =
      await prisma.equipamentosPosto.findMany({
        where: {
          id,
        },
        include: {
          Equipamentos: {
            select: {
              id: true,
              nome: true,
            }
          }
        }
      });

    if (!equipamentoPosto) {
      throw new BadRequestException('Equipamento do posto não localizado');
    }

    return equipamentoPosto;
  }

  public async update(
    id: number,
    updateEquipamentosPostoDto: UpdateEquipamentosPostoDto,
  ) {
    const equipamentoPosto =
      await prisma.equipamentosPosto.findMany({
        where: {
          id,
        },
      });

    if (!equipamentoPosto) {
      throw new BadRequestException('Equipamento do posto não localizado');
    }

    const equipamentoPostoAlterado =
      await prisma.equipamentosPosto.update({
        where: {
          id,
        },
        data: {
          equipamento_id: updateEquipamentosPostoDto.equipamento_id[0],
          posto_id: updateEquipamentosPostoDto.posto_id,
        },
      });

    return equipamentoPostoAlterado;
  }

  public async remove(id: number) {
    const equipamentoPosto =
      await prisma.equipamentosPosto.findMany({
        where: {
          id,
        },
      });

    if (!equipamentoPosto) {
      throw new BadRequestException('Equipamento do posto não localizado');
    }

    await prisma.equipamentosPosto.delete({
      where: {
        id,
      },
    });

    return;
  }
}
