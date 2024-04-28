import { Module } from '@nestjs/common';
import { EquipamentosPostoService } from './equipamentos-posto.service';
import { EquipamentosPostoController } from './equipamentos-posto.controller';

@Module({
  controllers: [EquipamentosPostoController],
  providers: [EquipamentosPostoService],
  exports: [EquipamentosPostoService]
})
export class EquipamentosPostoModule {}
