import { Body, Controller, Get, Query } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatorioAlertaDto } from './dto/RelatorioAlerta.dto';
import { RelatorioRondaDto } from './dto/RelatorioRondaDto';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) { }

  @Get('alertas')
  public async buscarAlertas(@Query() relatorioAlertaDto: RelatorioAlertaDto) {
    // return await this.relatoriosService.buscarAlertas(relatorioAlertaDto);
  }

  @Get('ronda')
  public async buscarRelatorios(@Query() relatorioRondaDto: RelatorioRondaDto) {
    return await this.relatoriosService.buscarRondas(relatorioRondaDto);
  }
}
