/*
  Warnings:

  - You are about to drop the column `ultimoLogin` on the `usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "ultimoLogin",
ADD COLUMN     "ultimo_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
