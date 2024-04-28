/*
  Warnings:

  - You are about to drop the column `equipamento_posto_id` on the `servico` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "servico" DROP CONSTRAINT "servico_equipamento_posto_id_fkey";

-- AlterTable
ALTER TABLE "servico" DROP COLUMN "equipamento_posto_id";
