/*
  Warnings:

  - You are about to drop the `equipamentos_servico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "equipamentos_posto" DROP CONSTRAINT "equipamentos_posto_equipamento_id_fkey";

-- AlterTable
ALTER TABLE "checklist" ADD COLUMN     "equipamentos_post_id" INTEGER;

-- DropTable
DROP TABLE "equipamentos_servico";

-- CreateTable
CREATE TABLE "equipamentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "equipamentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "equipamentos_posto" ADD CONSTRAINT "equipamentos_posto_equipamento_id_fkey" FOREIGN KEY ("equipamento_id") REFERENCES "equipamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_equipamentos_post_id_fkey" FOREIGN KEY ("equipamentos_post_id") REFERENCES "equipamentos_posto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
