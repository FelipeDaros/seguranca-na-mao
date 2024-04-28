-- CreateTable
CREATE TABLE "GerarRondas" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "verificado" BOOLEAN DEFAULT false,
    "atrasado" BOOLEAN DEFAULT false,
    "posto_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maximo_horario" TIMESTAMP(3),

    CONSTRAINT "GerarRondas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GerarRondas" ADD CONSTRAINT "GerarRondas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerarRondas" ADD CONSTRAINT "GerarRondas_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "posto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
