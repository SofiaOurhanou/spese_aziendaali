import { z } from "zod";

/* =========================
   CREAZIONE RIMBORSO
========================= */
export const creaRimborsoSchema = z.object({
  dataSpesa: z.coerce.date(),
  categoriaId: z.coerce.number().int().positive(),
  importo: z.coerce.number().positive("L'importo deve essere maggiore di zero"),
  descrizione: z.string().trim().min(1, "Descrizione obbligatoria"),
  riferimentoGiustificativo: z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || v.length > 0, {
      message: "Il riferimento non può essere composto solo da spazi",
    }),
});

/* =========================
   AGGIORNAMENTO RIMBORSO
   (solo se IN_ATTESA)
========================= */
export const aggiornaRimborsoSchema = creaRimborsoSchema;

export const rifiutaRimborsoSchema = z.object({
  motivazioneRifiuto: z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || v.length > 0, {
      message: "La motivazione non può essere composta solo da spazi",
    }),
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