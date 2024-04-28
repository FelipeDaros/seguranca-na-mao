/*
  Warnings:

  - You are about to drop the `checklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "checklist_equipamentos_post_id_fkey";

-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "checklist_posto_id_fkey";

-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "checklist_servico_id_fkey";

-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "checklist_usuario_id_fkey";

-- AlterTable
ALTER TABLE "servico" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "checklist";

-- CreateTable
CREATE TABLE "equipamentos_servico" (
    "id" SERIAL NOT NULL,
    "equipamento_id" INTEGER NOT NULL,
    "servico_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipamentos_servico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "equipamentos_servico" ADD CONSTRAINT "equipamentos_servico_equipamento_id_fkey" FOREIGN KEY ("equipamento_id") REFERENCES "equipamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos_servico" ADD CONSTRAINT "equipamentos_servico_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
