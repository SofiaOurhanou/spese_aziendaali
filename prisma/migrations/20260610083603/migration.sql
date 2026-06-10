-- CreateEnum
CREATE TYPE "ruolo" AS ENUM ('DIPENDENTE', 'RESPONSABILE');

-- CreateEnum
CREATE TYPE "statorichiesta" AS ENUM ('IN_ATTESA', 'APPROVATA', 'RIFIUTATA', 'LIQUIDATA');

-- CreateTable
CREATE TABLE "utente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ruolo" "ruolo" NOT NULL,

    CONSTRAINT "utente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoriaspesa" (
    "id" SERIAL NOT NULL,
    "descrizione" TEXT NOT NULL,

    CONSTRAINT "categoriaspesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "richiestarimborso" (
    "id" SERIAL NOT NULL,
    "datainserimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataspesa" TIMESTAMP(3) NOT NULL,
    "importo" DOUBLE PRECISION NOT NULL,
    "descrizione" TEXT NOT NULL,
    "riferimentoGiustificativo" TEXT,
    "stato" "statorichiesta" NOT NULL DEFAULT 'IN_ATTESA',
    "datavalutazione" TIMESTAMP(3),
    "dataliquidazione" TIMESTAMP(3),
    "motivazionerifiuto" TEXT,
    "dipendenteid" INTEGER NOT NULL,
    "responsabileid" INTEGER,
    "categoriaid" INTEGER NOT NULL,

    CONSTRAINT "richiestarimborso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utente_email_key" ON "utente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categoriaspesa_descrizione_key" ON "categoriaspesa"("descrizione");

-- AddForeignKey
ALTER TABLE "richiestarimborso" ADD CONSTRAINT "richiestarimborso_dipendenteid_fkey" FOREIGN KEY ("dipendenteid") REFERENCES "utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "richiestarimborso" ADD CONSTRAINT "richiestarimborso_responsabileid_fkey" FOREIGN KEY ("responsabileid") REFERENCES "utente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "richiestarimborso" ADD CONSTRAINT "richiestarimborso_categoriaid_fkey" FOREIGN KEY ("categoriaid") REFERENCES "categoriaspesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
