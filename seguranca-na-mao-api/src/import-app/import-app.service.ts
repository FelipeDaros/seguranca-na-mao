import { BadRequestException, Injectable } from '@nestjs/common';
import { Ponto } from '@prisma/client';
import { SincronizarRondasAppDto } from './dto/sincronizar-rondas-app-dto';
import { SincronizarAlertasAppDto } from './dto/sincronizar-alertas-app-dto';
import prisma from 'src/prisma.service';
import * as moment from 'moment';

@Injectable()
export class ImportAppService {
    constructor() { }

    public async bucsarPontosParaImportacao(empresa_id: number): Promise<Ponto[]> {
        const pontos = await prisma.ponto.findMany({
            where: {
                Posto: {
                    empresa_id
                }
            }
        });

        if (!pontos.length) {
            throw new BadRequestException('Não existe pontos nessa empresa');
        }

        return pontos;
    }


    public async sincronizarRondas({ atrasado, maximo_horario, ponto_id, posto_id, user_id, verificado, cancelado, motivo, servico_id }: SincronizarRondasAppDto) {
        try {
            await prisma.gerarRondas.create({
                data: {
                    atrasado,
                    ponto_id,
                    posto_id,
                    usuario_id: user_id,
                    verificado,
                    maximo_horario,
                    cancelado,
                    motivo,
                    servico_id
                }
            });
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    public async sincronizarAlertas({ servico_id, created_at, user_id }: SincronizarAlertasAppDto): Promise<void> {
        try {
            await prisma.alerta.create({
                data: {
                    servico_id,
                    created_at,
                    usuario_id: user_id
                }
            });

            return
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    public async finishDay(id: string) {
        const agora = moment().toDate();

        const servico = await prisma.servico.findFirst({
            where: {
                usuario_id: id,
            },
            orderBy: {
                id: `desc`
            },
        });

        try {
            const finishDay = await prisma.usuario.findUnique({
                where: {
                    id
                },
                include: {
                    Alerta: {
                        where: {
                            servico_id: servico.id
                        }
                    },
                    GerarRondas: {
                        where: {
                            created_at: {
                                gte: moment().subtract(12, "h").toDate(),
                                lte: agora,
                            },
                            servico_id: servico.id
                        },
                        include: {
                            Ponto: {
                                select: {
                                    id: true,
                                    nome: true
                                }
                            }
                        }
                    },
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
            const rondasCanceladas = finishDay.GerarRondas.filter(item => item.cancelado);

            const servicoData = {
                ...servico,
                equipamentos,
                finishDay,
                rondasCanceladas
            }

            return servicoData
        } catch (error) {

        }
    }
}
