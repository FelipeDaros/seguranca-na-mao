import { PartialType } from '@nestjs/mapped-types';
import { CreateGerarRondaDto } from './create-gerar-ronda.dto';

export class UpdateGerarRondaDto extends PartialType(CreateGerarRondaDto) {}
