-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DIPENDENTE', 'RESPONSABILE');

-- CreateEnum
CREATE TYPE "StatoRimborso" AS ENUM ('IN_ATTESA', 'APPROVATA', 'RIFIUTATA', 'LIQUIDATA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ruolo" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaSpesa" (
    "id" SERIAL NOT NULL,
    "descrizione" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriaSpesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RichiestaRimborso" (
    "id" SERIAL NOT NULL,
    "dataInserimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSpesa" TIMESTAMP(3) NOT NULL,
    "importo" DECIMAL(10,2) NOT NULL,
    "descrizione" TEXT NOT NULL,
    "riferimentoGiustificativo" TEXT,
    "stato" "StatoRimborso" NOT NULL DEFAULT 'IN_ATTESA',
    "dipendenteId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "responsabileValutazioneId" INTEGER,
    "dataValutazione" TIMESTAMP(3),
    "motivazioneRifiuto" TEXT,
    "dataLiquidazione" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RichiestaRimborso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaSpesa_descrizione_key" ON "CategoriaSpesa"("descrizione");

-- CreateIndex
CREATE INDEX "RichiestaRimborso_dipendenteId_idx" ON "RichiestaRimborso"("dipendenteId");

-- CreateIndex
CREATE INDEX "RichiestaRimborso_categoriaId_idx" ON "RichiestaRimborso"("categoriaId");

-- CreateIndex
CREATE INDEX "RichiestaRimborso_stato_idx" ON "RichiestaRimborso"("stato");

-- CreateIndex
CREATE INDEX "RichiestaRimborso_dataSpesa_idx" ON "RichiestaRimborso"("dataSpesa");

-- AddForeignKey
ALTER TABLE "RichiestaRimborso" ADD CONSTRAINT "RichiestaRimborso_dipendenteId_fkey" FOREIGN KEY ("dipendenteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RichiestaRimborso" ADD CONSTRAINT "RichiestaRimborso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaSpesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RichiestaRimborso" ADD CONSTRAINT "RichiestaRimborso_responsabileValutazioneId_fkey" FOREIGN KEY ("responsabileValutazioneId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
