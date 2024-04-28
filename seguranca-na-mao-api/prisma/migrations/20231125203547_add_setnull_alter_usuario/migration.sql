-- DropForeignKey
ALTER TABLE "alerta" DROP CONSTRAINT "alerta_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "checklist_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "configuracoes" DROP CONSTRAINT "configuracoes_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "gerar_rondas" DROP CONSTRAINT "gerar_rondas_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "panico" DROP CONSTRAINT "panico_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "registro_ocorrencia" DROP CONSTRAINT "registro_ocorrencia_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "servico" DROP CONSTRAINT "servico_usuario_id_fkey";

-- AddForeignKey
ALTER TABLE "panico" ADD CONSTRAINT "panico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "registro_ocorrencia" ADD CONSTRAINT "registro_ocorrencia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "gerar_rondas" ADD CONSTRAINT "gerar_rondas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "servico" ADD CONSTRAINT "servico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "configuracoes" ADD CONSTRAINT "configuracoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;
