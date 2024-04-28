-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "posto_id" INTEGER;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "posto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
