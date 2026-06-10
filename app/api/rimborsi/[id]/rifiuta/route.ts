import { prisma } from "@/lib/prisma";
import { requireAuth, isAuthResponse } from "@/lib/auth";
import { rimborsoInclude } from "@/lib/rimborso-include";
import { rifiutaRimborsoSchema } from "@/schemas/rimborso.schema";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const auth = requireAuth(req, ["RESPONSABILE"]);
  if (isAuthResponse(auth)) return auth;

  const { id } = await params;
  const rimborso = await prisma.richiestaRimborso.findUnique({
    where: { id: Number(id) },
  });

  if (!rimborso) {
    return NextResponse.json({ message: "Richiesta non trovata" }, { status: 404 });
  }

  if (rimborso.stato !== "IN_ATTESA") {
    return NextResponse.json(
      { message: "Solo le richieste in attesa possono essere rifiutate" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = rifiutaRimborsoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dati non validi", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const dataValutazione = new Date();
  if (dataValutazione < rimborso.dataInserimento) {
    return NextResponse.json(
      { message: "Data di valutazione non valida" },
      { status: 400 }
    );
  }

  const updated = await prisma.richiestaRimborso.update({
    where: { id: rimborso.id },
    data: {
      stato: "RIFIUTATA",
      dataValutazione,
      responsabileValutazioneId: auth.id,
      motivazioneRifiuto: parsed.data.motivazioneRifiuto ?? null,
    },
    include: rimborsoInclude,
  });

  return NextResponse.json(updated);
}
