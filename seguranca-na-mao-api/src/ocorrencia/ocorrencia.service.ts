import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOcorrenciaDto, Fotos } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { randomUUID } from 'crypto';
import prisma from 'src/prisma.service';

@Injectable()
export class OcorrenciaService {
  constructor() { }
  public async create({
    data_ocorrencia,
    descricao,
    usuario_id,
    titulo,
    fotos
  }: CreateOcorrenciaDto) {
    try {
      const createOcorrencia =
        await prisma.registroOcorrencia.create({
          data: {
            data_ocorrencia,
            descricao,
            usuario_id,
            titulo,
            status: 'ABERTO',
          },
        });

      fotos.forEach(async (foto: Fotos) => {
        await prisma.fotosOcorrencia.create({
          data: {
            nomeArquivo: randomUUID(),
            registro_ocorrencia_id: createOcorrencia.id,
            url: foto.base64,
            base64: foto.base64
          }
        })
      });   
      return createOcorrencia;
    } catch (error) {
      throw new BadRequestException('Não foi possível salvar a ocorrência');
    }
  }

  public async findAll() {
    try {
      const occorrencias = await prisma.registroOcorrencia.findMany(
        {
          include: { fotosOcorrencia: true, user: true },
        },
      );

      return occorrencias;
    } catch (error) {
      return error;
    }
  }

  public async findOne(id: number) {
    const ocorrencia = await prisma.registroOcorrencia.findUnique({
      where: {
        id,
      },
      include: {
        fotosOcorrencia: true,
        user: true,
      },
    });

    if (!ocorrencia) {
      throw new BadRequestException('Ocorrência não encontrada');
    }

    return ocorrencia;
  }

  public async updateStatus(
    id: number,
    updateOcorrenciaDto: UpdateOcorrenciaDto,
  ): Promise<string> {
    const ocorrencia = await prisma.registroOcorrencia.findUnique({
      where: {
        id,
      },
    });

    if (!ocorrencia) {
      throw new BadRequestException('Ocorrência não encontrada');
    }

    await prisma.registroOcorrencia.update({
      where: { id },
      data: updateOcorrenciaDto,
    });

    return `Ocorrência com o título ${ocorrencia.titulo} finalizada com sucesso!`;
  }

  public async remove(id: number): Promise<void> {
    const ocorrencia = await prisma.registroOcorrencia.findUnique({
      where: {
        id,
      },
    });

    if (!ocorrencia) {
      throw new BadRequestException('Ocorrência não encontrada');
    }

    await prisma.registroOcorrencia.delete({
      where: { id },
    });

    return;
  }
}
