import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { Posto } from './posto/posto.module';
import { EquipamentosPostoModule } from './equipamentos-posto/equipamentos-posto.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ServicoModule } from './servico/servico.module';
import { PanicoModule } from './panico/panico.module';
import { PontoModule } from './ponto/ponto.module';
import { OcorrenciaModule } from './ocorrencia/ocorrencia.module';
import { AuthModule } from './auth/auth.module';
import { GerarRondasModule } from './gerar-rondas/gerar-rondas.module';
import { MailModule } from './mail/mail.module';
import { JobsModule } from './jobs/jobs.module';
import { AlertaModule } from './alerta/alerta.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { ImportAppModule } from './import-app/import-app.module';
import { FilesModule } from './files/files.module';
import { ConfiguracoesModule } from './configuracoes/configuracoes.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    UsuariosModule,
    EquipamentosModule,
    Posto,
    EquipamentosPostoModule,
    EmpresaModule,
    ChecklistModule,
    ServicoModule,
    PanicoModule,
    PontoModule,
    OcorrenciaModule,
    AuthModule,
    GerarRondasModule,
    MailModule,
    JobsModule,
    AlertaModule,
    ScheduleModule.forRoot(),
    PushNotificationsModule,
    ImportAppModule,
    FilesModule,
    ConfiguracoesModule,
    RelatoriosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
