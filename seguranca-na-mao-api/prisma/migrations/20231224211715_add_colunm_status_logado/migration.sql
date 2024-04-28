/*
  Warnings:

  - You are about to drop the column `isFinishDay` on the `usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "isFinishDay",
ADD COLUMN     "status_logado" TEXT;
