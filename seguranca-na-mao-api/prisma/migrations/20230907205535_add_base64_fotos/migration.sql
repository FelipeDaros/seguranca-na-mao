-- AlterTable
ALTER TABLE "fotos_ocorrencia" ADD COLUMN     "base64" TEXT,
ALTER COLUMN "nome_arquivo" DROP NOT NULL;
