-- AlterTable
ALTER TABLE "panico" ADD COLUMN     "empresa_id" INTEGER;

-- AddForeignKey
ALTER TABLE "panico" ADD CONSTRAINT "panico_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
