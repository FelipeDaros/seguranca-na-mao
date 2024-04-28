/*
  Warnings:

  - You are about to drop the `Alerta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GerarRondas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alerta" DROP CONSTRAINT "Alerta_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "GerarRondas" DROP CONSTRAINT "GerarRondas_posto_id_fkey";

-- DropForeignKey
ALTER TABLE "GerarRondas" DROP CONSTRAINT "GerarRondas_usuario_id_fkey";

-- DropTable
DROP TABLE "Alerta";

-- DropTable
DROP TABLE "GerarRondas";

-- CreateTable
CREATE TABLE "gerar_rondas" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "verificado" BOOLEAN DEFAULT false,
    "atrasado" BOOLEAN DEFAULT false,
    "posto_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maximo_horario" TIMESTAMP(3),

    CONSTRAINT "gerar_rondas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerta" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gerar_rondas" ADD CONSTRAINT "gerar_rondas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gerar_rondas" ADD CONSTRAINT "gerar_rondas_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "posto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
