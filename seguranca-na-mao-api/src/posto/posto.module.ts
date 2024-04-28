import { Module } from '@nestjs/common';

import { PostoController } from './posto.controller';
import { PostoService } from './posto.service';

@Module({
  controllers: [PostoController],
  providers: [PostoService],
})
export class Posto {}
