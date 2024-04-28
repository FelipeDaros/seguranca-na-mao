import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multerConfig';
import { AuthGuard } from '@nestjs/passport';
// @UseGuards(AuthGuard('jwt'))
@Controller('ocorrencia')
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Post()
  public async save(
    @Body() createOcorrenciaDto: CreateOcorrenciaDto,
  ) {
    return await this.ocorrenciaService.create(createOcorrenciaDto);
  }

  @Get()
  findAll() {
    return this.ocorrenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ocorrenciaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOcorrenciaDto: UpdateOcorrenciaDto,
  ): Promise<string> {
    return this.ocorrenciaService.updateStatus(+id, updateOcorrenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ocorrenciaService.remove(+id);
  }
}
