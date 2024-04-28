import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracoeDto } from './create-configuracoe.dto';

export class UpdateConfiguracoeDto extends PartialType(CreateConfiguracoeDto) {}
