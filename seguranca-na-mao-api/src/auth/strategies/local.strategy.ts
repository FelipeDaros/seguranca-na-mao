import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login-dto';
import { UnauthorizedException } from '@nestjs/common';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'name' });
  }

  async validate(payload: LoginDto) {
    const user = await this.authService.login(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
