-- CreateTable
CREATE TABLE "equipamentos_servico" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "equipamento_posto_id" INTEGER,
    "posto_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipamentos_servico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "equipamentos_servico" ADD CONSTRAINT "equipamentos_servico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos_servico" ADD CONSTRAINT "equipamentos_servico_equipamento_posto_id_fkey" FOREIGN KEY ("equipamento_posto_id") REFERENCES "equipamentos_posto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos_servico" ADD CONSTRAINT "equipamentos_servico_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "posto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
