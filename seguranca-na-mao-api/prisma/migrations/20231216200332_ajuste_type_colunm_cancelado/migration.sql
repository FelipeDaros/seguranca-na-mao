/*
  Warnings:

  - The `cancelado` column on the `gerar_rondas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "gerar_rondas" DROP COLUMN "cancelado",
ADD COLUMN     "cancelado" BOOLEAN;
