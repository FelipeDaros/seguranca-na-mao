import { PartialType } from '@nestjs/mapped-types';
import { CreatePostoServicoDto } from './create-posto-servico.dto';

export class UpdatePostoServicoDto extends PartialType(CreatePostoServicoDto) {}
