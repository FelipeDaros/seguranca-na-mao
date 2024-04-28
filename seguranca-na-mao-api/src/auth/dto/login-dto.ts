import { IsString } from "class-validator";

export class LoginDto {
  @IsString()
  nome: string;

  @IsString()
  senha: string;
}
