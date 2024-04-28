import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PontoService } from './ponto.service';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UpdatePontoDto } from './dto/update-ponto.dto';
import { Ponto } from '@prisma/client';

@Controller('ponto')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

  @Post()
  create(@Body() createPontoDto: CreatePontoDto) {
    return this.pontoService.create(createPontoDto);
  }

  @Get()
  findAll() {
    return this.pontoService.findAll();
  }

  @Get('/paginacao')
  public async findAllWithPagination() {
    return await this.pontoService.findAllWithPagination();
  }

  @Post('/imprimir/:id')
  async downloadPDF(@Param('id') id: string, @Res() res): Promise<void> {
    const buffer = await this.pontoService.generarPDF(+id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pontoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePontoDto: UpdatePontoDto) {
    return this.pontoService.update(+id, updatePontoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pontoService.remove(+id);
  }

  @Get('/sincronizar/:posto_id')
  public async sincronizarPontos(@Param('posto_id') posto_id: string): Promise<Ponto[]>{
    return this.pontoService.sincronizarPontos(+posto_id);
  }
}
