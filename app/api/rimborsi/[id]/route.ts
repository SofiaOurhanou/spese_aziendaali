import { prisma } from "@/lib/prisma";
import { requireAuth, isAuthResponse } from "@/lib/auth";
import { rimborsoInclude } from "@/lib/rimborso-include";
import { aggiornaRimborsoSchema } from "@/schemas/rimborso.schema";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

async function getRimborso(id: number) {
  return prisma.richiestaRimborso.findUnique({
    where: { id },
    include: rimborsoInclude,
  });
}

function canAccess(rimborso: { dipendenteId: number }, userId: number, ruolo: string) {
  return ruolo === "RESPONSABILE" || rimborso.dipendenteId === userId;
}

export async function GET(req: Request, { params }: Params) {
  const auth = requireAuth(req);
  if (isAuthResponse(auth)) return auth;

  const { id } = await params;
  const rimborso = await getRimborso(Number(id));

  if (!rimborso) {
    return NextResponse.json({ message: "Richiesta non trovata" }, { status: 404 });
  }

  if (!canAccess(rimborso, auth.id, auth.ruolo)) {
    return NextResponse.json({ message: "Non autorizzato" }, { status: 403 });
  }

  return NextResponse.json(rimborso);
}

export async function PUT(req: Request, { params }: Params) {
  const auth = requireAuth(req, ["DIPENDENTE"]);
  if (isAuthResponse(auth)) return auth;

  const { id } = await params;
  const rimborso = await getRimborso(Number(id));

  if (!rimborso) {
    return NextResponse.json({ message: "Richiesta non trovata" }, { status: 404 });
  }

  if (rimborso.dipendenteId !== auth.id) {
    return NextResponse.json({ message: "Non autorizzato" }, { status: 403 });
  }

  if (rimborso.stato !== "IN_ATTESA") {
    return NextResponse.json(
      { message: "Solo le richieste in attesa possono essere modificate" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = aggiornaRimborsoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dati non validi", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const categoria = await prisma.categoriaSpesa.findUnique({
    where: { id: parsed.data.categoriaId },
  });
  if (!categoria) {
    return NextResponse.json(
      { message: "Categoria non trovata" },
      { status: 400 }
    );
  }

  const updated = await prisma.richiestaRimborso.update({
    where: { id: rimborso.id },
    data: {
      dataSpesa: parsed.data.dataSpesa,
      importo: parsed.data.importo,
      descrizione: parsed.data.descrizione,
      riferimentoGiustificativo: parsed.data.riferimentoGiustificativo,
      categoriaId: parsed.data.categoriaId,
    },
    include: rimborsoInclude,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = requireAuth(req, ["DIPENDENTE"]);
  if (isAuthResponse(auth)) return auth;

  const { id } = await params;
  const rimborso = await getRimborso(Number(id));

  if (!rimborso) {
    return NextResponse.json({ message: "Richiesta non trovata" }, { status: 404 });
  }

  if (rimborso.dipendenteId !== auth.id) {
    return NextResponse.json({ message: "Non autorizzato" }, { status: 403 });
  }

  if (rimborso.stato !== "IN_ATTESA") {
    return NextResponse.json(
      { message: "Solo le richieste in attesa possono essere eliminate" },
      { status: 400 }
    );
  }

  await prisma.richiestaRimborso.delete({ where: { id: rimborso.id } });
  return NextResponse.json({ message: "Richiesta eliminata" });
}
