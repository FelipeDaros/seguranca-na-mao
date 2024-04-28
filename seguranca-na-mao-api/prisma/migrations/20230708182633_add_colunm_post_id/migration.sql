/*
  Warnings:

  - Added the required column `ponto_id` to the `gerar_rondas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gerar_rondas" ADD COLUMN     "ponto_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "gerar_rondas" ADD CONSTRAINT "gerar_rondas_ponto_id_fkey" FOREIGN KEY ("ponto_id") REFERENCES "ponto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
