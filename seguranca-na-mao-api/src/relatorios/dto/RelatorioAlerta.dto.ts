import { IsBoolean, IsDate, IsDateString, IsEmpty, IsNumber, IsString } from "class-validator";

export class RelatorioAlertaDto {
  @IsString()
  empresa_id: string;

  @IsDateString()
  dataInicial: Date;

  @IsDateString()
  dataFinal: Date;
}