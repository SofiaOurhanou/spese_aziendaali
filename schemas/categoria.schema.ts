// src/schemas/categoria.schema.ts

import { z } from "zod";

export const categoriaSchema = z.object({
  id: z.number().optional(),
  descrizione: z.string().min(1, "Descrizione obbligatoria")
});