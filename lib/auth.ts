// src/lib/auth.ts

import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "secret";

// genera token
export function generaToken(utente: any) {
  return jwt.sign(
    {
      id: utente.id,
      ruolo: utente.ruolo
    },
    secret,
    { expiresIn: "1d" }
  );
}

// verifica token
export function verificaToken(token: string) {
  return jwt.verify(token, secret);
}