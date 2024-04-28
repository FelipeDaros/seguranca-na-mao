import { Injectable } from '@nestjs/common';
import { CreatePanicoDto } from './dto/create-panico.dto';
import { Panico } from '@prisma/client';
import * as moment from 'moment';
import prisma from 'src/prisma.service';


@Injectable()
export class PanicoService {
  constructor() { }

  public async create({
    usuario_id,
    verificado,
  }: CreatePanicoDto): Promise<CreatePanicoDto> {
    const panico = await prisma.panico.create({
      data: {
        usuario_id,
        verificado,
        created_at: moment().add(-3, 'hours').toDate()
      },
    });

    return panico;
  }

  public async update(id: number): Promise<void> {
    await prisma.panico.update({
      where: {
        id,
      },
      data: {
        verificado: true,
      },
    });
    return;
  }

  public async findAll(): Promise<Panico[]> {
    return await prisma.panico.findMany();
  }

  public async findAllEmpresa(id: number): Promise<Panico[]>{
    return await prisma.panico.findMany({
      where: {
        empresa_id: id
      }
    })
  }
}
