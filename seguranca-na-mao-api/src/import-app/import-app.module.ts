import { Module } from '@nestjs/common';
import { ImportAppService } from './import-app.service';
import { ImportAppController } from './import-app.controller';

@Module({
  controllers: [ImportAppController],
  providers: [ImportAppService]
})
export class ImportAppModule {}
