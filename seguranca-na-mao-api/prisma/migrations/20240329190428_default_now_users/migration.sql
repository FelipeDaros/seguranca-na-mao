/*
  Warnings:

  - You are about to drop the column `ultimo_login` on the `usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "ultimo_login",
ADD COLUMN     "ultimoLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
