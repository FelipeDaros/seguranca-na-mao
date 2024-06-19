import { IsNumber, IsString } from "class-validator";

export class CreatePanicoDto {
  @IsString({
    message: "id do usuário obrigatório"
  })
  usuario_id: string;
  verificado: boolean;

  @IsNumber({}, {
    message: "id da empresa é obrigatório"
  })
  empresa_id: number;
}
