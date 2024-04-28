import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipamentosPostoDto } from './create-equipamentos-posto.dto';

export class UpdateEquipamentosPostoDto extends PartialType(CreateEquipamentosPostoDto) {}
