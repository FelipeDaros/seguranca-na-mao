/*
  Warnings:

  - Added the required column `url` to the `fotos_ocorrencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fotos_ocorrencia" ADD COLUMN     "url" TEXT NOT NULL;
