import { prisma } from "@/lib/prisma";
import { requireAuth, isAuthResponse } from "@/lib/auth";
import {
  buildRimborsoWhere,
  parseRimborsoFilters,
} from "@/lib/rimborso-filters";
import { rimborsoInclude } from "@/lib/rimborso-include";
import { creaRimborsoSchema } from "@/schemas/rimborso.schema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (isAuthResponse(auth)) return auth;

  const filters = parseRimborsoFilters(new URL(req.url).searchParams);
  const where = buildRimborsoWhere(filters, auth);

  const rimborsi = await prisma.richiestaRimborso.findMany({
    where,
    include: rimborsoInclude,
    orderBy: { dataSpesa: "desc" },
  });

  return NextResponse.json(rimborsi);
}

export async function POST(req: Request) {
  const auth = requireAuth(req, ["DIPENDENTE"]);
  if (isAuthResponse(auth)) return auth;

  const body = await req.json();
  const parsed = creaRimborsoSchema.safeParse(body);

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

  const rimborso = await prisma.richiestaRimborso.create({
    data: {
      dataSpesa: parsed.data.dataSpesa,
      importo: parsed.data.importo,
      descrizione: parsed.data.descrizione,
      riferimentoGiustificativo: parsed.data.riferimentoGiustificativo,
      categoriaId: parsed.data.categoriaId,
      dipendenteId: auth.id,
      stato: "IN_ATTESA",
    },
    include: rimborsoInclude,
  });

  return NextResponse.json(rimborso, { status: 201 });
}
