-- CreateTable
CREATE TABLE "checklist" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "servico_id" INTEGER,
    "posto_id" INTEGER NOT NULL,

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "posto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
