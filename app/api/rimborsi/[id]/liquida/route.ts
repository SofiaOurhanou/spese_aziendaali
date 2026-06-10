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

  if (rimborso.stato !== "APPROVATA") {
    return NextResponse.json(
      { message: "Solo le richieste approvate possono essere liquidate" },
      { status: 400 }
    );
  }

  const dataLiquidazione = new Date();
  if (!rimborso.dataValutazione || dataLiquidazione < rimborso.dataValutazione) {
    return NextResponse.json(
      { message: "Data di liquidazione non valida" },
      { status: 400 }
    );
  }

  const updated = await prisma.richiestaRimborso.update({
    where: { id: rimborso.id },
    data: {
      stato: "LIQUIDATA",
      dataLiquidazione,
    },
    include: rimborsoInclude,
  });

  return NextResponse.json(updated);
}
