import { IsIn, IsNotEmpty, IsString,  } from "class-validator";

export class CreateConfiguracoeDto {

    @IsString()
    @IsIn(['ALERTA', 'RONDA'], {
        message: "Informe um tipo válido"
    })
    tipo: string;

    @IsString()
    usuario_id: string;

    @IsNotEmpty()
    valor: string;

    @IsString()
    parametro: string;
}
