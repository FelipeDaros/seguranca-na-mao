/*
  Warnings:

  - You are about to drop the column `servicoId` on the `equipamentos_posto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "equipamentos_posto" DROP CONSTRAINT "equipamentos_posto_servicoId_fkey";

-- AlterTable
ALTER TABLE "equipamentos_posto" DROP COLUMN "servicoId";

-- AddForeignKey
ALTER TABLE "servico" ADD CONSTRAINT "servico_equipamento_posto_id_fkey" FOREIGN KEY ("equipamento_posto_id") REFERENCES "equipamentos_posto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
