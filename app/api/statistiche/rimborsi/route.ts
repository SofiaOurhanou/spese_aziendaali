import { prisma } from "@/lib/prisma";
import { requireAuth, isAuthResponse } from "@/lib/auth";
import { buildRimborsoWhere, parseRimborsoFilters } from "@/lib/rimborso-filters";
import { formatMese } from "@/lib/rimborso-filters";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = requireAuth(req, ["RESPONSABILE"]);
  if (isAuthResponse(auth)) return auth;

  const filters = parseRimborsoFilters(new URL(req.url).searchParams);
  const where = buildRimborsoWhere(filters, auth);

  const richieste = await prisma.richiestaRimborso.findMany({
    where,
    include: { categoria: true },
  });

  type Aggregato = {
    mese: string;
    categoria: string;
    numeroRichieste: number;
    totaleRichiesto: number;
    totaleApprovato: number;
    totaleLiquidato: number;
  };

  const map = new Map<string, Aggregato>();

  for (const r of richieste) {
    const key = `${formatMese(r.dataSpesa)}-${r.categoriaId}`;
    const importo = Number(r.importo);

    if (!map.has(key)) {
      map.set(key, {
        mese: formatMese(r.dataSpesa),
        categoria: r.categoria.descrizione,
        numeroRichieste: 0,
        totaleRichiesto: 0,
        totaleApprovato: 0,
        totaleLiquidato: 0,
      });
    }

    const agg = map.get(key)!;
    agg.numeroRichieste += 1;
    agg.totaleRichiesto += importo;

    if (r.stato === "APPROVATA" || r.stato === "LIQUIDATA") {
      agg.totaleApprovato += importo;
    }
    if (r.stato === "LIQUIDATA") {
      agg.totaleLiquidato += importo;
    }
  }

  const result = Array.from(map.values()).map((a) => ({
    ...a,
    totaleRichiesto: round2(a.totaleRichiesto),
    totaleApprovato: round2(a.totaleApprovato),
    totaleLiquidato: round2(a.totaleLiquidato),
  }));

  return NextResponse.json(result);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
