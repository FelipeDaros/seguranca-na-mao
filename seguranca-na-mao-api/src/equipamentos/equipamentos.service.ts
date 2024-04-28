import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';
import prisma from 'src/prisma.service';

@Injectable()
export class EquipamentosService {
  constructor() { }

  public async create(createEquipamentoDto: CreateEquipamentoDto) {
    for await (const equipamento of createEquipamentoDto.nome) {
      const equipamentoExistente =
        await prisma.equipamentos.findFirst({
          where: {
            nome: equipamento,
          },
        });

      if (equipamentoExistente) {
        throw new BadRequestException(
          'Equipamento já cadastrado na plataforma!',
        );
      }

      await prisma.equipamentos.create({
        data: {
          nome: equipamento,
        },
      });
    }
  }

  public async findAll() {
    const equipamentos = await prisma.equipamentos.findMany();

    return equipamentos;
  }

  public async findOne(id: number) {
    const equipamento = await prisma.equipamentos.findUnique({
      where: {
        id,
      },
    });

    if (!equipamento) {
      throw new BadRequestException('Equipamento não foi localizado na base');
    }

    return equipamento;
  }

  public async update(id: number, updateEquipamentoDto: UpdateEquipamentoDto) {
    const equipamento = await prisma.equipamentos.findUnique({
      where: {
        id,
      },
    });

    if (!equipamento) {
      throw new BadRequestException('Equipamento não foi localizado na base');
    }

    for await (const equipa of updateEquipamentoDto.nome) {
      await prisma.equipamentos.update({
        where: {
          id,
        },
        data: equipa,
      });
    }
  }

  public async remove(id: number) {
    const equipamento = await prisma.equipamentos.findUnique({
      where: {
        id,
      },
    });

    if (!equipamento) {
      throw new BadRequestException('Equipamento não foi localizado na base');
    }

    return await prisma.equipamentos.delete({
      where: equipamento,
    });
  }
}
