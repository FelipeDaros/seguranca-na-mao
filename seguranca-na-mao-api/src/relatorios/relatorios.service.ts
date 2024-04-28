import { BadRequestException, Injectable } from '@nestjs/common';
import { Alerta, GerarRondas, Ponto } from '@prisma/client';
import { RelatorioAlertaDto } from './dto/RelatorioAlerta.dto';
import { RelatorioRondaDto } from './dto/RelatorioRondaDto';
import * as moment from 'moment';
import prisma from 'src/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor() { }
  public async buscarAlertas({ dataFinal, dataInicial, empresa_id }: RelatorioAlertaDto): Promise<Alerta[]> {
    return await prisma.alerta.findMany({
      where: {
        User: {
          empresa_id: +empresa_id
        },
        created_at: {
          gt: dataInicial,
          lt: dataFinal
        }
      },
      include: {
        User: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  public async buscarRondas({ dataFinal, dataInicial, empresa_id }: RelatorioRondaDto): Promise<GerarRondas[]> {

    if (!empresa_id) {
      throw new BadRequestException("Informe a empresa")
    }

    if (!dataFinal || !dataInicial) {
      throw new BadRequestException("Informe as datas");
    }

    const rondas = await prisma.gerarRondas.findMany({
      where: {
        Posto: {
          empresa_id: +empresa_id
        },
        created_at: {
          gt: moment(dataInicial).add(-3, 'hours').toDate(),
          lt: moment(dataFinal).add(-3, 'hours').toDate()
        }
      },
      include: {
        User: true,
        Ponto: true,
        Posto: {
          include: {
            Empresa: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return rondas;
  }
}
