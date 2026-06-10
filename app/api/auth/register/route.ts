import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registrazioneUtenteSchema } from "@/schemas/utente.schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registrazioneUtenteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dati non validi", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { nome, cognome, email, password, ruolo } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { message: "Email già utilizzata" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nome, cognome, email, password: hashed, ruolo },
    select: {
      id: true,
      nome: true,
      cognome: true,
      email: true,
      ruolo: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
