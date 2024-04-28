import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EquipamentosPostoService } from './equipamentos-posto.service';
import { CreateEquipamentosPostoDto } from './dto/create-equipamentos-posto.dto';
import { UpdateEquipamentosPostoDto } from './dto/update-equipamentos-posto.dto';

@Controller('equipamentos-posto')
export class EquipamentosPostoController {
  constructor(
    private readonly equipamentosPostoService: EquipamentosPostoService,
  ) {}

  @Post()
  create(@Body() createEquipamentosPostoDto: CreateEquipamentosPostoDto) {
    return this.equipamentosPostoService.create(createEquipamentosPostoDto);
  }

  @Get('/listar-equipamentos/:posto_id')
  findAll(@Param('posto_id') posto_id: string) {
    return this.equipamentosPostoService.findAll(+posto_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipamentosPostoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEquipamentosPostoDto: UpdateEquipamentosPostoDto,
  ) {
    return this.equipamentosPostoService.update(
      +id,
      updateEquipamentosPostoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipamentosPostoService.remove(+id);
  }
}
