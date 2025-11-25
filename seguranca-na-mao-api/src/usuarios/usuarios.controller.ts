import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  public async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get(':tipo_usuario/:id/:id_logado')
  public async findAll(@Param('tipo_usuario') tipo_usuario: string, @Param('id') id: string, @Param('id_logado') id_logado: string) {
    return this.usuariosService.findAll(tipo_usuario, +id, id_logado);
  }

  @Get('/find/:id')
  public async findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }

  @Put('adicionar-hora-alerta/:id')
  public async remadicionarHoraAlertAoUsuarioove(@Param('id') id: string): Promise<void> {
    return this.usuariosService.adicionarHoraAlertAoUsuario(id);
  }

  @Put('update-status-logado/:id/:status')
  public async updateStatusLogado(@Param('id') id: string, @Param('status') status: string): Promise<void> {
    return this.usuariosService.updateStatusLogado(id, status);
  }
}
