import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generaToken } from "@/lib/auth";
import { loginSchema } from "@/schemas/login.schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dati non validi", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Credenziali errate" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) {
    return NextResponse.json(
      { message: "Credenziali errate" },
      { status: 401 }
    );
  }

  const token = generaToken(user);
  return NextResponse.json({
    token,
    user: {
      id: user.id,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      ruolo: user.ruolo,
    },
  });
}
