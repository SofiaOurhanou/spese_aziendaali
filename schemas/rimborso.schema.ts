import { z } from "zod";

/* =========================
   CREAZIONE RIMBORSO
========================= */
export const creaRimborsoSchema = z.object({
  dataSpesa: z.coerce.date(),
  categoriaId: z.number(),
  importo: z.number().positive(),
  descrizione: z.string().min(1),
  riferimentoGiustificativo: z.string().optional()
});

/* =========================
   AGGIORNAMENTO RIMBORSO
   (solo se IN_ATTESA)
========================= */
export const aggiornaRimborsoSchema = z.object({
  dataSpesa: z.coerce.date(),
  categoriaId: z.number(),
  importo: z.number().positive(),
  descrizione: z.string().min(1),
  riferimentoGiustificativo: z.string().optional()
});

/* =========================
   FILTRI LISTA RIMBORSI
========================= */
export const filtroRimborsiSchema = z.object({
  stato: z.enum(["IN_ATTESA", "APPROVATA", "RIFIUTATA", "LIQUIDATA"]).optional(),
  categoriaId: z.number().optional(),
  dipendenteId: z.number().optional(),
  mese: z.string().optional()
});