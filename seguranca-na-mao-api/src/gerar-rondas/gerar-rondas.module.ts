import { Module } from '@nestjs/common';
import { GerarRondasService } from './gerar-rondas.service';
import { GerarRondasController } from './gerar-rondas.controller';

@Module({
  controllers: [GerarRondasController],
  providers: [GerarRondasService],
  exports: [GerarRondasService]
})
export class GerarRondasModule {}
