import { z } from "zod";

const trimmedString = (msg: string) =>
  z.string().trim().min(1, msg);

export const registrazioneUtenteSchema = z
  .object({
    nome: trimmedString("Nome obbligatorio"),
    cognome: trimmedString("Cognome obbligatorio"),
    email: z.string().trim().email("Email non valida"),
    password: z.string().min(6, "Password troppo corta"),
    confermaPassword: z.string().min(1, "Conferma password obbligatoria"),
    ruolo: z.enum(["DIPENDENTE", "RESPONSABILE"]).default("DIPENDENTE"),
  })
  .refine((data) => data.password === data.confermaPassword, {
    message: "Le password non coincidono",
    path: ["confermaPassword"],
  });

// output sicuro (senza password)
export const utenteOutputSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cognome: z.string(),
  email: z.string(),
  ruolo: z.enum(["DIPENDENTE", "RESPONSABILE"])
});