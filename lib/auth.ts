import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const secret = process.env.JWT_SECRET || "secret";

export type AuthUser = {
  id: number;
  ruolo: Role;
};

export function generaToken(utente: { id: number; ruolo: Role }) {
  return jwt.sign({ id: utente.id, ruolo: utente.ruolo }, secret, {
    expiresIn: "7d",
  });
}

export function verificaToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, secret) as AuthUser;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export function requireAuth(
  req: Request,
  ruoli?: Role[]
): AuthUser | NextResponse {
  const token = getTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ message: "Non autenticato" }, { status: 401 });
  }

  const user = verificaToken(token);
  if (!user) {
    return NextResponse.json({ message: "Token non valido" }, { status: 401 });
  }

  if (ruoli && !ruoli.includes(user.ruolo)) {
    return NextResponse.json({ message: "Non autorizzato" }, { status: 403 });
  }

  return user;
}

export function isAuthResponse(
  result: AuthUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
