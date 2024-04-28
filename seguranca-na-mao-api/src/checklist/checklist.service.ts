import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistDto } from './dto/create-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor() { }
  public async create({
    equipamentos_post_id,
    servico_id,
    usuario_id,
    posto_id,
  }: CreateChecklistDto) {
    try {

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
