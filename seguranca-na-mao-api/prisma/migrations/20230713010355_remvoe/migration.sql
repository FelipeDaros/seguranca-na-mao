/*
  Warnings:

  - You are about to drop the `equipamentos_servico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "equipamentos_servico" DROP CONSTRAINT "equipamentos_servico_equipamento_posto_id_fkey";

-- DropForeignKey
ALTER TABLE "equipamentos_servico" DROP CONSTRAINT "equipamentos_servico_posto_id_fkey";

-- DropForeignKey
ALTER TABLE "equipamentos_servico" DROP CONSTRAINT "equipamentos_servico_usuario_id_fkey";

-- DropTable
DROP TABLE "equipamentos_servico";
