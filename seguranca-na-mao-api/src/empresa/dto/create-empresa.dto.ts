import { IsString, MaxLength } from "class-validator";

export class CreateEmpresaDto {
  @IsString()
  nome: string;

  @IsString()
  cidade: string;

  @IsString()
  @MaxLength(2, {
    message: 'A quantidade de caracteres máxima é de 2'
  })
  estado: string;

  @IsString()
  @MaxLength(14, {
    message: 'A quantidade de caracteres máxima é de 14'
  })
  documento: string;

  @IsString()
  responsavel: string;

  @MaxLength(11, {
    message: 'A quantidade de caracteres máxima é de 11'
  })
  @IsString()
  contato: string;

  @IsString()
  endereco: string;

  @IsString()
  email: string;
}
