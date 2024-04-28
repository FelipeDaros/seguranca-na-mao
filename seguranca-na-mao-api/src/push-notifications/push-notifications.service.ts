import { BadRequestException, Injectable } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { Client } from 'onesignal-node';

@Injectable()
export class PushNotificationsService {
    private client: Client;
    constructor() {
        this.client = new Client(
            process.env.ONE_SIGNAL_APP_ID,
            process.env.ONE_SIGNAL_REST_API_KEY
        );
    }

    public async sendPushNotifications(): Promise<void> {
        // for await (const centroDecustoId of centroDecustoIds) {
        //     const filters = [
        //         {
        //             field: 'tag',
        //             key: centroDecustoId,
        //             relation: '=',
        //             value: centroDecustoId,
        //         },
        //     ];

        //     await this.client.createNotification({
        //         headings: { en: 'Há uma nova solicitação para aprovar!' },
        //         contents: {
        //             en: 'Foi efetuado uma nova solicitação para o centro de custo, por favor verificar',
        //         },
        //         filters: filters,
        //     });
        // }
    }

    public async sendPushNotificationsAll() {
        // try {
        //     await this.client.createNotification({
        //         headings: { en: title },
        //         contents: { en: message },
        //         included_segments: ['All'],
        //     });

        //     return { message, title };
        // } catch (error) {
        //     throw new BadRequestException(error)
        // }
    }

    public async sendNotificationsRondasEmAberto(usuarios: Usuario[]): Promise<void> {
        for await (const usuario of usuarios) {
            const filters = [
                {
                    field: 'tag',
                    key: usuario.id,
                    relation: '=',
                    value: usuario.id,
                },
            ];

            await this.client.createNotification({
                headings: { en: 'Existem rondas em aberto!' },
                contents: {
                    en: 'Finalize suas rondas para continuar com o seu alerta vigia!',
                },
                filters: filters,
            });
        }

        return;
    }

    public async sendNotificationsRondasCreated(usuario: Usuario): Promise<void> {
        const filters = [
            {
                field: 'tag',
                key: usuario.id,
                relation: '=',
                value: usuario.id,
            },
        ];

        await this.client.createNotification({
            headings: { en: 'Suas rondas foram criadas!!!' },
            contents: {
                en: 'Você já pode efetuar suas rondas!! Elas acabaram de ser geradas!!',
            },
            filters: filters,
        });

        return;
    }
}
