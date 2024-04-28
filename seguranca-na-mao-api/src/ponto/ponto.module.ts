import { Module } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoController } from './ponto.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [PontoController],
  providers: [PontoService, MailService],
  exports: [PontoService]
})
export class PontoModule {}
