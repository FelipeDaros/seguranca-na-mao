-- CreateTable
CREATE TABLE "configuracoes" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "configuracoes" ADD CONSTRAINT "configuracoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
