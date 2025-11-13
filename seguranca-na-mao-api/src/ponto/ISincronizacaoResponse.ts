import { Ponto } from "@prisma/client";

export type SincronizacaoResponse = {
  pontos: Ponto[];
  total: number;
  hasMore: boolean;
}