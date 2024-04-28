import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ImportAppService } from './import-app.service';
import { Ponto } from '@prisma/client';
import { SincronizarRondasAppDto } from './dto/sincronizar-rondas-app-dto';
import { SincronizarAlertasAppDto } from './dto/sincronizar-alertas-app-dto';

@Controller('import-app')
export class ImportAppController {
  constructor(private readonly importAppService: ImportAppService) { }

  @Get(':empresa_id')
  public async bucsarPontosParaImportacao(@Param('empresa_id') empresa_id: string): Promise<Ponto[]> {
    return await this.importAppService.bucsarPontosParaImportacao(+empresa_id);
  }

  @Post('/sincronizar-rondas')
  public sincronizarRondas(@Body() sincronizarRondasAppDto: SincronizarRondasAppDto){
    this.importAppService.sincronizarRondas(sincronizarRondasAppDto);
  }

  @Post('/sincronizar-alertas')
  public sincronizarAlertas(@Body() sincronizarAlertasAppDto: SincronizarAlertasAppDto) {
    this.importAppService.sincronizarAlertas(sincronizarAlertasAppDto);
  }

  @Get('/finish-day/:id')
  public async finishDay(@Param('id') id: string){
    return await this.importAppService.finishDay(id);
  }
}
