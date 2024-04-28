import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GerarRondasService } from './gerar-rondas.service';
import { CreateGerarRondaDto } from './dto/create-gerar-ronda.dto';
import { UpdateGerarRondaDto } from './dto/update-gerar-ronda.dto';
import { AuthGuard } from '@nestjs/passport';
import { GerarRondas } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('gerar-rondas')
export class GerarRondasController {
  constructor(private readonly gerarRondasService: GerarRondasService) {}

  @Post(':usuario_id')
  public async create(@Param('usuario_id') usuario_id: string): Promise<void> {
    return await this.gerarRondasService.create(usuario_id);
  }

  @Get(':usuario_id')
  public async findAll(
    @Param('usuario_id') usuario_id: string,
  ): Promise<any[]> {
    return await this.gerarRondasService.buscarRondasAoResposavel(usuario_id);
  }

  @Post('/verificar-ronda-selecionada/:id')
  public async verificarRondaSelecionada(
    @Param('id') id: string,
  ): Promise<GerarRondas> {
    return await this.gerarRondasService.verificarRondaSelecionada(+id);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<GerarRondas> {
    return await this.gerarRondasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGerarRondaDto: UpdateGerarRondaDto,
  ) {
    return this.gerarRondasService.update(+id, updateGerarRondaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gerarRondasService.remove(+id);
  }
}
