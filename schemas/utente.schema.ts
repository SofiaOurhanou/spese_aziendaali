// src/schemas/utente.schema.ts

import { z } from "zod";

// schema registrazione
export const registrazioneUtenteSchema = z.object({
  nome: z.string().min(1, "Nome obbligatorio"),
  cognome: z.string().min(1, "Cognome obbligatorio"),
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "Password troppo corta"),
  ruolo: z.enum(["DIPENDENTE", "RESPONSABILE"])
});

// output sicuro (senza password)
export const utenteOutputSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cognome: z.string(),
  email: z.string(),
  ruolo: z.enum(["DIPENDENTE", "RESPONSABILE"])
});