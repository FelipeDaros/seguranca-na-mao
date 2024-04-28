/*
  Warnings:

  - Added the required column `valor` to the `configuracoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "configuracoes" ADD COLUMN     "valor" INTEGER NOT NULL;
