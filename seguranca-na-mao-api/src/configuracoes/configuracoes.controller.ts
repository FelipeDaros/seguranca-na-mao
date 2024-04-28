import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ConfiguracoesService } from './configuracoes.service';
import { CreateConfiguracoeDto } from './dto/create-configuracoe.dto';
import { UpdateConfiguracoeDto } from './dto/update-configuracoe.dto';
import { Configuracoes, Usuario } from '@prisma/client';

@Controller('configuracoes')
export class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) { }

  @Post()
  create(@Body() createConfiguracoeDto: CreateConfiguracoeDto) {
    return this.configuracoesService.create(createConfiguracoeDto);
  }

  @Get('/vigilante/:vigilante_id')
  public async findOne(@Param('vigilante_id') vigilante_id: string): Promise<Usuario> {
    return await this.configuracoesService.findOne(vigilante_id);
  }

  @Get(':empresa_id')
  public async buscarConfiguracoesVigilantesEmpresa(@Param('empresa_id') empresa_id: string): Promise<Usuario[]> {
    return await this.configuracoesService.buscarConfiguracoesVigilantesEmpresa(+empresa_id);
  }

  @Get('/alerta/:usuario_id')
  public async buscarConfigAlerta(@Param('usuario_id') usuario_id: string): Promise<Configuracoes> {
    return await this.configuracoesService.buscarConfigAlerta(usuario_id);
  }

  @Get('/ronda/:usuario_id')
  public async buscarConfigRonda(@Param('usuario_id') usuario_id: string): Promise<Configuracoes> {
    return await this.configuracoesService.buscarConfigRonda(usuario_id);
  }

  @Put()
  public async update(@Body() updateConfiguracoeDto: UpdateConfiguracoeDto): Promise<Configuracoes>{
    return await this.configuracoesService.update(updateConfiguracoeDto);
  }
}
