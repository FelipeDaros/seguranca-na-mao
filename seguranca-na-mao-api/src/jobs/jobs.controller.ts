import { Controller, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  // @Get('buscar-rondas')
  // public async buscarRotasEmAberto() {
  //   await this.jobsService.buscarRotasEmAberto();
  // }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // @Get('gerar-rondas')
  // public async gerarRondas() {
  //   return await this.jobsService.gerarRondas();
  // }

}
