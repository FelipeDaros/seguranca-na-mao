/*
  Warnings:

  - Added the required column `servico_id` to the `alerta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alerta" ADD COLUMN     "servico_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
