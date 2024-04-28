import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PanicoService } from './panico.service';
import { CreatePanicoDto } from './dto/create-panico.dto';
import { Panico } from '@prisma/client';

@Controller('panico')
export class PanicoController {
  constructor(private readonly panicoService: PanicoService) {}

  @Post()
  public async create(@Body() createPanicoDto: CreatePanicoDto) {
    return await this.panicoService.create(createPanicoDto);
  }
  @Get()
  public async findAll(): Promise<Panico[]> {
    return await this.panicoService.findAll();
  }

  @Get('empresa/:id')
  public async findAllEmpresa(@Param('id') id: string): Promise<Panico[]> {
    return await this.panicoService.findAllEmpresa(+id);
  }

  @Put(':id')
  public async update(@Param('id') id: string) {
    return await this.panicoService.update(+id);
  }
}
