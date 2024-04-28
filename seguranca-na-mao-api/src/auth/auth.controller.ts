import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Post()
  public async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
