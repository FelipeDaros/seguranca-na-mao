/*
  Warnings:

  - You are about to drop the column `cnpj` on the `empresa` table. All the data in the column will be lost.
  - You are about to alter the column `estado` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - You are about to alter the column `contato` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "empresa" DROP COLUMN "cnpj",
ADD COLUMN     "documento" VARCHAR(14),
ALTER COLUMN "estado" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "contato" SET DATA TYPE VARCHAR(11);
