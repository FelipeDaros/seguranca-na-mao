import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { Servico } from '@prisma/client';
import { FinishServicoDto } from './dto/finish-servico.dto';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Post()
  public async create(
    @Body() createServicoDto: CreateServicoDto,
  ): Promise<Servico> {
    return this.servicoService.create(createServicoDto);
  }

  @Post('/finish')
  public async finish(
    @Body() finishServicoDto: FinishServicoDto,
  ): Promise<void> {
    return await this.servicoService.finish(finishServicoDto);
  }
  
  @Get()
  public async findAll(): Promise<Array<Servico>> {
    return await this.servicoService.findAll();
  }

  @Get(':usuario_id')
  public async findOne(@Param('usuario_id') usuario_id: string) {
    return await this.servicoService.findOne(usuario_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicoService.update(+id, updateServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicoService.remove(+id);
  }

  @Get('/ultimo-servico/:posto_id')
  public findLatestServicePost(@Param('posto_id') posto_id: string) {
    return this.servicoService.findLatestServicePost(+posto_id);
  }

  @Get('/buscar-informacoes-finishday/:user_id')
  public buscarInformacoesFinishDay(@Param('user_id') user_id: string) {
    return this.servicoService.buscarInformacoesFinishDay(user_id);
  }
}
