// src/schemas/statistiche.schema.ts
import { z } from "zod";

export const filtroStatisticheSchema = z.object({
  mese: z.string().optional(),
  categoriaId: z.number().optional(),
  dipendenteId: z.number().optional()
});