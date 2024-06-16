import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import prisma from 'src/prisma.service';

@Injectable()
export class EmpresaService {
  constructor() { }
  public async create({ cidade, estado, nome, contato, documento, email, endereco, responsavel }: CreateEmpresaDto) {
    const empresa = await prisma.empresa.findFirst({
      where: {
        nome,
      },
    });

    if (empresa) {
      throw new BadRequestException('Empresa já existeste');
    }

    const empresaSalva = await prisma.empresa.create({
      data: {
        cidade,
        estado,
        nome,
        contato,
        documento,
        email,
        endereco,
        responsavel
      },
    });

    return empresaSalva;
  }

  public async findAll() {
    const empresas = await prisma.empresa.findMany();

    return empresas;
  }

  public async findOne(id: number) {
    const empresa = await prisma.empresa.findUnique({
      where: {
        id
      }
    });

    if (!empresa) {
      throw new BadRequestException('Empresa não foi localizada.');
    }

    return empresa;
  }

  public async update(id: number, updateEmpresaDto: UpdateEmpresaDto): Promise<UpdateEmpresaDto> {
    const empresa = await prisma.empresa.findFirst({
      where: {
        nome: updateEmpresaDto.nome
      },
    });

    if (empresa) {
      throw new BadRequestException('Empresa já existeste com esse nome');
    }

    return await prisma.empresa.update({
      where: {
        id
      },
      data: updateEmpresaDto
    });
  }

  public async remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}
