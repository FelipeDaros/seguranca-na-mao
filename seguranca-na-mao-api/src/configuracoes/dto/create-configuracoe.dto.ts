import { IsIn, IsNotEmpty, IsString,  } from "class-validator";

export class CreateConfiguracoeDto {

    @IsString()
    @IsIn(['ALERTA', 'RONDA'])
    tipo: string;

    @IsString()
    usuario_id: string;

    @IsNotEmpty()
    valor: string;

    @IsString()
    parametro: string;
}
