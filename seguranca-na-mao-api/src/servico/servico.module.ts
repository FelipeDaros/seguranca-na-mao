import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { ChecklistService } from 'src/checklist/checklist.service';
import { EquipamentosPostoService } from 'src/equipamentos-posto/equipamentos-posto.service';

@Module({
  controllers: [ServicoController],
  providers: [ServicoService, ChecklistService, EquipamentosPostoService],
})
export class ServicoModule {}
