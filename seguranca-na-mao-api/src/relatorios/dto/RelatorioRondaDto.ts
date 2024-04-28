import { IsDateString, IsString } from "class-validator";


export class RelatorioRondaDto{
  @IsDateString()
  dataInicial: Date;

  @IsDateString()
  dataFinal: Date;
  
  @IsString()
  empresa_id: string;
}