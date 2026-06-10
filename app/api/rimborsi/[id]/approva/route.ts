import { prisma } from "@/lib/prisma";
import { requireAuth, isAuthResponse } from "@/lib/auth";
import { rimborsoInclude } from "@/lib/rimborso-include";
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
      { message: "Solo le richieste in attesa possono essere approvate" },
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
      stato: "APPROVATA",
      dataValutazione,
      responsabileValutazioneId: auth.id,
      motivazioneRifiuto: null,
    },
    include: rimborsoInclude,
  });

  return NextResponse.json(updated);
}
