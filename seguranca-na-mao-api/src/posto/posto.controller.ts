import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreatePostoServicoDto } from './dto/create-posto-servico.dto';
import { UpdatePostoServicoDto } from './dto/update-posto-servico.dto';
import { PostoService } from './posto.service';

@Controller('posto-servico')
export class PostoController {
  constructor(private readonly postoServicoService: PostoService) {}

  @Post()
  create(@Body() createPostoServicoDto: CreatePostoServicoDto) {
    return this.postoServicoService.create(createPostoServicoDto);
  }

  @Get(':empresa_id')
  findAll(@Param('empresa_id') empresa_id: string) {
    return this.postoServicoService.findAll(+empresa_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postoServicoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostoServicoDto: UpdatePostoServicoDto,
  ) {
    return this.postoServicoService.update(+id, updatePostoServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postoServicoService.remove(+id);
  }
}
