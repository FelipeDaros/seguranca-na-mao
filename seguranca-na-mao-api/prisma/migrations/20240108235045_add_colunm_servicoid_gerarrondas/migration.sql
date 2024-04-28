-- AlterTable
ALTER TABLE "gerar_rondas" ADD COLUMN     "servico_id" INTEGER;

-- AddForeignKey
ALTER TABLE "gerar_rondas" ADD CONSTRAINT "gerar_rondas_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
