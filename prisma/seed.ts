import { PrismaClient, StatoRimborso } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.richiestaRimborso.deleteMany();
  await prisma.categoriaSpesa.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Password1!", 10);

  const responsabile = await prisma.user.create({
    data: {
      nome: "Marco",
      cognome: "Rossi",
      email: "responsabile@azienda.it",
      password,
      ruolo: "RESPONSABILE",
    },
  });

  const dipendente1 = await prisma.user.create({
    data: {
      nome: "Laura",
      cognome: "Bianchi",
      email: "laura.bianchi@azienda.it",
      password,
      ruolo: "DIPENDENTE",
    },
  });

  const dipendente2 = await prisma.user.create({
    data: {
      nome: "Giuseppe",
      cognome: "Verdi",
      email: "giuseppe.verdi@azienda.it",
      password,
      ruolo: "DIPENDENTE",
    },
  });

  const categorie = await Promise.all(
    ["Trasferta", "Pasto", "Pedaggio", "Parcheggio", "Materiali"].map(
      (descrizione) =>
        prisma.categoriaSpesa.create({ data: { descrizione } })
    )
  );

  const [trasferta, pasto, pedaggio, parcheggio, materiali] = categorie;

  const richieste = [
    {
      dataSpesa: new Date("2026-03-10"),
      importo: 120.5,
      descrizione: "Viaggio Milano-Roma",
      categoriaId: trasferta.id,
      dipendenteId: dipendente1.id,
      stato: "IN_ATTESA" as StatoRimborso,
    },
    {
      dataSpesa: new Date("2026-03-15"),
      importo: 35.0,
      descrizione: "Pranzo con cliente",
      categoriaId: pasto.id,
      dipendenteId: dipendente1.id,
      stato: "APPROVATA" as StatoRimborso,
      dataValutazione: new Date("2026-03-16"),
      responsabileValutazioneId: responsabile.id,
    },
    {
      dataSpesa: new Date("2026-04-02"),
      importo: 12.5,
      descrizione: "Pedaggio autostrada A1",
      categoriaId: pedaggio.id,
      dipendenteId: dipendente1.id,
      stato: "LIQUIDATA" as StatoRimborso,
      dataValutazione: new Date("2026-04-03"),
      dataLiquidazione: new Date("2026-04-10"),
      responsabileValutazioneId: responsabile.id,
    },
    {
      dataSpesa: new Date("2026-04-20"),
      importo: 8.0,
      descrizione: "Parcheggio centro",
      categoriaId: parcheggio.id,
      dipendenteId: dipendente2.id,
      stato: "RIFIUTATA" as StatoRimborso,
      dataValutazione: new Date("2026-04-21"),
      motivazioneRifiuto: "Manca giustificativo",
      responsabileValutazioneId: responsabile.id,
    },
    {
      dataSpesa: new Date("2026-05-05"),
      importo: 45.0,
      descrizione: "Cancelleria ufficio",
      categoriaId: materiali.id,
      dipendenteId: dipendente2.id,
      stato: "IN_ATTESA" as StatoRimborso,
    },
    {
      dataSpesa: new Date("2026-05-12"),
      importo: 89.0,
      descrizione: "Trasferta Bologna",
      categoriaId: trasferta.id,
      dipendenteId: dipendente2.id,
      stato: "APPROVATA" as StatoRimborso,
      dataValutazione: new Date("2026-05-13"),
      responsabileValutazioneId: responsabile.id,
    },
    {
      dataSpesa: new Date("2026-05-18"),
      importo: 22.0,
      descrizione: "Pranzo lavoro",
      categoriaId: pasto.id,
      dipendenteId: dipendente1.id,
      stato: "LIQUIDATA" as StatoRimborso,
      dataValutazione: new Date("2026-05-19"),
      dataLiquidazione: new Date("2026-05-25"),
      responsabileValutazioneId: responsabile.id,
    },
  ];

  for (const r of richieste) {
    await prisma.richiestaRimborso.create({ data: r });
  }

  console.log("Seed completato.");
  console.log("Credenziali (password per tutti: Password1!):");
  console.log("  Responsabile: responsabile@azienda.it");
  console.log("  Dipendente 1: laura.bianchi@azienda.it");
  console.log("  Dipendente 2: giuseppe.verdi@azienda.it");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
