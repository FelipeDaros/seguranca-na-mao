import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { GerarRondasService } from 'src/gerar-rondas/gerar-rondas.service';

@Module({
  controllers: [AlertaController],
  providers: [AlertaService, GerarRondasService]
})
export class AlertaModule {}
